# 使用官方 Bun 镜像作为基础镜像
FROM oven/bun:1-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache curl

# 设置工作目录
WORKDIR /app

# 安装依赖阶段
FROM base AS deps
# 复制包管理文件
COPY package.json bun.lock* ./
# 安装生产依赖
RUN bun install --frozen-lockfile --production

# 构建阶段
FROM base AS builder
# 复制包管理文件
COPY package.json bun.lock* ./
# 安装所有依赖（包括开发依赖）
RUN bun install --frozen-lockfile

# 复制源代码
COPY . .

# 设置环境变量用于构建
ENV NEXT_TELEMETRY_DISABLED=1

# 构建 Next.js 应用
RUN bun run build

# 生产运行阶段
FROM base AS runner

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# 复制必要文件
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 8080

# 添加健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# 启动应用
CMD ["bun", "server.js"]