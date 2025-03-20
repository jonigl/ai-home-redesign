export const STYLE_PRESETS = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, neutral colors, decluttered spaces',
    image: '/images/minimalist.jpeg',
  },
  {
    id: 'modern',
    name: 'Modern Contemporary',
    description: 'Sleek, updated fixtures, current trends',
    image: '/images/modern-contemporary.jpeg',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Light woods, whites, functional design',
    image: '/images/scandinavian.jpeg',
  },
  {
    id: 'industrial',
    name: 'Industrial Chic',
    description: 'Exposed elements, raw materials',
    image: '/images/industrial-chic.jpeg',
  },
  {
    id: 'traditional',
    name: 'Cozy Traditional',
    description: 'Warm colors, classic elements',
    image: '/images/cozy-traditional.jpeg',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic, colorful, artistic',
    image: '/images/bohemian.jpeg',
  },
];

export type StylePreset = (typeof STYLE_PRESETS)[0];
