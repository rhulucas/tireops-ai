# TireOps 个人 Demo 免费部署指南

使用 **Neon 免费 PostgreSQL** + **Azure Web App**，零数据库费用。

---

## 第一步：获取免费数据库（Neon）

1. 打开 **[Neon 官网](https://neon.tech)**
2. 点击 **Sign Up**，用 GitHub 登录（最快）
3. 登录后点击 **New Project**
4. 填写：
   - **Project name**：`tireops`
   - **Region**：选离你近的，如 `Asia Pacific (Singapore)`
5. 点击 **Create Project**
6. 创建完成后，在项目页面找到 **Connection string**
7. 选择 **URI** 格式，复制类似这样的连接串：
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
8. **保存好**，后面会用到

---

## 第二步：创建 Azure Web App

1. 登录 [Azure Portal](https://portal.azure.com)
2. 进入资源组 `tireops-rg`，点击 **+ Create**
3. 搜索 **Web App** → 选择 **Web App** → **Create**
4. 配置：
   - **Resource group**：`tireops-rg`
   - **Name**：`tireops-app`（或任意唯一名称）
   - **Publish**：Code
   - **Runtime stack**：Node 20 LTS
   - **Operating System**：Linux
   - **Region**：Central US（与资源组一致）
5. **Review + create** → **Create**，等待完成

---

## 第三步：配置环境变量

1. 在 Azure 打开创建好的 **tireops-app**
2. 左侧 **Configuration** → **Application settings**
3. 点击 **+ New application setting**，依次添加：

| 名称 | 值 |
|------|-----|
| `DATABASE_URL` | 第一步从 Neon 复制的连接串 |
| `AUTH_SECRET` | 在终端运行 `openssl rand -base64 32` 的结果 |
| `NODE_ENV` | `production` |
| `OPENAI_API_KEY` | （可选）你的 OpenAI Key |

4. 点击 **Save**

---

## 第四步：从 GitHub 部署

1. 确保 TireOps 代码已推送到 GitHub
2. 在 Web App 左侧 **Deployment Center**
3. **Source**：GitHub
4. 授权并选择：组织 / 仓库 / 分支（如 `main`）
5. **Save**，等待首次部署完成

---

## 第五步：初始化数据库

在**本地终端**执行（需先配置 DATABASE_URL 指向 Neon）：

```bash
cd "/Users/ronghu/Documents/cursor project/tireops"

# 临时使用 Neon 连接串
export DATABASE_URL="你从 Neon 复制的连接串"

# 执行迁移和种子
npx prisma migrate deploy
npm run db:seed
```

---

## 第六步：访问 Demo

打开：**https://你的应用名.azurewebsites.net**

登录：`admin@tireops.com` / `admin123`

---

## 费用说明

- **Neon**：免费层足够个人 demo 使用
- **Azure Web App**：免费层（F1）或有免费额度，具体以订阅为准
