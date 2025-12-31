
import { GoogleGenAI, Type } from "@google/genai";
import { TransitPhoto } from "../types";

export const fetchPhotoOfTheMonth = async (): Promise<TransitPhoto> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Generate Metadata specifically for BC Transit 9528
  const metadataResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Provide metadata for a 'Member's Photo of the Month'. The member is Aurora Rose. The subject is: BC Transit 9528, a Former Alexander Dennis Demonstration Alexander Dennis E500. Location: Heading North on Douglas, 95 Blink to Langford at Douglas & Burdett. Ensure the title reflects the vehicle model and fleet number.",
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

  // 2. Generate Image matching the user's provided photo characteristics
  const imagePrompt = `A professional transit photograph of a BC Transit double-decker bus, fleet number 9528, which is an Alexander Dennis Enviro500 (E500). The destination sign displays '95 RAPIDBUS'. The bus is heading North on Douglas Street at the intersection of Burdett Avenue in Victoria, BC. Bright sunny day with blue sky and soft clouds. Modern city background with historical buildings. High-resolution, sharp focus, 35mm lens style.`;

  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: imagePrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  let imageUrl = "https://picsum.photos/1200/675";
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    ...metadata,
    imageUrl
  };
};
