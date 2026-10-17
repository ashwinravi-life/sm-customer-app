import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  NunitoSans_900Black,
  useFonts,
} from '@expo-google-fonts/nunito-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';
import { AppStateProvider, useAppState } from '@/lib/app-state';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <AppStateProvider>
      <RootStack />
    </AppStateProvider>
  );
}

function RootStack() {
  const { customer } = useAppState();
  const signedIn = customer !== null;

  return (
    <>
      <StatusBar style={signedIn ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="verify" />
        </Stack.Protected>

        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="order/[id]" />
          <Stack.Screen name="prescriptions" />
          <Stack.Screen name="offers" />
          <Stack.Screen name="stores" />
          <Stack.Screen name="book" />
          <Stack.Screen name="appointment/[id]" />
          <Stack.Screen name="refer" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="collection/[id]" />
          <Stack.Screen name="video/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
          <Stack.Screen name="learn/[topic]" />
          <Stack.Screen name="face-shapes" />
          <Stack.Screen name="eye-test" options={{ gestureEnabled: false }} />
          <Stack.Screen name="redeem" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
