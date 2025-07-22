import { ConnectionStatus } from './ConnectionStatus';
import { WebSocketState } from '../hooks/useWebSocket';

interface ChatHeaderProps {
  connectionState?: WebSocketState;
  onReconnect?: () => void;
}

export function ChatHeader({ connectionState, onReconnect }: ChatHeaderProps = {}) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                AIDO AI 助手
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                智能对话助手 {connectionState && '• 实时连接'}
              </p>
            </div>
          </div>
          
          {/* 连接状态 */}
          {connectionState ? (
            <ConnectionStatus 
              state={connectionState} 
              onReconnect={onReconnect}
            />
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">本地模式</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
