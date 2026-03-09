// File: client/components/SubmitReviewCard.tsx

import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import SoftCard from "./SoftCard";
import { colors } from "../constants/theme";

export default function SubmitReviewCard() {
  return (
    <Pressable
      onPress={() => router.push("/(tabs)/add-review")}
      style={({ pressed }) => [
        styles.pressable,
        pressed && styles.pressablePressed,
      ]}
    >
      <SoftCard style={styles.card}>
        <Text style={styles.icon}>i</Text>
        <Text style={styles.text}>Submit a Verified Review</Text>
      </SoftCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  pressablePressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  card: {
    flex: 1,
    minHeight: 150,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 10,
  },
  text: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 24,
  },
});