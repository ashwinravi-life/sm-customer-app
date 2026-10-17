import type { FrameShape } from '@/components/frame-art';
import type { IconName } from '@/components/icon';
import type { CoatingKind } from '@/components/learn/coatings';

export type LensVisualId =
  | 'single-vision'
  | 'bifocal'
  | 'progressive'
  | 'comparison'
  | 'myopia-control'
  | 'blur-to-clear'
  | 'blue-filter';

export interface LearnTopic {
  id: string;
  group: 'choose' | 'improve';
  title: string;
  short: string;
  icon: IconName;
  accent: { fg: string; bg: string };
  intro: string;
  goodFor: string[];
  visual: { kind: 'lens'; id: LensVisualId } | { kind: 'coating'; id: CoatingKind };
}

const TEAL = { fg: '#0B8F7A', bg: '#E6FAF6' };
const PURPLE = { fg: '#6D7BE0', bg: '#ECEEFC' };
const SKY = { fg: '#2BB8F0', bg: '#E5F6FD' };
const CORAL = { fg: '#F2765A', bg: '#FDECE8' };
const GOLD = { fg: '#B7791F', bg: '#FEF5E1' };

export const learnTopics: LearnTopic[] = [
  // Choose lenses
  {
    id: 'single-vision',
    group: 'choose',
    title: 'Single vision',
    short: 'One power, one distance',
    icon: 'ellipse-outline',
    accent: SKY,
    intro: 'The same power across the whole lens. Made either for seeing far or for reading up close.',
    goodFor: ['Short or long sight', 'First glasses and kids', 'Separate reading glasses'],
    visual: { kind: 'lens', id: 'single-vision' },
  },
  {
    id: 'bifocal',
    group: 'choose',
    title: 'Bifocal',
    short: 'Far on top, reading below',
    icon: 'contrast-outline',
    accent: PURPLE,
    intro: 'Two powers in one lens, split by a visible line: distance on top and a reading segment at the bottom.',
    goodFor: ['Far and reading in one pair', 'A budget-friendly multifocal', 'People used to bifocals'],
    visual: { kind: 'lens', id: 'bifocal' },
  },
  {
    id: 'progressive',
    group: 'choose',
    title: 'Progressive',
    short: 'Every distance, no line',
    icon: 'git-commit-outline',
    accent: TEAL,
    intro: 'Power changes smoothly from far at the top, through computer distance, to reading at the bottom. No visible line.',
    goodFor: ['40+ needing reading help', 'Office and screen work', 'One pair for the whole day'],
    visual: { kind: 'lens', id: 'progressive' },
  },
  {
    id: 'comparison',
    group: 'choose',
    title: 'SV vs Bifocal vs Progressive',
    short: 'Side-by-side comparison',
    icon: 'git-compare-outline',
    accent: GOLD,
    intro: 'Which lens covers which distance, at a glance.',
    goodFor: ['Choosing your next pair', 'Moving from bifocal to progressive'],
    visual: { kind: 'lens', id: 'comparison' },
  },
  {
    id: 'myopia-control',
    group: 'choose',
    title: 'Myopia control for kids',
    short: 'Help slow growing power',
    icon: 'happy-outline',
    accent: CORAL,
    intro: 'Special lenses for children whose minus power keeps increasing. They correct vision and help slow how fast it changes.',
    goodFor: ['Kids 6–16 with rising minus power', 'Parents who are both short-sighted', 'Lots of screen and study time'],
    visual: { kind: 'lens', id: 'myopia-control' },
  },
  {
    id: 'blur-to-clear',
    group: 'choose',
    title: 'Progressive: blur to clear',
    short: 'Drag your gaze down the lens',
    icon: 'eye-outline',
    accent: TEAL,
    intro: 'See how looking through different parts of a progressive lens brings far, middle and near into focus.',
    goodFor: ['First-time progressive wearers', 'Understanding the adaptation period'],
    visual: { kind: 'lens', id: 'blur-to-clear' },
  },
  {
    id: 'blue-filter',
    group: 'choose',
    title: 'Blue filter lenses',
    short: 'Comfort for screen time',
    icon: 'phone-portrait-outline',
    accent: SKY,
    intro: 'Lenses that reflect part of the high-energy blue-violet light from phones, laptops and LED lights.',
    goodFor: ['Long hours on screens', 'Students and office workers', 'Evening phone use'],
    visual: { kind: 'lens', id: 'blue-filter' },
  },

  // Improve lenses
  {
    id: 'anti-scratch',
    group: 'improve',
    title: 'Anti-scratch',
    short: 'Tougher surface',
    icon: 'shield-checkmark-outline',
    accent: TEAL,
    intro: 'A hard coat that protects the lens surface from everyday scratches.',
    goodFor: ['Everyone', 'Kids and active wearers', 'People who wipe lenses often'],
    visual: { kind: 'coating', id: 'anti-scratch' },
  },
  {
    id: 'hydrophobic',
    group: 'improve',
    title: 'Hydrophobic',
    short: 'Water rolls off',
    icon: 'water-outline',
    accent: SKY,
    intro: 'A water-repelling top layer that makes rain and splashes bead up and slide away.',
    goodFor: ['Two-wheeler riders', 'Monsoon season', 'Kitchens and outdoors'],
    visual: { kind: 'coating', id: 'hydrophobic' },
  },
  {
    id: 'smudge',
    group: 'improve',
    title: 'Smudge resistance',
    short: 'Fingerprints wipe off',
    icon: 'finger-print-outline',
    accent: PURPLE,
    intro: 'An oil-repelling layer so skin oils and fingerprints do not stick or smear.',
    goodFor: ['People who touch their glasses often', 'Make-up wearers', 'Hot, humid weather'],
    visual: { kind: 'coating', id: 'smudge' },
  },
  {
    id: 'anti-reflection',
    group: 'improve',
    title: 'Anti-reflection',
    short: 'Less glare, see the eyes',
    icon: 'sunny-outline',
    accent: GOLD,
    intro: 'Coatings that cut reflections off both sides of the lens for sharper vision and natural-looking eyes.',
    goodFor: ['Night driving', 'Screens and video calls', 'Photos'],
    visual: { kind: 'coating', id: 'anti-reflection' },
  },
  {
    id: 'anti-fog',
    group: 'improve',
    title: 'Anti-fog',
    short: 'Clear from AC to outdoors',
    icon: 'cloud-outline',
    accent: SKY,
    intro: 'A layer that stops lenses fogging up with sudden temperature changes or when wearing a mask.',
    goodFor: ['Mask wearers', 'Cooks and chefs', 'Moving in and out of AC'],
    visual: { kind: 'coating', id: 'anti-fog' },
  },
  {
    id: 'polarized',
    group: 'improve',
    title: 'Polarised',
    short: 'Cuts glare from roads and water',
    icon: 'car-sport-outline',
    accent: CORAL,
    intro: 'Sunglass lenses with a filter that blocks the harsh, flat glare reflecting off roads, water and cars.',
    goodFor: ['Driving and riding', 'Beach and water', 'Outdoor sports'],
    visual: { kind: 'coating', id: 'polarized' },
  },
  {
    id: 'photochromic',
    group: 'improve',
    title: 'Photochromic',
    short: 'Clear indoors, dark outdoors',
    icon: 'partly-sunny-outline',
    accent: PURPLE,
    intro: 'Lenses that darken automatically in sunlight and clear again indoors, so one pair works as specs and sunglasses.',
    goodFor: ['Moving in and out often', 'Light-sensitive eyes', 'Not wanting a separate sunglass'],
    visual: { kind: 'coating', id: 'photochromic' },
  },
];

export interface FaceShapeGuide {
  id: 'oval' | 'round' | 'square' | 'heart' | 'oblong';
  name: string;
  how: string;
  tip: string;
  best: FrameShape[];
  avoid: string;
}

export const faceShapes: FaceShapeGuide[] = [
  {
    id: 'oval',
    name: 'Oval',
    how: 'Slightly longer than wide, with gently rounded jaw and forehead.',
    tip: 'Lucky you: most styles suit. Go a little bold.',
    best: ['wayfarer', 'geometric', 'square', 'aviator'],
    avoid: 'Very narrow frames that look small on the face.',
  },
  {
    id: 'round',
    name: 'Round',
    how: 'Width and length are similar, with soft cheeks and a rounded chin.',
    tip: 'Angular frames add definition and make the face look longer.',
    best: ['rectangle', 'square', 'wayfarer', 'geometric'],
    avoid: 'Small round frames that echo the curves.',
  },
  {
    id: 'square',
    name: 'Square',
    how: 'Strong, broad jawline with a wide forehead.',
    tip: 'Curves soften strong angles.',
    best: ['round', 'oval', 'aviator', 'cateye'],
    avoid: 'Boxy, sharp-cornered frames.',
  },
  {
    id: 'heart',
    name: 'Heart',
    how: 'Wider forehead and cheekbones, tapering to a narrow chin.',
    tip: 'Frames that are lighter on top or wider at the bottom balance the face.',
    best: ['oval', 'round', 'aviator', 'rectangle'],
    avoid: 'Heavy top-line or very decorated brows.',
  },
  {
    id: 'oblong',
    name: 'Long',
    how: 'Noticeably longer than wide, with a long straight cheek line.',
    tip: 'Deep, wide frames make the face look shorter and balanced.',
    best: ['square', 'wayfarer', 'round', 'geometric'],
    avoid: 'Small, narrow or rimless frames.',
  },
];
