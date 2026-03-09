import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";

type Props = {
  label: string;
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
  onValueChange: (value: number) => void;
};

export default function TrustSlider({
  label,
  value,
  minimumValue = 1,
  maximumValue = 5,
  step = 1,
  leftLabel,
  rightLabel,
  onValueChange,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}/{maximumValue}</Text>
      </View>

      {Platform.OS === "web" ? (
        <input
          type="range"
          min={minimumValue}
          max={maximumValue}
          step={step}
          value={value}
          onChange={(e) => onValueChange(Number(e.target.value))}
          style={webSliderStyle}
        />
      ) : (
        <Slider
          value={value}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          onValueChange={onValueChange}
          minimumTrackTintColor="#d6b36a"
          maximumTrackTintColor="rgba(255,255,255,0.15)"
          thumbTintColor="#f4d18d"
          style={styles.nativeSlider}
        />
      )}

      <View style={styles.bottomRow}>
        <Text style={styles.edge}>{leftLabel || ""}</Text>
        <Text style={styles.edge}>{rightLabel || ""}</Text>
      </View>
    </View>
  );
}

const webSliderStyle: React.CSSProperties = {
  width: "100%",
  height: 36,
  accentColor: "#d6b36a",
  background: "transparent",
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 18,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#120d10",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    color: "#fff7eb",
    fontSize: 15,
    fontWeight: "800",
  },
  value: {
    color: "#d6b36a",
    fontSize: 14,
    fontWeight: "900",
  },
  nativeSlider: {
    width: "100%",
    height: 36,
  },
  bottomRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  edge: {
    color: "#b7aea5",
    fontSize: 12,
  },
});
