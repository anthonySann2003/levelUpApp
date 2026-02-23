import { Tabs } from "expo-router";
import { useLevelUpSound } from '../hooks/useLevelUpSound';

export default function RootLayout() {
  useLevelUpSound(); //Calling level up sound
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
    </Tabs>
  );
}