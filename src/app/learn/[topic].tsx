import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentType } from 'react';
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
import { SwipePager } from '@/components/swipe-pager';
import { Text } from '@/components/text';
import { Colors, Radius, Space } from '@/constants/theme';
import { learnTopics, TOPIC_SHORT_LABELS, type LearnTopic, type LensVisualId } from '@/data/learn';
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

const label = (t: LearnTopic) => TOPIC_SHORT_LABELS[t.id] ?? t.title;

function TopicVisual({ topic }: { topic: LearnTopic }) {
  if (topic.visual.kind === 'coating') return <CoatingVisual kind={topic.visual.id} />;
  const Visual = LENS_VISUALS[topic.visual.id];
  return <Visual />;
}

function TopicPage({ topic }: { topic: LearnTopic }) {
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.heading}>
        <IconBubble name={topic.icon} color={topic.accent.fg} background={topic.accent.bg} size={52} />
        <View style={styles.flex}>
          <Text variant="h1">{topic.title}</Text>
          <Text variant="caption">{topic.short}</Text>
        </View>
      </View>
      <Text variant="body">{topic.intro}</Text>

      <Card>
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

      <Button title="Ask about it at a store" icon="location-outline" variant="ghost" onPress={() => router.push('/stores')} />
    </ScrollView>
  );
}

// One page per group (Choose lenses / Improve lenses): swipe, tap a tab, or
// use the bottom bar to move between options.
export default function LensGuideScreen() {
  const { topic: initialId } = useLocalSearchParams<{ topic: string }>();
  const initial = learnTopics.find((t) => t.id === initialId) ?? learnTopics[0];
  const options = learnTopics.filter((t) => t.group === initial.group);
  const [index, setIndex] = useState(Math.max(0, options.indexOf(initial)));

  const tabsRef = useRef<ScrollView>(null);
  const [tabX, setTabX] = useState<Record<string, number>>({});
  const activeX = tabX[options[index]?.id ?? ''];

  // Keep the active tab in view.
  useEffect(() => {
    if (activeX !== undefined) tabsRef.current?.scrollTo({ x: Math.max(0, activeX - Space.xl), animated: true });
  }, [activeX]);

  return (
    <Screen title={initial.group === 'choose' ? 'Choose lenses' : 'Improve lenses'} scroll={false}>
      <ScrollView ref={tabsRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} style={styles.tabBar}>
        {options.map((t, i) => {
          const active = i === index;
          return (
            <Pressable
              key={t.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onLayout={(e) => {
                const x = e.nativeEvent.layout.x;
                setTabX((prev) => (prev[t.id] === x ? prev : { ...prev, [t.id]: x }));
              }}
              onPress={() => {
                select();
                setIndex(i);
              }}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text variant="captionStrong" color={active ? Colors.textOnDark : Colors.text}>
                {label(t)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <SwipePager
        items={options}
        index={index}
        onIndexChange={setIndex}
        keyOf={(t) => t.id}
        labelOf={label}
        renderPage={(t) => <TopicPage topic={t} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  tabBar: { flexGrow: 0 },
  tabs: { gap: Space.sm, paddingHorizontal: Space.xl, paddingVertical: Space.md },
  tab: { justifyContent: 'center', paddingHorizontal: 14, height: 38, borderRadius: Radius.pill, backgroundColor: Colors.surface },
  tabActive: { backgroundColor: Colors.ink },
  page: { padding: Space.xl, paddingTop: Space.sm, paddingBottom: 40, gap: Space.xl },
  heading: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
});
