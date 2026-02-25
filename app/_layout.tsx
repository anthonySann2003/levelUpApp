import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { useLevelUpSound } from '../hooks/useLevelUpSound';
import { useCharacterStore } from "../store/habitsStore";

export default function RootLayout() {
  const hasCompletedOnboarding = useCharacterStore(s => s.hasCompletedOnboarding); //Sets onboarding flag to value in store
  useLevelUpSound(); //Calling level up sound

  //If onboarding not complete will send user to it
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      setTimeout(() => {
        router.replace('/onboarding' as any);
      }, 100)
    }
  }, [hasCompletedOnboarding]);

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: "#111827", borderTopColor: "#1f2937" },
      tabBarActiveTintColor: "#facc15",
      tabBarInactiveTintColor: "#6b7280",
    }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="character" options={{ title: "Character" }} />
      <Tabs.Screen name="habits" options={{ title: "Habits" }} />
      <Tabs.Screen name="onboarding" options={{ href: null }} />
    </Tabs>
  );
}