package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Redis 和 MySQL 配置
var (
	rdb *redis.Client
	db  *gorm.DB
)

// 初始化 Redis 连接
func initRedis() error {
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "redis"
	}
	
	redisPassword := os.Getenv("REDIS_PASSWORD")
	
	rdb = redis.NewClient(&redis.Options{
		Addr:     redisHost + ":6379", // Docker 服务名
		Password: redisPassword,       // 从环境变量获取密码
		DB:       0,                   // 默认数据库
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	return err
}

// 初始化 MySQL 连接
func initMySQL() error {
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "db"
	}
	
	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "admin"
	}
	
	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "123123123"
	}
	
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "mydb"
	}
	
	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local", 
		dbUser, dbPassword, dbHost, dbName)
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	return err
}

func main() {
  // 初始化数据库连接
  if err := initRedis(); err != nil {
    fmt.Printf("Redis 连接失败: %v\n", err)
  } else {
    fmt.Println("Redis 连接成功!")
  }

  if err := initMySQL(); err != nil {
    fmt.Printf("MySQL 连接失败: %v\n", err)
  } else {
    fmt.Println("MySQL 连接成功!")
  }

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
    // 检查 Redis 和 MySQL 连接状态
    redisStatus := "disconnected"
    mysqlStatus := "disconnected"

    // 测试 Redis 连接
    if rdb != nil {
      ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
      defer cancel()
      if _, err := rdb.Ping(ctx).Result(); err == nil {
        redisStatus = "connected"
      }
    }

    // 测试 MySQL 连接
    if db != nil {
      if sqlDB, err := db.DB(); err == nil {
        if err := sqlDB.Ping(); err == nil {
          mysqlStatus = "connected"
        }
      }
    }

    c.JSON(http.StatusOK, gin.H{
      "status": "healthy",
      "service": "biz",
      "redis": redisStatus,
      "mysql": mysqlStatus,
      "timestamp": time.Now().Format(time.RFC3339),
    })
  })

  // Redis 测试端点
  r.GET("/test-redis", func(c *gin.Context) {
    if rdb == nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{
        "error": "Redis 未连接",
      })
      return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // 设置一个测试键值对
    testKey := "test:key"
    testValue := fmt.Sprintf("Hello Redis! Time: %s", time.Now().Format(time.RFC3339))
    
    err := rdb.Set(ctx, testKey, testValue, time.Minute).Err()
    if err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{
        "error": fmt.Sprintf("Redis SET 失败: %v", err),
      })
      return
    }

    // 获取值
    val, err := rdb.Get(ctx, testKey).Result()
    if err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{
        "error": fmt.Sprintf("Redis GET 失败: %v", err),
      })
      return
    }

    c.JSON(http.StatusOK, gin.H{
      "message": "Redis 测试成功",
      "key": testKey,
      "value": val,
      "timestamp": time.Now().Format(time.RFC3339),
    })
  })

  // MySQL 测试端点
  r.GET("/test-mysql", func(c *gin.Context) {
    if db == nil {
      c.JSON(http.StatusServiceUnavailable, gin.H{
        "error": "MySQL 未连接",
      })
      return
    }

    // 创建测试表
    type TestRecord struct {
      ID        uint      `gorm:"primaryKey"`
      Message   string    `gorm:"size:255"`
      Timestamp time.Time
    }

    // 自动迁移表结构
    if err := db.AutoMigrate(&TestRecord{}); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{
        "error": fmt.Sprintf("表迁移失败: %v", err),
      })
      return
    }

    // 插入测试数据
    testRecord := TestRecord{
      Message:   fmt.Sprintf("Hello MySQL! Time: %s", time.Now().Format(time.RFC3339)),
      Timestamp: time.Now(),
    }

    if err := db.Create(&testRecord).Error; err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{
        "error": fmt.Sprintf("插入数据失败: %v", err),
      })
      return
    }

    // 查询最近的5条记录
    var records []TestRecord
    if err := db.Order("id desc").Limit(5).Find(&records).Error; err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{
        "error": fmt.Sprintf("查询数据失败: %v", err),
      })
      return
    }

    c.JSON(http.StatusOK, gin.H{
      "message": "MySQL 测试成功",
      "inserted_record": testRecord,
      "recent_records": records,
      "timestamp": time.Now().Format(time.RFC3339),
    })
  })

  // 综合测试端点
  r.GET("/test-all", func(c *gin.Context) {
    results := gin.H{
      "timestamp": time.Now().Format(time.RFC3339),
    }

    // 测试 Redis
    if rdb != nil {
      ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
      defer cancel()
      
      if _, err := rdb.Ping(ctx).Result(); err == nil {
        results["redis"] = gin.H{
          "status": "connected",
          "test": "通过",
        }
      } else {
        results["redis"] = gin.H{
          "status": "error",
          "error": err.Error(),
        }
      }
    } else {
      results["redis"] = gin.H{
        "status": "not_initialized",
      }
    }

    // 测试 MySQL
    if db != nil {
      if sqlDB, err := db.DB(); err == nil {
        if err := sqlDB.Ping(); err == nil {
          results["mysql"] = gin.H{
            "status": "connected",
            "test": "通过",
          }
        } else {
          results["mysql"] = gin.H{
            "status": "error",
            "error": err.Error(),
          }
        }
      } else {
        results["mysql"] = gin.H{
          "status": "error",
          "error": err.Error(),
        }
      }
    } else {
      results["mysql"] = gin.H{
        "status": "not_initialized",
      }
    }

    c.JSON(http.StatusOK, results)
  })
  
  r.Run(":3000")
}