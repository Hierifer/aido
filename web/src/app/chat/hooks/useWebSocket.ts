import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

export interface WebSocketState {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  onlineUsers: number;
}

export interface WebSocketHookProps {
  onMessageReceived?: (message: Message) => void;
  onTypingChange?: (isTyping: boolean, userId?: string) => void;
  onUserCountChange?: (count: number) => void;
}

export function useWebSocket({ 
  onMessageReceived, 
  onTypingChange, 
  onUserCountChange 
}: WebSocketHookProps = {}) {
  const [state, setState] = useState<WebSocketState>({
    connected: false,
    connecting: false,
    error: null,
    onlineUsers: 0,
  });

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      // 创建 Socket.IO 连接
      const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        console.log('WebSocket 连接成功');
        setState(prev => ({
          ...prev,
          connected: true,
          connecting: false,
          error: null,
        }));
        reconnectAttempts.current = 0;
      });

      socket.on('disconnect', (reason) => {
        console.log('WebSocket 断开连接:', reason);
        setState(prev => ({
          ...prev,
          connected: false,
          connecting: false,
        }));

        // 自动重连
        if (reason === 'io server disconnect') {
          // 服务器主动断开，不自动重连
          setState(prev => ({
            ...prev,
            error: '服务器连接已断开',
          }));
        } else {
          // 网络问题等，尝试重连
          attemptReconnect();
        }
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket 连接错误:', error);
        setState(prev => ({
          ...prev,
          connected: false,
          connecting: false,
          error: '连接失败，请检查网络',
        }));
        attemptReconnect();
      });

      // 监听消息
      socket.on('message', (message: Message) => {
        onMessageReceived?.(message);
      });

      // 监听打字状态
      socket.on('typing', ({ isTyping, userId }: { isTyping: boolean; userId: string }) => {
        onTypingChange?.(isTyping, userId);
      });

      // 监听在线用户数
      socket.on('userCount', (count: number) => {
        setState(prev => ({ ...prev, onlineUsers: count }));
        onUserCountChange?.(count);
      });

      socketRef.current = socket;

    } catch (error) {
      console.error('创建 WebSocket 连接失败:', error);
      setState(prev => ({
        ...prev,
        connecting: false,
        error: '无法建立连接',
      }));
    }
  }, [onMessageReceived, onTypingChange, onUserCountChange]);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setState(prev => ({
        ...prev,
        error: '重连失败，请刷新页面',
      }));
      return;
    }

    reconnectAttempts.current++;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`尝试重连 (${reconnectAttempts.current}/${maxReconnectAttempts})`);
      connect();
    }, delay);
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setState({
      connected: false,
      connecting: false,
      error: null,
      onlineUsers: 0,
    });
  }, []);

  // 发送消息
  const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    if (socketRef.current?.connected) {
      const fullMessage: Message = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      socketRef.current.emit('message', fullMessage);
      return true;
    }
    return false;
  }, []);

  // 发送打字状态
  const sendTyping = useCallback((isTyping: boolean) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { isTyping });
    }
  }, []);

  // 发送语音消息
  const sendVoiceMessage = useCallback((audioData: Blob, duration: number) => {
    if (!socketRef.current?.connected) {
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `[语音消息 ${duration}秒]`,
        timestamp: new Date(),
      };

      socketRef.current?.emit('voiceMessage', {
        message: voiceMessage,
        audioData: base64Data,
        duration,
      });
    };
    reader.readAsDataURL(audioData);
    return true;
  }, []);

  // 组件挂载时连接
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    sendVoiceMessage,
  };
}
