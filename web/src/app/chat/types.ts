export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  audioUrl?: string; // 语音消息的音频 URL
  duration?: number; // 语音消息时长（秒）
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface AIResponse {
  content: string;
  error?: string;
}
