import { Server } from 'socket.io';
import { createServer } from 'http';

// 定义连接用户类型
interface ConnectedUser {
  id: string;
  connectedAt: Date;
}

// 全局变量存储 Socket.IO 服务器实例
let io: Server;

// 存储连接的用户
const connectedUsers = new Map<string, ConnectedUser>();

export async function GET() {
  if (!io) {
    // 创建 Socket.IO 服务器
    const httpServer = createServer();
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      console.log('用户连接:', socket.id);
      
      // 添加到连接用户列表
      connectedUsers.set(socket.id, {
        id: socket.id,
        connectedAt: new Date(),
      });

      // 广播在线用户数
      io.emit('userCount', connectedUsers.size);

      // 处理消息
      socket.on('message', async (message) => {
        console.log('收到消息:', message);
        
        // 广播用户消息
        io.emit('message', message);

        // 模拟 AI 响应
        setTimeout(() => {
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `我收到了您的消息："${message.content}"，这是通过 WebSocket 的实时响应！`,
            timestamp: new Date(),
          };
          
          io.emit('message', aiResponse);
        }, 1000 + Math.random() * 2000);
      });

      // 处理语音消息
      socket.on('voiceMessage', (data) => {
        console.log('收到语音消息:', data.duration + '秒');
        
        // 广播语音消息
        io.emit('message', {
          ...data.message,
          audioUrl: data.audioData, // 在实际应用中，需要将音频保存到服务器
        });

        // 模拟 AI 对语音消息的响应
        setTimeout(() => {
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: `我收到了您的语音消息，时长 ${data.duration} 秒。由于这是演示版本，我暂时无法处理语音内容，但在实际应用中可以集成语音识别服务。`,
            timestamp: new Date(),
          };
          
          io.emit('message', aiResponse);
        }, 1500);
      });

      // 处理打字状态
      socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {
          isTyping: data.isTyping,
          userId: socket.id,
        });
      });

      // 处理断开连接
      socket.on('disconnect', () => {
        console.log('用户断开连接:', socket.id);
        connectedUsers.delete(socket.id);
        
        // 广播在线用户数
        io.emit('userCount', connectedUsers.size);
        
        // 通知其他用户停止显示打字状态
        socket.broadcast.emit('typing', {
          isTyping: false,
          userId: socket.id,
        });
      });
    });

    // 启动服务器
    const PORT = process.env.WS_PORT || 3001;
    httpServer.listen(PORT, () => {
      console.log(`WebSocket 服务器运行在端口 ${PORT}`);
    });
  }

  return new Response(JSON.stringify({
    message: 'WebSocket 服务器已启动',
    port: process.env.WS_PORT || 3001,
    connectedUsers: connectedUsers.size,
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
