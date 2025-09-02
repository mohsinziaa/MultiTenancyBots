export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: {
    industry?: string;
    service?: string;
    location?: string;
    systemPrompt?: string;
  };
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  suggestions?: string[];
  confidence?: number;
}

export interface ChatConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}
