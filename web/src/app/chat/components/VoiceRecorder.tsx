import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface VoiceRecorderProps {
  onVoiceRecorded: (audioData: Blob, duration: number) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onVoiceRecorded, disabled }: VoiceRecorderProps) {
  const {
    isRecording,
    audioData,
    duration,
    error,
    startRecording,
    stopRecording,
    clearRecording,
    getAudioUrl,
  } = useVoiceRecording();

  const handleStartRecording = async () => {
    if (!isRecording) {
      await startRecording();
    }
  };

  const handleStopRecording = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const handleSendVoice = () => {
    if (audioData && duration > 0) {
      onVoiceRecorded(audioData, duration);
      clearRecording();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500 text-sm">
        <span>⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* 录音按钮 */}
      {!audioData && (
        <button
          onMouseDown={handleStartRecording}
          onMouseUp={handleStopRecording}
          onMouseLeave={handleStopRecording}
          onTouchStart={handleStartRecording}
          onTouchEnd={handleStopRecording}
          disabled={disabled}
          className={`p-2 rounded-full transition-all duration-200 ${
            isRecording
              ? 'bg-red-500 text-white scale-110 animate-pulse'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          } ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title={isRecording ? '松开停止录音' : '按住录音'}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {/* 录音中状态 */}
      {isRecording && (
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-red-500 rounded animate-pulse"></div>
            <div className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-4 bg-red-500 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-red-500 text-sm font-mono">
            {formatDuration(duration)}
          </span>
        </div>
      )}

      {/* 录音完成后的控制 */}
      {audioData && !isRecording && (
        <div className="flex items-center space-x-2">
          {/* 播放按钮 */}
          <audio
            controls
            src={getAudioUrl() || undefined}
            className="h-8"
            style={{ width: '200px' }}
          />
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDuration(duration)}
            </span>
            
            {/* 发送按钮 */}
            <button
              onClick={handleSendVoice}
              className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="发送语音"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </button>
            
            {/* 删除按钮 */}
            <button
              onClick={clearRecording}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="删除录音"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
