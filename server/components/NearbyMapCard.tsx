import React from "react";
import { Image, StyleSheet, Text } from "react-native";
import SoftCard from "./SoftCard";
import { colors } from "../constants/theme";

type Props = {
  mapUrl?: string;
};

export default function NearbyMapCard({ mapUrl }: Props) {
  return (
    <SoftCard style={styles.card}>
      <Text style={styles.title}>Nearby Verified Hotspots</Text>

      {mapUrl ? (
        <Image source={{ uri: mapUrl }} style={styles.map} />
      ) : (
        <Image
          source={require("../assets/map-placeholder.png")}
          style={styles.map}
        />
      )}

      <Text style={styles.mapLabel}>{mapUrl ? "Live map" : "Map"}</Text>
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
