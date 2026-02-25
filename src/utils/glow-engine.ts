export interface StyleProfile {
  preferred_silhouettes: string[];
  preferred_colors: string[];
  formality_level: number; // 1-5
  makeup_intensity: string;
  confidence_trends: number[];
}

export interface MomentPlan {
  look_direction: string;
  why_it_works: {
    harmony: string;
    psychology: string;
  };
  avoid_tonight: string[];
  makeup_grooming: {
    focus: string;
    intensity: string;
    steps: string[];
    finish: string;
  };
  styling: {
    title: string;
    options: {
      title: string;
      silhouette: string;
      palette: string[];
      avoid: string[];
      tag?: 'Underused' | 'New Combo' | 'Wardrobe Favorite';
    }[];
  };
  hair_covering: {
    title: string;
    direction: string;
    dos: string[];
    donts: string[];
  };
  presence: {
    entrance: string;
    posture: string[];
    eye_contact: string;
    calm_technique: string;
  };
  confidence_coach: {
    posture: string;
    breathing: string;
    mindset: string;
  };
  glow_score: number;
}

export const generateGlowPlan = (
  baseline: any,
  momentType: string,
  modifiers: any,
  styleProfile?: StyleProfile
): MomentPlan => {
  const isWoman = baseline?.identity === 'Woman' || baseline?.identity === 'Non-binary';
  const isCovered = baseline?.hair_coverage !== 'visible';
  
  // Intelligence Logic: Boost preferred colors if they exist in profile
  const basePalette = ['#E8D5D8', '#F5F0E1', '#4A3F3F', '#FFFFFF'];
  const finalPalette = styleProfile?.preferred_colors?.length 
    ? [...new Set([...styleProfile.preferred_colors, ...basePalette])].slice(0, 5)
    : basePalette;

  const glowScore = 90 + (Math.floor(Math.random() * 10));

  return {
    glow_score: glowScore,
    look_direction: `${modifiers.energy_mode || 'Natural'} energy tailored for your ${modifiers.date_type || momentType}.`,
    why_it_works: {
      harmony: "The palette complements your skin's natural undertones while the silhouette balances your frame.",
      psychology: "This specific color combination signals confidence and approachability in social settings."
    },
    avoid_tonight: [
      "Over-accessorizing: Keep it to one statement piece.",
      "Heavy matte base: Opt for a natural glow in this lighting.",
      "Oversized layers: Maintain a clean silhouette for this venue."
    ],
    makeup_grooming: {
      focus: isWoman ? "Radiant Skin & Defined Eyes" : "Clean Grooming & Scent",
      intensity: modifiers.energy_mode === 'Magnetic Bold' ? "High" : "Medium-Natural",
      steps: isWoman 
        ? ["Prep with hydrating primer", "Soft wing liner", "Nude satin lip"]
        : ["Exfoliate", "Lightweight moisturizer", "Clean beard lines"],
      finish: "Satin-Dewy"
    },
    styling: {
      title: "Curated Selection",
      options: [
        {
          title: modifiers.energy_mode || "Soft Magnetic",
          silhouette: "Structured top with flowing bottom for balanced movement.",
          palette: finalPalette,
          avoid: ['Neon', 'Harsh Grey'],
          tag: 'New Combo'
        }
      ]
    },
    hair_covering: {
      title: isCovered ? "Covering Harmony" : "Hair Direction",
      direction: "Soft volume with face-framing layers.",
      dos: ["Natural part", "Soft waves"],
      donts: ["Tight styles", "Excessive product"]
    },
    presence: {
      entrance: "3-second pause, soft smile, lead with your heart center.",
      posture: ["Shoulders down", "Chin neutral", "Open stance"],
      eye_contact: "Warm 3-second hold.",
      calm_technique: "4-7-8 breathing."
    },
    confidence_coach: {
      posture: "Imagine a string pulling you up from the crown of your head.",
      breathing: "Deep belly breaths to lower cortisol.",
      mindset: "You are the energy you want to attract."
    }
  };
};