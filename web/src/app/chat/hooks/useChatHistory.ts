import { useState, useEffect } from 'react';
import { Message } from '../types';

const STORAGE_KEY = 'aido-chat-history';

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '您好！我是 AIDO AI 助手，有什么可以帮助您的吗？',
      timestamp: new Date(),
    }
  ]);

  // 从 localStorage 加载聊天历史
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as (Omit<Message, 'timestamp'> & { timestamp: string })[];
          const messagesWithDates = parsed.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(messagesWithDates);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // 保存聊天历史到 localStorage
  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  };

  // 添加消息
  const addMessage = (message: Message) => {
    const newMessages = [...messages, message];
    saveMessages(newMessages);
  };

  // 清除聊天历史
  const clearHistory = () => {
    const initialMessage: Message = {
      id: '1',
      type: 'ai',
      content: '您好！我是 AIDO AI 助手，有什么可以帮助您的吗？',
      timestamp: new Date(),
    };
    saveMessages([initialMessage]);
  };

  return {
    messages,
    addMessage,
    clearHistory,
    setMessages: saveMessages,
  };
}
