import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';

import { Icon } from '@/components/icon';
import { CoatingSplit } from '@/components/learn/coatings';
import { LensDiagram } from '@/components/learn/lens-types';
import { Colors } from '@/constants/theme';
import type { LearnTopic } from '@/data/learn';

function BlueFilterThumb() {
  return (
    <Svg width={170} height={110} viewBox="0 0 170 110">
      <Rect x={4} y={30} width={40} height={30} rx={4} fill={Colors.ink} />
      <Rect x={8} y={34} width={32} height={22} rx={2} fill="#1E3A8A" />
      <Ellipse cx={105} cy={50} rx={9} ry={38} fill="#FEF3C7" stroke={Colors.ink} strokeWidth={3} />
      <Line x1={48} y1={40} x2={160} y2={42} stroke="#EF4444" strokeWidth={3} />
      <Line x1={48} y1={48} x2={160} y2={48} stroke="#22C55E" strokeWidth={3} />
      <Line x1={48} y1={56} x2={96} y2={58} stroke="#3B82F6" strokeWidth={3} />
      <Path d="M96 58 L66 84" stroke="#3B82F6" strokeWidth={3} strokeDasharray="5 4" />
      <Path d="M140 48 Q152 38 164 48 Q152 58 140 48 Z" fill="#FFFFFF" stroke={Colors.ink} strokeWidth={2} />
      <Circle cx={152} cy={48} r={4} fill={Colors.ink} />
    </Svg>
  );
}

// Small illustration of the topic itself, for cards on Discover.
export function TopicThumb({ topic }: { topic: LearnTopic }) {
  if (topic.visual.kind === 'coating') return <CoatingSplit kind={topic.visual.id} height={118} />;

  switch (topic.visual.id) {
    case 'single-vision':
      return <LensDiagram type="sv" width={150} labels={false} />;
    case 'bifocal':
      return <LensDiagram type="bf" width={150} />;
    case 'progressive':
      return <LensDiagram type="pal" width={150} />;
    case 'myopia-control':
      return <LensDiagram type="myopia" width={150} />;
    case 'comparison':
      return (
        <View style={styles.row}>
          <LensDiagram type="sv" width={62} labels={false} />
          <LensDiagram type="bf" width={62} labels={false} />
          <LensDiagram type="pal" width={62} labels={false} />
        </View>
      );
    case 'blur-to-clear':
      return (
        <View>
          <LensDiagram type="pal" width={150} active="mid" labels={false} />
          <View style={styles.eye}>
            <Icon name="eye" size={16} color={Colors.textOnDark} />
          </View>
        </View>
      );
    case 'blue-filter':
      return <BlueFilterThumb />;
  }
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  eye: {
    position: 'absolute',
    left: 75 - 14,
    top: 58,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.ink,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
