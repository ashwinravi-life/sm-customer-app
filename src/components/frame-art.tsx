import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Polygon, Rect, Stop } from 'react-native-svg';

export type FrameShape =
  | 'round'
  | 'oval'
  | 'rectangle'
  | 'square'
  | 'wayfarer'
  | 'aviator'
  | 'cateye'
  | 'geometric';

interface FrameArtProps {
  shape: FrameShape;
  color: string;
  // Sunglasses get a tinted lens; clear frames leave it almost transparent.
  tint?: string;
  width?: number;
  thickness?: number;
}

// Left lens drawn around (52, 42) in a 200 x 84 box; the right lens is a mirror.
function Lens({ shape, fill, stroke, strokeWidth }: { shape: FrameShape; fill: string; stroke: string; strokeWidth: number }) {
  const common = { fill, stroke, strokeWidth, strokeLinejoin: 'round' as const };
  switch (shape) {
    case 'round':
      return <Circle cx={52} cy={44} r={31} {...common} />;
    case 'oval':
      return <Ellipse cx={52} cy={44} rx={38} ry={25} {...common} />;
    case 'rectangle':
      return <Rect x={14} y={24} width={76} height={40} rx={9} {...common} />;
    case 'square':
      return <Rect x={17} y={12} width={70} height={64} rx={12} {...common} />;
    case 'wayfarer':
      return <Path d="M12 18 L92 18 L87 56 Q82 68 68 68 L32 68 Q18 68 15 56 Z" {...common} />;
    case 'aviator':
      return <Path d="M13 20 Q52 8 91 20 Q94 50 72 66 Q52 76 30 64 Q10 50 13 20 Z" {...common} />;
    case 'cateye':
      return <Path d="M8 14 Q50 22 91 26 Q93 56 70 64 Q40 70 22 58 Q10 44 8 14 Z" {...common} />;
    case 'geometric':
      return <Polygon points="24,16 80,16 94,42 80,70 24,70 10,42" {...common} />;
  }
}

export function FrameArt({ shape, color, tint, width = 200, thickness = 5 }: FrameArtProps) {
  const height = (width * 84) / 200;
  const lensFill = tint ? 'url(#tint)' : 'rgba(180, 220, 230, 0.18)';

  return (
    <Svg width={width} height={height} viewBox="0 0 200 84">
      <Defs>
        <LinearGradient id="tint" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={tint ?? '#000'} stopOpacity={0.95} />
          <Stop offset="1" stopColor={tint ?? '#000'} stopOpacity={0.55} />
        </LinearGradient>
      </Defs>

      {[false, true].map((mirrored) => (
        <G key={String(mirrored)} transform={mirrored ? 'translate(200 0) scale(-1 1)' : undefined}>
          <Lens shape={shape} fill={lensFill} stroke={color} strokeWidth={thickness} />
          {/* Lens glint */}
          <Path d="M30 30 Q36 24 44 23" stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={3} strokeLinecap="round" fill="none" />
          {/* Temple stub */}
          <Path d="M12 26 L1 22" stroke={color} strokeWidth={thickness} strokeLinecap="round" />
        </G>
      ))}

      {/* Bridge */}
      <Path
        d={shape === 'aviator' ? 'M88 26 Q100 18 112 26 M86 34 L114 34' : 'M88 34 Q100 24 112 34'}
        stroke={color}
        strokeWidth={thickness}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
