import { VoiceRecorder } from './VoiceRecorder';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onVoiceSend?: (audioData: Blob, duration: number) => void;
  isLoading: boolean;
  showVoiceRecorder?: boolean;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onVoiceSend,
  isLoading,
  showVoiceRecorder = true
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleVoiceRecorded = (audioData: Blob, duration: number) => {
    onVoiceSend?.(audioData, duration);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="flex space-x-3">
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的消息..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            disabled={isLoading}
          />
        </div>
        
        {/* 语音录音组件 */}
        {showVoiceRecorder && onVoiceSend && (
          <VoiceRecorder
            onVoiceRecorded={handleVoiceRecorded}
            disabled={isLoading}
          />
        )}
        
        <button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            '发送'
          )}
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        按 Enter 发送，Shift + Enter 换行{showVoiceRecorder && ' • 按住麦克风录音'}
      </div>
    </div>
  );
}
