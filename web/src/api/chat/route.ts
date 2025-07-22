import { NextRequest, NextResponse } from 'next/server';

// 模拟 AI 响应的函数
async function generateAIResponse(message: string): Promise<string> {
  // 这里可以集成真实的 AI API，如 OpenAI、Claude 等
  // 目前使用模拟响应
  
  const responses = [
    `关于"${message}"，这是一个很有趣的问题。让我来为您详细解答。`,
    `我理解您询问的是关于"${message}"的内容。这个话题确实值得深入探讨。`,
    `让我来帮您分析一下"${message}"这个话题。从多个角度来看...`,
    `针对"${message}"，我可以为您提供以下信息和建议...`,
    `这是一个关于"${message}"的很好的问题，让我详细解答。`,
  ];
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      );
    }

    // 生成 AI 响应
    const response = await generateAIResponse(message);

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 处理 GET 请求（可选）
export async function GET() {
  return NextResponse.json({
    message: 'AIDO AI Chat API',
    status: 'online',
    version: '1.0.0',
  });
}
