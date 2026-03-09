import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../firebase/config";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function useAuthSession() {
  return useContext(AuthContext);
}

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  const value = useMemo(() => ({ user, loading }), [user, loading]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#120606",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#d6b36a" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContext.Provider>
  );
}
