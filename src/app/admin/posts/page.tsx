"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import { ComicButton } from "@/components/ui/comic-button"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Calendar,
} from "lucide-react"

// Mock data
const mockPosts = [
  {
    id: "1",
    title: "Java 并发编程指南",
    slug: "java-concurrency",
    excerpt: "深入理解 Java 并发编程的核心概念...",
    published: true,
    publishedAt: "2025-03-15",
    viewCount: 234,
  },
  {
    id: "2",
    title: "React Hooks 深度解析",
    slug: "react-hooks-deep-dive",
    excerpt: "全面解析 React Hooks 的使用技巧...",
    published: true,
    publishedAt: "2025-03-10",
    viewCount: 189,
  },
  {
    id: "3",
    title: "Go 语言入门教程",
    slug: "go-tutorial",
    excerpt: "从零开始学习 Go 语言...",
    published: false,
    publishedAt: null,
    viewCount: 0,
  },
]

export default function PostsAdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState(mockPosts)

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这篇文章吗？")) {
      setPosts(posts.filter((p) => p.id !== id))
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#1A1A2E]">
        {/* Header */}
        <section className="py-8 px-4 bg-[#4361EE]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="font-comic text-3xl text-white tracking-wider">
              文章管理
            </h1>
            <Link href="/admin/posts/new">
              <ComicButton variant="primary" skew={false}>
                <Plus className="w-5 h-5 inline mr-1" />
                新建文章
              </ComicButton>
            </Link>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-4 border-black font-comic focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Posts Table */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-comic text-xl text-gray-500">没有找到文章</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <ComicCard
                  key={post.id}
                  variant="default"
                  color="white"
                  className="flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-comic text-lg">{post.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs border-2 ${
                          post.published
                            ? "border-green-500 text-green-600"
                            : "border-gray-400 text-gray-500"
                        }`}
                      >
                        {post.published ? (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            已发布
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            草稿
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-sm opacity-60 line-clamp-1 mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex gap-4 text-xs opacity-50">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.publishedAt}
                        </span>
                      )}
                      <span>阅读量: {post.viewCount}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <ComicButton variant="secondary" size="sm" skew={false}>
                        <Eye className="w-4 h-4" />
                      </ComicButton>
                    </Link>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <ComicButton variant="primary" size="sm" skew={false}>
                        <Edit className="w-4 h-4" />
                      </ComicButton>
                    </Link>
                    <ComicButton
                      variant="danger"
                      size="sm"
                      skew={false}
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </ComicButton>
                  </div>
                </ComicCard>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="bg-black text-white py-8 text-center">
        <p className="font-comic text-lg">
          © {new Date().getFullYear()} Kairos 博客
        </p>
      </footer>
    </>
  )
}
