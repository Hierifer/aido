import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isVoiceMessage = message.content.startsWith('[语音消息');
  const audioUrl = message.audioUrl;

  return (
    <div
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.type === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        }`}
      >
        {/* 语音消息 */}
        {isVoiceMessage && audioUrl ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{message.content}</span>
            </div>
            <audio
              controls
              src={audioUrl}
              className="w-full h-8"
              style={{ maxWidth: '200px' }}
            />
          </div>
        ) : (
          /* 文本消息 */
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
        
        <p className="text-xs mt-1 opacity-70">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
