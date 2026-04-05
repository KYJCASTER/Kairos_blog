import Link from "next/link"
import { getPublishedPosts } from "@/lib/posts"
import { ArrowRight, Calendar, Clock } from "lucide-react"

export async function LatestPosts() {
  const posts = getPublishedPosts().slice(0, 3)

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
              最新<span className="gradient-text">文章</span>
            </h2>
            <p className="text-gray-500">探索技术世界的精彩文章</p>
          </div>
          <Link 
            href="/blog" 
            className="hidden sm:inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-semibold"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-orange-400" />
            </div>
            <p className="text-xl text-gray-500 font-medium">文章正在创作中...</p>
            <p className="text-sm text-gray-400 mt-2">在 content/posts/ 目录添加 Markdown 文件</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <article className="card overflow-hidden h-full group cursor-pointer">
                  {/* 封面图 - 使用渐变背景 */}
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <span className="text-5xl font-bold gradient-text">K</span>
                  </div>
                  
                  {/* 内容 */}
                  <div className="p-6">
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* 标题 */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-800 group-hover:text-orange-500 transition-colors">
                      {post.title}
                    </h3>
                    
                    {/* 摘要 */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {post.excerpt || "暂无摘要"}
                    </p>
                    
                    {/* 日期 */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* 移动端查看全部按钮 */}
        <div className="text-center mt-10 sm:hidden">
          <Link href="/blog">
            <button className="btn-secondary inline-flex items-center gap-2">
              查看全部文章
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
