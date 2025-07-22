#!/bin/bash

echo "🚀 AIDO AI 对话模块功能测试"
echo "================================"

# 检查 Node.js 和 npm
echo "📋 检查环境..."
node --version || { echo "❌ Node.js 未安装"; exit 1; }
npm --version || { echo "❌ npm 未安装"; exit 1; }

# 检查依赖
echo "📦 检查依赖..."
if [ -f "package.json" ]; then
    echo "✅ package.json 存在"
else
    echo "❌ package.json 不存在"
    exit 1
fi

# 检查关键文件
echo "📁 检查文件结构..."
files=(
    "src/app/chat/page.tsx"
    "src/app/chat/types.ts"
    "src/app/chat/components/MessageBubble.tsx"
    "src/app/chat/components/ChatInput.tsx"
    "src/app/chat/components/VoiceRecorder.tsx"
    "src/app/chat/hooks/useVoiceRecording.ts"
    "src/app/chat/hooks/useWebSocket.ts"
    "src/app/api/chat/route.ts"
    "src/app/api/websocket/route.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 缺失"
    fi
done

# 检查环境变量
echo "🔧 检查配置..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local 配置文件存在"
    if grep -q "NEXT_PUBLIC_WS_URL" .env.local; then
        echo "✅ WebSocket URL 已配置"
    else
        echo "⚠️  WebSocket URL 未配置"
    fi
else
    echo "⚠️  .env.local 配置文件不存在，将使用默认配置"
fi

# 检查浏览器功能支持
echo "🌐 浏览器功能检查..."
echo "请在浏览器中访问 /chat 页面并检查以下功能："
echo "  - MediaRecorder API (语音录音)"
echo "  - WebSocket 支持"
echo "  - localStorage (历史记录)"
echo "  - getUserMedia (麦克风权限)"

echo ""
echo "🎯 测试步骤:"
echo "1. 启动开发服务器: npm run dev"
echo "2. 访问 http://localhost:8081/chat"
echo "3. 测试文本消息发送和接收"
echo "4. 测试语音录音功能（需要麦克风权限）"
echo "5. 测试 WebSocket 连接状态"
echo "6. 测试聊天历史保存和恢复"

echo ""
echo "✨ 测试完成！如有问题请查看 README.md 中的故障排除部分。"
