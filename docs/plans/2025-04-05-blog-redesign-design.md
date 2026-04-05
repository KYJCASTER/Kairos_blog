# Kairos 博客重构设计文档

## 1. 项目概述

### 1.1 背景
- **身份**：河南大学 2024 级网络工程专业学生（现大二）
- **技术栈**：Java, Go, Python, 前端开发
- **目标**：将现有静态 React 博客重构为全栈动态博客，采用美漫风格设计

### 1.2 重构目标
1. **架构升级**：从静态 Vite React 迁移到 Next.js 全栈
2. **视觉焕新**：粉蓝渐变 → 美漫/波普艺术风格
3. **功能增强**：增加后台管理、评论、搜索、统计等
4. **内容管理**：从硬编码数据迁移到数据库存储

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 | 版本/说明 |
|------|------|-----------|
| 框架 | Next.js | 15.x (App Router) |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 4.x + 自定义美漫插件 |
| 数据库 | PostgreSQL | 14+ |
| ORM | Prisma | 6.x |
| 认证 | NextAuth.js | 5.x (Auth.js) |
| 部署 | Vercel | 免费版 |
| 搜索 | Meilisearch | Cloud 免费版或自托管 |

### 2.2 项目结构

```
kairos-blog/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # 后台管理路由组
│   │   ├── dashboard/
│   │   ├── posts/
│   │   │   ├── new/
│   │   │   └── [id]/edit/
│   │   ├── settings/
│   │   └── layout.tsx            # 后台布局（侧边栏）
│   ├── (blog)/                   # 博客前台路由组
│   │   ├── page.tsx              # 首页
│   │   ├── about/
│   │   ├── blog/
│   │   │   ├── page.tsx          # 文章列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 文章详情
│   │   ├── tags/
│   │   │   └── [tag]/
│   │   └── layout.tsx            # 前台布局
│   ├── api/                      # API 路由
│   │   ├── auth/[...nextauth]/
│   │   ├── posts/
│   │   ├── tags/
│   │   ├── comments/
│   │   └── search/
│   ├── layout.tsx                # 根布局
│   └── globals.css
├── components/                   # React 组件
│   ├── ui/                       # 基础 UI 组件
│   │   ├── comic-button.tsx
│   │   ├── comic-card.tsx
│   │   ├── speech-bubble.tsx
│   │   └── halftone-bg.tsx
│   ├── blog/                     # 博客相关组件
│   │   ├── post-card.tsx
│   │   ├── post-content.tsx
│   │   ├── toc.tsx
│   │   └── code-block.tsx
│   └── admin/                    # 后台组件
├── lib/                          # 工具函数
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # Auth.js 配置
│   └── utils.ts
├── prisma/
│   └── schema.prisma             # 数据库模型
├── types/                        # TypeScript 类型
├── public/                       # 静态资源
│   ├── fonts/                    # 漫画字体
│   ├── images/
│   └── halftone/                 # 网点纹理
└── docs/                         # 文档
```

---

## 3. 数据库设计

### 3.1 Prisma Schema

```prisma
// 用户表（管理员）
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  role          Role      @default(ADMIN)
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  ADMIN
  EDITOR
}

// 文章表
model Post {
  id            String    @id @default(cuid())
  slug          String    @unique
  title         String
  excerpt       String?   // 摘要
  content       String    // Markdown/HTML
  coverImage    String?   // 封面图
  published     Boolean   @default(false)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // 统计
  viewCount     Int       @default(0)
  likeCount     Int       @default(0)
  
  // 关联
  authorId      String
  author        User      @relation(fields: [authorId], references: [id])
  tags          Tag[]
  comments      Comment[]
}

// 标签表
model Tag {
  id            String    @id @default(cuid())
  name          String    @unique
  slug          String    @unique
  color         String    // 美漫风格配色
  posts         Post[]
}

// 评论表（使用 Giscus，可选本地存储）
model Comment {
  id            String    @id @default(cuid())
  content       String
  authorName    String
  authorEmail   String
  authorAvatar  String?
  createdAt     DateTime  @default(now())
  postId        String
  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  parentId      String?   // 回复功能
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies       Comment[] @relation("CommentReplies")
}
```

---

## 4. 前端设计 - 美漫风格

### 4.1 设计语言

**核心元素：**
- **粗黑描边**：所有卡片、按钮、标题都有 2-4px 黑色描边
- **高饱和度配色**：
  - 主色：漫画红 `#E63946`、英雄蓝 `#4361EE`
  - 辅色：闪电黄 `#FFD60A`、能量紫 `#7209B7`
  - 背景：米白 `#FEFAE0`、暗灰 `#1A1A2E`
- **网点纹理**：使用 SVG halftone pattern 作为背景装饰
- **速度线/爆炸贴**：装饰元素强调动感
- **不规则边框**：使用 `clip-path` 实现漫画风格的锯齿、爆炸形状

### 4.2 字体方案

```css
/* 标题字体 - 漫画风格 */
@font-face {
  font-family: 'Bangers';
  src: url('/fonts/Bangers-Regular.ttf');
}

/* 正文字体 - 清晰可读 */
@font-face {
  font-family: 'Comic Neue';
  src: url('/fonts/ComicNeue-Regular.ttf');
}
```

### 4.3 动画效果

- **页面切换**：漫画翻页效果（3D rotateY）
- **按钮悬停**：弹性放大 + 抖动效果
- **卡片出现**：从屏幕外"飞入" + 旋转
- **文字**：打字机效果、抖动效果
- **背景**：轻微的视差滚动

### 4.4 组件设计

#### ComicButton
```tsx
// 粗描边 + 斜体 + 悬停抖动
<button className="
  relative px-6 py-3 
  bg-[#FFD60A] 
  border-4 border-black 
  font-[Bangers] text-xl tracking-wider
  transform -skew-x-12
  hover:scale-110 hover:-skew-x-6
  transition-all duration-150
  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
  hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
">
  POW!
</button>
```

#### ComicCard
```tsx
// 爆炸形状边框 + 粗描边 + 内部网点纹理
<div className="
  relative 
  bg-white 
  border-4 border-black
  [clip-path:polygon(0%_5%,5%_0%,95%_0%,100%_5%,100%_95%,95%_100%,5%_100%,0%_95%)]
">
  <div className="absolute inset-0 bg-halftone opacity-10" />
  {children}
</div>
```

#### SpeechBubble
```tsx
// 漫画对话框
<div className="
  relative
  bg-white
  border-4 border-black
  rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%]
  p-6
  before:content-['']
  before:absolute before:-bottom-4 before:left-1/4
  before:w-0 before:h-0
  before:border-l-[20px] before:border-l-transparent
  before:border-t-[30px] before:border-t-white
  before:border-r-[20px] before:border-r-transparent
">
  {content}
</div>
```

---

## 5. 页面结构设计

### 5.1 首页 (Home)

```
┌─────────────────────────────────────────┐
│  [Hero Section - 全屏]                  │
│  ┌─────────────────────────────────┐   │
│  │  "KAIROS"                       │   │
│  │  [爆炸贴: 开发者日志]            │   │
│  │  [漫画气泡: 2024级网工学生]       │   │
│  │  [按钮: 开始阅读 →]              │   │
│  └─────────────────────────────────┘   │
│  [速度线背景]                            │
├─────────────────────────────────────────┤
│  [最新文章 - 3篇]                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 漫画框   │ │ 漫画框   │ │ 漫画框   │   │
│  │ 封面图   │ │ 封面图   │ │ 封面图   │   │
│  │ 标题     │ │ 标题     │ │ 标题     │   │
│  │ 标签     │ │ 标签     │ │ 标签     │   │
│  └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────┤
│  [关于我 - 简短介绍]                     │
│  [头像 + 技能标签云]                     │
├─────────────────────────────────────────┤
│  [标签云 - 可视化]                       │
│  [各标签用不同大小/颜色展示]              │
├─────────────────────────────────────────┤
│  [Footer - 粗描边风格]                   │
└─────────────────────────────────────────┘
```

### 5.2 文章列表页 (Blog)

```
┌─────────────────────────────────────────┐
│  [页面标题: BLOG]                       │
│  [爆炸贴装饰]                            │
├─────────────────────────────────────────┤
│  [搜索框 + 分类筛选器]                    │
│  ┌─────────────────────────────────┐   │
│  │ 🔍 搜索文章...                   │   │
│  └─────────────────────────────────┘   │
│  [全部] [Java] [Go] [Python] [前端]     │
├─────────────────────────────────────────┤
│  [瀑布流/网格文章卡片]                    │
│  ┌──────────┐ ┌──────────┐             │
│  │ 漫画框    │ │ 漫画框    │ ...         │
│  └──────────┘ └──────────┘             │
├─────────────────────────────────────────┤
│  [分页 - 漫画风格]                       │
│  [<<] [<] [1] [2] [3] [>] [>>]          │
└─────────────────────────────────────────┘
```

### 5.3 文章详情页 (Post)

```
┌─────────────────────────────────────────┐
│  [返回按钮] [分享按钮]                    │
├─────────────────────────────────────────┤
│  [封面图 - 全宽]                         │
├─────────────────────────────────────────┤
│  ┌──────┐                               │
│  │ 标签  │ [发布日期] [阅读时间] [浏览量] │
│  └──────┘                               │
│                                         │
│  [文章标题 - 漫画字体]                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │     文章内容 (Markdown渲染)      │   │
│  │     - 代码块 (高亮 + 复制)       │   │
│  │     - 图片 (圆角 + 阴影)         │   │
│  │     - 引用 (漫画对话框样式)       │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  [标签] [点赞按钮] [分享按钮]             │
├─────────────────────────────────────────┤
│  [评论区 - Giscus]                       │
├─────────────────────────────────────────┤
│  [相关文章推荐]                          │
└─────────────────────────────────────────┘
```

### 5.4 关于页 (About)

```
┌─────────────────────────────────────────┐
│  [漫画风格个人介绍]                      │
│  ┌────────┐                             │
│  │ 头像    │  "Kairos"                  │
│  │ 漫画框  │  2024级网络工程             │
│  └────────┘  河南大学                    │
│              [技能漫画展示]               │
│              Java | Go | Python | 前端   │
├─────────────────────────────────────────┤
│  [时间线 - 漫画风格]                      │
│  [学习历程、项目经历]                     │
├─────────────────────────────────────────┤
│  [联系方式 - 漫画对话框]                  │
│  [邮箱: 2016559265@qq.com]              │
│  [GitHub链接]                            │
└─────────────────────────────────────────┘
```

### 5.5 后台管理 (Admin)

```
┌─────────────────────────────────────────┐
│  [侧边栏]        │  [主内容区]            │
│  ┌────────┐      │                      │
│  │ 仪表盘  │      │  文章列表/编辑器       │
│  │ 文章管理 │      │  ┌────────────────┐  │
│  │ 标签管理 │      │  │ 富文本编辑器    │  │
│  │ 评论管理 │      │  │ 标题/标签/封面  │  │
│  │ 设置    │      │  │ 发布/存草稿    │  │
│  └────────┘      │  └────────────────┘  │
│                  │                      │
└─────────────────────────────────────────┘
```

---

## 6. 功能模块设计

### 6.1 文章系统

**功能：**
- 富文本编辑器（Tiptap 或 Plate）
- Markdown 快捷键支持
- 图片上传（Vercel Blob 或 Cloudinary）
- 自动保存草稿
- 发布/取消发布
- 生成 slug（自动/手动）

**URL 设计：**
- 列表：`/blog`
- 详情：`/blog/[slug]`

### 6.2 标签系统

**功能：**
- 多标签关联
- 标签云可视化（词云效果）
- 按标签筛选文章
- 标签颜色自定义

**URL 设计：**
- 标签页：`/tags/[tag]`

### 6.3 搜索系统

**方案：** Meilisearch Cloud（免费 100k 文档）

**功能：**
- 全文搜索（标题、内容、标签）
- 搜索建议（自动补全）
- 搜索结果高亮
- 过滤（标签、日期范围）

### 6.4 代码高亮

**方案：** Shiki（VS Code 同款引擎）

**功能：**
- 语法高亮
- 行号显示
- 复制按钮
- 代码块标题
- diff 高亮

### 6.5 评论系统

**方案：** Giscus（基于 GitHub Discussions）

**优点：**
- 免费
- 无需自建数据库
- 支持 Markdown
- 邮件通知

### 6.6 统计系统

**功能：**
- 浏览量（数据库计数，防刷）
- 点赞（本地存储记录是否已赞）
- 后台仪表盘展示

### 6.7 暗黑模式

**方案：** next-themes

**设计：**
- 亮色：米白背景 + 高饱和配色
- 暗色：深蓝灰背景 + 霓虹配色

---

## 7. 迁移计划

### Phase 1：项目初始化（1-2 天）
1. 创建 Next.js 项目（App Router）
2. 配置 Tailwind CSS + 美漫主题
3. 配置 Prisma + PostgreSQL（本地/Neon）
4. 配置 NextAuth.js

### Phase 2：基础架构（2-3 天）
1. 设计数据库模型
2. 创建 API 路由
3. 实现基础 CRUD
4. 搭建后台管理框架

### Phase 3：前端开发（4-5 天）
1. 实现美漫 UI 组件库
2. 开发前台页面（Home, About, Blog, Post）
3. 开发后台管理界面
4. 实现暗黑模式

### Phase 4：功能集成（2-3 天）
1. 集成代码高亮
2. 集成搜索（Meilisearch）
3. 集成评论（Giscus）
4. 实现统计功能

### Phase 5：内容迁移（1 天）
1. 将现有文章录入数据库
2. 配置封面图
3. 设置标签

### Phase 6：部署上线（1 天）
1. 部署到 Vercel
2. 配置 PostgreSQL（Neon 或 Supabase）
3. 配置环境变量
4. 域名配置（可选）

---

## 8. 技术债务与风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 美漫风格实现复杂 | 开发时间增加 | 先实现 MVP，再细化动画 |
| 数据库迁移问题 | 数据丢失 | 充分测试，保留备份 |
| SEO 排名下降 | 流量损失 | 保持 URL 结构，设置 301 |
| Vercel 免费额度 | 服务中断 | 监控使用量，准备降级方案 |

---

## 9. 后续优化方向

1. **性能优化**
   - 图片优化（Next.js Image）
   - 边缘缓存（Vercel Edge）
   - 数据库索引优化

2. **功能扩展**
   - 邮件订阅
   - 文章导出（PDF/MD）
   - 多语言支持

3. **体验优化**
   - PWA 支持
   - 阅读进度条
   - 平滑滚动

---

## 10. 参考资源

### 设计参考
- [Marvel Comics](https://www.marvel.com/)
- [DC Comics](https://www.dc.com/)
- [Comic Book Plus](https://comicbookplus.com/)

### 技术参考
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Auth.js](https://authjs.dev/)

---

*设计文档版本：1.0*
*创建日期：2026-04-05*
*状态：待审核*
