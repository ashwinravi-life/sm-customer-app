import { useIsFocused } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

// Muted, looping background video for banners. Pauses while its screen is not
// in view so off-screen tabs don't burn battery and data.
export function AutoVideo({ source, style }: { source: string | number; style?: StyleProp<ViewStyle> }) {
  const focused = useIsFocused();
  const player = useVideoPlayer(source, (p) => {
    p.muted = true;
    p.loop = true;
  });

  useEffect(() => {
    if (focused) player.play();
    else player.pause();
  }, [focused, player]);

  return (
    <VideoView
      player={player}
      style={[StyleSheet.absoluteFill, style]}
      contentFit="cover"
      nativeControls={false}
      // TextureView clips to rounded corners and sits correctly under overlays on Android.
      surfaceType="textureView"
      useExoShutter={false}
      allowsPictureInPicture={false}
    />
  );
}
