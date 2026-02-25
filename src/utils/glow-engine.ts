export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong';
export type HairCoverage = 'visible' | 'partial' | 'covered' | 'unspecified';

export interface MomentPlan {
  look_direction: string;
  makeup_grooming: string;
  styling: {
    title: string;
    content: string;
    tips: string[];
  };
  color_palette: {
    colors: string[];
    avoid: string[];
  };
  posture_presence: string[];
  camera_presence?: {
    framing: string;
    eye_line: string;
    micro_expressions: string;
  };
  voice_delivery?: {
    pacing: string;
    warmups: string[];
  };
  checklist: string[];
  glow_score: number;
}

export const generateMomentPlan = (
  baseline: any,
  momentType: string,
  modifiers: any
): MomentPlan => {
  const isCreator = momentType.includes('Creator');
  const isCovered = baseline.hair_coverage === 'covered';
  
  // Deterministik seed
  const seed = (momentType.length + baseline.identity.length) % 10;
  const glowScore = 82 + seed;

  const plan: MomentPlan = {
    glow_score: glowScore,
    look_direction: getLookDirection(momentType, baseline.presentation_goal),
    makeup_grooming: getMakeupGrooming(momentType, baseline.beauty_comfort, baseline.identity),
    styling: {
      title: isCovered ? "Styling & Framing" : "Hair Direction",
      content: isCovered ? getCoveredStyling(momentType) : getVisibleHairStyling(momentType),
      tips: isCovered ? ["Focus on undercap volume", "Ensure fabric harmony"] : ["Soft waves", "Natural part"]
    },
    color_palette: {
      colors: ['#E8D5D8', '#F5F0E1', '#4A3F3F', '#D1C4E9', '#FFFFFF'],
      avoid: ['Neon Yellow', 'Harsh Grey']
    },
    posture_presence: [
      "Shoulders back and down",
      "Chin parallel to floor",
      "Open palm gestures"
    ],
    checklist: [
      "Check lighting source",
      "Hydrate 15 mins before",
      "Final mirror check",
      "Deep breath (4-7-8)"
    ]
  };

  if (isCreator) {
    plan.camera_presence = {
      framing: modifiers.framing || "Head & Shoulders",
      eye_line: "Level with lens",
      micro_expressions: "Soft smile between points"
    };
    plan.voice_delivery = {
      pacing: "Measured & intentional",
      warmups: ["Lip trills (30s)", "Humming scale"]
    };
  }

  return plan;
};

const getLookDirection = (moment: string, goal: string) => {
  if (moment === 'Job Interview') return `A ${goal.toLowerCase()} professional silhouette with clean lines.`;
  if (moment === 'First Date') return `Soft, approachable ${goal.toLowerCase()} textures.`;
  return `Balanced ${goal.toLowerCase()} energy for this moment.`;
};

const getMakeupGrooming = (moment: string, comfort: string, identity: string) => {
  const base = identity === 'Man' ? "Grooming" : "Makeup";
  return `${base}: ${comfort} intensity. Focus on skin radiance and eye definition.`;
};

const getCoveredStyling = (moment: string) => {
  if (moment === 'Power Meeting') return "Structured wrap with silk-blend fabric.";
  return "Soft draping with jersey or chiffon for a natural frame.";
};

const getVisibleHairStyling = (moment: string) => {
  if (moment === 'Night Out') return "High-shine finish with soft volume.";
  return "Natural texture with minimal flyaways.";
};