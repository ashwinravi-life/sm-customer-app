import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AutoVideo } from '@/components/auto-video';
import { Badge, IconBubble, SectionHeader } from '@/components/bits';
import { Card } from '@/components/card';
import { FrameArt } from '@/components/frame-art';
import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Gradients, Radius, Space } from '@/constants/theme';
import { collections, heroVideo, promoVideos, type Collection } from '@/data/discover';
import { learnTopics, type LearnTopic } from '@/data/learn';
import { PHOTOS } from '@/data/media';
import { tap } from '@/lib/haptics';

const LOGO_ASPECT_RATIO = 1920 / 196;
const SHADE = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.78)'] as const;

function Photo({ uri, style }: { uri: string; style?: object }) {
  return (
    <Image
      source={{ uri }}
      style={[StyleSheet.absoluteFill, style]}
      contentFit="cover"
      transition={250}
      cachePolicy="memory-disk"
    />
  );
}

function Tappable({ onPress, style, children, label }: { onPress: () => void; style?: object; children: ReactNode; label?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const openCollection = (c: Collection) => router.push({ pathname: '/collection/[id]', params: { id: c.id } });

function CollectionBanner({ collection, height }: { collection: Collection; height: number }) {
  return (
    <Tappable onPress={() => openCollection(collection)} style={[styles.banner, { height }]} label={collection.name}>
      {collection.heroVideo ? <AutoVideo source={collection.heroVideo} /> : <Photo uri={collection.heroImage} />}
      <LinearGradient colors={SHADE} start={{ x: 0, y: 0.35 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.bannerTop}>
        <Badge label={collection.badge} color={Colors.ink} background={collection.accent} />
      </View>
      <View style={styles.bannerText}>
        <Text variant="h1" color={Colors.textOnDark}>
          {collection.name}
        </Text>
        <Text variant="body" color={Colors.textOnDarkMuted} numberOfLines={2}>
          {collection.tagline}
        </Text>
        <View style={styles.cta}>
          <Text variant="captionStrong" color={collection.accent}>
            Explore {collection.frames.length} styles
          </Text>
          <Icon name="arrow-forward" size={16} color={collection.accent} />
        </View>
      </View>
    </Tappable>
  );
}

function CollectionTile({ collection }: { collection: Collection }) {
  return (
    <Tappable onPress={() => openCollection(collection)} style={styles.tile} label={collection.name}>
      <Photo uri={collection.heroImage} />
      <LinearGradient colors={SHADE} start={{ x: 0, y: 0.4 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.bannerTop}>
        <Badge label={collection.badge} color={Colors.ink} background={collection.accent} />
      </View>
      <View style={styles.bannerText}>
        <Text variant="h2" color={Colors.textOnDark}>
          {collection.name}
        </Text>
        <Text variant="caption" color={Colors.textOnDarkMuted} numberOfLines={2}>
          {collection.tagline}
        </Text>
      </View>
    </Tappable>
  );
}

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

const LOOKS = [
  { uri: PHOTOS.couplePastel, title: 'Pastel pairs', collection: 'titanium-air', tall: false },
  { uri: PHOTOS.orangeJacketGlasses, title: 'Night-out round', collection: 'retro-revival', tall: true },
  { uri: PHOTOS.framesFlatLay, title: 'Clear & crystal', collection: 'titanium-air', tall: true },
  { uri: PHOTOS.sunglassesPool, title: 'Poolside shades', collection: 'sun-club', tall: false },
];

export default function DiscoverScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const scrollRef = useRef<ScrollView>(null);
  const [collectionsY, setCollectionsY] = useState(0);
  const [pastHero, setPastHero] = useState(false);

  const heroHeight = Math.round(windowHeight * 0.74);
  const byId = (id: string) => collections.find((c) => c.id === id);
  const titanium = byId('titanium-air');
  const retro = byId('retro-revival');
  const sun = byId('sun-club');
  const kids = byId('little-explorers');
  const choose = learnTopics.filter((t) => t.group === 'choose');
  const improve = learnTopics.filter((t) => t.group === 'improve');

  return (
    <View style={styles.root}>
      {/* Light status bar over the dark hero video, dark once scrolled onto white */}
      {focused ? <StatusBar style={pastHero ? 'dark' : 'light'} /> : null}

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={64}
        onScroll={(e) => {
          const past = e.nativeEvent.contentOffset.y > heroHeight - insets.top - 40;
          if (past !== pastHero) setPastHero(past);
        }}
        contentContainerStyle={styles.content}
      >
        {/* Hero video */}
        <View style={[styles.hero, { height: heroHeight }]}>
          <AutoVideo source={heroVideo.source} />
          <LinearGradient colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0)']} style={styles.heroTopShade} />
          <LinearGradient colors={SHADE} start={{ x: 0, y: 0.3 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={[styles.heroLogo, { top: insets.top + Space.md }]}>
            <Image
              source={require('@/assets/images/specsmakers-logo-white.png')}
              style={styles.logo}
              contentFit="contain"
              accessibilityLabel="Specsmakers"
            />
          </View>
          <View style={styles.heroText}>
            <Text variant="overline" color={Colors.teal}>
              {heroVideo.eyebrow}
            </Text>
            <Text variant="display" color={Colors.textOnDark}>
              {heroVideo.title}
            </Text>
            <Text variant="body" color={Colors.textOnDarkMuted}>
              {heroVideo.subtitle}
            </Text>
            <Tappable
              onPress={() => scrollRef.current?.scrollTo({ y: collectionsY - Space.lg, animated: true })}
              style={styles.heroCta}
              label="Explore collections"
            >
              <Text variant="bodyStrong">Explore collections</Text>
              <Icon name="arrow-down" size={18} />
            </Tappable>
          </View>
        </View>

        <View style={styles.body}>
          {/* Collections */}
          <View style={styles.section} onLayout={(e) => setCollectionsY(e.nativeEvent.layout.y + heroHeight)}>
            <SectionHeader title="New collections" />
            {titanium ? <CollectionBanner collection={titanium} height={440} /> : null}
            <View style={styles.tileRow}>
              {retro ? <CollectionTile collection={retro} /> : null}
              {kids ? <CollectionTile collection={kids} /> : null}
            </View>
            {sun ? <CollectionBanner collection={sun} height={380} /> : null}
          </View>

          {/* Video reels */}
          {promoVideos.length ? (
            <View style={styles.section}>
              <SectionHeader title="Watch" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} style={styles.bleed}>
                {promoVideos.map((v) => (
                  <Tappable
                    key={v.id}
                    onPress={() => router.push({ pathname: '/video/[id]', params: { id: v.id } })}
                    style={styles.reel}
                    label={`Play ${v.title}`}
                  >
                    <AutoVideo source={v.source} />
                    <LinearGradient colors={SHADE} start={{ x: 0, y: 0.45 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
                    <View style={styles.reelPlay}>
                      <Icon name="volume-high" size={14} color={Colors.ink} />
                    </View>
                    <View style={styles.bannerText}>
                      <Text variant="h3" color={Colors.textOnDark}>
                        {v.title}
                      </Text>
                      <Text variant="caption" color={Colors.textOnDarkMuted}>
                        {v.subtitle}
                      </Text>
                    </View>
                  </Tappable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* Shop the look */}
          <View style={styles.section}>
            <SectionHeader title="Shop the look" />
            <View style={styles.masonry}>
              {[0, 1].map((col) => (
                <View key={col} style={styles.masonryCol}>
                  {LOOKS.filter((_, i) => i % 2 === col).map((look) => (
                    <Tappable
                      key={look.title}
                      onPress={() => router.push({ pathname: '/collection/[id]', params: { id: look.collection } })}
                      style={[styles.look, { height: look.tall ? 260 : 190 }]}
                      label={look.title}
                    >
                      <Photo uri={look.uri} />
                      <LinearGradient colors={SHADE} start={{ x: 0, y: 0.55 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
                      <View style={styles.lookText}>
                        <Text variant="captionStrong" color={Colors.textOnDark}>
                          {look.title}
                        </Text>
                      </View>
                    </Tappable>
                  ))}
                </View>
              ))}
            </View>
          </View>

          {/* Progressive lens banner */}
          <Tappable
            onPress={() => router.push({ pathname: '/learn/[topic]', params: { topic: 'progressive' } })}
            style={styles.splitBanner}
            label="Progressive lenses"
          >
            <View style={styles.splitImage}>
              <Photo uri={PHOTOS.womanSareeReading} />
            </View>
            <View style={styles.splitText}>
              <Text variant="overline" color={Colors.tealDeep}>
                40+ and reading?
              </Text>
              <Text variant="h2">Progressives that feel natural</Text>
              <Text variant="caption">Far, screen and book in one pair, with no line.</Text>
              <View style={styles.cta}>
                <Text variant="captionStrong" color={Colors.tealDeep}>
                  See how they work
                </Text>
                <Icon name="arrow-forward" size={16} color={Colors.tealDeep} />
              </View>
            </View>
          </Tappable>

          {/* Every generation */}
          <View style={styles.section}>
            <Text variant="h1">Eyewear for every generation.</Text>
            <Text variant="caption">Keep the whole family’s prescriptions in one place.</Text>
            <View style={styles.mosaic}>
              <View style={[styles.mosaicItem, styles.mosaicTall]}>
                <Photo uri={PHOTOS.grandmotherSmiling} />
              </View>
              <View style={styles.mosaicCol}>
                <View style={[styles.mosaicItem, styles.mosaicShort]}>
                  <Photo uri={PHOTOS.womanSareePortrait} />
                </View>
                <View style={[styles.mosaicItem, styles.mosaicShort]}>
                  <Photo uri={PHOTOS.boyGlasses} />
                </View>
              </View>
            </View>
            <Tappable onPress={() => router.push('/prescriptions')} style={styles.inlineCta} label="Family prescriptions">
              <Icon name="people" size={18} color={Colors.textOnDark} />
              <Text variant="bodyStrong" color={Colors.textOnDark}>
                See family prescriptions
              </Text>
            </Tappable>
          </View>

          {/* Eye test game */}
          <Tappable onPress={() => router.push('/eye-test')} style={styles.game} label="Eye test game">
            <LinearGradient colors={Gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
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
          </Tappable>

          {/* Lens guides */}
          <View style={styles.section}>
            <SectionHeader title="Choose lenses" />
            <TopicGrid topics={choose} />
          </View>
          <View style={styles.section}>
            <SectionHeader title="Improve lenses" />
            <TopicGrid topics={improve} />
          </View>

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

          <Text variant="caption" align="center" style={styles.credit}>
            Prototype imagery: Pexels stock photos and videos.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.95 },
  content: { paddingBottom: 120 },
  hero: { backgroundColor: Colors.ink, justifyContent: 'flex-end', overflow: 'hidden' },
  heroTopShade: { position: 'absolute', top: 0, left: 0, right: 0, height: 140 },
  heroLogo: { position: 'absolute', left: Space.xl },
  logo: { height: 22, aspectRatio: LOGO_ASPECT_RATIO },
  heroText: { padding: Space.xl, paddingBottom: Space.xxxl, gap: Space.sm },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Space.sm,
    marginTop: Space.md,
    backgroundColor: Colors.teal,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: Radius.pill,
  },
  body: { padding: Space.xl, gap: Space.xxxl },
  section: { gap: Space.md },
  banner: { borderRadius: Radius.xl, overflow: 'hidden', backgroundColor: Colors.ink, justifyContent: 'space-between' },
  bannerTop: { padding: Space.lg },
  bannerText: { padding: Space.xl, gap: 4 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Space.sm },
  tileRow: { flexDirection: 'row', gap: Space.md },
  tile: {
    flex: 1,
    height: 300,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.ink,
    justifyContent: 'space-between',
  },
  bleed: { marginHorizontal: -Space.xl },
  carousel: { gap: Space.md, paddingHorizontal: Space.xl },
  reel: {
    width: 190,
    height: 300,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.ink,
    justifyContent: 'flex-end',
  },
  reelPlay: {
    position: 'absolute',
    top: Space.md,
    right: Space.md,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masonry: { flexDirection: 'row', gap: Space.md },
  masonryCol: { flex: 1, gap: Space.md },
  look: { borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.border, justifyContent: 'flex-end' },
  lookText: { padding: Space.md },
  splitBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    minHeight: 220,
  },
  splitImage: { width: '42%', backgroundColor: Colors.border },
  splitText: { flex: 1, padding: Space.lg, gap: 4, justifyContent: 'center' },
  mosaic: { flexDirection: 'row', gap: Space.md, height: 320 },
  mosaicCol: { flex: 1, gap: Space.md },
  mosaicItem: { borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.border },
  mosaicTall: { flex: 1.15 },
  mosaicShort: { flex: 1 },
  inlineCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.sm,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.ink,
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
  credit: { marginTop: -Space.lg },
});
