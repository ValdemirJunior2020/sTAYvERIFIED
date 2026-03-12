// File: client/app/(tabs)/profile.tsx

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { deleteCurrentUserAccount, logoutUser } from "../../services/auth";
import { colors, radius, spacing } from "../../constants/theme";

type ReviewItem = {
  trust_badge?: "Bronze" | "Silver" | "Gold";
};

const badgeImages = {
  Bronze: require("../../assets/bronze.png"),
  Silver: require("../../assets/silver.png"),
  Gold: require("../../assets/gold.png"),
};

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [reviewCount, setReviewCount] = useState(0);
  const [bronzeCount, setBronzeCount] = useState(0);
  const [silverCount, setSilverCount] = useState(0);
  const [goldCount, setGoldCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        if (!user) {
          if (mounted) setLoading(false);
          return;
        }

        const q = query(collection(db, "reviews"), where("userId", "==", user.uid));
        const snap = await getDocs(q);

        if (!mounted) return;

        const reviews = snap.docs.map((doc) => doc.data() as ReviewItem);

        setReviewCount(reviews.length);
        setBronzeCount(reviews.filter((r) => r.trust_badge === "Bronze").length);
        setSilverCount(reviews.filter((r) => r.trust_badge === "Silver").length);
        setGoldCount(reviews.filter((r) => r.trust_badge === "Gold").length);
      } catch (error: any) {
        Alert.alert("Profile error", error?.message || "Unable to load profile stats.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, [user]);

  const topBadge = useMemo(() => {
    if (goldCount > 0) return "Gold";
    if (silverCount > 0) return "Silver";
    return "Bronze";
  }, [goldCount, silverCount]);

  async function handleLogout() {
    try {
      await logoutUser();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert("Logout failed", error?.message || "Unable to log out.");
    }
  }

  function confirmDelete() {
    Alert.alert(
      "Delete account",
      "This will remove your account login. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ]
    );
  }

  async function handleDeleteAccount() {
    try {
      await deleteCurrentUserAccount();
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert(
        "Delete failed",
        error?.message ||
          "You may need to log in again before deleting this account."
      );
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.name}>
            {user?.displayName?.trim() || "Traveler"}
          </Text>
          <Text style={styles.email}>{user?.email || "No email available"}</Text>
          <Text style={styles.memberStatus}>
            {loading ? "Loading profile..." : "Verified member profile"}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Reviews" value={String(reviewCount)} />
        <StatCard label="Bronze" value={String(bronzeCount)} />
        <StatCard label="Silver" value={String(silverCount)} />
        <StatCard label="Gold" value={String(goldCount)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Top Contributor Badge</Text>

        <View style={styles.badgeSection}>
          <Image source={badgeImages[topBadge]} style={styles.badgeImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.badgeName}>{topBadge}</Text>
            <Text style={styles.badgeText}>
              Your contribution summary is based on trust badges earned from your submitted reviews.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <Pressable style={styles.primaryButton} onPress={handleLogout}>
          <Text style={styles.primaryButtonText}>Logout</Text>
        </Pressable>

        <Pressable style={styles.dangerButton} onPress={confirmDelete}>
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </Pressable>

        <Text style={styles.helper}>
          Account deletion removes your Firebase Auth user. If Firebase requires recent login, log out and back in, then try again.
        </Text>
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  headerCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#1f3658",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },
  headerText: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },
  email: {
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: "700",
  },
  memberStatus: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flexGrow: 1,
    minWidth: "22%",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  statLabel: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 6,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: spacing.md,
  },
  badgeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  badgeImage: {
    width: 88,
    height: 88,
    resizeMode: "contain",
  },
  badgeName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
  },
  badgeText: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  dangerButton: {
    backgroundColor: "#fff1f1",
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(200,40,40,0.12)",
  },
  dangerButtonText: {
    color: "#b42318",
    fontSize: 15,
    fontWeight: "900",
  },
  helper: {
    color: colors.textSoft,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.md,
  },
});