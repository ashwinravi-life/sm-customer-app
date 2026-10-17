import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import { Card } from '@/components/card';
import { FrameArt } from '@/components/frame-art';
import { Icon } from '@/components/icon';
import { FadeSwap } from '@/components/learn/primitives';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { collections } from '@/data/discover';
import { faceShapes, type FaceShapeGuide } from '@/data/learn';
import { formatRupees } from '@/lib/format';
import { select } from '@/lib/haptics';

const FACE_PATHS: Record<FaceShapeGuide['id'], string> = {
  oval: 'M100 18 C150 18 172 70 170 120 C168 180 140 222 100 222 C60 222 32 180 30 120 C28 70 50 18 100 18 Z',
  round: 'M100 26 C160 26 182 80 180 125 C178 180 145 214 100 214 C55 214 22 180 20 125 C18 80 40 26 100 26 Z',
  square: 'M100 22 C150 22 174 34 176 80 L176 160 C176 196 158 214 132 218 L68 218 C42 214 24 196 24 160 L24 80 C26 34 50 22 100 22 Z',
  heart: 'M100 22 C162 22 182 58 180 100 C178 150 140 196 100 222 C60 196 22 150 20 100 C18 58 38 22 100 22 Z',
  oblong: 'M100 10 C146 10 160 50 160 100 L160 160 C160 205 132 230 100 230 C68 230 40 205 40 160 L40 100 C40 50 54 10 100 10 Z',
};

function Face({ shape, frame }: { shape: FaceShapeGuide['id']; frame: FaceShapeGuide['best'][number] }) {
  return (
    <View style={styles.faceWrap}>
      <Svg width={200} height={240} viewBox="0 0 200 240">
        <Path d={FACE_PATHS[shape]} fill="#F7E6D8" stroke={Colors.ink} strokeWidth={3} />
        {/* Eyes, nose, smile */}
        <Ellipse cx={72} cy={112} rx={9} ry={5} fill={Colors.ink} />
        <Ellipse cx={128} cy={112} rx={9} ry={5} fill={Colors.ink} />
        <Path d="M100 120 L94 150 L104 152" stroke="#B08968" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Path d="M80 178 Q100 192 120 178" stroke="#B08968" strokeWidth={3} fill="none" strokeLinecap="round" />
        <Circle cx={60} cy={150} r={10} fill="#F2765A" opacity={0.15} />
        <Circle cx={140} cy={150} r={10} fill="#F2765A" opacity={0.15} />
      </Svg>
      <View style={styles.faceFrame} pointerEvents="none">
        <FrameArt shape={frame} color={Colors.ink} width={140} thickness={6} />
      </View>
    </View>
  );
}

export default function FaceShapesScreen() {
  const [shapeId, setShapeId] = useState<FaceShapeGuide['id']>('oval');
  const guide = faceShapes.find((f) => f.id === shapeId)!;
  const [frameIndex, setFrameIndex] = useState(0);
  const frame = guide.best[frameIndex % guide.best.length];

  const matches = collections
    .flatMap((c) => c.frames.filter((f) => guide.best.includes(f.shape) && !f.tint).map((f) => ({ ...f, collection: c })))
    .slice(0, 6);

  return (
    <Screen title="Frames for your face">
      <Text variant="caption">Pick the face shape closest to yours, then tap through the frames that suit it.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shapes} style={styles.bleed}>
        {faceShapes.map((f) => {
          const active = f.id === shapeId;
          return (
            <Pressable
              key={f.id}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => {
                select();
                setShapeId(f.id);
                setFrameIndex(0);
              }}
              style={[styles.shapeChip, active && styles.shapeChipActive]}
            >
              <Svg width={30} height={36} viewBox="0 0 200 240">
                <Path d={FACE_PATHS[f.id]} fill={active ? Colors.teal : 'none'} stroke={active ? Colors.teal : Colors.text} strokeWidth={14} />
              </Svg>
              <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
                {f.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Card style={styles.preview}>
        <FadeSwap fadeKey={`${shapeId}-${frame}`}>
          <Face shape={shapeId} frame={frame} />
        </FadeSwap>
        <View style={styles.frameRow}>
          {guide.best.map((shape, i) => {
            const active = i === frameIndex % guide.best.length;
            return (
              <Pressable
                key={shape}
                accessibilityRole="button"
                accessibilityLabel={`Try ${shape} frame`}
                onPress={() => {
                  select();
                  setFrameIndex(i);
                }}
                style={[styles.frameOption, active && styles.frameOptionActive]}
              >
                <FrameArt shape={shape} color={active ? Colors.ink : Colors.textMuted} width={58} thickness={7} />
                <Text variant="caption" color={active ? Colors.text : Colors.textMuted} style={styles.capitalize}>
                  {shape === 'cateye' ? 'Cat-eye' : shape}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Card style={styles.gap}>
        <Text variant="h2">{guide.name} face</Text>
        <Text variant="caption">{guide.how}</Text>
        <View style={styles.tip}>
          <Icon name="bulb" size={18} color={Colors.coin} />
          <Text variant="bodyStrong" style={styles.flex}>
            {guide.tip}
          </Text>
        </View>
        <View style={styles.tip}>
          <Icon name="close-circle" size={18} color={Colors.danger} />
          <Text variant="caption" style={styles.flex}>
            Avoid: {guide.avoid}
          </Text>
        </View>
      </Card>

      {matches.length ? (
        <View style={styles.gap}>
          <Text variant="h2">Suits you from our collections</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shapes} style={styles.bleed}>
            {matches.map((f) => (
              <Card
                key={f.id}
                style={styles.match}
                onPress={() => router.push({ pathname: '/collection/[id]', params: { id: f.collection.id } })}
              >
                <FrameArt shape={f.shape} color={f.color} width={120} />
                <Text variant="captionStrong">{f.name}</Text>
                <Text variant="caption">{formatRupees(f.price)}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  bleed: { marginHorizontal: -Space.xl, flexGrow: 0 },
  shapes: { gap: Space.sm, paddingHorizontal: Space.xl },
  shapeChip: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    minWidth: 70,
  },
  shapeChipActive: { backgroundColor: Colors.ink },
  preview: { alignItems: 'center', gap: Space.lg },
  faceWrap: { width: 200, height: 240 },
  faceFrame: { position: 'absolute', top: 81, left: 30 },
  frameRow: { flexDirection: 'row', gap: Space.sm, flexWrap: 'wrap', justifyContent: 'center' },
  frameOption: {
    alignItems: 'center',
    gap: 2,
    padding: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  frameOptionActive: { borderColor: Colors.ink, backgroundColor: Colors.background },
  capitalize: { textTransform: 'capitalize' },
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: Space.sm },
  match: { width: 150, alignItems: 'center', gap: 4 },
});
