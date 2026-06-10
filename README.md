# Kairos 博客

> 一个写给自己看、也欢迎你路过的技术博客。

[![Deploy](https://img.shields.io/github/actions/workflow/status/KYJCASTER/Kairos_blog/deploy.yml?branch=master&label=deploy)](https://github.com/KYJCASTER/Kairos_blog/actions)

**线上**: https://kyjcaster.github.io/Kairos_blog/

## 技术栈

- **Next.js 16** + **React 19**（App Router，`output: 'export'` 静态导出）
- **TypeScript 5**
- **Tailwind CSS 4**
- 内容：Markdown + gray-matter
- 代码高亮：**Shiki**（dual-theme，构建期完成）
- 站内搜索：**Fuse.js**（纯客户端）

部署在 **GitHub Pages**，base path 为 `/Kairos_blog`。

## 写一篇文章

在 `content/posts/` 里新建一个 Markdown 文件，比如 `my-first-post.md`：

```md
---
title: "我的第一篇文章"
date: "2026-06-10"
tags: ["随笔"]
excerpt: "可选；不写的话会从正文自动截取。"
cover: "/Kairos_blog/cover.jpg"   # 可选
published: true
---

# 正文从这里开始

随便写。代码块会自动高亮。
```

`published: false` 的文章不会出现在列表里。`slug` 不写时使用文件名。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:3000/Kairos_blog
npm run build      # 输出到 ./dist
npm run lint
```

## 项目结构（关键部分）

```
src/
├── app/
│   ├── layout.tsx              # 全局布局 + 字体注入
│   ├── page.tsx                # 首页
│   ├── blog/page.tsx           # 文章列表 + 客户端搜索
│   ├── blog/[slug]/page.tsx    # 文章正文 + TOC + 进度条 + 上下篇
│   ├── tags/page.tsx           # 标签云
│   ├── about/page.tsx          # 关于
│   ├── sitemap.ts              # 自动生成 sitemap.xml
│   ├── robots.ts               # 自动生成 robots.txt
│   ├── rss.xml/route.ts        # RSS feed
│   └── globals.css             # 设计系统
├── components/                 # 复用 UI
└── lib/
    ├── site.ts                 # 站点元信息（域名、作者等）
    ├── posts.ts                # 读 content/posts
    ├── markdown.ts             # Shiki + Marked
    └── reading-time.ts         # CJK 友好的字数与阅读时长
content/posts/                  # 文章 Markdown
```

## 设计

| 用途        | 字体                | 颜色基调         |
|-------------|---------------------|------------------|
| 大标题      | Fraunces (serif)    | —                |
| 正文        | Inter               | `#1F1B16` on `#FAF7F2` |
| 等宽 / 标签 | JetBrains Mono      | —                |
| 强调        | —                   | 红陶橙 `#C2410C` |

所有颜色通过 CSS 变量定义，深色模式由 `next-themes` 切换 `<html class="dark">`。

## License

MIT
