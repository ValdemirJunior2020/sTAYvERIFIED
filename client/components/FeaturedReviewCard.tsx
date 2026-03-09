// File: client/components/FeaturedReviewCard.tsx

import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SoftCard from "./SoftCard";
import { colors } from "../constants/theme";

export default function FeaturedReviewCard() {
  return (
    <SoftCard style={styles.card}>
      <Text style={styles.heading}>Featured Verified Review</Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((item) => (
          <Ionicons key={item} name="star" size={24} color={colors.gold} />
        ))}
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>Verified Authenticity</Text>
      </View>

      <View style={styles.userRow}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=32" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Sarah L</Text>
          <Text style={styles.location}>Austin, TX</Text>
        </View>
      </View>

      <Text style={styles.review}>
        Exceptional service and food. The verification system works!
      </Text>
    </SoftCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e9f3ff",
  },
  heading: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.green,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  location: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  review: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
  },
});