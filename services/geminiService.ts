import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // In a real app, use process.env.API_KEY. 
  // We assume the environment has this key or the user provides it.
  const apiKey = process.env.API_KEY; 
  if (!apiKey) {
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAiContent = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "No response generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message || "Failed to generate content."}`;
  }
};
