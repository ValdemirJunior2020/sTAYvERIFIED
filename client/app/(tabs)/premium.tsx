import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PremiumPlanCard from "../../components/PremiumPlanCard";
import { premiumPlans } from "../../data/premiumPlans";
import { seedDemoReviews } from "../../services/seedDemoReviews";

export default function PremiumScreen() {
  const [loadingSeed, setLoadingSeed] = useState(false);

  async function handleSeed() {
    try {
      setLoadingSeed(true);
      const result = await seedDemoReviews();

      if (result.skipped) {
        Alert.alert("Demo data already loaded", "Reviews already exist in Firestore.");
      } else {
        Alert.alert("Demo data loaded", `${result.inserted} demo reviews were added.`);
      }
    } catch (error: any) {
      Alert.alert("Seed failed", error?.message || "Unable to seed demo data.");
    } finally {
      setLoadingSeed(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={["#3d0101", "#1b0505", "#0b0b0f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.kicker}>StayVerified Premium</Text>
        <Text style={styles.title}>Monetization-ready trust platform</Text>
        <Text style={styles.description}>
          Premium traveler identity, advanced trust filters, property intelligence, and future paid insights.
        </Text>
      </LinearGradient>

      <View style={styles.section}>
        {premiumPlans.map((plan) => (
          <PremiumPlanCard
            key={plan.id}
            title={plan.title}
            subtitle={plan.subtitle}
            monthlyPrice={plan.monthlyPrice}
            yearlyPrice={plan.yearlyPrice}
            badge={plan.badge}
            highlight={plan.highlight}
            features={plan.features}
            onPress={() =>
              Alert.alert(
                "Subscription placeholder",
                "The paywall UI is complete, but Apple billing must be connected with StoreKit / RevenueCat before App Store release."
              )
            }
          />
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Demo content loader</Text>
        <Text style={styles.infoText}>
          Load sample Firestore reviews for Home and Company screens. These entries are marked as demo data.
        </Text>
        <Text style={styles.seedButton} onPress={loadingSeed ? undefined : handleSeed}>
          {loadingSeed ? "Loading..." : "Load Demo Reviews"}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>App Store-safe launch note</Text>
        <Text style={styles.infoText}>
          Keep the premium screen visible, but do not promise paid access until Apple In-App Purchase is fully connected and testable.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050507"
  },
  content: {
    padding: 16,
    paddingBottom: 120
  },
  hero: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(214,179,106,0.16)",
    marginBottom: 18
  },
  kicker: {
    color: "#d6b36a",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8
  },
  title: {
    color: "#fff7eb",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900"
  },
  description: {
    marginTop: 10,
    color: "#d8d2ca",
    fontSize: 15,
    lineHeight: 22
  },
  section: {
    marginBottom: 8
  },
  infoCard: {
    backgroundColor: "#121217",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14
  },
  infoTitle: {
    color: "#fff7eb",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8
  },
  infoText: {
    color: "#d1cbc2",
    fontSize: 14,
    lineHeight: 21
  },
  seedButton: {
    marginTop: 16,
    color: "#d6b36a",
    fontWeight: "900",
    fontSize: 15
  }
});
