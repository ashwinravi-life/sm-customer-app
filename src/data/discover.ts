import type { FrameShape } from '@/components/frame-art';
import { PHOTOS, VIDEOS } from '@/data/media';

// Prototype catalogue for the Discover tab. Swap for ERPNext Item / Website Item data later.

export interface CollectionFrame {
  id: string;
  name: string;
  shape: FrameShape;
  color: string;
  tint?: string;
  colorName: string;
  material: string;
  price: number;
  // Other colours the frame comes in, shown as swatches.
  swatches: string[];
}

export interface Collection {
  id: string;
  name: string;
  tagline: string;
  story: string;
  badge: string;
  gradient: readonly [string, string];
  accent: string;
  heroShape: FrameShape;
  heroColor: string;
  heroTint?: string;
  heroImage: string;
  heroVideo?: string;
  gallery: string[];
  frames: CollectionFrame[];
}

export const collections: Collection[] = [
  {
    id: 'titanium-air',
    name: 'Titanium Air',
    tagline: 'Feather-light. Built for all day.',
    story: 'Pure titanium frames weighing under 10 grams, with flexible hinges that never pinch. Hypoallergenic and rust-proof.',
    badge: 'New',
    gradient: ['#0F2A26', '#1F5F55'],
    accent: '#37D7BD',
    heroShape: 'rectangle',
    heroColor: '#C9D1D3',
    heroImage: PHOTOS.womanMotorbikeDelhi,
    gallery: [PHOTOS.framesYellow, PHOTOS.couplePastel, PHOTOS.framesShowcase],
    frames: [
      { id: 'TA101', name: 'Air TA101', shape: 'rectangle', color: '#4B5563', colorName: 'Gunmetal', material: 'Titanium', price: 4990, swatches: ['#4B5563', '#C9A86A', '#1F2937'] },
      { id: 'TA102', name: 'Air TA102', shape: 'round', color: '#C9A86A', colorName: 'Champagne gold', material: 'Titanium', price: 4990, swatches: ['#C9A86A', '#9CA3AF'] },
      { id: 'TA103', name: 'Air TA103', shape: 'geometric', color: '#9CA3AF', colorName: 'Brushed silver', material: 'Titanium', price: 5490, swatches: ['#9CA3AF', '#4B5563'] },
      { id: 'TA104', name: 'Air TA104', shape: 'oval', color: '#1F2937', colorName: 'Matte black', material: 'Titanium', price: 4990, swatches: ['#1F2937', '#7C2D12'] },
    ],
  },
  {
    id: 'retro-revival',
    name: 'Retro Revival',
    tagline: 'Bold acetate, vintage soul.',
    story: 'Hand-polished Italian acetate in classic 60s and 70s silhouettes. Thick rims, keyhole bridges and rich tortoise tones.',
    badge: 'Trending',
    gradient: ['#3B1F12', '#8A4B22'],
    accent: '#F5B82E',
    heroShape: 'round',
    heroColor: '#7C3F1D',
    heroImage: PHOTOS.tortoiseFrameNight,
    gallery: [PHOTOS.orangeJacketGlasses, PHOTOS.framesFlatLay, PHOTOS.floralRoundGlasses],
    frames: [
      { id: 'RR201', name: 'Revival RR201', shape: 'round', color: '#7C3F1D', colorName: 'Havana tortoise', material: 'Acetate', price: 3290, swatches: ['#7C3F1D', '#111827', '#B45309'] },
      { id: 'RR202', name: 'Revival RR202', shape: 'wayfarer', color: '#111827', colorName: 'Gloss black', material: 'Acetate', price: 2990, swatches: ['#111827', '#7C3F1D'] },
      { id: 'RR203', name: 'Revival RR203', shape: 'cateye', color: '#9F1239', colorName: 'Ruby', material: 'Acetate', price: 3290, swatches: ['#9F1239', '#111827', '#7C3F1D'] },
      { id: 'RR204', name: 'Revival RR204', shape: 'square', color: '#065F46', colorName: 'Bottle green', material: 'Acetate', price: 3290, swatches: ['#065F46', '#111827'] },
    ],
  },
  {
    id: 'sun-club',
    name: 'Sun Club 2026',
    tagline: 'Polarised. UV400. Made for Indian summers.',
    story: 'Every pair blocks 100% UVA and UVB, with polarised lenses that cut glare off roads and water. Available with your power too.',
    badge: 'Summer',
    gradient: ['#7C2D12', '#F2765A'],
    accent: '#FFD25E',
    heroShape: 'aviator',
    heroColor: '#C9A86A',
    heroTint: '#14532D',
    heroImage: PHOTOS.manSunglassesStreet,
    gallery: [PHOTOS.sunglassesPool, PHOTOS.manSunglassesStreet],
    frames: [
      { id: 'SC301', name: 'Sun SC301', shape: 'aviator', color: '#C9A86A', tint: '#14532D', colorName: 'Gold · G15 green', material: 'Metal', price: 2490, swatches: ['#C9A86A', '#4B5563'] },
      { id: 'SC302', name: 'Sun SC302', shape: 'wayfarer', color: '#111827', tint: '#1F2937', colorName: 'Black · Grey', material: 'Acetate', price: 1990, swatches: ['#111827', '#7C3F1D'] },
      { id: 'SC303', name: 'Sun SC303', shape: 'cateye', color: '#7C3F1D', tint: '#78350F', colorName: 'Tortoise · Brown', material: 'Acetate', price: 2290, swatches: ['#7C3F1D', '#9F1239'] },
      { id: 'SC304', name: 'Sun SC304', shape: 'round', color: '#9CA3AF', tint: '#1E3A8A', colorName: 'Silver · Blue mirror', material: 'Metal', price: 2490, swatches: ['#9CA3AF', '#C9A86A'] },
    ],
  },
  {
    id: 'little-explorers',
    name: 'Little Explorers',
    tagline: 'Bend-proof frames for kids on the go.',
    story: 'Flexible TR90 frames that survive drops, twists and playgrounds. Soft nose pads and adjustable sports straps included.',
    badge: 'Kids',
    gradient: ['#312E81', '#6D7BE0'],
    accent: '#37D7BD',
    heroShape: 'oval',
    heroColor: '#2BB8F0',
    heroImage: PHOTOS.girlBlueGlasses,
    gallery: [PHOTOS.boyGlasses, PHOTOS.girlBlueGlasses],
    frames: [
      { id: 'LE401', name: 'Explorer LE401', shape: 'oval', color: '#2BB8F0', colorName: 'Sky blue', material: 'TR90 flex', price: 1490, swatches: ['#2BB8F0', '#F2765A', '#16A34A'] },
      { id: 'LE402', name: 'Explorer LE402', shape: 'round', color: '#F2765A', colorName: 'Coral', material: 'TR90 flex', price: 1490, swatches: ['#F2765A', '#6D7BE0'] },
      { id: 'LE403', name: 'Explorer LE403', shape: 'rectangle', color: '#16A34A', colorName: 'Leaf green', material: 'TR90 flex', price: 1490, swatches: ['#16A34A', '#2BB8F0'] },
    ],
  },
];

// Promo videos: hosted URLs (or bundled files). Stock placeholders for now.
export interface PromoVideo {
  id: string;
  title: string;
  subtitle: string;
  source: number | string;
}

export const promoVideos: PromoVideo[] = [
  { id: 'lens-craft', title: 'Crafted to your power', subtitle: 'Lenses made for you', source: VIDEOS.prescriptionGlassesCloseUp },
  { id: 'sun-club', title: 'Sun Club 2026', subtitle: 'Polarised. UV400.', source: VIDEOS.happySunglasses },
  { id: 'frames-up-close', title: 'Frames, up close', subtitle: 'Details that matter', source: VIDEOS.eyeglassesCloseUp },
];

export const heroVideo = {
  source: VIDEOS.womanPutsOnGlasses,
  eyebrow: 'The 2026 edit',
  title: 'New frames\nhave landed.',
  subtitle: 'Four collections, from feather-light titanium to polarised sun.',
};
