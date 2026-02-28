# TireOps 企业级 Azure 部署指南

## 架构概览

| 组件 | Azure 服务 | 说明 |
|------|-----------|------|
| Web 应用 | Azure App Service (Linux, Node 20) | 承载 Next.js 应用 |
| 数据库 | Azure Database for PostgreSQL (Flexible) | 持久化存储 |
| AI | OpenAI API 或 Azure OpenAI Service | AI 能力 |
| 认证 | NextAuth.js (JWT) | 用户登录、权限 |

## 一、前置准备

1. **Azure 账号**：https://azure.microsoft.com/free
2. **GitHub 仓库**：代码已推送
3. **环境变量**：准备 `AUTH_SECRET`、`OPENAI_API_KEY`

生成 AUTH_SECRET：
```bash
openssl rand -base64 32
```

## 二、创建 Azure Database for PostgreSQL

1. 登录 [Azure Portal](https://portal.azure.com)
2. **创建资源** → 搜索 **Azure Database for PostgreSQL**
3. 选择 **Flexible server**
4. 配置：
   - 订阅、资源组（如 `tireops-rg`）
   - 服务器名称：`tireops-db`
   - 区域：与 Web App 相同（如 East Asia）
   - PostgreSQL 版本：16
   - 计算 + 存储：B1ms（开发）/ 更高（生产）
   - 管理员用户名、密码
5. ** networking**：允许 Azure 服务访问
6. 创建完成后，在 **连接字符串** 中复制 ADO.NET 格式，转换为：
   ```
   postgresql://用户名:密码@服务器名.postgres.database.azure.com:5432/postgres?sslmode=require
   ```

## 三、创建 Web App 并部署

1. **创建 Web App**：
   - 资源类型：Web App
   - 运行时：Node 20 LTS
   - 操作系统：Linux
   - 区域：East Asia（与数据库同区以降低延迟）

2. **配置环境变量**（Configuration → Application settings）：
   | 名称 | 值 | 说明 |
   |-----|-----|------|
   | DATABASE_URL | postgresql://... | 步骤二获得的连接串 |
   | AUTH_SECRET | (openssl 生成) | NextAuth 加密密钥 |
   | OPENAI_API_KEY | sk-xxx | OpenAI API Key |
   | NODE_ENV | production | 生产模式 |

3. **部署中心**：
   - 源：GitHub
   - 选择仓库、分支（main）
   - 保存后自动触发部署

## 四、首次部署后

1. 运行数据库迁移（在 Azure Cloud Shell 或本地连接数据库）：
   ```bash
   # 本地执行，DATABASE_URL 指向 Azure PostgreSQL
   npx prisma migrate deploy
   npm run db:seed
   ```

2. 默认管理员账号：
   - 邮箱：`admin@tireops.com`
   - 密码：`admin123`
   - **首次登录后请立即修改密码**

## 五、生产环境建议

- **SSL/TLS**：Azure App Service 默认提供 HTTPS
- **缩放**：根据负载调整 App Service 实例
- **备份**：Azure Database for PostgreSQL 支持自动备份
- **监控**：启用 Application Insights
- **密钥管理**：使用 Azure Key Vault 存储敏感配置（可选）
