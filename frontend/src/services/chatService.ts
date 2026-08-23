/**
 * Service/API Layer for MannMitra Chatbot Integration
 *
 * Provides stateless multi-turn conversation and mood routing with the backend API.
 */
import type { Mood } from '../types/content';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ChatApiRequest {
  messages: ChatMessage[];
}

export interface ChatApiResponse {
  reply: string;
  mood: Mood | null;
  confidence: number;
  ready_to_route: boolean;
  crisis: boolean;
}

export class ChatServiceError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ChatServiceError';
    this.statusCode = statusCode;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

/**
 * Sends conversation history to the backend chat endpoint.
 *
 * @param messages Full array of conversation messages so far.
 * @returns Promise resolving to the typed ChatApiResponse.
 * @throws ChatServiceError if the request fails or returns a non-200 status.
 */
export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatApiResponse> {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new ChatServiceError('Messages array must not be empty');
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Network error';
    throw new ChatServiceError(`Chat network request failed: ${errorMsg}`);
  }

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errBody = await response.json();
      errorDetails = errBody.error || response.statusText;
    } catch {
      errorDetails = response.statusText;
    }
    throw new ChatServiceError(`Chat service error (${response.status}): ${errorDetails}`, response.status);
  }

  try {
    const data: ChatApiResponse = await response.json();
    return data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Malformed response JSON';
    throw new ChatServiceError(`Failed to parse chat service response: ${errorMsg}`);
  }
}
