import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AutoVideo } from '@/components/auto-video';
import { Badge } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { FrameArt } from '@/components/frame-art';
import { Icon } from '@/components/icon';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Fonts, Radius, Space } from '@/constants/theme';
import { collections, type Collection, type CollectionFeature, type CollectionFrame } from '@/data/discover';
import { formatRupees } from '@/lib/format';
import { select, tap } from '@/lib/haptics';

function FrameTile({ frame }: { frame: CollectionFrame }) {
  const [color, setColor] = useState(frame.swatches[0] ?? frame.color);
  return (
    <Card style={styles.tile}>
      <View style={styles.tileArt}>
        <FrameArt shape={frame.shape} color={color} tint={frame.tint} width={136} />
      </View>
      <Text variant="captionStrong" numberOfLines={1}>
        {frame.name}
      </Text>
      <Text variant="caption" numberOfLines={1}>
        {frame.material} · {frame.colorName}
      </Text>
      <View style={styles.tileBottom}>
        <Text variant="h3">{formatRupees(frame.price)}</Text>
        <View style={styles.swatches}>
          {frame.swatches.map((s) => (
            <Pressable
              key={s}
              accessibilityRole="button"
              accessibilityLabel="Change colour"
              hitSlop={6}
              onPress={() => {
                select();
                setColor(s);
              }}
              style={[styles.swatch, { backgroundColor: s }, s === color && styles.swatchActive]}
            />
          ))}
        </View>
      </View>
    </Card>
  );
}

function LearnMore({ topic, color }: { topic: string; color: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={() => {
        tap();
        router.push({ pathname: '/learn/[topic]', params: { topic } });
      }}
      style={styles.learn}
    >
      <Text variant="captionStrong" color={color}>
        See how it works
      </Text>
      <Icon name="arrow-forward" size={16} color={color} />
    </Pressable>
  );
}

function FeatureBanner({ feature, collection }: { feature: CollectionFeature; collection: Collection }) {
  if (feature.image) {
    return (
      <View style={styles.featurePhoto}>
        <Image source={{ uri: feature.image }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.82)']}
          start={{ x: 0, y: 0.25 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.featureIcon}>
          <Icon name={feature.icon} size={22} color={Colors.ink} />
        </View>
        <View style={styles.featureText}>
          <Text variant="h2" color={Colors.textOnDark}>
            {feature.title}
          </Text>
          <Text variant="body" color={Colors.textOnDarkMuted}>
            {feature.text}
          </Text>
          {feature.learnTopic ? <LearnMore topic={feature.learnTopic} color={collection.accent} /> : null}
        </View>
      </View>
    );
  }

  return (
    <LinearGradient colors={collection.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.featureStat}>
      {/* Oversized frame outline as a watermark */}
      <View style={styles.watermark} pointerEvents="none">
        <FrameArt shape={collection.heroShape} color="rgba(255,255,255,0.12)" width={260} thickness={4} />
      </View>
      <Icon name={feature.icon} size={26} color={collection.accent} />
      <Text style={styles.stat} color={Colors.textOnDark}>
        {feature.stat}
      </Text>
      <Text variant="overline" color={collection.accent}>
        {feature.statLabel}
      </Text>
      <Text variant="h2" color={Colors.textOnDark} style={styles.statTitle}>
        {feature.title}
      </Text>
      <Text variant="body" color={Colors.textOnDarkMuted}>
        {feature.text}
      </Text>
      {feature.learnTopic ? <LearnMore topic={feature.learnTopic} color={collection.accent} /> : null}
    </LinearGradient>
  );
}

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const collection = collections.find((c) => c.id === id);

  if (!collection) {
    return (
      <Screen title="Collection">
        <Text variant="body">This collection could not be found.</Text>
      </Screen>
    );
  }

  return (
    <Screen title={collection.name}>
      <View style={styles.hero}>
        {collection.heroVideo ? (
          <AutoVideo source={collection.heroVideo} />
        ) : (
          <Image source={{ uri: collection.heroImage }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
        )}
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} start={{ x: 0, y: 0.3 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.heroBadge}>
          <Badge label={collection.badge} color={Colors.ink} background={collection.accent} />
        </View>
        <View style={styles.heroText}>
          <Text variant="h1" color={Colors.textOnDark}>
            {collection.tagline}
          </Text>
        </View>
      </View>

      <Text variant="body">{collection.story}</Text>

      <View style={styles.specs}>
        {collection.specs.map((s) => (
          <View key={s.label} style={styles.spec}>
            <Text variant="overline">{s.label}</Text>
            <Text variant="captionStrong" align="center">
              {s.value}
            </Text>
          </View>
        ))}
      </View>

      <Text variant="h2">Design & features</Text>
      {collection.features.map((feature) => (
        <FeatureBanner key={feature.title} feature={feature} collection={collection} />
      ))}

      <Text variant="h2">Lookbook</Text>
      {collection.gallery.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery} style={styles.bleed}>
          {collection.gallery.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.galleryImage} contentFit="cover" transition={250} />
          ))}
        </ScrollView>
      ) : null}

      <Text variant="h2">The frames</Text>

      <View style={styles.grid}>
        {collection.frames.map((frame) => (
          <FrameTile key={frame.id} frame={frame} />
        ))}
      </View>

      <Button title="Try them at a store near you" icon="location-outline" onPress={() => router.push('/stores')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 420,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.ink,
    justifyContent: 'space-between',
  },
  heroBadge: { padding: Space.lg },
  specs: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingVertical: Space.md },
  spec: { flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 4 },
  featurePhoto: {
    height: 360,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.ink,
    justifyContent: 'space-between',
  },
  featureIcon: {
    margin: Space.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { padding: Space.xl, gap: Space.xs },
  featureStat: { borderRadius: Radius.xl, padding: Space.xxl, gap: 4, overflow: 'hidden' },
  watermark: { position: 'absolute', right: -60, bottom: -10 },
  stat: { fontFamily: Fonts.black, fontSize: 64, lineHeight: 72, letterSpacing: -2, marginTop: Space.sm },
  statTitle: { marginTop: Space.md },
  learn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Space.sm, alignSelf: 'flex-start' },
  heroText: { padding: Space.xl },
  bleed: { marginHorizontal: -Space.xl, flexGrow: 0 },
  gallery: { gap: Space.md, paddingHorizontal: Space.xl },
  galleryImage: { width: 200, height: 250, borderRadius: Radius.lg, backgroundColor: Colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.md },
  tile: { width: '47%', flexGrow: 1, gap: 2, padding: Space.md },
  tileArt: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    height: 92,
    marginBottom: Space.sm,
  },
  tileBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Space.xs },
  swatches: { flexDirection: 'row', gap: 6 },
  swatch: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: Colors.surface },
  swatchActive: { borderColor: Colors.ink },
});
