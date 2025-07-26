'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ChatHeader } from './components/ChatHeader';
import ASRVoiceRecorder from './components/ASRVoiceRecorder';
import { aiService } from './services/aiService';
import { useChatHistory } from './hooks/useChatHistory';
// import { useWebSocket } from './hooks/useWebSocket';

export default function ChatPage() {
  const { messages, addMessage, clearHistory } = useChatHistory();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket 处理函数 (暂时注释掉)
  /*
  const handleMessageReceived = (message: Message) => {
    addMessage(message);
  };

  const handleTypingChange = (isTyping: boolean, userId?: string) => {
    if (userId) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    }
  };
  */

  // 初始化 WebSocket (暂时注释掉)
  /*
  const {
    connected,
    connecting,
    error: wsError,
    onlineUsers,
    connect,
    sendMessage,
    sendTyping,
    sendVoiceMessage,
  } = useWebSocket({
    onMessageReceived: handleMessageReceived,
    onTypingChange: handleTypingChange,
  });
  */

  // 临时模拟 WebSocket 状态
  const connected = false;
  const connecting = false;
  const wsError = null;
  const onlineUsers = 0;
  const connect = () => {};
  // const sendMessage = () => {};
  // const sendTyping = () => {};
  // const sendVoiceMessage = () => {};

  const connectionState = {
    connected,
    connecting,
    error: wsError,
    onlineUsers,
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    // 如果 WebSocket 连接，通过 WebSocket 发送 (暂时注释掉)
    /*
    if (connected) {
      sendMessage(userMessage);
    } else {
      // 否则添加到本地消息列表
      addMessage(userMessage);
    }
    */
    
    // 暂时直接添加到本地消息列表
    addMessage(userMessage);

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // 如果没有 WebSocket 连接，使用本地 AI 服务
      if (!connected) {
        const aiResponse = await aiService.getResponse(currentInput);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        };

        addMessage(aiMessage);
      }
      // 如果有 WebSocket 连接，AI 响应会通过 WebSocket 接收
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理语音消息
  const handleVoiceSend = async (audioData: Blob, duration: number) => {
    const voiceMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `[语音消息 ${duration}秒]`,
      timestamp: new Date(),
      audioUrl: URL.createObjectURL(audioData),
      duration,
    };

    // 如果 WebSocket 连接，通过 WebSocket 发送语音消息 (暂时注释掉)
    /*
    if (connected) {
      sendVoiceMessage(audioData, duration);
    } else {
      // 否则添加到本地消息列表
      addMessage(voiceMessage);
      
      // 模拟 AI 对语音消息的响应
      setIsLoading(true);
      try {
        const aiResponse = await aiService.getResponse(`用户发送了一条${duration}秒的语音消息`);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date(),
        };

        addMessage(aiMessage);
      } catch (error) {
        console.error('Error getting AI response for voice:', error);
      } finally {
        setIsLoading(false);
      }
    }
    */
    
    // 暂时直接添加到本地消息列表
    addMessage(voiceMessage);
    
    // 模拟 AI 对语音消息的响应
    setIsLoading(true);
    try {
      const aiResponse = await aiService.getResponse(`用户发送了一条${duration}秒的语音消息`);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('Error getting AI response for voice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理语音识别的文本发送
  const handleASRTextSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsLoading(true);

    try {
      const aiResponse = await aiService.getResponse(text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 输入变化时发送打字状态 (暂时注释掉 WebSocket 部分)
  const handleInputChange = (value: string) => {
    setInput(value);
    
    /*
    if (connected) {
      sendTyping(value.length > 0);
    }
    */
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <ChatHeader 
        connectionState={connectionState}
        onReconnect={connect}
      />

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Controls */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              对话历史将自动保存 {/* {connected && '• 实时同步'} */}
            </div>
            <button
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-600 transition-colors"
            >
              清除历史
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* 显示其他用户正在输入 (暂时注释掉，因为没有 WebSocket) */}
            {/*
            {typingUsers.size > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {typingUsers.size === 1 ? '对方正在输入...' : `${typingUsers.size} 人正在输入...`}
                    </span>
                  </div>
                </div>
              </div>
            )}
            */}
            
            {/* Loading indicator */}
            {isLoading && <LoadingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* ASR Voice Recorder */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <ASRVoiceRecorder 
              onSendMessage={handleASRTextSend}
              disabled={isLoading}
            />
          </div>

          {/* Input Area */}
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSend={handleSend}
            onVoiceSend={handleVoiceSend}
            isLoading={isLoading}
            showVoiceRecorder={true}
          />
        </div>
      </div>
    </div>
  );
}
