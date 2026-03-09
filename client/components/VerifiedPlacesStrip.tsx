import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import SoftCard from "./SoftCard";
import { colors } from "../constants/theme";

const items = [
  {
    name: "Donmatoes",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Orchards",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Gourmets",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Lyrikition",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function VerifiedPlacesStrip() {
  return (
    <SoftCard>
      <Text style={styles.title}>Recently Verified Places</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item) => (
          <View key={item.name} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.label}>{item.name}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SoftCard>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 12,
  },
  row: {
    gap: 10,
  },
  item: {
    width: 108,
    height: 88,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.cardSoft,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "rgba(19,32,51,0.42)",
  },
  label: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
});
