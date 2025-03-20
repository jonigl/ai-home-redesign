import minimalist from '../../public/images/minimalist.jpeg';
import modern from '../../public/images/modern-contemporary.jpeg';
import scandinavian from '../../public/images/scandinavian.jpeg';
import industrial from '../../public/images/industrial-chic.jpeg';
import traditional from '../../public/images/cozy-traditional.jpeg';
import bohemian from '../../public/images/bohemian.jpeg';

export const STYLE_PRESETS = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, neutral colors, decluttered spaces',
    image: minimalist,
  },
  {
    id: 'modern',
    name: 'Modern Contemporary',
    description: 'Sleek, updated fixtures, current trends',
    image: modern,
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Light woods, whites, functional design',
    image: scandinavian,
  },
  {
    id: 'industrial',
    name: 'Industrial Chic',
    description: 'Exposed elements, raw materials',
    image: industrial,
  },
  {
    id: 'traditional',
    name: 'Cozy Traditional',
    description: 'Warm colors, classic elements',
    image: traditional,
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic, colorful, artistic',
    image: bohemian,
  },
];

export type StylePreset = (typeof STYLE_PRESETS)[0];
