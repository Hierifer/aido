import { useState, useRef, useCallback } from 'react';

export interface VoiceRecordingState {
  isRecording: boolean;
  audioData: Blob | null;
  duration: number;
  error: string | null;
}

export function useVoiceRecording() {
  const [state, setState] = useState<VoiceRecordingState>({
    isRecording: false,
    audioData: null,
    duration: 0,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('您的浏览器不支持录音功能');
      }

      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      // 检查 MediaRecorder 支持
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        console.warn('WebM 格式不支持，使用默认格式');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4',
      });

      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        setState(prev => ({
          ...prev,
          audioData: audioBlob,
          isRecording: false,
        }));
        
        // 停止所有音频轨道
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setState(prev => ({
          ...prev,
          error: '录音过程中发生错误',
          isRecording: false,
        }));
      };

      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      
      // 开始录音
      mediaRecorder.start(100); // 每100ms收集一次数据
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        error: null,
        duration: 0,
      }));

      // 开始计时
      durationIntervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }, 1000);

    } catch (error) {
      console.error('开始录音失败:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '无法访问麦克风',
        isRecording: false,
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  const clearRecording = useCallback(() => {
    setState({
      isRecording: false,
      audioData: null,
      duration: 0,
      error: null,
    });
    audioChunksRef.current = [];
  }, []);

  // 获取音频文件的 URL
  const getAudioUrl = useCallback(() => {
    if (state.audioData) {
      return URL.createObjectURL(state.audioData);
    }
    return null;
  }, [state.audioData]);

  // 转换为 base64
  const getAudioBase64 = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!state.audioData) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // 移除 data:audio/webm;base64, 前缀
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(state.audioData);
    });
  }, [state.audioData]);

  return {
    ...state,
    startRecording,
    stopRecording,
    clearRecording,
    getAudioUrl,
    getAudioBase64,
  };
}
