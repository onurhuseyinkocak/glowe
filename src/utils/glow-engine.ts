export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond' | 'Oblong';
export type HairCoverage = 'visible' | 'partial' | 'covered' | 'unspecified';

export interface MomentPlan {
  look_direction: string;
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
  checklist: {
    task: string;
    how: string;
  }[];
  glow_score: number;
}

export const generateGlowPlan = (
  baseline: any,
  momentType: string,
  modifiers: any
): MomentPlan => {
  const isWoman = baseline?.identity === 'Woman' || baseline?.identity === 'Non-binary';
  const isCovered = baseline?.hair_coverage !== 'visible';
  
  const seed = ((momentType?.length || 0) + (baseline?.identity?.length || 0)) % 10;
  const glowScore = 88 + seed;

  // First Date Logic
  if (momentType.includes('date')) {
    return {
      glow_score: glowScore,
      look_direction: "Soft, approachable magnetic energy with elevated textures.",
      makeup_grooming: {
        focus: isWoman ? "Radiant Skin & Soft Eyes" : "Clean Grooming & Scent",
        intensity: "Medium-Natural",
        steps: isWoman 
          ? ["Apply dewy base for natural glow", "Soft brown liner for eye definition", "Tinted balm for approachable lips"]
          : ["Exfoliate 2 hours before", "Apply lightweight moisturizer", "Clean beard lines or close shave"],
        finish: "Satin-Dewy"
      },
      styling: {
        title: "Outfit Direction",
        options: [
          {
            title: "Soft Magnetic",
            silhouette: "Flowing fabrics with one structured element.",
            palette: ['#E8D5D8', '#F5F0E1', '#4A3F3F', '#FFFFFF', '#D1C4E9'],
            avoid: ['Neon Yellow', 'Harsh Grey']
          },
          {
            title: "Clean & Elevated",
            silhouette: "Monochrome layers with premium knitwear.",
            palette: ['#FFFFFF', '#BCAEAE', '#4A3F3F', '#FCE4EC', '#E0F2F1'],
            avoid: ['Distressed Denim', 'Graphic Tees']
          }
        ]
      },
      hair_covering: {
        title: isCovered ? "Covering Harmony" : "Hair Direction",
        direction: isCovered ? "Soft draping with silk-blend fabric." : "Natural texture with soft volume.",
        dos: isCovered ? ["Use undercap for volume", "Match fabric to skin undertone"] : ["Soft waves", "Natural part"],
        donts: isCovered ? ["Harsh pins", "Clashing patterns"] : ["Excessive hairspray", "Tight ponytails"]
      },
      presence: {
        entrance: "3-second pause at the door, soft smile, shoulders back.",
        posture: ["Chin parallel to floor", "Hands visible, not crossed", "Lean in slightly when listening"],
        eye_contact: "Soft 3-second hold, then look away naturally.",
        calm_technique: "4-7-8 breathing for 3 cycles before entering."
      },
      checklist: [
        { task: "Steam outfit", how: "Ensure zero wrinkles for a polished first impression." },
        { task: "Set hair/covering", how: "Check structure in natural light." },
        { task: "Apply glow base", how: "Focus on high points of the face." },
        { task: "Signature accessory", how: "Choose one piece that tells a story." },
        { task: "Final mirror check", how: "Shoulders down, chin neutral, deep breath." }
      ]
    };
  }

  // Default Fallback (Job Interview style)
  return {
    glow_score: glowScore,
    look_direction: "Structured, confident professional silhouette.",
    makeup_grooming: {
      focus: "Polished & Neutral",
      intensity: "Minimal-Professional",
      steps: ["Matte base for camera-ready skin", "Neutral eye palette", "Defined brows"],
      finish: "Matte-Satin"
    },
    styling: {
      title: "Professional Framing",
      options: [
        {
          title: "Power Neutral",
          silhouette: "Tailored blazer or structured dress.",
          palette: ['#4A3F3F', '#FFFFFF', '#BCAEAE', '#E0F2F1', '#F5F0E1'],
          avoid: ['Bright Red', 'Large Prints']
        }
      ]
    },
    hair_covering: {
      title: "Clean Lines",
      direction: "Sleek and controlled framing.",
      dos: ["Tame flyaways", "Secure wrap structure"],
      donts: ["Messy buns", "Loose strands"]
    },
    presence: {
      entrance: "Firm stride, immediate eye contact, warm greeting.",
      posture: ["Sit tall, back off the chair", "Feet flat on floor", "Open palm gestures"],
      eye_contact: "Direct and engaged, 70/30 rule.",
      calm_technique: "Box breathing (4-4-4-4) for 2 minutes."
    },
    checklist: [
      { task: "Check lighting", how: "If virtual, ensure light is facing you." },
      { task: "Minimal jewelry", how: "One small pair of earrings or a watch." },
      { task: "Voice warm-up", how: "Humming scale for 30 seconds to clear tone." }
    ]
  };
};