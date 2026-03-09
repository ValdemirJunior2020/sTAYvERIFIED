import { Redirect } from "expo-router";
import React from "react";
import { useAuthSession } from "./_layout";

export default function IndexPage() {
  const { user, loading } = useAuthSession();

  if (loading) return null;

  return user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />;
}
