import { router, useLocalSearchParams } from 'expo-router';
import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

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
import { Colors, Space } from '@/constants/theme';
import { learnTopics, type LensVisualId, type LearnTopic } from '@/data/learn';

const LENS_VISUALS: Record<LensVisualId, ComponentType> = {
  'single-vision': SingleVisionVisual,
  bifocal: BifocalVisual,
  progressive: ProgressiveVisual,
  comparison: ComparisonVisual,
  'myopia-control': MyopiaControlVisual,
  'blur-to-clear': GazeVisual,
  'blue-filter': BlueFilterVisual,
};

function TopicVisual({ topic }: { topic: LearnTopic }) {
  if (topic.visual.kind === 'coating') return <CoatingVisual kind={topic.visual.id} />;
  const Visual = LENS_VISUALS[topic.visual.id];
  return <Visual />;
}

export default function LearnTopicScreen() {
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = learnTopics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <Screen title="Learn">
        <Text variant="body">This topic could not be found.</Text>
      </Screen>
    );
  }

  const siblings = learnTopics.filter((t) => t.group === topic.group);
  const next = siblings[(siblings.indexOf(topic) + 1) % siblings.length];

  return (
    <Screen title={topic.group === 'choose' ? 'Choose lenses' : 'Improve lenses'}>
      <View style={styles.heading}>
        <IconBubble name={topic.icon} color={topic.accent.fg} background={topic.accent.bg} size={52} />
        <View style={styles.flex}>
          <Text variant="h1">{topic.title}</Text>
          <Text variant="caption">{topic.short}</Text>
        </View>
      </View>
      <Text variant="body">{topic.intro}</Text>

      {/* key resets the visual's toggles when moving to the next topic */}
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

      <Button title="Try it at a store near you" icon="location-outline" onPress={() => router.push('/stores')} />
      {next && next.id !== topic.id ? (
        <Button
          title={`Next: ${next.title}`}
          icon="arrow-forward"
          variant="outline"
          onPress={() => router.replace({ pathname: '/learn/[topic]', params: { topic: next.id } })}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: Space.md },
  heading: { flexDirection: 'row', alignItems: 'center', gap: Space.md },
  bullet: { flexDirection: 'row', alignItems: 'center', gap: Space.sm },
});
