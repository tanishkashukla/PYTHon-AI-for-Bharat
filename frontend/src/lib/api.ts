import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "KnowYourRightsAI", a specialized legal awareness assistant for Indian citizens.
Your goal is to simplify complex Indian laws into plain language.

Core Objectives:
1. Categorize the user's issue into one of these categories: Consumer Rights, Property & Housing, Employment & Labour, Family Matters, Documents & Certificates, Government Services, Healthcare, Criminal Law, Cyber Law, Women's Rights, Motor Vehicle Act, Senior Citizen Rights, Education Law, Tax Law, or General.
2. Provide a 3-5 step "Action Plan" for the user.
3. Identify the relevant public authority (e.g., National Consumer Helpline, local Police Station, Labour Commissioner).

Tone & Style:
- Professional, empathetic, and grounded.
- Use simple English or Hindi as requested. Avoid "legalese".
- Be concise. Use bullet points for readability.

Strict Constraints:
- YOU ARE NOT A LAWYER. Do not provide specific "legal advice." Provide "legal information."
- Never predict the outcome of a court case.
- If a query is outside Indian Law, state you cannot assist.
`;

export interface ChatRequest {
  session_id: string;
  language: 'en' | 'hi';
  message: string;
  selected_category?: string;
}

export interface ChatResponse {
  category: string;
  rights: string[];
  steps: string[];
  authority: {
    name: string;
    phone: string;
    website: string;
  };
  disclaimer: string;
  article_cited: string;
  audio_url?: string;
}

export const generateSessionId = () => uuidv4();

export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: request.message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `\nRespond in ${request.language === 'hi' ? 'Hindi' : 'English'}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            rights: { type: Type.ARRAY, items: { type: Type.STRING } },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            authority: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                phone: { type: Type.STRING },
                website: { type: Type.STRING }
              },
              required: ["name", "phone", "website"]
            },
            disclaimer: { type: Type.STRING },
            article_cited: { type: Type.STRING }
          },
          required: ["category", "rights", "steps", "authority", "disclaimer", "article_cited"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error('Gemini Error:', error);
    // If the error indicates an invalid key, we can throw a specific error
    if (error.message?.includes("API key not valid") || error.message?.includes("API_KEY_INVALID")) {
      throw new Error("GEMINI_API_KEY_INVALID");
    }
    throw error;
  }
};
