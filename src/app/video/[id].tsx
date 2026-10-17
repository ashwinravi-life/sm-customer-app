import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Text } from '@/components/text';
import { Colors, Space } from '@/constants/theme';
import { promoVideos, type PromoVideo } from '@/data/discover';

function Player({ video }: { video: PromoVideo }) {
  const player = useVideoPlayer(video.source, (p) => {
    p.loop = false;
    p.play();
  });
  return <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />;
}

export default function VideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const video = promoVideos.find((v) => v.id === id);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {video ? <Player video={video} /> : null}
      <SafeAreaView style={styles.overlay} edges={['top']} pointerEvents="box-none">
        <View style={styles.topRow}>
          <View style={styles.flex}>
            {video ? (
              <>
                <Text variant="h3" color={Colors.textOnDark}>
                  {video.title}
                </Text>
                <Text variant="caption" color={Colors.textOnDarkMuted}>
                  {video.subtitle}
                </Text>
              </>
            ) : (
              <Text variant="h3" color={Colors.textOnDark}>
                Video not found
              </Text>
            )}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
            <Icon name="close" size={22} color={Colors.textOnDark} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  flex: { flex: 1 },
  video: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Space.md, padding: Space.lg },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
