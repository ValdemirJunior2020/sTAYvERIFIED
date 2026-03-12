// File: client/app/(tabs)/home.tsx

import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import FeaturedReviewCard from "../../components/FeaturedReviewCard";
import NearbyMapCard from "../../components/NearbyMapCard";
import ScoreCard from "../../components/ScoreCard";
import SoftCard from "../../components/SoftCard";
import SubmitReviewCard from "../../components/SubmitReviewCard";
import VerifiedPlacesStrip from "../../components/VerifiedPlacesStrip";
import { colors } from "../../constants/theme";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function HomeScreen() {
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadLatestMap() {
      try {
        const q = query(
          collection(db, "reviews"),
          orderBy("created_at", "desc"),
          limit(1)
        );

        const snap = await getDocs(q);
        if (!mounted) return;

        if (!snap.empty) {
          const latest = snap.docs[0].data() as any;
          const incomingMap =
            latest.place_static_map_url || latest.staticMapUrl || "";
          setMapUrl(incomingMap || "");
        } else {
          setMapUrl("");
        }
      } catch {
        if (mounted) setMapUrl("");
      }
    }

    loadLatestMap();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={styles.brand}>StayVerified</Text>
      </View>

      <FeaturedReviewCard />

      <View style={styles.sectionGap} />
      <VerifiedPlacesStrip />

      <View style={styles.grid}>
        <SubmitReviewCard />
        <NearbyMapCard mapUrl={mapUrl} />
      </View>

      <ScoreCard />

      <SoftCard style={styles.bottomSpace}>
        <Text style={styles.smallTitle}>Trust-first travel intelligence</Text>
        <Text style={styles.body}>
          Proof-backed reviews, traveler reputation, and premium trust insights.
        </Text>
      </SoftCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 40,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 12,
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  brand: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -1,
  },
  sectionGap: {
    height: 14,
  },
  grid: {
    flexDirection: "row",
    gap: 14,
    marginTop: 14,
  },
  smallTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },
  body: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  bottomSpace: {
    marginTop: 14,
  },
});