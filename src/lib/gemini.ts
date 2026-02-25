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