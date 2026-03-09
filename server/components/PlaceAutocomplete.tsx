import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { PlaceSuggestion, searchPlaces } from "../services/places";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSelectPlace: (place: PlaceSuggestion) => void;
};

export default function PlaceAutocomplete({
  value,
  onChangeText,
  onSelectPlace,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PlaceSuggestion[]>([]);

  useEffect(() => {
    const q = value.trim();

    if (q.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const items = await searchPlaces(q);
        setResults(items);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [value]);

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search hotel or property"
        placeholderTextColor="#8d827b"
        style={styles.input}
      />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}

      {results.length > 0 ? (
        <View style={styles.dropdown}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.placeId}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onSelectPlace(item);
                  setResults([]);
                }}
                style={styles.item}
              >
                <Text style={styles.mainText}>
                  {item.mainText || item.text}
                </Text>
                {!!item.secondaryText && (
                  <Text style={styles.secondaryText}>{item.secondaryText}</Text>
                )}
              </Pressable>
            )}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f7faff",
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
  },
  loadingWrap: {
    paddingVertical: 10,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 220,
    overflow: "hidden",
  },
  item: {
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mainText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryText: {
    color: colors.textSoft,
    fontSize: 12,
    marginTop: 4,
  },
});
