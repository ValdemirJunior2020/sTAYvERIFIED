import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import Screen from "../../components/Screen";
import { forgotPassword } from "../../services/auth";
import { colors, radius, spacing } from "../../constants/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    try {
      if (!email.trim()) {
        Alert.alert("Missing email", "Please enter your email address.");
        return;
      }

      setLoading(true);
      await forgotPassword(email.trim());
      Alert.alert("Email sent", "Password reset instructions were sent to your email.");
      router.replace("/(auth)/login");
    } catch (error: any) {
      Alert.alert(
        "Reset failed",
        error?.message || "Unable to send password reset email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we will send you a password reset link.
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          placeholderTextColor="#8a98a8"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send Reset Email"}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.link}>Back to Login</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
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
    marginTop: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: "#f7faff",
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
  link: {
    marginTop: spacing.lg,
    textAlign: "center",
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },
});
