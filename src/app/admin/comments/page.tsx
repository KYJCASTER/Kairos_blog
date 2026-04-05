"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import { ComicButton } from "@/components/ui/comic-button"
import { Trash2, Check, MessageSquare } from "lucide-react"

// Mock data
const mockComments = [
  {
    id: "1",
    authorName: "张三",
    authorEmail: "zhangsan@example.com",
    content: "写得真不错，学到了很多！",
    postTitle: "Java 并发编程指南",
    createdAt: "2025-03-20",
    approved: true,
  },
  {
    id: "2",
    authorName: "李四",
    authorEmail: "lisi@example.com",
    content: "请问有源码可以参考吗？",
    postTitle: "React Hooks 深度解析",
    createdAt: "2025-03-18",
    approved: false,
  },
  {
    id: "3",
    authorName: "王五",
    authorEmail: "wangwu@example.com",
    content: "期待更多类似的教程！",
    postTitle: "Go 语言入门教程",
    createdAt: "2025-03-15",
    approved: true,
  },
]

export default function CommentsAdminPage() {
  const [comments, setComments] = useState(mockComments)
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all")

  const filteredComments = comments.filter((comment) => {
    if (filter === "pending") return !comment.approved
    if (filter === "approved") return comment.approved
    return true
  })

  const handleApprove = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, approved: true } : c))
    )
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这条评论吗？")) {
      setComments(comments.filter((c) => c.id !== id))
    }
  }

  const pendingCount = comments.filter((c) => !c.approved).length

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#1A1A2E]">
        {/* Header */}
        <section className="py-8 px-4 bg-[#2ECC71]">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-comic text-3xl text-white tracking-wider">
              评论管理
            </h1>
            {pendingCount > 0 && (
              <p className="text-white/80 mt-2">
                有 {pendingCount} 条评论待审核
              </p>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {[
              { key: "all", label: "全部", count: comments.length },
              { key: "pending", label: "待审核", count: pendingCount },
              {
                key: "approved",
                label: "已通过",
                count: comments.length - pendingCount,
              },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as any)}
                className={`px-4 py-2 border-4 font-comic transition-all ${
                  filter === f.key
                    ? "border-black bg-[#4361EE] text-white"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-comic text-xl text-gray-500">
                  没有找到评论
                </p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <ComicCard
                  key={comment.id}
                  variant="default"
                  color={comment.approved ? "white" : "yellow"}
                  className="relative"
                >
                  {!comment.approved && (
                    <div className="absolute top-0 right-0 bg-[#FFD60A] border-l-4 border-b-4 border-black px-3 py-1 font-comic text-sm">
                      待审核
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#4361EE] rounded-full flex items-center justify-center font-comic text-white">
                          {comment.authorName[0]}
                        </div>
                        <div>
                          <p className="font-comic">{comment.authorName}</p>
                          <p className="text-xs opacity-60">
                            {comment.authorEmail}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3 pl-13">
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-4 text-xs opacity-50">
                        <span>文章: {comment.postTitle}</span>
                        <span>{comment.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      {!comment.approved && (
                        <ComicButton
                          variant="primary"
                          size="sm"
                          skew={false}
                          onClick={() => handleApprove(comment.id)}
                        >
                          <Check className="w-4 h-4" />
                        </ComicButton>
                      )}
                      <ComicButton
                        variant="danger"
                        size="sm"
                        skew={false}
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </ComicButton>
                    </div>
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
