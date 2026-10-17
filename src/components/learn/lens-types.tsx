import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { Icon } from '@/components/icon';
import { Caption, FadeSwap, SceneRows, Segmented, type SceneDistance } from '@/components/learn/primitives';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { select } from '@/lib/haptics';

type Clarity = Record<SceneDistance['key'], 'clear' | 'soft' | 'blur'>;
type LensType = 'sv' | 'bf' | 'pal' | 'myopia';

const W = 220;
const H = 190;
const ZONE = { far: Colors.sky, mid: Colors.teal, near: Colors.purple };

// A spectacle lens with its optical zones; `active` brightens one zone.
export function LensDiagram({
  type,
  active,
  width = 260,
  labels = true,
}: {
  type: LensType;
  active?: string;
  width?: number;
  labels?: boolean;
}) {
  const op = (key: string) => (active === undefined || active === key ? 0.85 : 0.25);

  return (
    <Svg width={width} height={(width * H) / W} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <ClipPath id={`lens-${type}`}>
          <Ellipse cx={110} cy={95} rx={100} ry={84} />
        </ClipPath>
        <LinearGradient id="corridor" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={ZONE.far} />
          <Stop offset="0.45" stopColor={ZONE.mid} />
          <Stop offset="1" stopColor={ZONE.near} />
        </LinearGradient>
      </Defs>

      <G clipPath={`url(#lens-${type})`}>
        <Rect x={0} y={0} width={W} height={H} fill="#F3F6F7" />

        {type === 'sv' ? <Rect x={0} y={0} width={W} height={H} fill={ZONE.far} opacity={op('all')} /> : null}

        {type === 'bf' ? (
          <>
            <Rect x={0} y={0} width={W} height={H} fill={ZONE.far} opacity={op('far')} />
            <Path d="M62 118 L158 118 Q158 168 110 170 Q62 168 62 118 Z" fill={ZONE.near} opacity={op('near')} />
            {/* The visible bifocal line */}
            <Line x1={62} y1={118} x2={158} y2={118} stroke={Colors.ink} strokeWidth={2.5} />
          </>
        ) : null}

        {type === 'pal' ? (
          <>
            <Rect x={0} y={0} width={W} height={80} fill={ZONE.far} opacity={op('far')} />
            <Path d="M78 80 L142 80 L128 122 L92 122 Z" fill={ZONE.mid} opacity={op('mid')} />
            <Path d="M92 122 L128 122 L156 190 L64 190 Z" fill={ZONE.near} opacity={op('near')} />
            {/* Soft side zones */}
            <Path d="M0 80 L78 80 L92 122 L64 190 L0 190 Z" fill="#9CA3AF" opacity={0.28} />
            <Path d="M220 80 L142 80 L128 122 L156 190 L220 190 Z" fill="#9CA3AF" opacity={0.28} />
          </>
        ) : null}

        {type === 'myopia' ? (
          <>
            <Rect x={0} y={0} width={W} height={H} fill={ZONE.mid} opacity={op('ring') * 0.35} />
            {Array.from({ length: 6 }, (_, ring) =>
              Array.from({ length: 10 + ring * 4 }, (_, i) => {
                const r = 42 + ring * 9;
                const a = (i / (10 + ring * 4)) * Math.PI * 2;
                return (
                  <Circle
                    key={`${ring}-${i}`}
                    cx={110 + Math.cos(a) * r}
                    cy={95 + Math.sin(a) * r * 0.86}
                    r={3}
                    fill={ZONE.near}
                    opacity={op('ring')}
                  />
                );
              }),
            )}
            <Circle cx={110} cy={95} r={32} fill={ZONE.far} opacity={op('center')} />
          </>
        ) : null}
      </G>

      <Ellipse cx={110} cy={95} rx={100} ry={84} fill="none" stroke={Colors.ink} strokeWidth={4} />
      {/* Glint */}
      <Path d="M40 52 Q55 32 80 24" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.8} />

      {labels && type === 'pal' ? (
        <>
          <SvgText x={110} y={50} fontSize={12} fontWeight="bold" fill={Colors.ink} textAnchor="middle">FAR</SvgText>
          <SvgText x={110} y={106} fontSize={10} fontWeight="bold" fill={Colors.ink} textAnchor="middle">MID</SvgText>
          <SvgText x={110} y={160} fontSize={12} fontWeight="bold" fill={Colors.textOnDark} textAnchor="middle">NEAR</SvgText>
          <SvgText x={30} y={140} fontSize={9} fill={Colors.textMuted} textAnchor="middle">soft</SvgText>
          <SvgText x={190} y={140} fontSize={9} fill={Colors.textMuted} textAnchor="middle">soft</SvgText>
        </>
      ) : null}
      {labels && type === 'bf' ? (
        <>
          <SvgText x={110} y={70} fontSize={12} fontWeight="bold" fill={Colors.ink} textAnchor="middle">FAR</SvgText>
          <SvgText x={110} y={150} fontSize={12} fontWeight="bold" fill={Colors.textOnDark} textAnchor="middle">NEAR</SvgText>
        </>
      ) : null}
      {labels && type === 'myopia' ? (
        <SvgText x={110} y={99} fontSize={10} fontWeight="bold" fill={Colors.ink} textAnchor="middle">CLEAR</SvgText>
      ) : null}
    </Svg>
  );
}

function Center({ children }: { children: ReactNode }) {
  return <View style={styles.center}>{children}</View>;
}

export function SingleVisionVisual() {
  const [mode, setMode] = useState<'far' | 'near'>('far');
  const clarity: Clarity =
    mode === 'far' ? { far: 'clear', mid: 'soft', near: 'blur' } : { far: 'blur', mid: 'soft', near: 'clear' };
  return (
    <View style={styles.stack}>
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { value: 'far', label: 'For distance', icon: 'car-outline' },
          { value: 'near', label: 'For reading', icon: 'book-outline' },
        ]}
      />
      <Center>
        <LensDiagram type="sv" />
      </Center>
      <Text variant="caption" align="center">
        One power across the whole lens, set for {mode === 'far' ? 'distance' : 'reading'}.
      </Text>
      <FadeSwap fadeKey={mode}>
        <SceneRows clarity={clarity} />
      </FadeSwap>
    </View>
  );
}

const BF_CLARITY: Record<'far' | 'near', Clarity> = {
  far: { far: 'clear', mid: 'blur', near: 'blur' },
  near: { far: 'blur', mid: 'blur', near: 'clear' },
};

export function BifocalVisual() {
  const [zone, setZone] = useState<'far' | 'near'>('far');
  return (
    <View style={styles.stack}>
      <Segmented
        value={zone}
        onChange={setZone}
        options={[
          { value: 'far', label: 'Look up' },
          { value: 'near', label: 'Look down' },
        ]}
      />
      <Center>
        <LensDiagram type="bf" active={zone} />
      </Center>
      <FadeSwap fadeKey={zone}>
        <SceneRows clarity={BF_CLARITY[zone]} />
      </FadeSwap>
      <Caption>Two powers split by a visible line. Nothing in between, so screens at arm’s length can look blurry.</Caption>
    </View>
  );
}

const PAL_CLARITY: Record<'far' | 'mid' | 'near', Clarity> = {
  far: { far: 'clear', mid: 'soft', near: 'blur' },
  mid: { far: 'soft', mid: 'clear', near: 'soft' },
  near: { far: 'blur', mid: 'soft', near: 'clear' },
};

export function ProgressiveVisual() {
  const [zone, setZone] = useState<'far' | 'mid' | 'near'>('far');
  return (
    <View style={styles.stack}>
      <Segmented
        value={zone}
        onChange={setZone}
        options={[
          { value: 'far', label: 'Top' },
          { value: 'mid', label: 'Middle' },
          { value: 'near', label: 'Bottom' },
        ]}
      />
      <Center>
        <LensDiagram type="pal" active={zone} />
      </Center>
      <FadeSwap fadeKey={zone}>
        <SceneRows clarity={PAL_CLARITY[zone]} />
      </FadeSwap>
      <Caption>Power changes smoothly from top to bottom with no visible line. The grey edges are slightly soft, which is normal.</Caption>
    </View>
  );
}

// Drag the gaze dot down the lens to see the view sharpen at each distance.
export function GazeVisual() {
  const size = 260;
  const height = (size * H) / W;
  const [y, setY] = useState(height * 0.22);

  const zoneAt = (py: number): 'far' | 'mid' | 'near' => {
    const ratio = py / height;
    return ratio < 0.42 ? 'far' : ratio < 0.64 ? 'mid' : 'near';
  };

  const zone = zoneAt(y);

  const move = (py: number) => {
    const clamped = Math.max(18, Math.min(height - 18, py));
    if (zoneAt(clamped) !== zone) select();
    setY(clamped);
  };

  return (
    <View style={styles.stack}>
      <Text variant="captionStrong" align="center">
        Drag the eye up and down the lens
      </Text>
      <Center>
        <View
          style={{ width: size, height }}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
          onResponderGrant={(e) => move(e.nativeEvent.locationY)}
          onResponderMove={(e) => move(e.nativeEvent.locationY)}
        >
          <LensDiagram type="pal" active={zone} width={size} />
          <View pointerEvents="none" style={[styles.gaze, { top: y - 18 }]}>
            <Icon name="eye" size={22} color={Colors.textOnDark} />
          </View>
        </View>
      </Center>
      <SceneRows clarity={PAL_CLARITY[zone]} />
      <Caption>Tip: in progressives, point your nose at what you want to see and move your eyes, not your head. Most people adapt in a few days.</Caption>
    </View>
  );
}

const COMPARE_ROWS: { label: string; values: [boolean, boolean, boolean] }[] = [
  { label: 'Far', values: [true, true, true] },
  { label: 'Computer', values: [false, false, true] },
  { label: 'Reading', values: [false, true, true] },
  { label: 'No visible line', values: [true, false, true] },
  { label: 'One pair for all', values: [false, false, true] },
];

export function ComparisonVisual() {
  const cols: { type: LensType; label: string }[] = [
    { type: 'sv', label: 'Single vision' },
    { type: 'bf', label: 'Bifocal' },
    { type: 'pal', label: 'Progressive' },
  ];
  return (
    <View style={styles.stack}>
      <View style={styles.compareHeader}>
        <View style={styles.compareLabelCol} />
        {cols.map((c) => (
          <View key={c.type} style={styles.compareCol}>
            <LensDiagram type={c.type} width={78} labels={false} />
            <Text variant="captionStrong" align="center">
              {c.label}
            </Text>
          </View>
        ))}
      </View>
      {COMPARE_ROWS.map((row) => (
        <View key={row.label} style={styles.compareRow}>
          <Text variant="captionStrong" style={styles.compareLabelCol}>
            {row.label}
          </Text>
          {row.values.map((ok, i) => (
            <View key={i} style={styles.compareCol}>
              <Icon name={ok ? 'checkmark-circle' : 'close-circle'} size={22} color={ok ? Colors.success : '#D1D5DB'} />
            </View>
          ))}
        </View>
      ))}
      <Caption>Single vision is the most affordable for one distance. Progressives cover every distance in one pair.</Caption>
    </View>
  );
}

export function MyopiaControlVisual() {
  const [zone, setZone] = useState<'center' | 'ring'>('center');
  return (
    <View style={styles.stack}>
      <Segmented
        value={zone}
        onChange={setZone}
        options={[
          { value: 'center', label: 'Clear centre' },
          { value: 'ring', label: 'Control ring' },
        ]}
      />
      <Center>
        <LensDiagram type="myopia" active={zone} />
      </Center>
      <FadeSwap fadeKey={zone}>
        <Text variant="caption" align="center">
          {zone === 'center'
            ? 'The centre corrects your child’s power so they see sharply.'
            : 'Hundreds of tiny segments around it send a signal that helps slow how fast the eye grows.'}
        </Text>
      </FadeSwap>

      <View style={styles.chartCard}>
        <Text variant="captionStrong">How myopia can grow over 3 years</Text>
        <Svg width="100%" height={140} viewBox="0 0 300 140">
          {[0, 1, 2, 3].map((yr) => (
            <G key={yr}>
              <Line x1={30 + yr * 85} y1={10} x2={30 + yr * 85} y2={115} stroke={Colors.border} strokeWidth={1} />
              <SvgText x={30 + yr * 85} y={132} fontSize={10} fill={Colors.textMuted} textAnchor="middle">
                {yr === 0 ? 'Today' : `Year ${yr}`}
              </SvgText>
            </G>
          ))}
          <Path d="M30 20 Q120 50 285 108" stroke={Colors.coral} strokeWidth={4} fill="none" strokeLinecap="round" />
          <Path d="M30 20 Q120 34 285 62" stroke={Colors.tealDeep} strokeWidth={4} fill="none" strokeLinecap="round" />
          <Circle cx={285} cy={108} r={5} fill={Colors.coral} />
          <Circle cx={285} cy={62} r={5} fill={Colors.tealDeep} />
        </Svg>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.coral }]} />
            <Text variant="caption">Regular lenses</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.tealDeep }]} />
            <Text variant="caption">Myopia control lenses</Text>
          </View>
        </View>
        <Text variant="caption">Illustrative. Results vary by child; your optometrist will advise.</Text>
      </View>
    </View>
  );
}

export function BlueFilterVisual() {
  const [on, setOn] = useState<'without' | 'with'>('without');
  const filtered = on === 'with';
  return (
    <View style={styles.stack}>
      <Segmented
        value={on}
        onChange={setOn}
        options={[
          { value: 'without', label: 'Regular lens' },
          { value: 'with', label: 'Blue filter' },
        ]}
      />
      <FadeSwap fadeKey={on}>
        <Svg width="100%" height={170} viewBox="0 0 320 170">
          {/* Screen */}
          <Rect x={8} y={40} width={62} height={44} rx={6} fill={Colors.ink} />
          <Rect x={14} y={46} width={50} height={32} rx={3} fill="#1E3A8A" />
          <Rect x={30} y={84} width={18} height={12} fill={Colors.ink} />
          {/* Lens */}
          <Ellipse cx={175} cy={70} rx={14} ry={56} fill={filtered ? '#FEF3C7' : '#E0F2FE'} stroke={Colors.ink} strokeWidth={3} />
          {/* Eye */}
          <Path d="M262 70 Q285 46 310 70 Q285 94 262 70 Z" fill="#FFFFFF" stroke={Colors.ink} strokeWidth={3} />
          <Circle cx={286} cy={70} r={9} fill={Colors.ink} />

          {/* Red and green pass through */}
          <Line x1={74} y1={56} x2={258} y2={64} stroke="#EF4444" strokeWidth={4} />
          <Line x1={74} y1={68} x2={258} y2={70} stroke="#22C55E" strokeWidth={4} />
          {/* Blue: passes, or bounces off the lens */}
          {filtered ? (
            <>
              <Line x1={74} y1={80} x2={162} y2={82} stroke="#3B82F6" strokeWidth={4} />
              <Path d="M162 82 L110 120" stroke="#3B82F6" strokeWidth={4} strokeDasharray="6 5" />
              <Line x1={188} y1={80} x2={258} y2={76} stroke="#3B82F6" strokeWidth={2} opacity={0.35} />
            </>
          ) : (
            <Line x1={74} y1={80} x2={258} y2={76} stroke="#3B82F6" strokeWidth={4} />
          )}

          {/* Spectrum */}
          <Defs>
            <LinearGradient id="spectrum" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#7C3AED" />
              <Stop offset="0.22" stopColor="#2563EB" />
              <Stop offset="0.45" stopColor="#22C55E" />
              <Stop offset="0.7" stopColor="#FACC15" />
              <Stop offset="1" stopColor="#EF4444" />
            </LinearGradient>
          </Defs>
          <Rect x={8} y={140} width={304} height={14} rx={7} fill="url(#spectrum)" />
          {filtered ? <Rect x={8} y={136} width={60} height={22} rx={6} fill="none" stroke={Colors.ink} strokeWidth={2} /> : null}
          <SvgText x={8} y={168} fontSize={9} fill={Colors.textMuted}>
            400 nm
          </SvgText>
          <SvgText x={312} y={168} fontSize={9} fill={Colors.textMuted} textAnchor="end">
            700 nm
          </SvgText>
        </Svg>
      </FadeSwap>
      <Caption>
        {filtered
          ? 'A filter reflects part of the high-energy blue-violet light from screens and LEDs, for more comfortable screen time.'
          : 'Regular lenses let all screen light through, including high-energy blue-violet light.'}
      </Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Space.lg },
  center: { alignItems: 'center' },
  gaze: {
    position: 'absolute',
    left: 260 / 2 - 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.ink,
    borderWidth: 3,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareHeader: { flexDirection: 'row', alignItems: 'flex-end' },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  compareLabelCol: { width: 92 },
  compareCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartCard: { backgroundColor: Colors.background, borderRadius: Radius.md, padding: Space.md, gap: Space.sm },
  legend: { flexDirection: 'row', gap: Space.lg, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
});
