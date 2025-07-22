import { WebSocketState } from '../hooks/useWebSocket';

interface ConnectionStatusProps {
  state: WebSocketState;
  onReconnect?: () => void;
}

export function ConnectionStatus({ state, onReconnect }: ConnectionStatusProps) {
  if (state.connected) {
    return (
      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm">
          已连接 {state.onlineUsers > 0 && `(${state.onlineUsers} 人在线)`}
        </span>
      </div>
    );
  }

  if (state.connecting) {
    return (
      <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
        <span className="text-sm">连接中...</span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-sm">{state.error}</span>
        {onReconnect && (
          <button
            onClick={onReconnect}
            className="text-xs bg-red-100 dark:bg-red-900 px-2 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            重试
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span className="text-sm">离线</span>
    </div>
  );
}
