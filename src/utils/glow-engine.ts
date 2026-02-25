export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong';
export type HairCoverage = 'visible' | 'partial' | 'covered' | 'unspecified';

export interface GlowPlan {
  face_shape: FaceShape;
  glow_score: number;
  harmony_insight: string;
  styling: {
    title: string;
    content: string;
  };
  makeup_vibe: string;
  color_palette: string[];
  outfit_energy: string;
  event_tips: string;
}

const FACE_SHAPES: FaceShape[] = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Oblong'];

export const generateGlowPlan = (
  identity: string,
  event: string,
  energy: string,
  coverage: HairCoverage
): GlowPlan => {
  // Deterministik sonuç için girdilerden bir seed oluşturuyoruz (basit simülasyon)
  const seed = (identity.length + event.length + energy.length + coverage.length) % FACE_SHAPES.length;
  const faceShape = FACE_SHAPES[seed];
  const glowScore = 85 + (seed % 15); // 85-100 arası tutarlı skor

  const isCovered = coverage === 'covered';

  const plan: GlowPlan = {
    face_shape: faceShape,
    glow_score: glowScore,
    harmony_insight: `Your ${faceShape} structure provides a naturally balanced canvas for ${energy} expressions.`,
    styling: {
      title: isCovered ? "Styling Direction" : "Hair Direction",
      content: isCovered 
        ? getCoveredStyling(event, energy)
        : getVisibleHairStyling(event, energy, faceShape)
    },
    makeup_vibe: getMakeupVibe(event, energy, identity),
    color_palette: getColorPalette(energy),
    outfit_energy: getOutfitEnergy(event, energy),
    event_tips: getEventTips(event)
  };

  return plan;
};

const getCoveredStyling = (event: string, energy: string) => {
  if (event === 'Job Interview') return "Structured wrap with a neutral palette. Focus on a polished silhouette and balanced volume.";
  if (event === 'First Date') return "Soft face framing with elegant draping. Use warm, radiant fabric tones to enhance your glow.";
  return "Refined layering with satin textures. Focus on highlight balance and sophisticated volume.";
};

const getVisibleHairStyling = (event: string, energy: string, shape: string) => {
  if (event === 'Job Interview') return "Polished low bun or a structured bob to emphasize professional clarity.";
  return "Soft romantic waves with natural volume to soften the jawline and add radiance.";
};

const getMakeupVibe = (event: string, energy: string, identity: string) => {
  const base = identity === 'Man' ? "Grooming" : "Makeup";
  if (event === 'First Date') return `${base}: Dewy skin, soft flush, and a hint of shimmer for a radiant look.`;
  return `${base}: Matte finish, neutral tones, and confident definition.`;
};

const getColorPalette = (energy: string) => {
  const palettes: Record<string, string[]> = {
    'Soft': ['#E8D5D8', '#F5F0E1', '#D1C4E9', '#FFFFFF', '#BCAAA4'],
    'Bold': ['#4A3F3F', '#E8D5D8', '#FFAB91', '#263238', '#D84315'],
    'Elegant': ['#4A3F3F', '#F5F0E1', '#CFD8DC', '#90A4AE', '#263238'],
    'Natural': ['#BCAAA4', '#F5F0E1', '#A5D6A7', '#E8F5E9', '#795548'],
    'Trendy': ['#D1C4E9', '#F48FB1', '#80CBC4', '#E8D5D8', '#4A3F3F']
  };
  return palettes[energy] || palettes['Soft'];
};

const getOutfitEnergy = (event: string, energy: string) => {
  return `A ${energy.toLowerCase()} silhouette that balances comfort with ${event.toLowerCase()} expectations.`;
};

const getEventTips = (event: string) => {
  const tips: Record<string, string> = {
    'First Date': "Focus on eye contact and a warm smile. Your glow comes from within.",
    'Job Interview': "Posture is key. Let your appearance reflect your competence.",
    'Wedding': "Luminous textures work best under celebration lighting.",
    'Girls Night': "Experiment with one bold element to spark joy.",
    'Power Meeting': "Clean lines and minimal distractions command the room.",
    'Glow-Up Reset': "Today is about you. Take time to appreciate your progress."
  };
  return tips[event] || "Stay present and embrace your natural radiance.";
};