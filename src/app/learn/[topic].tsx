import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState, type ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { IconBubble } from '@/components/bits';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { CoatingVisual } from '@/components/learn/coatings';
import {
  BifocalVisual,
  BlueFilterVisual,
  ComparisonVisual,
  GazeVisual,
  MyopiaControlVisual,
  ProgressiveVisual,
  SingleVisionVisual,
} from '@/components/learn/lens-types';
import { Screen } from '@/components/screen';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { learnTopics, type LearnTopic, type LensVisualId } from '@/data/learn';
import { select } from '@/lib/haptics';

const LENS_VISUALS: Record<LensVisualId, ComponentType> = {
  'single-vision': SingleVisionVisual,
  bifocal: BifocalVisual,
  progressive: ProgressiveVisual,
  comparison: ComparisonVisual,
  'myopia-control': MyopiaControlVisual,
  'blur-to-clear': GazeVisual,
  'blue-filter': BlueFilterVisual,
};

// Short labels so all options fit comfortably in the tab strip.
const TAB_LABELS: Record<string, string> = {
  'single-vision': 'Single vision',
  bifocal: 'Bifocal',
  progressive: 'Progressive',
  comparison: 'Compare',
  'myopia-control': 'Myopia kids',
  'blur-to-clear': 'Blur to clear',
  'blue-filter': 'Blue filter',
  'anti-scratch': 'Anti-scratch',
  hydrophobic: 'Hydrophobic',
  smudge: 'Smudge-free',
  'anti-reflection': 'Anti-reflection',
  'anti-fog': 'Anti-fog',
  polarized: 'Polarised',
  photochromic: 'Photochromic',
};

function TopicVisual({ topic }: { topic: LearnTopic }) {
  if (topic.visual.kind === 'coating') return <CoatingVisual kind={topic.visual.id} />;
  const Visual = LENS_VISUALS[topic.visual.id];
  return <Visual />;
}

// One page per group (Choose lenses / Improve lenses). The route param picks
// the starting option; switching options happens in place via the tab strip.
export default function LensGuideScreen() {
  const { topic: initialId } = useLocalSearchParams<{ topic: string }>();
  const initial = learnTopics.find((t) => t.id === initialId) ?? learnTopics[0];
  const options = learnTopics.filter((t) => t.group === initial.group);

  const [topicId, setTopicId] = useState(initial.id);
  const topic = options.find((t) => t.id === topicId) ?? initial;
  const index = options.indexOf(topic);

  const pageRef = useRef<ScrollView>(null);
  const tabsRef = useRef<ScrollView>(null);
  const [tabX, setTabX] = useState<Record<string, number>>({});

  const show = (id: string) => {
    select();
    setTopicId(id);
    pageRef.current?.scrollTo({ y: 0, animated: false });
    tabsRef.current?.scrollTo({ x: Math.max(0, (tabX[id] ?? 0) - Space.xl), animated: true });
  };

  const prev = options[index - 1];
  const next = options[index + 1];

  return (
    <Screen title={initial.group === 'choose' ? 'Choose lenses' : 'Improve lenses'} scroll={false}>
      <ScrollView
        ref={tabsRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
        style={styles.tabBar}
      >
        {options.map((t) => {
          const active = t.id === topic.id;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onLayout={(e) => {
                const x = e.nativeEvent.layout.x;
                setTabX((prevX) => (prevX[t.id] === x ? prevX : { ...prevX, [t.id]: x }));
                // Opened from a link to a later option: bring its tab into view.
                if (t.id === initial.id && x > 0) {
                  tabsRef.current?.scrollTo({ x: Math.max(0, x - Space.xl), animated: false });
                }
              }}
              onPress={() => show(t.id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Icon name={t.icon} size={16} color={active ? Colors.teal : Colors.text} />
              <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
                {TAB_LABELS[t.id] ?? t.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView ref={pageRef} contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <IconBubble name={topic.icon} color={topic.accent.fg} background={topic.accent.bg} size={52} />
          <View style={styles.flex}>
            <Text variant="overline">
              {index + 1} of {options.length}
            </Text>
            <Text variant="h1">{topic.title}</Text>
            <Text variant="caption">{topic.short}</Text>
          </View>
        </View>
        <Text variant="body">{topic.intro}</Text>

        {/* key resets the visual's toggles when switching options */}
        <Card key={topic.id}>
          <TopicVisual topic={topic} />
        </Card>

        <Card style={styles.gap}>
          <Text variant="h3">Good for</Text>
          {topic.goodFor.map((item) => (
            <View key={item} style={styles.bullet}>
              <Icon name="checkmark-circle" size={20} color={Colors.success} />
              <Text variant="body" style={styles.flex}>
                {item}
              </Text>
            </View>
          ))}
        </Card>

        <View style={styles.pager}>
          {prev ? (
            <Button title={TAB_LABELS[prev.id] ?? prev.title} icon="arrow-back" variant="outline" size="md" style={styles.flex} onPress={() => show(prev.id)} />
          ) : (
            <View style={styles.flex} />
          )}
          {next ? (
            <Button title={TAB_LABELS[next.id] ?? next.title} icon="arrow-forward" size="md" style={styles.flex} onPress={() => show(next.id)} />
          ) : (
            <View style={styles.flex} />
          )}
        </View>

        <Button title="Ask about it at a store" icon="location-outline" variant="ghost" onPress={() => router.push('/stores')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  tabBar: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabs: { gap: Space.sm, paddingHorizontal: Space.xl, paddingVertical: Space.md },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  tabActive: { backgroundColor: Colors.ink },
  page: { padding: Space.xl, paddingBottom: 80, gap: Space.xl },
  heading: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
  pager: { flexDirection: 'row', gap: Space.md },
});
