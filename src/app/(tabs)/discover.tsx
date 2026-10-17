import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Badge, IconBubble, SectionHeader } from '@/components/bits';
import { Card } from '@/components/card';
import { FrameArt } from '@/components/frame-art';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Gradients, Radius, Space } from '@/constants/theme';
import { collections, promoVideos } from '@/data/discover';
import { learnTopics, type LearnTopic } from '@/data/learn';
import { tap } from '@/lib/haptics';

function TopicGrid({ topics }: { topics: LearnTopic[] }) {
  return (
    <View style={styles.topicGrid}>
      {topics.map((topic) => (
        <Card
          key={topic.id}
          style={styles.topic}
          onPress={() => router.push({ pathname: '/learn/[topic]', params: { topic: topic.id } })}
        >
          <IconBubble name={topic.icon} color={topic.accent.fg} background={topic.accent.bg} size={40} />
          <Text variant="captionStrong" numberOfLines={2}>
            {topic.title}
          </Text>
          <Text variant="caption" numberOfLines={2}>
            {topic.short}
          </Text>
        </Card>
      ))}
    </View>
  );
}

export default function DiscoverScreen() {
  const choose = learnTopics.filter((t) => t.group === 'choose');
  const improve = learnTopics.filter((t) => t.group === 'improve');

  return (
    <Screen>
      <View>
        <Text variant="h1">Discover</Text>
        <Text variant="caption">New launches, lens guides and a quick eye check.</Text>
      </View>

      {/* New collections */}
      <View style={styles.section}>
        <SectionHeader title="New collections" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} style={styles.bleed}>
          {collections.map((c) => (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              onPress={() => {
                tap();
                router.push({ pathname: '/collection/[id]', params: { id: c.id } });
              }}
              style={({ pressed }) => pressed && { transform: [{ scale: 0.98 }] }}
            >
              <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.collection}>
                <Badge label={c.badge} color={Colors.ink} background={c.accent} />
                <View style={styles.collectionArt}>
                  <FrameArt shape={c.heroShape} color={c.heroColor} tint={c.heroTint} width={190} thickness={6} />
                </View>
                <Text variant="h2" color={Colors.textOnDark}>
                  {c.name}
                </Text>
                <Text variant="caption" color={Colors.textOnDarkMuted} numberOfLines={1}>
                  {c.tagline}
                </Text>
                <View style={styles.collectionCta}>
                  <Text variant="captionStrong" color={c.accent}>
                    {c.frames.length} styles · Explore
                  </Text>
                  <Icon name="arrow-forward" size={16} color={c.accent} />
                </View>
              </LinearGradient>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Promo videos */}
      {promoVideos.length ? (
        <View style={styles.section}>
          <SectionHeader title="Watch" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} style={styles.bleed}>
            {promoVideos.map((v) => (
              <Pressable
                key={v.id}
                accessibilityRole="button"
                accessibilityLabel={`Play ${v.title}`}
                onPress={() => {
                  tap();
                  router.push({ pathname: '/video/[id]', params: { id: v.id } });
                }}
              >
                <LinearGradient colors={v.gradient} style={styles.video}>
                  <View style={styles.play}>
                    <Icon name="play" size={24} color={Colors.ink} />
                  </View>
                  <View>
                    <Text variant="h3" color={Colors.textOnDark}>
                      {v.title}
                    </Text>
                    <Text variant="caption" color={Colors.textOnDarkMuted}>
                      {v.subtitle} · {v.duration}
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {/* Eye test game */}
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          tap();
          router.push('/eye-test');
        }}
        style={({ pressed }) => pressed && { transform: [{ scale: 0.98 }] }}
      >
        <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.game}>
          <LinearGradient colors={Gradients.heroGlow} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.flex}>
            <Text variant="overline" color={Colors.teal}>
              3-minute game
            </Text>
            <Text variant="h2" color={Colors.textOnDark}>
              Check your eyes at home
            </Text>
            <Text variant="caption" color={Colors.textOnDarkMuted}>
              Sharpness, astigmatism and colour, one eye at a time.
            </Text>
          </View>
          <View style={styles.gameIcon}>
            <Text style={styles.gameE}>E</Text>
          </View>
        </LinearGradient>
      </Pressable>

      {/* Choose lenses */}
      <View style={styles.section}>
        <SectionHeader title="Choose lenses" />
        <TopicGrid topics={choose} />
      </View>

      {/* Improve lenses */}
      <View style={styles.section}>
        <SectionHeader title="Improve lenses" />
        <TopicGrid topics={improve} />
      </View>

      {/* Face shapes */}
      <Card onPress={() => router.push('/face-shapes')} style={styles.face}>
        <View style={styles.flex}>
          <Text variant="h2">Frames for your face shape</Text>
          <Text variant="caption">Oval, round, square, heart or long? See what suits you.</Text>
        </View>
        <View style={styles.faceArt}>
          <FrameArt shape="wayfarer" color={Colors.ink} width={92} thickness={7} />
          <FrameArt shape="round" color={Colors.coral} width={92} thickness={7} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  section: { gap: Space.md },
  bleed: { marginHorizontal: -Space.xl },
  carousel: { gap: Space.md, paddingHorizontal: Space.xl },
  collection: { width: 280, borderRadius: Radius.xl, padding: Space.xl, gap: 4 },
  collectionArt: { alignItems: 'center', paddingVertical: Space.lg },
  collectionCta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Space.sm },
  video: { width: 240, height: 150, borderRadius: Radius.lg, padding: Space.lg, justifyContent: 'space-between' },
  play: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  game: { borderRadius: Radius.xl, padding: Space.xxl, flexDirection: 'row', alignItems: 'center', gap: Space.lg, overflow: 'hidden' },
  gameIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  gameE: { fontSize: 44, lineHeight: 50, fontWeight: '900', color: Colors.ink },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.md },
  topic: { width: '47%', flexGrow: 1, gap: 6, padding: Space.md },
  face: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  faceArt: { gap: 4 },
});
