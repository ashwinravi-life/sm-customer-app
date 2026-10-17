import { Tabs } from 'expo-router';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { Colors, Fonts, Shadow } from '@/constants/theme';
import { select } from '@/lib/haptics';

function tabIcon(name: IconName, activeName: IconName) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Icon name={focused ? activeName : name} size={24} color={color} />;
  };
}

function QrTabIcon({ focused }: { focused: boolean }) {
  return (
    <View style={[styles.qrButton, focused && styles.qrButtonActive]}>
      <Icon name="qr-code" size={28} color={focused ? Colors.ink : Colors.teal} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenListeners={{ tabPress: () => select() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.ink,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontFamily: Fonts.bold, fontSize: 11 },
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home-outline', 'home') }} />
      <Tabs.Screen
        name="discover"
        options={{ title: 'Discover', tabBarIcon: tabIcon('compass-outline', 'compass') }}
      />
      <Tabs.Screen name="my-qr" options={{ title: 'My QR', tabBarIcon: QrTabIcon }} />
      <Tabs.Screen
        name="rewards"
        options={{ title: 'Rewards', tabBarIcon: tabIcon('sparkles-outline', 'sparkles') }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Orders', tabBarIcon: tabIcon('bag-handle-outline', 'bag-handle') }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 0,
    paddingTop: 6,
    ...Shadow.card,
  },
  qrButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: -26,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.surface,
    ...Shadow.raised,
  },
  qrButtonActive: { backgroundColor: Colors.teal },
});
