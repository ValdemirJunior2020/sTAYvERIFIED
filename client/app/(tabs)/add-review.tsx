// File: client/app/(tabs)/add-review.tsx

import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, radius, spacing } from "../../constants/theme";
import SoftCard from "../../components/SoftCard";
import { moderateReview } from "../../services/moderation";
import { uploadProofToCloudinary } from "../../services/cloudinary";
import { createReview } from "../../services/reviews";

type QaScorecard = {
  matchedPhotos: boolean;
  hiddenFees: boolean;
  reservationFound: boolean;
  finalPriceMatched: boolean;
  smoothCheckIn: boolean;
  helpfulSupport: boolean;
};

type Sliders = {
  visuals: number;
  value: number;
  process: number;
};

type Tags = {
  bestFor: string[];
  bookingExperience: string[];
};

export default function AddReviewScreen() {
  const [company, setCompany] = useState("");
  const [review, setReview] = useState("");
  const [proof, setProof] = useState("");
  const [uploadedProofUrl, setUploadedProofUrl] = useState("");
  const [trustPercentage, setTrustPercentage] = useState(80);
  const [trustBadge, setTrustBadge] = useState<"Bronze" | "Silver" | "Gold">(
    "Silver"
  );
  const [qaScorecard, setQaScorecard] = useState<QaScorecard>({
    matchedPhotos: true,
    hiddenFees: false,
    reservationFound: true,
    finalPriceMatched: true,
    smoothCheckIn: true,
    helpfulSupport: true,
  });
  const [sliders, setSliders] = useState<Sliders>({
    visuals: 4,
    value: 4,
    process: 4,
  });
  const [tags, setTags] = useState<Tags>({
    bestFor: [],
    bookingExperience: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [moderation, setModeration] = useState<any | null>(null);
  const [verification, setVerification] = useState<any | null>(null);

  const [placeId] = useState("");
  const [placeAddress] = useState("");
  const [placeType] = useState("");
  const [placePhotoUrl] = useState("");
  const [placeStaticMapUrl] = useState("");

  async function handleSubmit() {
    try {
      console.log("STEP 1: submit clicked");

      if (!company.trim()) {
        Alert.alert("Missing company", "Please enter a company or platform.");
        return;
      }

      if (!review.trim()) {
        Alert.alert("Missing review", "Please enter your written review.");
        return;
      }

      setSubmitting(true);

      console.log("STEP 2: running moderation");
      const moderationResult = await moderateReview(
        company.trim(),
        review.trim()
      );
      console.log("STEP 2 RESULT:", moderationResult);

      setModeration({
        allowed: moderationResult.allowed,
        flagged: moderationResult.flagged,
        flags: moderationResult.flags || [],
        message: moderationResult.message,
        source: moderationResult.source,
      });

      if (!moderationResult.allowed) {
        Alert.alert("Review blocked", moderationResult.message);
        setSubmitting(false);
        return;
      }

      let finalProofUrl = uploadedProofUrl;

      if (proof && !uploadedProofUrl) {
        console.log("STEP 3: uploading proof to Cloudinary", proof);
        const uploaded = await uploadProofToCloudinary(proof);
        console.log("STEP 3 RESULT:", uploaded);

        finalProofUrl = uploaded.secure_url;
        setUploadedProofUrl(uploaded.secure_url);
      }

      const payload = {
        company: company.trim(),
        place_id: placeId,
        place_address: placeAddress,
        place_type: placeType,
        place_photo_url: placePhotoUrl,
        place_static_map_url: placeStaticMapUrl,
        review: review.trim(),
        proof: finalProofUrl,
        trust_percentage: trustPercentage,
        trust_badge: trustBadge,
        qa_scorecard: qaScorecard,
        expectation_sliders: sliders,
        tags,
        moderation_allowed: moderationResult.allowed,
        moderation_flags: moderationResult.flags || [],
        moderation_source: moderationResult.source,
        verification_summary: verification?.summary || "",
        verification_confidence: verification?.confidence || "low",
        verification_flags: verification?.flags || [],
      };

      console.log("STEP 4: saving review to Firestore", payload);
      const reviewId = await createReview(payload);
      console.log("STEP 4 RESULT: saved review id =", reviewId);

      Alert.alert("Success", "Review added successfully.");

      setCompany("");
      setReview("");
      setProof("");
      setUploadedProofUrl("");
      setModeration(null);
      setVerification(null);
      setQaScorecard({
        matchedPhotos: true,
        hiddenFees: false,
        reservationFound: true,
        finalPriceMatched: true,
        smoothCheckIn: true,
        helpfulSupport: true,
      });
      setSliders({
        visuals: 4,
        value: 4,
        process: 4,
      });
      setTags({
        bestFor: [],
        bookingExperience: [],
      });
    } catch (error: any) {
      console.error("SUBMIT ERROR:", error);
      Alert.alert(
        "Submit failed",
        error?.response?.data?.error ||
          error?.message ||
          JSON.stringify(error) ||
          "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add a trusted review</Text>

      <SoftCard>
        <View style={styles.field}>
          <Text style={styles.label}>Company or platform</Text>
          <TextInput
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            placeholder="Hotel, OTA, vacation rental..."
            placeholderTextColor="#8a98a8"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Your review</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            placeholder="Share expectation vs reality, proof-backed details..."
            placeholderTextColor="#8a98a8"
          />
        </View>

        <Pressable
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={submitting ? undefined : handleSubmit}
        >
          <Text style={styles.buttonText}>
            {submitting ? "Submitting..." : "Submit review"}
          </Text>
        </Pressable>
      </SoftCard>

      {moderation && (
        <SoftCard style={styles.moderationCard}>
          <Text style={styles.moderationTitle}>Moderation result</Text>
          <Text style={styles.moderationText}>{moderation.message}</Text>
        </SoftCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 120,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f7faff",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  multiline: {
    minHeight: 120,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  moderationCard: {
    marginTop: spacing.md,
  },
  moderationTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  moderationText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});