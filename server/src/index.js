// File: server/src/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { v2 as cloudinary } from "cloudinary";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force dotenv to load the exact server/.env file
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("dotenv path =", path.resolve(__dirname, "../.env"));
console.log("CLOUDINARY_CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME || "missing");
console.log("CLOUDINARY_API_KEY =", process.env.CLOUDINARY_API_KEY ? "present" : "missing");
console.log("CLOUDINARY_API_SECRET =", process.env.CLOUDINARY_API_SECRET ? "present" : "missing");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function buildRespectfulRewriteMessage() {
  return "Please rewrite your review so it stays respectful, specific, and safe for all users. Remove insults, threats, explicit language, private information, or aggressive wording.";
}

function containsPII(text = "") {
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const phoneRegex = /(\+?\d{1,2}\s*)?(\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/;
  const bookingLikeRegex =
    /\b(itinerary|confirmation|booking|reservation)\s*(id|#|number|num)?\s*[:#-]?\s*[A-Z0-9-]{5,}\b/i;
  const cardLikeRegex = /\b(?:\d[ -]*?){13,16}\b/;

  const findings = [];
  if (emailRegex.test(text)) findings.push("email_address");
  if (phoneRegex.test(text)) findings.push("phone_number");
  if (bookingLikeRegex.test(text)) findings.push("booking_identifier");
  if (cardLikeRegex.test(text)) findings.push("possible_payment_card");

  return findings;
}

function localPolicyFlags(text = "") {
  const lowered = text.toLowerCase();
  const flags = [];

  const profanity = ["idiot", "stupid", "moron", "dumb", "trash", "garbage", "loser"];
  const violent = ["kill", "hurt you", "attack", "beat you", "shoot"];
  const sexual = ["sex", "nude", "porn"];
  const spammy = ["buy now", "click here", "promo code", "subscribe now"];

  if (profanity.some((w) => lowered.includes(w))) flags.push("disrespectful_language");
  if (violent.some((w) => lowered.includes(w))) flags.push("violent_or_threatening_language");
  if (sexual.some((w) => lowered.includes(w))) flags.push("sexual_content");
  if (spammy.some((w) => lowered.includes(w))) flags.push("spam_like_language");

  return flags;
}

async function moderateReviewText(text) {
  const piiFlags = containsPII(text);
  const localFlags = localPolicyFlags(text);

  if (!openai) {
    return {
      allowed: piiFlags.length === 0 && localFlags.length === 0,
      source: "local-only",
      flagged: piiFlags.length > 0 || localFlags.length > 0,
      flags: [...piiFlags, ...localFlags],
      message:
        piiFlags.length || localFlags.length
          ? buildRespectfulRewriteMessage()
          : "Content passed local moderation checks.",
    };
  }

  try {
    const moderation = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: text,
    });

    const result = moderation.results?.[0];
    const apiFlagged = !!result?.flagged;

    const flags = [
      ...piiFlags,
      ...localFlags,
      ...(apiFlagged
        ? Object.entries(result.categories || {})
            .filter(([, value]) => !!value)
            .map(([key]) => `openai_${key}`)
        : []),
    ];

    return {
      allowed: !apiFlagged && piiFlags.length === 0 && localFlags.length === 0,
      source: "openai+local",
      flagged: apiFlagged || piiFlags.length > 0 || localFlags.length > 0,
      flags,
      message:
        apiFlagged || piiFlags.length || localFlags.length
          ? buildRespectfulRewriteMessage()
          : "Content passed moderation checks.",
    };
  } catch {
    return {
      allowed: piiFlags.length === 0 && localFlags.length === 0,
      source: "local-fallback",
      flagged: piiFlags.length > 0 || localFlags.length > 0,
      flags: [...piiFlags, ...localFlags, "moderation_api_unavailable"],
      message:
        piiFlags.length || localFlags.length
          ? buildRespectfulRewriteMessage()
          : "Content passed local fallback moderation.",
    };
  }
}

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    server: "StayVerified Server",
    status: "healthy",
    port: PORT,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
    placesConfigured: !!process.env.GOOGLE_PLACES_API_KEY,
    cloudinaryConfigured:
      !!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/cloudinary/signature", (req, res) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        ok: false,
        error: "Cloudinary environment variables are missing.",
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "stayverified/proofs";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json({
      ok: true,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      folder,
      signature,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Unable to generate Cloudinary signature.",
    });
  }
});

app.post("/api/places/autocomplete", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const input = String(req.body?.input || "").trim();

    if (!apiKey) {
      return res.status(500).json({ ok: false, error: "Missing GOOGLE_PLACES_API_KEY" });
    }

    if (!input) {
      return res.json({ ok: true, suggestions: [] });
    }

    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["us"],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data?.error?.message || "Places autocomplete failed.",
      });
    }

    const suggestions = (data.suggestions || [])
      .filter((item) => item.placePrediction)
      .map((item) => ({
        placeId: item.placePrediction.placeId,
        text: item.placePrediction.text?.text || "",
        mainText: item.placePrediction.structuredFormat?.mainText?.text || "",
        secondaryText: item.placePrediction.structuredFormat?.secondaryText?.text || "",
      }));

    return res.json({ ok: true, suggestions });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Places autocomplete failed.",
    });
  }
});

app.get("/api/places/details/:placeId", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = String(req.params.placeId || "").trim();

    if (!apiKey) {
      return res.status(500).json({ ok: false, error: "Missing GOOGLE_PLACES_API_KEY" });
    }

    if (!placeId) {
      return res.status(400).json({ ok: false, error: "Missing placeId" });
    }

    const fieldMask = [
      "id",
      "displayName",
      "formattedAddress",
      "photos",
      "primaryTypeDisplayName",
      "rating",
      "googleMapsUri",
      "websiteUri",
      "location",
    ].join(",");

    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data?.error?.message || "Place details failed.",
      });
    }

    let photoUrl = "";
    if (data.photos?.[0]?.name) {
      photoUrl = `https://places.googleapis.com/v1/${data.photos[0].name}/media?maxWidthPx=1000&key=${apiKey}`;
    }

    const lat = data.location?.latitude ?? null;
    const lng = data.location?.longitude ?? null;
    const staticMapUrl =
      lat != null && lng != null
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=1200x500&scale=2&markers=color:red%7C${lat},${lng}&key=${apiKey}`
        : "";

    return res.json({
      ok: true,
      place: {
        id: data.id || placeId,
        name: data.displayName?.text || "",
        address: data.formattedAddress || "",
        rating: data.rating || null,
        type: data.primaryTypeDisplayName?.text || "",
        googleMapsUri: data.googleMapsUri || "",
        websiteUri: data.websiteUri || "",
        photoUrl,
        location: {
          latitude: lat,
          longitude: lng,
        },
        staticMapUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Place details failed.",
    });
  }
});

app.post("/api/moderate-review", async (req, res) => {
  try {
    const { company = "", review = "" } = req.body || {};
    const combined = `Company: ${String(company || "").trim()}\nReview: ${String(review || "").trim()}`;

    if (!String(review || "").trim()) {
      return res.status(400).json({
        ok: false,
        error: "Review text is required.",
      });
    }

    const moderation = await moderateReviewText(combined);
    return res.json({ ok: true, ...moderation });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Moderation failed.",
    });
  }
});

app.post("/api/verify-review", async (req, res) => {
  try {
    const {
      company = "",
      review = "",
      qa_scorecard = {},
      expectation_sliders = {},
      tags = {},
    } = req.body || {};

    const reviewText = String(review || "").trim();
    const companyName = String(company || "").trim();
    const flags = [];

    if (!reviewText || reviewText.length < 30) flags.push("too_short");
    if (!companyName) flags.push("missing_company");

    const vagueWords = ["good", "bad", "nice", "okay", "fine", "great", "terrible", "awesome", "cool"];
    const reviewLower = reviewText.toLowerCase();
    const vagueCount = vagueWords.filter((word) => reviewLower.includes(word)).length;

    if (vagueCount >= 3 && reviewText.length < 120) flags.push("possibly_vague");

    const hasQa = qa_scorecard && Object.keys(qa_scorecard).length > 0;
    const hasSliders = expectation_sliders && Object.keys(expectation_sliders).length > 0;
    const hasTags =
      tags &&
      ((Array.isArray(tags.bestFor) && tags.bestFor.length > 0) ||
        (Array.isArray(tags.bookingExperience) && tags.bookingExperience.length > 0));

    const looksSpecific =
      reviewText.length >= 60 &&
      (hasQa || hasSliders || hasTags || /\d/.test(reviewText) || reviewText.includes("$"));

    const looksUseful = reviewText.length >= 50 && !flags.includes("too_short");

    let confidence = "low";
    if (looksUseful && looksSpecific) confidence = "high";
    else if (looksUseful || looksSpecific) confidence = "medium";

    const summaryParts = [];
    summaryParts.push(companyName ? `Review for ${companyName}` : "Traveler review");
    summaryParts.push(looksSpecific ? "contains concrete travel details" : "could use more specific details");
    summaryParts.push(
      looksUseful
        ? "appears useful for future travelers"
        : "needs more substance to help future travelers"
    );

    return res.json({
      ok: true,
      summary: `${summaryParts.join(", ")}.`,
      confidence,
      flags,
      looksUseful,
      looksSpecific,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || "Verification failed.",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`StayVerified server running on http://127.0.0.1:${PORT}`);
});