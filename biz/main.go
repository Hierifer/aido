package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  
  // 健康检查端点
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
      "status": "healthy",
    })
  })
  
  // 健康检查端点（用于 Docker healthcheck）
  r.GET("/health", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "status": "healthy",
      "service": "biz",
    })
  })
  
  r.Run(":3000")
}