# Kairos 博客 - Next.js 重构版

基于 Next.js 15 + React 19 + TypeScript + Tailwind CSS 构建的全栈博客系统。

## 技术栈

- **框架**: Next.js 16 + React 19
- **语言**: TypeScript 5.8
- **样式**: Tailwind CSS 4
- **UI 风格**: 美漫/波普艺术 (Comic/Pop Art)
- **数据库**: PostgreSQL + Prisma 7
- **认证**: NextAuth.js v5 (静态导出模式使用模拟认证)
- **评论**: Giscus

## 特性

### 前端
- 🎨 美漫风格设计 - Bangers/Comic Neue 字体、粗边框、网点纹理
- 🌓 深色/浅色主题切换
- 📱 响应式布局
- ⚡ Next.js App Router

### 功能
- 📝 文章管理 (CRUD)
- 🏷️ 标签系统
- 🔍 文章搜索
- 💬 Giscus 评论集成
- 📊 阅读统计

### 管理后台
- 📋 Dashboard 数据概览
- ✏️ Markdown 文章编辑器
- 🏷️ 标签管理
- 💬 评论审核

## 项目结构

```
kairos-blog-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── blog/page.tsx   # 博客列表
│   │   │   ├── about/page.tsx  # 关于页面
│   │   │   ├── tags/page.tsx   # 标签云
│   │   │   └── admin/          # 管理后台
│   │   ├── globals.css         # 全局样式
│   │   └── layout.tsx          # 根布局
│   ├── components/
│   │   ├── ui/                 # UI 组件
│   │   │   ├── comic-button.tsx
│   │   │   ├── comic-card.tsx
│   │   │   └── speech-bubble.tsx
│   │   ├── navbar.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── search-box.tsx
│   │   └── giscus-comments.tsx
│   └── lib/
│       ├── db.ts               # Prisma 客户端
│       ├── auth.ts             # 认证配置
│       └── utils.ts            # 工具函数
├── prisma/
│   └── schema.prisma           # 数据库模型
├── public/                     # 静态资源
└── ...config files
```

## 开发

```bash
# 安装依赖
npm install

# 生成 Prisma 客户端
npx prisma generate

# 开发服务器
npm run dev

# 构建
npm run build

# 预览构建
npm run preview
```

## 部署

### GitHub Pages (静态导出)

项目配置为静态导出模式 (`output: 'export'`)，适合部署到 GitHub Pages：

1. 推送代码到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择 GitHub Actions 作为构建源

### 环境变量

创建 `.env.local`：

```env
# 数据库 (生产环境必需)
DATABASE_URL="postgresql://user:password@localhost:5432/kairos_blog"

# NextAuth (可选，静态导出模式使用模拟认证)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"
```

## 注意事项

### 静态导出限制

由于使用 `output: 'export'` 进行静态导出：

1. **API 路由**: 不支持服务端 API 路由
   - NextAuth API 路由已移除
   - 认证使用客户端模拟

2. **动态路由**: 需要 `generateStaticParams()`
   - 文章详情页需要数据库连接来生成静态路径
   - 构建时数据库需可访问

3. **数据库**: 构建时需要连接数据库生成静态页面
   - 生产部署需配置数据库连接
   - 或使用 ISR (增量静态再生) + 服务端托管

### 后续优化建议

1. **服务端托管**: 考虑使用 Vercel/Netlify 获得完整 Next.js 功能
2. **ISR**: 添加增量静态再生支持
3. **图片优化**: 配置 Cloudinary/AWS S3 存储
4. **搜索**: 集成 Meilisearch 实现全文搜索
5. **CMS**: 集成 Strapi/Sanity 作为内容管理后台

## 设计系统

### 颜色

| 名称 | 值 | 用途 |
|------|-----|------|
| comic-red | #E63946 | 强调、警告 |
| comic-blue | #4361EE | 主色、链接 |
| comic-yellow | #FFD60A | 高亮、按钮 |
| comic-purple | #7209B7 | 副色、标签 |
| comic-green | #2ECC71 | 成功、通过 |
| comic-orange | #F39C12 | 警告、提示 |
| comic-cream | #FEFAE0 | 背景色 |
| comic-dark | #1A1A2E | 深色模式背景 |

### 字体

- **标题**: Bangers (Google Fonts)
- **正文**: Comic Neue (Google Fonts)

## License

MIT
