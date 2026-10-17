import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Avatar, IconBubble, ProgressBar, SectionHeader } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Coin } from '@/components/coin';
import { Icon, type IconName } from '@/components/icon';
import { FeaturedOffer } from '@/components/offer-card';
import { OrderProgressBar } from '@/components/order-progress';
import { Screen } from '@/components/screen';
import { StoreCard } from '@/components/store-card';
import { Text } from '@/components/text';
import { Colors, Gradients, Radius, Space } from '@/constants/theme';
import { EARN_RULES, family, offers, orders, stores } from '@/data/mock';
import { useAppState, useCustomer } from '@/lib/app-state';
import { daysUntil, formatNumber, formatRupees, formatShortDate, greeting } from '@/lib/format';
import { tap } from '@/lib/haptics';
import { formatAppointment } from '@/lib/appointments';
import { isActive, stageLabel } from '@/lib/orders';

const QUICK_ACTIONS: { icon: IconName; label: string; color: string; bg: string; href: '/book' | '/prescriptions' | '/stores' | '/refer' }[] = [
  { icon: 'calendar', label: 'Book test', color: Colors.purple, bg: Colors.purpleSoft, href: '/book' },
  { icon: 'eye', label: 'Prescriptions', color: Colors.sky, bg: Colors.skySoft, href: '/prescriptions' },
  { icon: 'location', label: 'Stores', color: Colors.coral, bg: Colors.coralSoft, href: '/stores' },
  { icon: 'gift', label: 'Refer & Earn', color: Colors.tealDeep, bg: Colors.tealSoft, href: '/refer' },
];

// Family members whose next eye test is due within 30 days (or overdue).
function examsDueSoon() {
  return family
    .map((member) => ({ member, due: member.prescriptions[0]?.nextExamDue }))
    .filter((x): x is { member: (typeof family)[number]; due: string } => !!x.due && daysUntil(x.due) <= 30);
}

export default function HomeScreen() {
  const customer = useCustomer();
  const { coinBalance, tier, nextTier, appointments } = useAppState();
  const nextAppointment = appointments[0];
  const nextStore = stores.find((s) => s.id === nextAppointment?.storeId);
  const activeOrder = orders.find(isActive);
  const dueExams = examsDueSoon();

  return (
    <Screen>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => {
            tap();
            router.push('/profile');
          }}
          style={({ pressed }) => [styles.headerProfile, pressed && { opacity: 0.7 }]}
        >
          <Avatar name={customer.name} color={Colors.ink} size={46} />
          <View style={styles.flex}>
            <Text variant="caption">{greeting()},</Text>
            <Text variant="h2">{customer.firstName}</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show my QR"
          onPress={() => {
            tap();
            router.navigate('/my-qr');
          }}
          style={({ pressed }) => [styles.headerQr, pressed && { opacity: 0.7 }]}
        >
          <Icon name="qr-code" size={22} />
        </Pressable>
      </View>

      {/* Member card */}
      <View style={styles.hero}>
        <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={Gradients.heroGlow}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroTop}>
          <Text variant="overline" color={Colors.textOnDarkMuted}>
            SM Club
          </Text>
          <View style={styles.tierPill}>
            <Icon name="diamond" size={12} color={Colors.coin} />
            <Text variant="captionStrong" color={Colors.textOnDark}>
              {tier}
            </Text>
          </View>
        </View>

        <View style={styles.balanceRow}>
          <Coin size={40} />
          <Text variant="display" color={Colors.textOnDark}>
            {formatNumber(coinBalance)}
          </Text>
        </View>
        <Text variant="caption" color={Colors.textOnDarkMuted}>
          SM Coins · worth {formatRupees(coinBalance)} on your next purchase
        </Text>

        {nextTier ? (
          <View style={styles.tierProgress}>
            <ProgressBar progress={nextTier.progress} track="rgba(255,255,255,0.15)" />
            <Text variant="caption" color={Colors.textOnDarkMuted}>
              Earn {formatNumber(nextTier.coinsNeeded)} more coins to unlock {nextTier.tier}
            </Text>
          </View>
        ) : null}

        <View style={styles.heroActions}>
          <Button
            title="Redeem"
            icon="flash"
            variant="teal"
            size="md"
            style={styles.flex}
            onPress={() => router.push('/redeem')}
          />
          <Button
            title="Earn more"
            icon="trending-up"
            variant="light"
            size="md"
            style={styles.flex}
            onPress={() => router.navigate('/rewards')}
          />
        </View>
      </View>

      {/* Upcoming eye test */}
      {nextAppointment && nextStore ? (
        <Card
          onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: nextAppointment.id } })}
          style={styles.reminder}
        >
          <IconBubble name="calendar" color={Colors.purple} background={Colors.purpleSoft} />
          <View style={styles.flex}>
            <Text variant="overline" color={Colors.purple}>
              Upcoming eye test
            </Text>
            <Text variant="h3">{formatAppointment(nextAppointment)}</Text>
            <Text variant="caption" numberOfLines={1}>
              {nextAppointment.memberName.split(' ')[0]} · {nextStore.name}
            </Text>
          </View>
          <Icon name="chevron-forward" size={20} color={Colors.textMuted} />
        </Card>
      ) : null}

      {/* Active order */}
      {activeOrder ? (
        <Card onPress={() => router.push({ pathname: '/order/[id]', params: { id: activeOrder.id } })} style={styles.orderCard}>
          <View style={styles.orderTop}>
            <IconBubble name="construct" color={Colors.tealDeep} background={Colors.tealSoft} />
            <View style={styles.flex}>
              <Text variant="overline" color={Colors.tealDeep}>
                Order in progress
              </Text>
              <Text variant="h3">{stageLabel(activeOrder.stage, activeOrder)}</Text>
              <Text variant="caption">
                {activeOrder.fulfilment === 'store_pickup' ? 'Ready for pickup' : 'Delivery'} by{' '}
                {formatShortDate(activeOrder.expectedDate)}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={Colors.textMuted} />
          </View>
          <OrderProgressBar order={activeOrder} />
        </Card>
      ) : null}

      {/* Quick actions */}
      <View style={styles.quickGrid}>
        {QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.label}
            accessibilityRole="button"
            onPress={() => {
              tap();
              router.push(action.href);
            }}
            style={({ pressed }) => [styles.quick, pressed && { transform: [{ scale: 0.95 }] }]}
          >
            <IconBubble name={action.icon} color={action.color} background={action.bg} size={54} />
            <Text variant="captionStrong" align="center" numberOfLines={1}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Eye test reminder */}
      {dueExams.map(({ member, due }) => {
        const days = daysUntil(due);
        return (
          <Card key={member.id} style={styles.reminder}>
            <IconBubble name="alarm" color={Colors.coral} background={Colors.coralSoft} />
            <View style={styles.flex}>
              <Text variant="h3">
                {member.relation === 'Self' ? 'Your' : `${member.name.split(' ')[0]}'s`} eye test is{' '}
                {days < 0 ? 'overdue' : days === 0 ? 'due today' : `due in ${days} days`}
              </Text>
              <Text variant="caption">
                Free at any store, and you earn {EARN_RULES.eyeTest} SM Coins.
              </Text>
            </View>
            <Button title="Book" size="md" variant="primary" onPress={() => router.push('/book')} />
          </Card>
        );
      })}

      {/* Offers */}
      <View style={styles.section}>
        <SectionHeader title="Offers for you" actionLabel="See all" onAction={() => router.push('/offers')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          style={styles.bleed}
        >
          {offers.filter((o) => !o.exclusiveTier).slice(0, 4).map((offer) => (
            <FeaturedOffer key={offer.id} offer={offer} width={290} height={230} />
          ))}
        </ScrollView>
      </View>

      {/* Refer banner */}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          tap();
          router.push('/refer');
        }}
      >
        <LinearGradient colors={Gradients.teal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.referBanner}>
          <View style={styles.flex}>
            <Text variant="h2">Invite friends,</Text>
            <Text variant="h2">earn up to {EARN_RULES.referralJoin + EARN_RULES.referralPurchase} coins each</Text>
            <Text variant="captionStrong" style={styles.referCta}>
              Share your code →
            </Text>
          </View>
          <View style={styles.referIcon}>
            <Icon name="gift" size={44} color={Colors.ink} />
          </View>
        </LinearGradient>
      </Pressable>

      {/* Nearest store */}
      <View style={styles.section}>
        <SectionHeader title="Store near you" actionLabel="All stores" onAction={() => router.push('/stores')} />
        <StoreCard store={stores[0]} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Space.md },
  headerQr: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { borderRadius: Radius.xl, padding: Space.xxl, gap: Space.sm, overflow: 'hidden' },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md, marginTop: Space.sm },
  tierProgress: { gap: Space.sm, marginTop: Space.md },
  heroActions: { flexDirection: 'row', gap: Space.sm, marginTop: Space.md },
  orderCard: { gap: Space.lg },
  orderTop: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  quick: { width: '24%', alignItems: 'center', gap: Space.sm },
  reminder: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  section: { gap: Space.md },
  bleed: { marginHorizontal: -Space.xl },
  carousel: { gap: Space.md, paddingHorizontal: Space.xl, paddingBottom: Space.sm },
  referBanner: { borderRadius: Radius.xl, padding: Space.xxl, flexDirection: 'row', alignItems: 'center', gap: Space.md },
  referCta: { marginTop: Space.md },
  referIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
