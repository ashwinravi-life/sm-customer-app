import Constants from 'expo-constants';
import { router, type Href } from 'expo-router';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Avatar, IconBubble } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon, type IconName } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { family } from '@/data/mock';
import { useAppState, useCustomer } from '@/lib/app-state';
import { tap } from '@/lib/haptics';

interface MenuItem {
  icon: IconName;
  label: string;
  hint?: string;
  color: string;
  bg: string;
  onPress: () => void;
}

const go = (href: Href) => () => router.push(href);

const MENU: MenuItem[] = [
  { icon: 'eye', label: 'Prescriptions', hint: `${family.length} members`, color: Colors.purple, bg: Colors.purpleSoft, onPress: go('/prescriptions') },
  { icon: 'bag-handle', label: 'My orders', color: Colors.tealDeep, bg: Colors.tealSoft, onPress: () => router.navigate('/orders') },
  { icon: 'pricetags', label: 'Offers & coupons', color: Colors.sky, bg: Colors.skySoft, onPress: go('/offers') },
  { icon: 'location', label: 'Nearby stores', color: Colors.coral, bg: Colors.coralSoft, onPress: go('/stores') },
  { icon: 'gift', label: 'Refer & earn', color: Colors.coral, bg: Colors.coralSoft, onPress: go('/refer') },
  {
    icon: 'headset',
    label: 'Customer care',
    hint: '+91 97915 97915',
    color: Colors.text,
    bg: Colors.background,
    onPress: () => Linking.openURL('tel:+919791597915'),
  },
  {
    icon: 'shield-checkmark',
    label: 'Privacy policy',
    color: Colors.text,
    bg: Colors.background,
    onPress: () => Linking.openURL('https://www.specsmakers.in/pages/privacy-policy'),
  },
];

export default function ProfileScreen() {
  const customer = useCustomer();
  const { signOut, tier } = useAppState();

  return (
    <Screen>
      <Text variant="h1">Profile</Text>

      <Card style={styles.profile}>
        <Avatar name={customer.name} color={Colors.ink} size={60} />
        <View style={styles.flex}>
          <Text variant="h2">{customer.name}</Text>
          <Text variant="caption">+91 {customer.mobile}</Text>
          <View style={styles.tier}>
            <Icon name="diamond" size={12} color={Colors.coin} />
            <Text variant="captionStrong">SM Club {tier}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.gap}>
        <View style={styles.rowBetween}>
          <Text variant="h3">Family</Text>
          <Text variant="caption">Prescriptions linked to your number</Text>
        </View>
        <View style={styles.familyRow}>
          {family.map((member) => (
            <Pressable
              key={member.id}
              accessibilityRole="button"
              onPress={() => {
                tap();
                router.push({ pathname: '/prescriptions', params: { member: member.id } });
              }}
              style={styles.familyMember}
            >
              <Avatar name={member.name} color={member.avatarColor} size={52} />
              <Text variant="captionStrong" numberOfLines={1}>
                {member.name.split(' ')[0]}
              </Text>
              <Text variant="caption">{member.relation}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card padded={false}>
        {MENU.map((item, i) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            onPress={() => {
              tap();
              item.onPress();
            }}
            style={({ pressed }) => [styles.menuItem, i > 0 && styles.menuBorder, pressed && { backgroundColor: Colors.background }]}
          >
            <IconBubble name={item.icon} color={item.color} background={item.bg} size={38} />
            <Text variant="bodyStrong" style={styles.flex}>
              {item.label}
            </Text>
            {item.hint ? <Text variant="caption">{item.hint}</Text> : null}
            <Icon name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        ))}
      </Card>

      <Button title="Log out" icon="log-out-outline" variant="outline" onPress={signOut} />

      <Text variant="caption" align="center">
        Specsmakers · v{Constants.expoConfig?.version ?? '1.0.0'} (prototype)
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.lg },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Space.sm },
  profile: { flexDirection: 'row', alignItems: 'center', gap: Space.lg },
  tier: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: Colors.coinSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  familyRow: { flexDirection: 'row', gap: Space.lg },
  familyMember: { alignItems: 'center', gap: 4, width: 72 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Space.md, paddingHorizontal: Space.lg, paddingVertical: 14 },
  menuBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
});
