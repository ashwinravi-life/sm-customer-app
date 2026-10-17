import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Caption, FadeSwap, Segmented } from '@/components/learn/primitives';
import { Colors, Space } from '@/constants/theme';

export type CoatingKind =
  | 'anti-scratch'
  | 'hydrophobic'
  | 'smudge'
  | 'anti-reflection'
  | 'anti-fog'
  | 'polarized'
  | 'photochromic';

const LABELS: Record<CoatingKind, [string, string]> = {
  'anti-scratch': ['Uncoated', 'Hard coat'],
  hydrophobic: ['Uncoated', 'Hydrophobic'],
  smudge: ['Uncoated', 'Smudge-resistant'],
  'anti-reflection': ['Uncoated', 'Anti-reflection'],
  'anti-fog': ['Uncoated', 'Anti-fog'],
  polarized: ['Regular sunglass', 'Polarised'],
  photochromic: ['Indoors', 'Outdoors'],
};

const CAPTIONS: Record<CoatingKind, [string, string]> = {
  'anti-scratch': [
    'Everyday wiping, keys and bags leave fine scratches that scatter light and blur your view.',
    'A hard coat makes the surface tougher, so lenses stay clearer for longer.',
  ],
  hydrophobic: [
    'Rain and splashes spread into a film that is hard to see through.',
    'Water beads up and rolls off, so a quick shake or wipe clears the lens.',
  ],
  smudge: [
    'Skin oils and fingerprints stick and smear when you wipe.',
    'An oil-repelling top layer stops prints from sticking; they wipe off in one go.',
  ],
  'anti-reflection': [
    'Reflections from lights bounce off the lens: glare for you, and others cannot see your eyes.',
    'Reflections are cut down, so you see sharper at night and on screens, and you look better in photos and video calls.',
  ],
  'anti-fog': [
    'Walking out of AC, wearing a mask or opening a hot pot fogs the lens instantly.',
    'An anti-fog layer stops tiny droplets forming, keeping your view clear.',
  ],
  polarized: [
    'Sunlight bouncing off roads, water and car bonnets causes harsh glare, even with dark lenses.',
    'A polarising filter blocks that horizontal glare, so colours look richer and driving is safer.',
  ],
  photochromic: [
    'Indoors the lens stays clear, like regular glasses.',
    'In sunlight it darkens on its own to protect from UV and glare, then clears again indoors.',
  ],
};

const VB_W = 320;
const VB_H = 190;

function LensFrame({ children, id }: { children: ReactNode; id: string }) {
  return (
    <>
      <Defs>
        <ClipPath id={id}>
          <Ellipse cx={160} cy={95} rx={128} ry={82} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#${id})`}>{children}</G>
      <Ellipse cx={160} cy={95} rx={128} ry={82} fill="none" stroke={Colors.ink} strokeWidth={5} />
    </>
  );
}

function Eye() {
  return (
    <G>
      <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#F7E6D8" />
      <Path d="M90 100 Q160 40 230 100 Q160 150 90 100 Z" fill="#FFFFFF" stroke="#4B3621" strokeWidth={3} />
      <Circle cx={160} cy={98} r={26} fill="#6B4F2A" />
      <Circle cx={160} cy={98} r={12} fill="#111827" />
      <Circle cx={168} cy={90} r={5} fill="#FFFFFF" />
      <Path d="M88 98 Q160 30 232 98" stroke="#4B3621" strokeWidth={4} fill="none" />
    </G>
  );
}

// `uid` keeps SVG ids unique when two copies render in one picture (before/after split).
function Visual({ kind, on, uid = '' }: { kind: CoatingKind; on: boolean; uid?: string }) {
  const clip = `clip-${kind}${uid}`;
  switch (kind) {
    case 'anti-scratch':
      return (
        <LensFrame id={clip}>
          <Eye />
          {!on ? (
            <G stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.9}>
              <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#FFFFFF" opacity={0.25} stroke="none" />
              <Path d="M60 60 L140 90" />
              <Path d="M110 40 L200 70" />
              <Path d="M180 120 L260 100" />
              <Path d="M70 130 L150 150" />
              <Path d="M210 60 L250 140" />
              <Path d="M90 80 L120 140" />
              <Path d="M150 30 L240 40" />
            </G>
          ) : null}
        </LensFrame>
      );
    case 'hydrophobic':
      return (
        <LensFrame id={clip}>
          <Eye />
          {!on ? (
            <G fill="#93C5FD" opacity={0.55}>
              <Path d="M40 60 Q120 40 170 70 Q140 110 60 100 Z" />
              <Path d="M150 110 Q230 90 290 130 Q220 170 160 150 Z" />
              <Path d="M190 40 Q250 30 280 60 Q240 80 200 70 Z" />
            </G>
          ) : (
            <G>
              {[
                [80, 60, 9],
                [120, 130, 7],
                [200, 50, 8],
                [240, 120, 10],
                [170, 150, 6],
                [100, 95, 5],
              ].map(([x, y, r], i) => (
                <G key={i}>
                  <Path d={`M${x} ${y - r - 18} L${x} ${y - r}`} stroke="#93C5FD" strokeWidth={2} opacity={0.5} />
                  <Circle cx={x} cy={y} r={r} fill="#BFDBFE" stroke="#60A5FA" strokeWidth={1.5} />
                  <Circle cx={x - r / 3} cy={y - r / 3} r={r / 4} fill="#FFFFFF" />
                </G>
              ))}
            </G>
          )}
        </LensFrame>
      );
    case 'smudge':
      return (
        <LensFrame id={clip}>
          <Eye />
          {[
            [110, 70],
            [215, 120],
          ].map(([cx, cy], i) => (
            <G key={i} opacity={on ? 0.12 : 0.65} stroke="#78716C" strokeWidth={2} fill="none">
              {[8, 14, 20, 26, 32].map((r) => (
                <Ellipse key={r} cx={cx} cy={cy} rx={r} ry={r * 1.25} />
              ))}
            </G>
          ))}
          {!on ? <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#D6D3D1" opacity={0.35} /> : null}
        </LensFrame>
      );
    case 'anti-reflection':
      return (
        <LensFrame id={clip}>
          <Eye />
          {!on ? (
            <G fill="#FFFFFF">
              <Path d="M60 20 L120 20 L60 170 L0 170 Z" opacity={0.85} />
              <Path d="M150 20 L180 20 L120 170 L90 170 Z" opacity={0.7} />
              <Path d="M230 20 L300 20 L240 170 L170 170 Z" opacity={0.6} />
            </G>
          ) : (
            <Path d="M240 40 Q260 50 270 70" stroke="#86EFAC" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
          )}
        </LensFrame>
      );
    case 'anti-fog':
      return (
        <LensFrame id={clip}>
          <Eye />
          {!on ? (
            <G>
              <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#F8FAFC" opacity={0.85} />
              {Array.from({ length: 40 }, (_, i) => (
                <Circle key={i} cx={(i * 53) % 300 + 10} cy={(i * 37) % 170 + 10} r={2 + (i % 3)} fill="#CBD5E1" opacity={0.8} />
              ))}
            </G>
          ) : null}
        </LensFrame>
      );
    case 'polarized':
      return (
        <LensFrame id={clip}>
          <Defs>
            <LinearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={on ? '#3B82F6' : '#BFDBFE'} />
              <Stop offset="1" stopColor={on ? '#93C5FD' : '#E0F2FE'} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={VB_W} height={95} fill={`url(#sky${uid})`} />
          <Rect x={0} y={95} width={VB_W} height={95} fill={on ? '#0E7490' : '#67E8F9'} />
          <Path d="M0 95 L90 70 L150 95 Z" fill={on ? '#166534' : '#86EFAC'} />
          {!on ? (
            <G fill="#FFFFFF">
              {[
                [70, 120],
                [150, 110],
                [230, 130],
                [110, 150],
                [200, 160],
                [270, 112],
              ].map(([x, y], i) => (
                <Path key={i} d={`M${x - 26} ${y} L${x} ${y - 4} L${x + 26} ${y} L${x} ${y + 4} Z`} opacity={0.95} />
              ))}
              <Rect x={0} y={0} width={VB_W} height={VB_H} opacity={0.25} />
            </G>
          ) : (
            <G stroke="#0F172A" strokeWidth={1} opacity={0.12}>
              {Array.from({ length: 30 }, (_, i) => (
                <Path key={i} d={`M${i * 11} 0 L${i * 11} ${VB_H}`} />
              ))}
            </G>
          )}
        </LensFrame>
      );
    case 'photochromic':
      return (
        <LensFrame id={clip}>
          <Eye />
          <Rect x={0} y={0} width={VB_W} height={VB_H} fill="#292524" opacity={on ? 0.78 : 0.03} />
        </LensFrame>
      );
  }
}

export function CoatingVisual({ kind }: { kind: CoatingKind }) {
  const [state, setState] = useState<'off' | 'on'>('off');
  const on = state === 'on';
  const [offLabel, onLabel] = LABELS[kind];
  const icons =
    kind === 'photochromic'
      ? ({ off: 'home-outline', on: 'sunny' } as const)
      : ({ off: 'close-circle-outline', on: 'checkmark-circle' } as const);

  return (
    <View style={styles.stack}>
      <Segmented
        value={state}
        onChange={setState}
        options={[
          { value: 'off', label: offLabel, icon: icons.off },
          { value: 'on', label: onLabel, icon: icons.on },
        ]}
      />
      <FadeSwap fadeKey={state}>
        <Svg width="100%" height={210} viewBox={`0 0 ${VB_W} ${VB_H}`}>
          <Visual kind={kind} on={on} />
        </Svg>
      </FadeSwap>
      <Caption>{CAPTIONS[kind][on ? 1 : 0]}</Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Space.lg },
});

// Before/after thumbnail: left half uncoated, right half coated.
export function CoatingSplit({ kind, height = 120 }: { kind: CoatingKind; height?: number }) {
  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <Defs>
        <ClipPath id={`left-${kind}`}>
          <Rect x={0} y={0} width={VB_W / 2} height={VB_H} />
        </ClipPath>
        <ClipPath id={`right-${kind}`}>
          <Rect x={VB_W / 2} y={0} width={VB_W / 2} height={VB_H} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#left-${kind})`}>
        <Visual kind={kind} on={false} uid="-before" />
      </G>
      <G clipPath={`url(#right-${kind})`}>
        <Visual kind={kind} on uid="-after" />
      </G>
      <Rect x={VB_W / 2 - 1.5} y={6} width={3} height={VB_H - 12} fill={Colors.surface} />
    </Svg>
  );
}
