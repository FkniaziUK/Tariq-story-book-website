
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { Book, AgeRange, Genre, Character } from "../types";

// Helper to get fresh client instance using the pre-configured key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to strip data URL prefix for Gemini API
const parseDataUrl = (dataUrl: string) => {
  const [header, data] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
  return { data, mimeType };
};

export const checkApiKey = async (): Promise<boolean> => {
  // Always returns true as the key is expected to be present in the environment
  return true;
};

export const requestApiKey = async () => {
  // No-op: We are using the pre-attached key
};

export const generateCharacter = async (description: string, seedOffset: number = 0): Promise<string> => {
  const ai = getAI();
  const variation = seedOffset === 0 ? "facing front" : "in a dynamic pose";
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `High-end professional character design for a premium children's book. Character: ${description}. ${variation}. Full body, isolated on clean white background, master-grade digital watercolor illustration, vibrant colors, charming and friendly personality. 4K resolution, publishing quality.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "4K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const generateStory = async (config: {
  prompt: string,
  ageRange: AgeRange,
  genre: Genre,
  primaryLang: string,
  secondaryLang?: string,
  characterDesc: string,
  numPages: number
}): Promise<{ title: string, pages: { text1: string, text2?: string, imgPrompt: string }[] }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Write a ${config.numPages}-page children's story.
      Prompt: ${config.prompt}
      Age Range: ${config.ageRange}
      Genre: ${config.genre}
      Character: ${config.characterDesc}
      Primary Language: ${config.primaryLang}
      ${config.secondaryLang ? `Secondary Language (Bilingual): ${config.secondaryLang}` : ''}
      
      Return as JSON with title and an array of exactly ${config.numPages} pages. Each page has text1 (primary), text2 (secondary, if bilingual), and imgPrompt (descriptive visual for this specific scene).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text1: { type: Type.STRING },
                text2: { type: Type.STRING },
                imgPrompt: { type: Type.STRING }
              },
              required: ["text1", "imgPrompt"]
            }
          }
        },
        required: ["title", "pages"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generatePageImage = async (imgPrompt: string, characterRef: string): Promise<string> => {
  const ai = getAI();
  const { data, mimeType } = parseDataUrl(characterRef);
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: data,
            mimeType: mimeType
          }
        },
        { 
          text: `Consistent children's book illustration. Scene: ${imgPrompt}. MUST use the character provided in the image part. High-quality, detailed, watercolor style, soft lighting, 4K resolution.` 
        }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "4K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Page image generation failed");
};

export const generateWorksheet = async (book: Book): Promise<any> => {
  const ai = getAI();
  const storyText = book.pages.map(p => p.textPrimary).join('\n');
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Based on this story: "${storyText}", create an educational worksheet for age ${book.ageRange}. 
    Include 3 comprehension questions, 3 vocabulary words with definitions from context, and 1 creative writing prompt. 
    Format as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          comprehension: { type: Type.ARRAY, items: { type: Type.STRING } },
          vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
          writingPrompt: { type: Type.STRING }
        },
        required: ["comprehension", "vocabulary", "writingPrompt"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateAudio = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this story clearly and warmly for a child: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
};
