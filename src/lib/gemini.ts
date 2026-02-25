const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface WardrobeTags {
  category: string;
  color_tags: string[];
  style_tags: string[];
  season_tags: string[];
  notes: string;
}

export const analyzeWardrobeImage = async (base64Image: string): Promise<WardrobeTags> => {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key is missing");

  const prompt = `Analyze this clothing item and return a JSON object with these fields: 
  - category: (one of: top, bottom, dress, shoes, outerwear, accessory, headwear)
  - color_tags: (array of main colors)
  - style_tags: (array of styles like casual, corporate, date, night-out, minimal, chic)
  - season_tags: (array of seasons like spring, summer, fall, winter)
  - notes: (short description)
  Return ONLY the JSON object.`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: base64Image.split(',')[1] } }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};

export const generateLookPlan = async (context: any, wardrobe: any[], referenceImage?: string) => {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key is missing");

  const prompt = `You are Glowé Stylist. Based on the user's wardrobe and context, generate a style plan.
  Context: ${JSON.stringify(context)}
  Wardrobe Items: ${JSON.stringify(wardrobe.map(i => ({ id: i.id, category: i.category, colors: i.color_tags, styles: i.style_tags })))}
  
  Return a JSON object:
  {
    "recommended_outfits": [
      { "title": "Best Match", "item_ids": [], "notes": "Why this works", "accessories": [], "colors": [] },
      { "title": "Alternative", "item_ids": [], "notes": "A different vibe", "accessories": [], "colors": [] }
    ],
    "makeup_or_grooming": { "focus": "", "intensity": "", "tips": [] },
    "covering_or_hair": { "style": "", "notes": "" },
    "posture_presence": ["tip 1", "tip 2"],
    "why": "Overall rationale"
  }
  Return ONLY the JSON object.`;

  const parts: any[] = [{ text: prompt }];
  if (referenceImage) {
    parts.push({ inline_data: { mime_type: "image/jpeg", data: referenceImage.split(',')[1] } });
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts }] })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Gemini look generation failed:", error);
    throw error;
  }
};