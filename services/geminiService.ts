
import { GoogleGenAI, Type } from "@google/genai";
import { TransitPhoto } from "../types";

export const fetchPhotoOfTheMonth = async (): Promise<TransitPhoto> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // 1. Generate Metadata
    const metadataResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide metadata for a 'Member's Photo of the Month' for the Transit Museum Society. Member: Aurora Rose. Subject: BC Transit 9528 (Alexander Dennis E500). Location: Douglas & Burdett, Victoria, BC. Year: 2024.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            year: { type: Type.STRING },
            location: { type: Type.STRING },
            member: { type: Type.STRING },
          },
          required: ["title", "year", "location", "member"]
        }
      }
    });

    const metadata = JSON.parse(metadataResponse.text || "{}");

    // 2. Generate Image
    const imagePrompt = `A stunning professional transit photograph of a BC Transit double-decker bus, fleet number 9528, Alexander Dennis E500. Destination sign '95 RAPIDBUS'. Driving through downtown Victoria BC. Bright daylight, cinematic lighting, 8k resolution.`;

    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    let imageUrl = "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200"; // Fallback
    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    return { ...metadata, imageUrl };
  } catch (error) {
    console.error("Gemini Fetch Error:", error);
    throw error;
  }
};
