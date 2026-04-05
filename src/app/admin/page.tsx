"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import { ComicButton } from "@/components/ui/comic-button"
import {
  FileText,
  Tags,
  MessageSquare,
  Eye,
  Heart,
  Plus,
  Settings,
} from "lucide-react"

// Mock data for dashboard
const stats = [
  { label: "文章总数", value: 12, icon: FileText, color: "#4361EE" },
  { label: "总阅读量", value: 1234, icon: Eye, color: "#2ECC71" },
  { label: "总点赞", value: 56, icon: Heart, color: "#E63946" },
  { label: "标签数", value: 8, icon: Tags, color: "#FFD60A" },
]

const recentPosts = [
  { id: "1", title: "Java 并发编程指南", views: 234, published: true },
  { id: "2", title: "React Hooks 深度解析", views: 189, published: true },
  { id: "3", title: "Go 语言入门", views: 0, published: false },
]

export default function AdminPage() {
  // Static export mode - admin is publicly accessible
  // In production, add your own authentication layer

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#1A1A2E]">
        {/* Header */}
        <section className="py-8 px-4 bg-[#4361EE]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="font-comic text-3xl sm:text-4xl text-white tracking-wider">
                管理后台
              </h1>
              <p className="text-white/80 mt-1">
                欢迎回来，管理员
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/posts/new">
                <ComicButton variant="primary" skew={false}>
                  <Plus className="w-5 h-5 inline mr-1" />
                  新建文章
                </ComicButton>
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <section className="mb-12">
            <h2 className="font-comic text-2xl mb-6 tracking-wider">数据概览</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <ComicCard
                    key={stat.label}
                    variant="default"
                    color="white"
                    className="text-center"
                  >
                    <div
                      className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: stat.color }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-comic text-3xl">{stat.value}</p>
                    <p className="text-sm opacity-60">{stat.label}</p>
                  </ComicCard>
                )
              })}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Posts */}
            <section className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-comic text-2xl tracking-wider">最近文章</h2>
                <Link href="/admin/posts">
                  <span className="text-[#4361EE] hover:underline font-comic">
                    查看全部 →
                  </span>
                </Link>
              </div>

              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <ComicCard
                    key={post.id}
                    variant="default"
                    color="white"
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-comic text-lg mb-1">{post.title}</h3>
                      <div className="flex gap-4 text-sm opacity-60">
                        <span>阅读量: {post.views}</span>
                        <span
                          className={`px-2 py-0.5 text-xs border-2 ${
                            post.published
                              ? "border-green-500 text-green-600"
                              : "border-gray-400 text-gray-500"
                          }`}
                        >
                          {post.published ? "已发布" : "草稿"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <ComicButton variant="secondary" size="sm" skew={false}>
                          编辑
                        </ComicButton>
                      </Link>
                    </div>
                  </ComicCard>
                ))}
              </div>
            </section>

            {/* Quick Links */}
            <section>
              <h2 className="font-comic text-2xl mb-6 tracking-wider">快速导航</h2>
              <div className="space-y-4">
                <Link href="/admin/posts">
                  <ComicCard
                    variant="default"
                    color="cream"
                    className="flex items-center gap-4 cursor-pointer hover:translate-x-1 transition-transform"
                  >
                    <div className="w-10 h-10 bg-[#4361EE] rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-comic text-lg">文章管理</span>
                  </ComicCard>
                </Link>

                <Link href="/admin/tags">
                  <ComicCard
                    variant="default"
                    color="cream"
                    className="flex items-center gap-4 cursor-pointer hover:translate-x-1 transition-transform"
                  >
                    <div className="w-10 h-10 bg-[#FFD60A] rounded-lg flex items-center justify-center">
                      <Tags className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-comic text-lg">标签管理</span>
                  </ComicCard>
                </Link>

                <Link href="/admin/comments">
                  <ComicCard
                    variant="default"
                    color="cream"
                    className="flex items-center gap-4 cursor-pointer hover:translate-x-1 transition-transform"
                  >
                    <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-comic text-lg">评论管理</span>
                  </ComicCard>
                </Link>

                <Link href="/admin/settings">
                  <ComicCard
                    variant="default"
                    color="cream"
                    className="flex items-center gap-4 cursor-pointer hover:translate-x-1 transition-transform"
                  >
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-comic text-lg">系统设置</span>
                  </ComicCard>
                </Link>
              </div>
            </section>
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
