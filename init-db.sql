-- 初始化数据库脚本
-- 修改默认认证插件为兼容模式
ALTER USER 'admin'@'%' IDENTIFIED WITH mysql_native_password BY '123123123';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root123456';

-- 创建测试表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入测试数据
INSERT INTO users (name, email) VALUES 
('Admin User', 'admin@example.com'),
('Test User', 'test@example.com');

-- 确保 admin 用户有正确的权限
GRANT ALL PRIVILEGES ON mydb.* TO 'admin'@'%';
FLUSH PRIVILEGES;
