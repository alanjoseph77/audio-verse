import { Stack } from "expo-router";
import { AudioProvider } from "../context/AudioContext";

export default function RootLayout() {
  return (
    <AudioProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book-detail" options={{ presentation: 'card' }} />
        <Stack.Screen name="player" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="artist-profile" />
      </Stack>
    </AudioProvider>
  );
}
