'use client';

import { useState } from 'react';

interface TestResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export default function TestPage() {
  const [redisResult, setRedisResult] = useState<TestResult | null>(null);
  const [mysqlResult, setMysqlResult] = useState<TestResult | null>(null);
  const [allResult, setAllResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState({
    redis: false,
    mysql: false,
    all: false
  });

  const testRedis = async () => {
    setLoading(prev => ({ ...prev, redis: true }));
    try {
      const response = await fetch('/api/test-redis');
      const data = await response.json();
      
      if (response.ok) {
        setRedisResult({ success: true, data });
      } else {
        setRedisResult({ success: false, error: data.error || 'Redis 测试失败' });
      }
    } catch (error) {
      setRedisResult({ 
        success: false, 
        error: error instanceof Error ? error.message : '网络错误' 
      });
    } finally {
      setLoading(prev => ({ ...prev, redis: false }));
    }
  };

  const testMysql = async () => {
    setLoading(prev => ({ ...prev, mysql: true }));
    try {
      const response = await fetch('/api/test-mysql');
      const data = await response.json();
      
      if (response.ok) {
        setMysqlResult({ success: true, data });
      } else {
        setMysqlResult({ success: false, error: data.error || 'MySQL 测试失败' });
      }
    } catch (error) {
      setMysqlResult({ 
        success: false, 
        error: error instanceof Error ? error.message : '网络错误' 
      });
    } finally {
      setLoading(prev => ({ ...prev, mysql: false }));
    }
  };

  const testAll = async () => {
    setLoading(prev => ({ ...prev, all: true }));
    try {
      const response = await fetch('/api/test-all');
      const data = await response.json();
      
      if (response.ok) {
        setAllResult({ success: true, data });
      } else {
        setAllResult({ success: false, error: data.error || '综合测试失败' });
      }
    } catch (error) {
      setAllResult({ 
        success: false, 
        error: error instanceof Error ? error.message : '网络错误' 
      });
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  const ResultCard = ({ title, result, isLoading }: { 
    title: string; 
    result: TestResult | null; 
    isLoading: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">测试中...</span>
        </div>
      )}
      
      {!isLoading && result && (
        <div className={`p-4 rounded-lg border ${result.success 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center mb-2">
            {result.success ? (
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
            <span className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '测试成功' : '测试失败'}
            </span>
          </div>
          
          {result.error && (
            <p className="text-red-700 text-sm mb-2">错误: {result.error}</p>
          )}
          
          {result.data && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">响应数据:</h4>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      {!isLoading && !result && (
        <p className="text-gray-500 py-8 text-center">点击上方按钮开始测试</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">服务连接测试</h1>
          <p className="text-gray-600 mt-2">测试 Redis 和 MySQL 数据库连接状态</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={testRedis}
            disabled={loading.redis}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading.redis ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                测试中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z"></path>
                </svg>
                测试 Redis
              </>
            )}
          </button>

          <button
            onClick={testMysql}
            disabled={loading.mysql}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading.mysql ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                测试中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z"></path>
                </svg>
                测试 MySQL
              </>
            )}
          </button>

          <button
            onClick={testAll}
            disabled={loading.all}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading.all ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                测试中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                综合测试
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ResultCard 
            title="Redis 连接测试" 
            result={redisResult} 
            isLoading={loading.redis} 
          />
          
          <ResultCard 
            title="MySQL 连接测试" 
            result={mysqlResult} 
            isLoading={loading.mysql} 
          />
          
          <div className="lg:col-span-2 xl:col-span-1">
            <ResultCard 
              title="综合测试结果" 
              result={allResult} 
              isLoading={loading.all} 
            />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">使用说明</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Redis 测试:</strong> 测试 Redis 缓存服务的连接状态，会执行 SET/GET 操作</p>
            <p>• <strong>MySQL 测试:</strong> 测试 MySQL 数据库连接，会创建测试表并插入数据</p>
            <p>• <strong>综合测试:</strong> 同时测试所有服务的连接状态和性能</p>
          </div>
        </div>
      </div>
    </div>
  );
}
