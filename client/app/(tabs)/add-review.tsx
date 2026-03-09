// File: client/app/(tabs)/add-review.tsx
// Replace ONLY your handleSubmit function with this version

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
    const moderationResult = await moderateReview(company.trim(), review.trim());
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
    setPlaceId("");
    setPlacePhotoUrl("");
    setPlaceAddress("");
    setPlaceType("");
    setPlaceStaticMapUrl("");
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