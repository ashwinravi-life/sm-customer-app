import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { FrameArt } from '@/components/frame-art';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { collections, type CollectionFrame } from '@/data/discover';
import { formatRupees } from '@/lib/format';
import { select } from '@/lib/haptics';

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
      <LinearGradient colors={collection.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <Badge label={collection.badge} color={Colors.ink} background={collection.accent} />
        <View style={styles.heroArt}>
          <FrameArt shape={collection.heroShape} color={collection.heroColor} tint={collection.heroTint} width={240} thickness={6} />
        </View>
        <Text variant="h1" color={Colors.textOnDark}>
          {collection.tagline}
        </Text>
        <Text variant="body" color={Colors.textOnDarkMuted}>
          {collection.story}
        </Text>
      </LinearGradient>

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
  hero: { borderRadius: Radius.xl, padding: Space.xxl, gap: Space.md },
  heroArt: { alignItems: 'center', paddingVertical: Space.md },
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
