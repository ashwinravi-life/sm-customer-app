import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

import { IconBubble } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon, type IconName } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { EARN_RULES } from '@/data/mock';
import { error as errorHaptic, select, success } from '@/lib/haptics';

// A fun at-home screening, not a medical test. Sizes are relative because a
// phone cannot know its distance from the eye.

type Eye = 'right' | 'left';
type Dir = 'right' | 'down' | 'left' | 'up';
type Step =
  | { kind: 'intro' }
  | { kind: 'cover'; eye: Eye }
  | { kind: 'acuity'; eye: Eye }
  | { kind: 'astig' }
  | { kind: 'color' }
  | { kind: 'result' };

const E_SIZES = [110, 84, 64, 48, 36, 27, 20, 15, 11];
const DIRS: Dir[] = ['right', 'down', 'left', 'up'];
const ROTATION: Record<Dir, string> = { right: '0deg', down: '90deg', left: '180deg', up: '270deg' };
const COLOR_ROUNDS = [16, 11, 8, 5, 3];

const randomDir = (avoid?: Dir) => {
  const options = DIRS.filter((d) => d !== avoid);
  return options[Math.floor(Math.random() * options.length)];
};

function rating(levels: number) {
  if (levels >= 8) return { label: 'Sharp', color: Colors.success };
  if (levels >= 6) return { label: 'Good', color: Colors.tealDeep };
  if (levels >= 4) return { label: 'Could be better', color: Colors.coin };
  return { label: 'Needs a check', color: Colors.danger };
}

function TumblingE({ size, dir }: { size: number; dir: Dir }) {
  return (
    <View style={{ transform: [{ rotate: ROTATION[dir] }] }}>
      <Svg width={size} height={size} viewBox="0 0 5 5">
        <Rect x={0} y={0} width={1} height={5} fill={Colors.ink} />
        <Rect x={0} y={0} width={5} height={1} fill={Colors.ink} />
        <Rect x={0} y={2} width={5} height={1} fill={Colors.ink} />
        <Rect x={0} y={4} width={5} height={1} fill={Colors.ink} />
      </Svg>
    </View>
  );
}

function Acuity({ eye, onDone }: { eye: Eye; onDone: (levelsPassed: number) => void }) {
  const [level, setLevel] = useState(0);
  const [missed, setMissed] = useState(false);
  const [dir, setDir] = useState<Dir>(() => randomDir());

  const answer = (picked: Dir) => {
    if (picked === dir) {
      success();
      if (level + 1 >= E_SIZES.length) return onDone(E_SIZES.length);
      setLevel(level + 1);
      setMissed(false);
    } else {
      errorHaptic();
      if (missed) return onDone(level);
      setMissed(true);
    }
    setDir(randomDir(dir));
  };

  const arrows: { d: Dir; icon: IconName }[] = [
    { d: 'up', icon: 'arrow-up' },
    { d: 'left', icon: 'arrow-back' },
    { d: 'right', icon: 'arrow-forward' },
    { d: 'down', icon: 'arrow-down' },
  ];

  return (
    <View style={styles.body}>
      <View style={styles.center}>
        <Text variant="overline">{eye === 'right' ? 'Right eye' : 'Left eye'} · Level {level + 1} of {E_SIZES.length}</Text>
        <Text variant="caption" align="center">
          Which way are the E’s legs pointing?
        </Text>
      </View>
      <View style={styles.eArea}>
        <TumblingE size={E_SIZES[level]} dir={dir} />
      </View>
      <View style={styles.pad}>
        {arrows.map((a) => (
          <Pressable
            key={a.d}
            accessibilityRole="button"
            accessibilityLabel={`Pointing ${a.d}`}
            onPress={() => answer(a.d)}
            style={({ pressed }) => [styles.arrow, styles[`arrow_${a.d}`], pressed && styles.arrowPressed]}
          >
            <Icon name={a.icon} size={28} color={Colors.textOnDark} />
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => onDone(level)} hitSlop={10} style={styles.center}>
        <Text variant="captionStrong" color={Colors.textMuted}>
          I can’t see it
        </Text>
      </Pressable>
    </View>
  );
}

function Astigmatism({ onDone }: { onDone: (linesDiffer: boolean) => void }) {
  const spokes = 12;
  return (
    <View style={styles.body}>
      <View style={styles.center}>
        <Text variant="overline">Astigmatism check</Text>
        <Text variant="h2" align="center">
          Do some lines look darker or sharper than others?
        </Text>
        <Text variant="caption" align="center">
          Cover one eye, then the other, and look at the centre dot.
        </Text>
      </View>
      <View style={styles.eArea}>
        <Svg width={260} height={260} viewBox="-130 -130 260 260">
          {Array.from({ length: spokes }, (_, i) => {
            const a = (i / spokes) * Math.PI;
            const x = Math.cos(a) * 120;
            const y = Math.sin(a) * 120;
            return <Line key={i} x1={-x} y1={-y} x2={x} y2={y} stroke={Colors.ink} strokeWidth={3} />;
          })}
          <Circle cx={0} cy={0} r={8} fill={Colors.surface} stroke={Colors.ink} strokeWidth={3} />
        </Svg>
      </View>
      <View style={styles.row}>
        <Button title="All look the same" variant="outline" style={styles.flex} onPress={() => onDone(false)} />
        <Button title="Some look darker" style={styles.flex} onPress={() => onDone(true)} />
      </View>
    </View>
  );
}

function ColorRounds({ onDone }: { onDone: (score: number) => void }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [puzzle, setPuzzle] = useState(() => makePuzzle(0));

  function makePuzzle(r: number) {
    return { hue: Math.floor(Math.random() * 360), odd: Math.floor(Math.random() * 16), delta: COLOR_ROUNDS[r] };
  }

  const pick = (i: number) => {
    const correct = i === puzzle.odd;
    if (correct) success();
    else errorHaptic();
    const nextScore = score + (correct ? 1 : 0);
    if (round + 1 >= COLOR_ROUNDS.length) return onDone(nextScore);
    setScore(nextScore);
    setRound(round + 1);
    setPuzzle(makePuzzle(round + 1));
  };

  return (
    <View style={styles.body}>
      <View style={styles.center}>
        <Text variant="overline">
          Colour · Round {round + 1} of {COLOR_ROUNDS.length}
        </Text>
        <Text variant="h2" align="center">
          Tap the square that’s a different shade
        </Text>
      </View>
      <View style={styles.grid}>
        {Array.from({ length: 16 }, (_, i) => (
          <Pressable
            key={`${round}-${i}`}
            accessibilityRole="button"
            accessibilityLabel={`Square ${i + 1}`}
            onPress={() => pick(i)}
            style={[
              styles.tile,
              { backgroundColor: `hsl(${puzzle.hue}, 62%, ${i === puzzle.odd ? 52 + puzzle.delta : 52}%)` },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default function EyeTestScreen() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [acuity, setAcuity] = useState<Record<Eye, number>>({ right: 0, left: 0 });
  const [astig, setAstig] = useState(false);
  const [colorScore, setColorScore] = useState(0);

  const order: Step['kind'][] = ['intro', 'cover', 'acuity', 'astig', 'color', 'result'];
  const progress = order.indexOf(step.kind) / (order.length - 1);

  const restart = () => {
    setAcuity({ right: 0, left: 0 });
    setAstig(false);
    setColorScore(0);
    setStep({ kind: 'intro' });
  };

  let content: ReactNode;

  if (step.kind === 'intro') {
    content = (
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.introArt}>
          <TumblingE size={96} dir="right" />
        </View>
        <Text variant="h1" align="center">
          Quick eye check
        </Text>
        <Text variant="body" align="center" color={Colors.textMuted}>
          Three short games: sharpness for each eye, an astigmatism dial and a colour round.
        </Text>
        <Card style={styles.tips}>
          {[
            { icon: 'phone-portrait-outline' as IconName, text: 'Hold the phone at arm’s length' },
            { icon: 'sunny-outline' as IconName, text: 'Sit in a well-lit room' },
            { icon: 'glasses-outline' as IconName, text: 'Wear your current glasses if you have them' },
          ].map((t) => (
            <View key={t.text} style={styles.tipRow}>
              <IconBubble name={t.icon} color={Colors.tealDeep} background={Colors.tealSoft} size={36} />
              <Text variant="bodyStrong" style={styles.flex}>
                {t.text}
              </Text>
            </View>
          ))}
        </Card>
        <Text variant="caption" align="center">
          This is a fun screening, not a medical eye test. Only an optometrist can check your eyes properly.
        </Text>
        <Button title="Start" icon="play" onPress={() => setStep({ kind: 'cover', eye: 'right' })} />
      </ScrollView>
    );
  } else if (step.kind === 'cover') {
    const covered = step.eye === 'right' ? 'LEFT' : 'RIGHT';
    content = (
      <View style={[styles.body, styles.centerBody]}>
        <IconBubble name="hand-left" color={Colors.tealDeep} background={Colors.tealSoft} size={84} />
        <Text variant="h1" align="center">
          Cover your {covered} eye
        </Text>
        <Text variant="body" align="center" color={Colors.textMuted}>
          Use your palm, without pressing. You’re now testing your {step.eye} eye.
        </Text>
        <Button title="I’m ready" onPress={() => setStep({ kind: 'acuity', eye: step.eye })} />
      </View>
    );
  } else if (step.kind === 'acuity') {
    const eye = step.eye;
    content = (
      <Acuity
        key={eye}
        eye={eye}
        onDone={(levels) => {
          setAcuity((prev) => ({ ...prev, [eye]: levels }));
          setStep(eye === 'right' ? { kind: 'cover', eye: 'left' } : { kind: 'astig' });
        }}
      />
    );
  } else if (step.kind === 'astig') {
    content = (
      <Astigmatism
        onDone={(differ) => {
          select();
          setAstig(differ);
          setStep({ kind: 'color' });
        }}
      />
    );
  } else if (step.kind === 'color') {
    content = (
      <ColorRounds
        onDone={(score) => {
          setColorScore(score);
          setStep({ kind: 'result' });
        }}
      />
    );
  } else {
    const rows = (['right', 'left'] as Eye[]).map((eye) => ({ eye, levels: acuity[eye], r: rating(acuity[eye]) }));
    const needsCheck = rows.some((x) => x.levels < 6) || astig || colorScore < 4;
    content = (
      <ScrollView contentContainerStyle={styles.body}>
        <Text variant="h1" align="center">
          Your results
        </Text>
        <Card style={styles.results}>
          {rows.map(({ eye, levels, r }) => (
            <View key={eye} style={styles.resultRow}>
              <Text variant="bodyStrong" style={styles.flex}>
                {eye === 'right' ? 'Right eye' : 'Left eye'}
              </Text>
              <Text variant="caption">{levels}/{E_SIZES.length}</Text>
              <Text variant="captionStrong" color={r.color}>
                {r.label}
              </Text>
            </View>
          ))}
          <View style={styles.resultRow}>
            <Text variant="bodyStrong" style={styles.flex}>
              Astigmatism dial
            </Text>
            <Text variant="captionStrong" color={astig ? Colors.coin : Colors.success}>
              {astig ? 'Lines looked uneven' : 'Even'}
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text variant="bodyStrong" style={styles.flex}>
              Colour
            </Text>
            <Text variant="captionStrong" color={colorScore >= 4 ? Colors.success : Colors.coin}>
              {colorScore}/{COLOR_ROUNDS.length}
            </Text>
          </View>
        </Card>
        <Card style={[styles.advice, needsCheck && styles.adviceWarn]}>
          <Icon name={needsCheck ? 'alert-circle' : 'happy'} size={24} color={needsCheck ? Colors.coral : Colors.success} />
          <Text variant="body" style={styles.flex}>
            {needsCheck
              ? 'Some results suggest your eyes would benefit from a proper check. It’s free at any Specsmakers store.'
              : 'Nice! Still, a full eye test every year keeps your prescription accurate.'}
          </Text>
        </Card>
        <Button
          title={`Find a store · +${EARN_RULES.eyeTest} coins for the test`}
          icon="location-outline"
          onPress={() => router.replace('/stores')}
        />
        <Button title="Retake" variant="outline" icon="refresh" onPress={restart} />
        <Text variant="caption" align="center">
          Screening only, not a diagnosis.
        </Text>
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" hitSlop={10} onPress={() => router.back()} style={styles.close}>
          <Icon name="close" size={22} />
        </Pressable>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(4, progress * 100)}%` }]} />
        </View>
      </View>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Space.md, paddingHorizontal: Space.xl, paddingTop: Space.sm },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: Colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.teal, borderRadius: 4 },
  body: { flex: 1, padding: Space.xl, gap: Space.lg },
  centerBody: { justifyContent: 'center', alignItems: 'stretch' },
  center: { alignItems: 'center', gap: 4 },
  introArt: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: 40,
    backgroundColor: Colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tips: { gap: Space.md },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  eArea: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  pad: { width: 220, height: 220, alignSelf: 'center' },
  arrow: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow_up: { top: 0, left: 75 },
  arrow_down: { bottom: 0, left: 75 },
  arrow_left: { left: 0, top: 75 },
  arrow_right: { right: 0, top: 75 },
  arrowPressed: { backgroundColor: Colors.teal, transform: [{ scale: 0.94 }] },
  row: { flexDirection: 'row', gap: Space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignSelf: 'center', width: 320 },
  tile: { width: 70, height: 70, borderRadius: Radius.md },
  results: { gap: Space.md },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  advice: { flexDirection: 'row', gap: Space.md, alignItems: 'flex-start', backgroundColor: Colors.successSoft },
  adviceWarn: { backgroundColor: Colors.coralSoft },
});
