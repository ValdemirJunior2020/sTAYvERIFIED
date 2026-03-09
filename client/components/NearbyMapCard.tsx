// File: client/components/NearbyMapCard.tsx

import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import SoftCard from "./SoftCard";
import { colors } from "../constants/theme";

type Props = {
  mapUrl?: string;
};

const FALLBACK_MAP_URL =
  "https://placehold.co/1200x600/e6eef8/7b8ba1?text=Nearby+Verified+Hotspots";

export default function NearbyMapCard({ mapUrl }: Props) {
  return (
    <SoftCard style={styles.card}>
      <Text style={styles.title}>Nearby Verified Hotspots</Text>

      <Image
        source={{ uri: mapUrl || FALLBACK_MAP_URL }}
        style={styles.map}
      />

      <Text style={styles.mapLabel}>
        {mapUrl ? "Live map" : "Placeholder map"}
      </Text>
    </SoftCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 150,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 96,
    borderRadius: 16,
    backgroundColor: "#dfe8f4",
  },
  mapLabel: {
    marginTop: 8,
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "800",
  },
});