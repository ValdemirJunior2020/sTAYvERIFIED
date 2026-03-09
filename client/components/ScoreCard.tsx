import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SoftCard from "./SoftCard";
import { colors } from "../constants/theme";

export default function ScoreCard() {
  return (
    <SoftCard style={styles.card}>
      <Text style={styles.title}>My Verified Score</Text>

      <View style={styles.row}>
        <View style={styles.ring}>
          <View style={styles.innerRing} />
        </View>

        <View>
          <Text style={styles.metric}>14 Reviews</Text>
          <Text style={styles.metric}>12 Badges</Text>
        </View>
      </View>
    </SoftCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  ring: {
    width: 62,
    height: 62,
    borderRadius: 999,
    borderWidth: 6,
    borderColor: "#7db7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  innerRing: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#ffffff",
  },
  metric: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
  },
});
