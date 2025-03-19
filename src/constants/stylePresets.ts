export const STYLE_PRESETS = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines, neutral colors, decluttered spaces',
    image: 'https://plus.unsplash.com/premium_photo-1661888751535-d904c82257a3?q=80&w=3066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'modern',
    name: 'Modern Contemporary',
    description: 'Sleek, updated fixtures, current trends',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Light woods, whites, functional design',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c',
  },
  {
    id: 'industrial',
    name: 'Industrial Chic',
    description: 'Exposed elements, raw materials',
    image: 'https://plus.unsplash.com/premium_photo-1676320102845-4fa58706484e?q=80&w=3045&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'traditional',
    name: 'Cozy Traditional',
    description: 'Warm colors, classic elements',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic, colorful, artistic',
    image: 'https://images.unsplash.com/photo-1583845112203-29329902332e?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export type StylePreset = (typeof STYLE_PRESETS)[0];
