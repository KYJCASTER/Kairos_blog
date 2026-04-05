"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import { ComicButton } from "@/components/ui/comic-button"
import { Plus, Edit, Trash2, Hash } from "lucide-react"

// Mock data
const mockTags = [
  { id: "1", name: "Java", slug: "java", color: "#E63946", postCount: 5 },
  { id: "2", name: "React", slug: "react", color: "#4361EE", postCount: 3 },
  { id: "3", name: "教程", slug: "tutorial", color: "#FFD60A", postCount: 8 },
  { id: "4", name: "Go", slug: "go", color: "#2ECC71", postCount: 2 },
  { id: "5", name: "网络安全", slug: "security", color: "#7209B7", postCount: 1 },
]

export default function TagsAdminPage() {
  const [tags, setTags] = useState(mockTags)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#4361EE")

  const handleAddTag = () => {
    if (!newTagName.trim()) return

    const newTag = {
      id: Date.now().toString(),
      name: newTagName,
      slug: newTagName.toLowerCase().replace(/\s+/g, "-"),
      color: newTagColor,
      postCount: 0,
    }

    setTags([...tags, newTag])
    setNewTagName("")
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个标签吗？")) {
      setTags(tags.filter((t) => t.id !== id))
    }
  }

  const colors = [
    "#E63946",
    "#4361EE",
    "#FFD60A",
    "#2ECC71",
    "#7209B7",
    "#F39C12",
    "#1A1A2E",
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-[#1A1A2E]">
        {/* Header */}
        <section className="py-8 px-4 bg-[#7209B7]">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-comic text-3xl text-white tracking-wider">
              标签管理
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Add New Tag */}
            <section className="lg:col-span-1">
              <ComicCard variant="explosion" color="yellow">
                <h2 className="font-comic text-xl mb-4">新建标签</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-comic text-sm mb-2">
                      标签名称
                    </label>
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="例如：JavaScript"
                      className="w-full px-3 py-2 border-4 border-black font-comic focus:outline-none focus:ring-2 focus:ring-[#4361EE]"
                    />
                  </div>

                  <div>
                    <label className="block font-comic text-sm mb-2">
                      标签颜色
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewTagColor(color)}
                          className={`w-8 h-8 rounded-full border-4 ${
                            newTagColor === color
                              ? "border-black scale-110"
                              : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <ComicButton
                    variant="primary"
                    skew={false}
                    onClick={handleAddTag}
                    className="w-full"
                  >
                    <Plus className="w-5 h-5 inline mr-1" />
                    添加标签
                  </ComicButton>
                </div>
              </ComicCard>
            </section>

            {/* Tags List */}
            <section className="lg:col-span-2">
              <h2 className="font-comic text-2xl mb-6 tracking-wider">
                所有标签 ({tags.length})
              </h2>

              <div className="space-y-4">
                {tags.map((tag) => (
                  <ComicCard
                    key={tag.id}
                    variant="default"
                    color="white"
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-lg border-4 border-black flex items-center justify-center"
                        style={{ backgroundColor: tag.color }}
                      >
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-comic text-lg">{tag.name}</h3>
                        <p className="text-sm opacity-60">
                          /blog?tag={tag.slug} · {tag.postCount} 篇文章
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <ComicButton variant="primary" size="sm" skew={false}>
                        <Edit className="w-4 h-4" />
                      </ComicButton>
                      <ComicButton
                        variant="danger"
                        size="sm"
                        skew={false}
                        onClick={() => handleDelete(tag.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </ComicButton>
                    </div>
                  </ComicCard>
                ))}
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
