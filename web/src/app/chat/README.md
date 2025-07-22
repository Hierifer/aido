# AIDO AI 对话模块

这是一个完整的 AI 对话系统，基于 Next.js 和 React 构建，提供了现代化的聊天界面、语音录音和实时通信功能。

## 功能特性

### 🚀 核心功能
- **实时对话**: 支持用户与 AI 助手的实时对话
- **语音录音**: 支持录制和发送语音消息
- **WebSocket 连接**: 实时双向通信，支持多用户协作
- **历史记录**: 自动保存和恢复聊天历史
- **响应式设计**: 适配桌面和移动设备
- **深色模式**: 支持浅色/深色主题切换

### 💡 交互特性
- **快捷发送**: 支持 Enter 键快速发送消息
- **换行输入**: Shift + Enter 进行换行
- **语音录制**: 按住麦克风按钮录音，松开发送
- **语音播放**: 支持播放接收到的语音消息
- **打字指示**: 实时显示其他用户的打字状态
- **在线状态**: 显示连接状态和在线用户数
- **加载状态**: 美观的加载动画指示器
- **时间戳**: 显示消息发送时间

### 🛠️ 技术特性
- **模块化设计**: 组件化架构，易于维护和扩展
- **TypeScript**: 完整的类型安全支持
- **本地存储**: 使用 localStorage 持久化聊天记录
- **WebSocket**: 基于 Socket.IO 的实时通信
- **Web API**: 使用 MediaRecorder API 进行语音录制
- **自动重连**: WebSocket 断线自动重连机制
- **错误处理**: 完善的错误处理和用户反馈

## 项目结构

```
web/src/app/chat/
├── page.tsx                    # 主聊天页面
├── types.ts                    # 类型定义
├── components/                 # 组件目录
│   ├── MessageBubble.tsx       # 消息气泡组件
│   ├── ChatInput.tsx           # 输入组件
│   ├── ChatHeader.tsx          # 聊天头部
│   ├── LoadingIndicator.tsx    # 加载指示器
│   ├── VoiceRecorder.tsx       # 语音录音组件
│   └── ConnectionStatus.tsx    # 连接状态组件
├── hooks/                      # 自定义 Hooks
│   ├── useChatHistory.ts       # 聊天历史管理
│   ├── useVoiceRecording.ts    # 语音录音功能
│   └── useWebSocket.ts         # WebSocket 连接管理
└── services/                   # 服务层
    └── aiService.ts            # AI 服务接口

web/src/app/api/
├── chat/
│   └── route.ts                # 聊天 API 路由
└── websocket/
    └── route.ts                # WebSocket 服务器
```

## 快速开始

### 1. 环境配置
创建 `.env.local` 文件并配置：
```env
# WebSocket 服务器配置
NEXT_PUBLIC_WS_URL=ws://localhost:3001
WS_PORT=3001
```

### 2. 启动服务
```bash
# 启动 Next.js 开发服务器
npm run dev

# WebSocket 服务器会自动启动在 3001 端口
```

### 3. 访问聊天页面
在浏览器中访问 `/chat` 路径即可开始使用 AI 对话功能。

### 4. 功能使用

#### 文本消息
- 在输入框中输入您的消息
- 按 Enter 键或点击"发送"按钮
- AI 会自动回复您的消息

#### 语音消息
- 点击并按住麦克风按钮开始录音
- 松开按钮停止录音
- 预览录音后点击发送按钮

#### 实时功能
- 如果 WebSocket 连接成功，支持实时双向通信
- 可以看到其他用户的打字状态
- 显示在线用户数量

### 5. 管理历史
- 聊天记录会自动保存到浏览器本地存储
- 刷新页面后聊天记录会自动恢复
- 点击"清除历史"可以重置对话

## 自定义配置

### 集成真实 AI API

修改 `services/aiService.ts` 中的 `callAI` 方法：

```typescript
async callAI(message: string): Promise<AIResponse> {
  try {
    // 替换为您的 AI API 端点
    const response = await fetch('YOUR_AI_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY', // 如需要
      },
      body: JSON.stringify({ 
        message,
        // 其他 API 参数
      }),
    });

    const data = await response.json();
    return { content: data.response };
  } catch (error) {
    // 错误处理
    throw error;
  }
}
```

### 配置语音录音

语音录音功能基于 Web MediaRecorder API，支持以下配置：

```typescript
// 在 useVoiceRecording hook 中自定义录音参数
const stream = await navigator.mediaDevices.getUserMedia({ 
  audio: {
    echoCancellation: true,    // 回声消除
    noiseSuppression: true,    // 噪音抑制
    autoGainControl: true,     // 自动增益控制
    sampleRate: 44100,         // 采样率
    channelCount: 1,           // 声道数（单声道）
  } 
});
```

### 配置 WebSocket 连接

修改 WebSocket 连接参数：

```typescript
// 在 useWebSocket hook 中配置连接选项
const socket = io(WEBSOCKET_URL, {
  transports: ['websocket', 'polling'],
  timeout: 10000,                    // 连接超时
  reconnection: true,                // 自动重连
  reconnectionAttempts: 5,           // 重连次数
  reconnectionDelay: 1000,           // 重连延迟
});
```

### 环境变量配置

在 `.env.local` 中设置：

```env
# WebSocket 服务器
NEXT_PUBLIC_WS_URL=ws://localhost:3001
WS_PORT=3001

# AI API 配置（可选）
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_API_KEY=your_api_key_here

# 语音功能配置（可选）
VOICE_API_URL=https://speech-api.example.com
VOICE_API_KEY=your_voice_api_key
```

### 自定义样式

所有组件都使用 Tailwind CSS 进行样式设置，您可以：

1. 修改组件中的 className 来调整样式
2. 在 `globals.css` 中添加自定义 CSS
3. 配置 Tailwind 主题来修改颜色方案

### 扩展功能

#### 添加语音识别
集成语音转文本功能：

```typescript
// 使用 Web Speech API
const recognition = new (window as any).webkitSpeechRecognition();
recognition.onresult = (event: any) => {
  const transcript = event.results[0][0].transcript;
  // 处理识别结果
};
```

#### 添加语音合成
为 AI 回复添加语音播放：

```typescript
// 使用 Web Speech Synthesis API
const utterance = new SpeechSynthesisUtterance(message.content);
speechSynthesis.speak(utterance);
```

#### 添加文件上传
在 `ChatInput` 组件中添加文件上传功能：

```typescript
const handleFileUpload = (file: File) => {
  // 处理文件上传逻辑
  const formData = new FormData();
  formData.append('file', file);
  
  // 发送到服务器
  fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
};
```

#### 添加表情符号
集成表情符号选择器：

```typescript
// 使用 emoji-picker-react 库
import EmojiPicker from 'emoji-picker-react';

const onEmojiClick = (emojiObject: any) => {
  setInput(prev => prev + emojiObject.emoji);
};
```

#### 添加代码高亮
集成代码语法高亮显示：

```typescript
// 在 MessageBubble 中添加代码块检测和高亮
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const renderCodeBlocks = (content: string) => {
  // 检测代码块并应用语法高亮
};
```

#### 添加消息回复功能
支持回复特定消息：

```typescript
interface Message {
  // 现有属性...
  replyTo?: string; // 回复的消息 ID
}

const handleReply = (messageId: string) => {
  // 设置回复目标
  setReplyingTo(messageId);
};
```

## API 文档

### HTTP API

#### POST /api/chat

发送消息给 AI 并获取响应。

**请求体:**
```json
{
  "message": "用户输入的消息"
}
```

**响应:**
```json
{
  "response": "AI 的回复内容",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/chat

获取 API 状态信息。

**响应:**
```json
{
  "message": "AIDO AI Chat API",
  "status": "online",
  "version": "1.0.0"
}
```

#### GET /api/websocket

启动或检查 WebSocket 服务器状态。

**响应:**
```json
{
  "message": "WebSocket 服务器已启动",
  "port": 3001,
  "connectedUsers": 5
}
```

### WebSocket 事件

#### 客户端发送事件

##### `message`
发送文本消息
```typescript
socket.emit('message', {
  id: 'unique_id',
  type: 'user',
  content: '消息内容',
  timestamp: new Date()
});
```

##### `voiceMessage`
发送语音消息
```typescript
socket.emit('voiceMessage', {
  message: {
    id: 'unique_id',
    type: 'user',
    content: '[语音消息 5秒]',
    timestamp: new Date()
  },
  audioData: 'base64_audio_data',
  duration: 5
});
```

##### `typing`
发送打字状态
```typescript
socket.emit('typing', {
  isTyping: true
});
```

#### 服务端发送事件

##### `message`
接收消息
```typescript
socket.on('message', (message) => {
  // 处理接收到的消息
});
```

##### `typing`
接收打字状态
```typescript
socket.on('typing', ({ isTyping, userId }) => {
  // 处理其他用户的打字状态
});
```

##### `userCount`
接收在线用户数
```typescript
socket.on('userCount', (count) => {
  // 更新在线用户数显示
});
```

##### 连接事件
```typescript
socket.on('connect', () => {
  console.log('已连接到服务器');
});

socket.on('disconnect', (reason) => {
  console.log('与服务器断开连接:', reason);
});

socket.on('connect_error', (error) => {
  console.error('连接错误:', error);
});
```

## 性能优化

### 1. 消息分页
对于长对话历史，考虑实现消息分页加载：

```typescript
const loadMoreMessages = async (page: number) => {
  // 分页加载历史消息
};
```

### 2. 响应缓存
缓存常见问题的 AI 响应：

```typescript
const responseCache = new Map<string, string>();

const getCachedResponse = (message: string) => {
  return responseCache.get(message);
};
```

### 3. 优化渲染
使用 React.memo 优化组件渲染：

```typescript
export const MessageBubble = React.memo(({ message }: MessageBubbleProps) => {
  // 组件内容
});
```

## 安全考虑

### 1. 数据安全
- **输入验证**: 对用户输入进行适当的验证和清理
- **XSS 防护**: 防止跨站脚本攻击，使用 React 的内置保护
- **API 密钥**: 将 AI API 密钥存储在环境变量中，不要暴露在客户端

### 2. WebSocket 安全
- **身份验证**: 实现用户身份验证机制
- **速率限制**: 防止消息发送频率过高
- **连接验证**: 验证 WebSocket 连接的合法性
- **数据加密**: 在生产环境中使用 WSS (WebSocket Secure)

### 3. 语音功能安全
- **权限请求**: 明确请求和说明麦克风权限的用途
- **数据处理**: 语音数据应该安全处理，避免未授权访问
- **文件大小限制**: 限制语音文件的大小和时长
- **格式验证**: 验证音频文件格式的合法性

### 4. 隐私保护
- **数据最小化**: 只收集必要的用户数据
- **本地存储**: 聊天记录存储在本地，保护用户隐私
- **临时文件**: 及时清理临时音频文件
- **GDPR 合规**: 符合数据保护法规要求

### 5. 内容过滤
- **消息过滤**: 实现不当内容检测和过滤
- **AI 响应验证**: 对 AI 生成的内容进行安全检查
- **举报机制**: 提供用户举报功能

### 6. 生产环境建议
```env
# 使用 HTTPS 和 WSS
NEXT_PUBLIC_WS_URL=wss://your-domain.com
API_URL=https://your-api-domain.com

# 设置 CORS 策略
CORS_ORIGIN=https://your-frontend-domain.com

# 启用速率限制
RATE_LIMIT_MESSAGES_PER_MINUTE=30
RATE_LIMIT_VOICE_PER_MINUTE=10
```

## 故障排除

### 常见问题

#### 聊天功能
1. **聊天记录不保存**: 检查浏览器是否允许 localStorage
2. **AI 响应慢**: 检查网络连接和 API 状态
3. **样式异常**: 确保 Tailwind CSS 正确配置

#### 语音录音问题
1. **无法录音**: 
   - 检查浏览器是否支持 MediaRecorder API
   - 确认已授予麦克风权限
   - 检查麦克风硬件是否正常工作

2. **录音质量差**: 
   - 调整录音参数（采样率、降噪设置）
   - 检查环境噪音
   - 确保麦克风距离适当

3. **语音消息无法播放**:
   - 检查音频格式支持
   - 确认音频文件未损坏
   - 尝试刷新页面

#### WebSocket 连接问题
1. **无法连接 WebSocket**:
   - 检查服务器是否启动（端口 3001）
   - 确认防火墙设置
   - 检查网络连接
   - 验证 WebSocket URL 配置

2. **连接频繁断开**:
   - 检查网络稳定性
   - 调整重连参数
   - 查看浏览器控制台错误

3. **消息发送失败**:
   - 检查 WebSocket 连接状态
   - 验证消息格式
   - 查看服务器日志

#### 权限问题
1. **麦克风权限被拒绝**:
   - 在浏览器设置中允许麦克风访问
   - 清除站点权限并重新授权
   - 尝试使用 HTTPS 连接

2. **CORS 错误**:
   - 配置正确的 CORS 策略
   - 检查 API 端点设置
   - 确认域名配置

### 调试技巧

#### 开发者工具
1. **控制台调试**:
   ```javascript
   // 启用详细日志
   localStorage.setItem('debug', 'chat:*');
   
   // 检查 WebSocket 状态
   console.log('WebSocket state:', socket.readyState);
   
   // 监听所有 Socket.IO 事件
   socket.onAny((event, ...args) => {
     console.log('Socket event:', event, args);
   });
   ```

2. **网络面板**:
   - 检查 WebSocket 连接状态
   - 监控消息收发
   - 查看 HTTP 请求状态

3. **应用面板**:
   - 检查 localStorage 中的聊天记录
   - 查看权限设置
   - 清除缓存和数据

#### 日志记录
```typescript
// 启用详细日志
const DEBUG = process.env.NODE_ENV === 'development';

const log = (level: string, message: string, data?: any) => {
  if (DEBUG) {
    console[level](`[Chat] ${message}`, data);
  }
};
```

#### 测试工具
1. **WebSocket 测试**:
   ```bash
   # 使用 wscat 测试 WebSocket 连接
   npm install -g wscat
   wscat -c ws://localhost:3001
   ```

2. **麦克风测试**:
   - 使用浏览器的音频测试页面
   - 检查系统音频设置
   - 测试其他录音应用

### 性能优化

#### 内存管理
```typescript
// 清理音频 URL
useEffect(() => {
  return () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };
}, [audioUrl]);
```

#### 连接优化
```typescript
// 减少重连频率
const reconnectDelay = Math.min(1000 * Math.pow(2, attempts), 30000);
```

#### 消息优化
```typescript
// 批量处理消息
const batchMessages = useMemo(() => {
  return messages.slice(-100); // 只显示最近100条
}, [messages]);
```

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个 AI 对话模块！

## 许可证

MIT License
