import { v4 as uuidv4 } from 'uuid';

export interface ChatRequest {
  session_id: string;
  language: 'en' | 'hi';
  message: string;
  selected_category?: string;
}

export interface ChatResponse {
  category?: string;
  rights: string[];
  steps: string[];
  authority: {
    name: string;
    phone: string;
    website: string;
  };
  disclaimer: string;
  article_cited: string;
  model_used?: string;
  cache_hit?: boolean;
  retrieval_score?: number;
  sources_used?: {
    section: string;
    category: string;
  }[];
  fallback_reason?: string;
  error?: string;
}

export const generateSessionId = () => uuidv4();

const API_URL = 'https://7cx975g7qe.execute-api.us-east-1.amazonaws.com/prod/ask';

export const sendChatMessage = async (
  request: ChatRequest
): Promise<ChatResponse> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: request.message,
    }),
  });

  const data = await response.json();

  // Lambda proxy responses often return body as a JSON string
  const parsed =
    typeof data.body === 'string' ? JSON.parse(data.body) : data.body ?? data;

  if (!response.ok) {
    throw new Error(parsed?.error || 'Backend request failed');
  }

  if (parsed?.error) {
    throw new Error(parsed.error);
  }

  return parsed as ChatResponse;
};
