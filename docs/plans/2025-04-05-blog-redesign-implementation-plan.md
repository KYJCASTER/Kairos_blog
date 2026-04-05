# Kairos 博客重构实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将现有静态 Vite React 博客重构为 Next.js 全栈动态博客，采用美漫风格设计，包含文章管理、标签、搜索、评论、统计等功能。

**Architecture:** 使用 Next.js 15 App Router + PostgreSQL + Prisma + NextAuth 的全栈架构。前端采用美漫/波普艺术风格，使用 Tailwind CSS 自定义样式和动画。

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth.js, Meilisearch, Giscus

---

## Phase 1: 项目初始化

### Task 1: 创建 Next.js 项目

**Files:**
- Create: `kairos-blog-next/` (项目根目录)

**Step 1: 初始化项目**

```bash
cd /mnt/d/kairos_blog
npx create-next-app@latest kairos-blog-next --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Step 2: 进入项目目录**

```bash
cd kairos-blog-next
```

**Step 3: 安装核心依赖**

```bash
npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install shiki next-themes
npm install meilisearch
npm install lucide-react
npm install date-fns
npm install -D @types/node
```

**Step 4: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with dependencies"
```

---

### Task 2: 配置数据库和 Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Create: `.env.local`
- Create: `lib/db.ts`

**Step 1: 初始化 Prisma**

```bash
npx prisma init
```

**Step 2: 编写 schema.prisma**

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  role          Role      @default(ADMIN)
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum Role {
  ADMIN
  EDITOR
}

model Post {
  id            String    @id @default(cuid())
  slug          String    @unique
  title         String
  excerpt       String?
  content       String    @db.Text
  coverImage    String?
  published     Boolean   @default(false)
  publishedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  viewCount     Int       @default(0)
  likeCount     Int       @default(0)
  authorId      String
  author        User      @relation(fields: [authorId], references: [id])
  tags          Tag[]
  comments      Comment[]
}

model Tag {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  color       String   @default("#4361EE")
  description String?
  posts       Post[]
  createdAt   DateTime @default(now())
}

model Comment {
  id            String    @id @default(cuid())
  content       String
  authorName    String
  authorEmail   String
  authorAvatar  String?
  createdAt     DateTime  @default(now())
  postId        String
  post          Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  parentId      String?
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies       Comment[] @relation("CommentReplies")
}
```

**Step 3: 配置环境变量**

```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/kairos_blog?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"
MEILISEARCH_HOST="your-meilisearch-host"
MEILISEARCH_API_KEY="your-meilisearch-api-key"
```

**Step 4: 创建数据库客户端**

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Step 5: 生成迁移并推送**

```bash
npx prisma migrate dev --name init
n```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: setup prisma schema and database client"
```

---

### Task 3: 配置 NextAuth

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

**Step 1: 配置 Auth.js**

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"
import { prisma } from "./db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        (session.user as any).id = user.id
        (session.user as any).role = (user as any).role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
}
```

**Step 2: 创建 API 路由**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: configure NextAuth with GitHub provider"
```

---

## Phase 2: 美漫风格 UI 组件库

### Task 4: 配置美漫主题和全局样式

**Files:**
- Modify: `app/globals.css`
- Create: `app/layout.tsx` (更新)
- Create: `tailwind.config.ts` (更新)

**Step 1: 更新 Tailwind 配置**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        comic: {
          red: "#E63946",
          blue: "#4361EE",
          yellow: "#FFD60A",
          purple: "#7209B7",
          green: "#2ECC71",
          orange: "#F39C12",
          cream: "#FEFAE0",
          dark: "#1A1A2E",
        },
      },
      fontFamily: {
        comic: ["Bangers", "cursive"],
        body: ["Comic Neue", "cursive"],
      },
      animation: {
        "wiggle": "wiggle 0.3s ease-in-out infinite",
        "bounce-slight": "bounce-slight 0.5s ease-in-out",
        "pow": "pow 0.3s ease-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "bounce-slight": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pow: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "50%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 2: 更新全局样式**

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 26, 26, 46;
  --background-rgb: 254, 250, 224;
}

.dark {
  --foreground-rgb: 254, 250, 224;
  --background-rgb: 26, 26, 46;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
  font-family: 'Comic Neue', sans-serif;
}

/* 美漫风格基础类 */
@layer components {
  .comic-border {
    @apply border-4 border-black;
  }
  
  .comic-shadow {
    box-shadow: 6px 6px 0px 0px rgba(0, 0, 0, 1);
  }
  
  .comic-shadow-sm {
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
  }
  
  .comic-text {
    font-family: 'Bangers', cursive;
    letter-spacing: 0.05em;
  }
}

/* 网点纹理背景 */
.halftone {
  background-image: radial-gradient(circle, #000 1px, transparent 1px);
  background-size: 8px 8px;
}

/* 选择文本样式 */
::selection {
  background: #FFD60A;
  color: #1A1A2E;
}
```

**Step 3: 更新根布局**

```typescript
// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Kairos 博客 - 开发者日志",
  description: "河南大学 2024 级网络工程专业学生的技术博客",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 4: 创建 ThemeProvider**

```typescript
// components/theme-provider.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ReactNode } from "react"

export function ThemeProvider({ children, ...props }: { children: ReactNode } & any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: setup comic theme and global styles"
```

---

### Task 5: 创建美漫 UI 组件

**Files:**
- Create: `components/ui/comic-button.tsx`
- Create: `components/ui/comic-card.tsx`
- Create: `components/ui/speech-bubble.tsx`
- Create: `components/ui/halftone-bg.tsx`

**Step 1: ComicButton 组件**

```typescript
// components/ui/comic-button.tsx
"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ComicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning"
  size?: "sm" | "md" | "lg"
  skew?: boolean
}

const ComicButton = forwardRef<HTMLButtonElement, ComicButtonProps>(
  ({ className, variant = "primary", size = "md", skew = true, children, ...props }, ref) => {
    const variants = {
      primary: "bg-comic-yellow hover:bg-yellow-400",
      secondary: "bg-comic-blue text-white hover:bg-blue-600",
      danger: "bg-comic-red text-white hover:bg-red-600",
      warning: "bg-comic-orange text-white hover:bg-orange-600",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "relative font-comic tracking-wider",
          "border-4 border-black",
          "transition-all duration-150",
          "hover:scale-105 active:scale-95",
          "comic-shadow hover:comic-shadow-sm active:shadow-none",
          "active:translate-x-1 active:translate-y-1",
          skew && "-skew-x-12",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className={cn(skew && "skew-x-12 inline-block")}>{children}</span>
      </button>
    )
  }
)

ComicButton.displayName = "ComicButton"

export { ComicButton }
```

**Step 2: ComicCard 组件**

```typescript
// components/ui/comic-card.tsx
import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface ComicCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "explosion" | "jagged"
  color?: "white" | "cream" | "blue" | "yellow" | "red"
}

const ComicCard = forwardRef<HTMLDivElement, ComicCardProps>(
  ({ className, variant = "default", color = "white", children, ...props }, ref) => {
    const colors = {
      white: "bg-white",
      cream: "bg-comic-cream",
      blue: "bg-comic-blue text-white",
      yellow: "bg-comic-yellow",
      red: "bg-comic-red text-white",
    }

    const clipPaths = {
      default: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      explosion: "polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)",
      jagged: "polygon(0% 5%, 5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%)",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative border-4 border-black comic-shadow",
          colors[color],
          className
        )}
        style={{ clipPath: clipPaths[variant] }}
        {...props}
      >
        <div className="halftone absolute inset-0 opacity-5 pointer-events-none" />
        <div className="relative p-6">{children}</div>
      </div>
    )
  }
)

ComicCard.displayName = "ComicCard"

export { ComicCard }
```

**Step 3: SpeechBubble 组件**

```typescript
// components/ui/speech-bubble.tsx
import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface SpeechBubbleProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "right" | "bottom"
  color?: "white" | "yellow" | "blue"
}

const SpeechBubble = forwardRef<HTMLDivElement, SpeechBubbleProps>(
  ({ className, direction = "bottom", color = "white", children, ...props }, ref) => {
    const colors = {
      white: "bg-white",
      yellow: "bg-comic-yellow",
      blue: "bg-comic-blue text-white",
    }

    const tails = {
      left: "before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[15px] before:border-t-transparent before:border-r-[20px] before:border-r-inherit before:border-b-[15px] before:border-b-transparent",
      right: "before:absolute before:-right-4 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[15px] before:border-t-transparent before:border-l-[20px] before:border-l-inherit before:border-b-[15px] before:border-b-transparent",
      bottom: "before:absolute before:-bottom-4 before:left-1/4 before:w-0 before:h-0 before:border-l-[15px] before:border-l-transparent before:border-t-[20px] before:border-t-inherit before:border-r-[15px] before:border-r-transparent",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[30px] border-4 border-black p-6",
          colors[color],
          tails[direction],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SpeechBubble.displayName = "SpeechBubble"

export { SpeechBubble }
```

**Step 4: 创建工具函数**

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```bash
npm install clsx tailwind-merge
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add comic UI components (Button, Card, SpeechBubble)"
```

---

## Phase 3: 博客前台页面

### Task 6: 创建导航组件

**Files:**
- Create: `components/navbar.tsx`
- Create: `components/theme-toggle.tsx`

**Step 1: 导航栏组件**

```typescript
// components/navbar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { Zap, User, BookOpen } from "lucide-react"

const navItems = [
  { href: "/", label: "首页", icon: Zap },
  { href: "/blog", label: "博客", icon: BookOpen },
  { href: "/about", label: "关于", icon: User },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-comic-cream dark:bg-comic-dark border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-comic-red border-4 border-black rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span className="font-comic text-xl text-white">K</span>
            </div>
            <span className="font-comic text-2xl tracking-wider hidden sm:block">
              KAIROS
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 font-comic text-lg tracking-wider transition-all",
                    "hover:-translate-y-1",
                    isActive && "text-comic-red"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-comic-red rounded-full" />
                  )}
                </Link>
              )
            })}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: 主题切换按钮**

```typescript
// components/theme-toggle.tsx
"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { ComicButton } from "./ui/comic-button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <ComicButton
      variant="secondary"
      size="sm"
      skew={false}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="ml-2"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </ComicButton>
  )
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add navbar with comic styling and theme toggle"
```

---

### Task 7: 创建首页

**Files:**
- Create: `app/page.tsx`
- Create: `app/sections/hero-section.tsx`
- Create: `app/sections/latest-posts.tsx`
- Create: `app/sections/about-preview.tsx`

**Step 1: Hero Section**

```typescript
// app/sections/hero-section.tsx
import { ComicButton } from "@/components/ui/comic-button"
import { SpeechBubble } from "@/components/ui/speech-bubble"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20">
      {/* 速度线背景 */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 bg-black"
            style={{
              top: `${Math.random() * 100}%`,
              left: 0,
              right: 0,
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* 主标题 */}
        <h1 className="font-comic text-6xl sm:text-8xl md:text-9xl tracking-wider mb-6 transform -rotate-2">
          <span className="text-comic-red">K</span>
          <span className="text-comic-blue">A</span>
          <span className="text-comic-yellow">I</span>
          <span className="text-comic-purple">R</span>
          <span className="text-comic-green">O</span>
          <span className="text-comic-orange">S</span>
        </h1>

        {/* 副标题气泡 */}
        <div className="flex justify-center mb-8">
          <SpeechBubble direction="bottom" color="yellow" className="max-w-md">
            <p className="font-comic text-2xl tracking-wider">开发者日志</p>
            <p className="text-sm mt-2 opacity-80">河南大学 · 2024级 · 网络工程</p>
          </SpeechBubble>
        </div>

        {/* 技能标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["Java", "Go", "Python", "前端"].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-white border-4 border-black font-comic text-lg comic-shadow-sm transform hover:-translate-y-1 transition-transform"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* CTA 按钮 */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/blog">
            <ComicButton variant="primary" size="lg">
              开始阅读 →
            </ComicButton>
          </Link>
          <Link href="/about">
            <ComicButton variant="secondary" size="lg">
              了解我
            </ComicButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: 最新文章 Section**

```typescript
// app/sections/latest-posts.tsx
import { prisma } from "@/lib/db"
import { ComicCard } from "@/components/ui/comic-card"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

export async function LatestPosts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { tags: true },
  })

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-comic text-4xl sm:text-5xl text-center mb-12 tracking-wider">
          <span className="bg-comic-yellow px-4 py-2 border-4 border-black comic-shadow inline-block transform -rotate-2">
            最新文章
          </span>
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-comic text-2xl text-gray-500">文章正在创作中...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <ComicCard
                  variant={index % 2 === 0 ? "explosion" : "default"}
                  color={["white", "cream", "yellow"][index % 3] as any}
                  className="h-full transform hover:-translate-y-2 transition-transform cursor-pointer"
                >
                  {post.coverImage && (
                    <div className="aspect-video mb-4 border-4 border-black overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-comic text-xl mb-2 tracking-wider line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm opacity-70 line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 text-xs border-2 border-black"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs mt-4 opacity-50">
                    {post.publishedAt &&
                      format(new Date(post.publishedAt), "yyyy年M月d日", { locale: zhCN })}
                  </p>
                </ComicCard>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/blog">
            <span className="inline-block font-comic text-xl px-6 py-3 bg-comic-blue text-white border-4 border-black comic-shadow hover:comic-shadow-sm hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
              查看全部文章 →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 3: About Preview Section**

```typescript
// app/sections/about-preview.tsx
import { SpeechBubble } from "@/components/ui/comic-card"
import Link from "next/link"

export function AboutPreview() {
  return (
    <section className="py-20 px-4 bg-comic-blue dark:bg-comic-purple">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* 头像 */}
          <div className="relative">
            <div className="w-32 h-32 bg-white border-4 border-black rounded-full overflow-hidden comic-shadow">
              <img
                src="/头像.jpg"
                alt="Kairos"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-comic-yellow border-4 border-black rounded-full flex items-center justify-center font-comic">
              K
            </div>
          </div>

          {/* 介绍 */}
          <div className="flex-1 text-white">
            <h2 className="font-comic text-3xl mb-4 tracking-wider">关于我</h2>
            <p className="text-lg mb-4 opacity-90">
              河南大学 2024 级网络工程专业学生，热爱编程和技术探索。
              正在学习 Java、Go、Python 和前端开发。
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Java", "Go", "Python", "React", "网络安全"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-white text-black border-2 border-black font-comic text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
            <Link href="/about">
              <span className="inline-block font-comic text-lg px-6 py-2 bg-comic-yellow text-black border-4 border-black comic-shadow hover:comic-shadow-sm hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
                了解更多 →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 4: 首页整合**

```typescript
// app/page.tsx
import { Navbar } from "@/components/navbar"
import { HeroSection } from "./sections/hero-section"
import { LatestPosts } from "./sections/latest-posts"
import { AboutPreview } from "./sections/about-preview"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LatestPosts />
        <AboutPreview />
      </main>
      <footer className="bg-black text-white py-8 text-center">
        <p className="font-comic text-lg">© {new Date().getFullYear()} Kairos 博客</p>
        <p className="text-sm opacity-60 mt-2">Made with 💥 and ☕</p>
      </footer>
    </>
  )
}
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: create home page with hero, latest posts, and about preview sections"
```

---

由于文档长度限制，以上是重构计划的前半部分，包含 Phase 1-3 的核心任务。完整的实施计划还包括：

## 后续阶段概述

### Phase 4: 博客文章页面
- 文章列表页（搜索、筛选、分页）
- 文章详情页（TOC、代码高亮、前后导航）
- 标签页面

### Phase 5: 关于页面
- 个人介绍时间线
- 技能展示
- 联系方式

### Phase 6: 后台管理
- Dashboard 概览
- 文章编辑器（Tiptap）
- 标签管理
- 评论管理

### Phase 7: 高级功能
- 搜索集成（Meilisearch）
- 评论系统（Giscus）
- 统计功能

### Phase 8: 部署
- Vercel 配置
- 数据库迁移
- 环境变量设置

---

**设计文档:** `docs/plans/2025-04-05-blog-redesign-design.md`
**实施计划:** `docs/plans/2025-04-05-blog-redesign-implementation-plan.md`

**执行选项：**
1. **当前会话继续** - 我立即开始执行 Phase 1 的任务
2. **新开会话执行** - 使用 `executing-plans` skill 在新会话中批量执行

你选择哪种方式？
