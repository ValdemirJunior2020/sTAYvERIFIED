// File: app/(auth)/login.tsx
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AppInput } from '@/components/AppInput';
import { GradientButton } from '@/components/GradientButton';
import { GlassCard } from '@/components/GlassCard';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login failed', error.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.brand}>StayVerified</Text>
        <Text style={styles.pitch}>Trust intelligence for hotels, OTAs, rentals, and booking platforms.</Text>
      </View>

      <GlassCard>
        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>
          <AppInput label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <AppInput label="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <GradientButton title="Login" onPress={handleLogin} loading={submitting} />
          <Link href="/(auth)/forgot-password" asChild>
            <Pressable>
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </Link>
        </View>
      </GlassCard>

      <Link href="/(auth)/signup" asChild>
        <Pressable>
          <Text style={styles.footer}>
            New here? <Text style={styles.linkStrong}>Create account</Text>
          </Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 24
  },
  hero: {
    gap: 8
  },
  brand: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '900'
  },
  pitch: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  },
  form: {
    gap: 16
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800'
  },
  link: {
    color: colors.gold,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '700'
  },
  footer: {
    color: colors.textMuted,
    textAlign: 'center'
  },
  linkStrong: {
    color: colors.text,
    fontWeight: '800'
  }
});
