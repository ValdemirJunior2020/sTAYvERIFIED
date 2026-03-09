// File: app/(auth)/signup.tsx
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '@/components/Screen';
import { AppInput } from '@/components/AppInput';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function SignupScreen() {
  const { signup } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    try {
      setSubmitting(true);
      await signup(displayName, email, password);
    } catch (error: any) {
      Alert.alert('Sign up failed', error.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text style={styles.brand}>Create your trust profile</Text>
      <GlassCard>
        <Text style={styles.title}>Join StayVerified</Text>
        <AppInput label="Display name" value={displayName} onChangeText={setDisplayName} />
        <AppInput label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <AppInput label="Password" secureTextEntry value={password} onChangeText={setPassword} helperText="Use at least 6 characters." />
        <GradientButton title="Sign Up" onPress={handleSignup} loading={submitting} />
      </GlassCard>
      <Link href="/(auth)/login" asChild>
        <Pressable>
          <Text style={styles.footer}>
            Already have an account? <Text style={styles.linkStrong}>Login</Text>
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
  brand: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900'
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16
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
