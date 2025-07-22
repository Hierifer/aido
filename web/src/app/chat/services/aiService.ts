import { AIResponse } from '../types';

class AIService {
  private baseUrl = '/api/chat'; // 后端 AI API 地址

  // 模拟 AI 响应
  async simulateResponse(userMessage: string): Promise<string> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // 简单的响应逻辑，可以替换为真实的 AI API 调用
    const responses = [
      `关于"${userMessage}"，这是一个很有趣的问题。让我来为您详细解答。`,
      `我理解您询问的是关于"${userMessage}"的内容。这个话题确实值得深入探讨。`,
      `让我来帮您分析一下"${userMessage}"这个话题。从多个角度来看...`,
      `针对"${userMessage}"，我可以为您提供以下信息和建议...`,
      `这是一个关于"${userMessage}"的很好的问题，让我详细解答。`,
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // 调用真实 AI API（可选实现）
  async callAI(message: string): Promise<AIResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { content: data.response };
    } catch (error) {
      console.error('AI API Error:', error);
      // 降级到模拟响应
      const content = await this.simulateResponse(message);
      return { content };
    }
  }

  // 获取 AI 响应
  async getResponse(message: string): Promise<string> {
    try {
      // 优先尝试真实 API，失败则使用模拟响应
      const result = await this.callAI(message);
      return result.content;
    } catch (error) {
      console.error('Error getting AI response:', error);
      // 降级处理
      return await this.simulateResponse(message);
    }
  }
}

export const aiService = new AIService();
