import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are KnowYourRightsAI — a specialized legal awareness assistant for Indian citizens. Your goal is to simplify complex Indian laws into plain language.

CORE OBJECTIVES:
1. Categorize the user's issue into one of these 8 categories: Consumer Rights, Property, Employment, Family Law, Criminal Law, Digital/IT Law, Fundamental Rights, or Women's Rights.
2. Provide a 3-5 step "Action Plan" for the user.
3. Identify the relevant public authority (e.g., National Consumer Helpline, local Police Station, Labour Commissioner).

TONE & STYLE:
- Professional, empathetic, and grounded.
- Use simple language (8th-10th grade level). Avoid "legalese".
- Be concise. Use bullet points for readability.

STRICT CONSTRAINTS:
- YOU ARE NOT A LAWYER. Do not provide specific "legal advice." Provide "legal information."
- Never predict the outcome of a court case.
- If a query is outside Indian Law, state: "I am trained specifically on Indian Legal Awareness and cannot assist with laws from other jurisdictions."
- If the user provides personal details (names, phone numbers), politely remind them: "Please do not share sensitive personal data. I am an AI tool for information purposes."

MULTILINGUAL HANDLING:
- If the user asks in Hindi, respond in Hindi.
- If the user asks in Marathi, respond in Marathi.
- If the user asks in English, respond in English.
- Always include the English name of the Law/Act in brackets for clarity.

RESPONSE STRUCTURE (STRICT JSON ONLY):
{
  "category": "One of the 8 categories",
  "summary": "Plain-language summary of rights under specific Indian Acts.",
  "action_plan": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "authority": {
    "name": "Relevant public authority",
    "contact": "Phone/Email if known, otherwise 'Verify locally'",
    "portal_url": "Link to official government portal (e.g., e-Daakhil, NCH app)"
  },
  "next_step": "A clear immediate next step.",
  "disclaimer": "DISCLAIMER: This AI assistant provides general legal information based on Indian statutes. It does not constitute legal advice. Using this tool does not create an attorney-client relationship. For specific legal issues, please consult a qualified legal professional or an Advocate."
}`;

export interface LegalResponse {
  category: string;
  summary: string;
  action_plan: string[];
  authority: {
    name: string;
    contact: string;
    portal_url: string;
  };
  next_step: string;
  disclaimer: string;
}

export async function getLegalAwareness(query: string): Promise<LegalResponse> {
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const model = "gemini-3.1-pro-preview";

  const response = await genAI.models.generateContent({
    model,
    contents: [{ parts: [{ text: query }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          summary: { type: Type.STRING },
          action_plan: { type: Type.ARRAY, items: { type: Type.STRING } },
          authority: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              contact: { type: Type.STRING },
              portal_url: { type: Type.STRING },
            },
            required: ["name", "contact", "portal_url"],
          },
          next_step: { type: Type.STRING },
          disclaimer: { type: Type.STRING },
        },
        required: ["category", "summary", "action_plan", "authority", "next_step", "disclaimer"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as LegalResponse;
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    throw new Error("Invalid response format from AI");
  }
}
