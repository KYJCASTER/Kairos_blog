"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import { ComicButton } from "@/components/ui/comic-button"
import { ChevronLeft, Save, Eye } from "lucide-react"

// Simple markdown editor for now (can be replaced with Tiptap)
export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50)
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleSave = async (publish: boolean) => {
    setSaving(true)
    // TODO: Implement actual save with API
    console.log("Saving post:", {
      title,
      slug,
      excerpt,
      content,
      tags: tags.split(",").map((t) => t.trim()),
      published: publish,
    })
    setTimeout(() => {
      setSaving(false)
      router.push("/admin/posts")
    }, 1000)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#1A1A2E]">
        {/* Header */}
        <section className="py-4 px-4 bg-[#4361EE]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link
              href="/admin/posts"
              className="flex items-center gap-2 text-white hover:opacity-80"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-comic">返回</span>
            </Link>
            <div className="flex gap-3">
              <ComicButton
                variant="secondary"
                size="sm"
                skew={false}
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                <Save className="w-4 h-4 inline mr-1" />
                {saving ? "保存中..." : "保存草稿"}
              </ComicButton>
              <ComicButton
                variant="primary"
                size="sm"
                skew={false}
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                发布
              </ComicButton>
            </div>
          </div>
        </section>

        {/* Editor */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <ComicCard variant="default" color="white">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block font-comic text-lg mb-2">文章标题</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="输入文章标题..."
                  className="w-full px-4 py-3 border-4 border-black font-comic text-xl focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-comic text-lg mb-2">
                  URL 别名 (slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-url-slug"
                  className="w-full px-4 py-3 border-4 border-black font-comic focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-comic text-lg mb-2">摘要</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="简短描述文章内容..."
                  rows={3}
                  className="w-full px-4 py-3 border-4 border-black font-comic focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block font-comic text-lg mb-2">
                  标签 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Java, React, 教程"
                  className="w-full px-4 py-3 border-4 border-black font-comic focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-comic text-lg mb-2">文章内容</label>
                <p className="text-sm opacity-60 mb-2">
                  支持 Markdown 格式
                </p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="开始写作..."
                  rows={20}
                  className="w-full px-4 py-3 border-4 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800 resize-y"
                />
              </div>

              {/* Preview */}
              {content && (
                <div>
                  <label className="block font-comic text-lg mb-2">预览</label>
                  <div className="border-4 border-dashed border-gray-300 p-4">
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: content
                          .replace(/# (.*)/g, "<h1>$1</h1>")
                          .replace(/## (.*)/g, "<h2>$1</h2>")
                          .replace(/### (.*)/g, "<h3>$1</h3>")
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.*?)\*/g, "<em>$1</em>")
                          .replace(/`([^`]+)`/g, "<code>$1</code>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </ComicCard>
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
