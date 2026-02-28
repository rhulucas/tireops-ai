# TireOps AI

轮胎行业全栈智能平台，**企业级** 7 个专属模块。

## 企业级特性

| 特性 | 说明 |
|------|------|
| **PostgreSQL** | 生产级数据库，支持 Azure / 自建 |
| **身份认证** | NextAuth.js 登录、JWT 会话 |
| **角色权限** | ADMIN / USER 角色（可扩展） |
| **API 限流** | 60 次/分钟/IP，防滥用 |
| **Azure 就绪** | 完整部署文档，支持全球访问 |

## 功能模块

| 模块 | 功能 |
|------|------|
| **Dashboard** | 生产线状态、QC、胎纹效率 |
| **AI Quoting** | 轮胎报价、EU 标签、DOT/ECE |
| **Orders** | 订单 PRODUCTION / QC CHECK |
| **Email AI** | OEM / 车队 / 质保邮件场景 |
| **Invoice AI** | 发票、质保、认证费 |
| **Tread Designer** | 胎面设计 → AI 分析 → CNC 导出 |
| **Compound Spec** | phr 配方生成、EU 预测 |

## 技术栈

- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: PostgreSQL (生产) / Docker 本地
- **Auth**: NextAuth.js v5 + bcrypt
- **AI**: OpenAI GPT-4o-mini

## 环境要求

- **Node.js** >= 20.9.0
- **PostgreSQL** 16+（本地可用 Docker）

## 快速开始

### 1. 本地 PostgreSQL（Docker）

```bash
docker-compose up -d
```

### 2. 环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env`，配置：
- `DATABASE_URL`：`postgresql://tireops:tireops_dev@localhost:5432/tireops`
- `AUTH_SECRET`：`openssl rand -base64 32` 生成
- `OPENAI_API_KEY`：可选

### 3. 数据库与种子

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4. 启动

```bash
npm run dev
```

访问 http://localhost:3000

**默认登录**：`admin@tireops.com` / `admin123`（生产环境请立即修改）

## 个人 Demo 免费部署（推荐）

零数据库费用：Neon 免费 PostgreSQL + Azure Web App。

**详细步骤**：[docs/FREE_DEMO_SETUP.md](docs/FREE_DEMO_SETUP.md)

## Azure 完整部署（含付费数据库）

详见 [docs/AZURE_DEPLOYMENT.md](docs/AZURE_DEPLOYMENT.md)

简要步骤：
1. 创建 Azure Database for PostgreSQL
2. 创建 Web App（Node 20）
3. 配置环境变量
4. 通过 GitHub 部署
5. 运行 `prisma migrate deploy` 与 `db:seed`
