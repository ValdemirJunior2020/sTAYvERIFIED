import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  title: string;
  subtitle: string;
  monthlyPrice: string;
  yearlyPrice: string;
  badge: string;
  highlight: string;
  features: string[];
  onPress: () => void;
};

export default function PremiumPlanCard(props: Props) {
  const {
    title,
    subtitle,
    monthlyPrice,
    yearlyPrice,
    badge,
    highlight,
    features,
    onPress
  } = props;

  return (
    <LinearGradient
      colors={["#2b0505", "#160808", "#0b0b0f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.badgeRow}>
        <Text style={styles.badge}>{badge}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.highlight}>{highlight}</Text>

      <View style={styles.priceRow}>
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Monthly</Text>
          <Text style={styles.price}>{monthlyPrice}</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Yearly</Text>
          <Text style={styles.price}>{yearlyPrice}</Text>
        </View>
      </View>

      <View style={styles.featureList}>
        {features.map((feature) => (
          <Text key={feature} style={styles.featureItem}>• {feature}</Text>
        ))}
      </View>

      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Coming Soon</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(214,179,106,0.18)",
    marginBottom: 16
  },
  badgeRow: {
    marginBottom: 12
  },
  badge: {
    color: "#f0cf8b",
    fontWeight: "800",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1
  },
  title: {
    color: "#fff7eb",
    fontSize: 26,
    fontWeight: "900"
  },
  subtitle: {
    color: "#d6d0c7",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20
  },
  highlight: {
    color: "#f0cf8b",
    marginTop: 12,
    fontSize: 14,
    fontWeight: "700"
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    marginBottom: 18
  },
  priceBox: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  priceLabel: {
    color: "#cfc8bf",
    fontSize: 12,
    marginBottom: 6
  },
  price: {
    color: "#fff7eb",
    fontSize: 24,
    fontWeight: "900"
  },
  featureList: {
    gap: 10,
    marginBottom: 18
  },
  featureItem: {
    color: "#f0ebe4",
    fontSize: 14,
    lineHeight: 20
  },
  button: {
    borderRadius: 16,
    backgroundColor: "#d6b36a",
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonText: {
    color: "#1b0909",
    fontWeight: "900",
    fontSize: 15
  }
});
