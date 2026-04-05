import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Search, Calendar, ArrowRight } from "lucide-react"

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = Number(searchParams.page) || 1
  const perPage = 9
  const skip = (page - 1) * perPage
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const tagFilter = typeof searchParams.tag === "string" ? searchParams.tag : ""

  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { excerpt: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(tagFilter && {
      tags: {
        some: { slug: tagFilter },
      },
    }),
  }

  let posts: any[] = []
  let totalPosts = 0
  let tags: any[] = []

  try {
    [posts, totalPosts, tags] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: perPage,
        include: { tags: true },
      }),
      prisma.post.count({ where }),
      prisma.tag.findMany({
        include: { _count: { select: { posts: true } } },
      }),
    ])
  } catch (error) {
    console.log("Database not available")
  }

  const totalPages = Math.ceil(totalPosts / perPage)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Header */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="gradient-text">博客文章</span>
            </h1>
            <p className="text-slate-400 text-lg">
              分享技术心得与学习笔记
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <form className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      name="search"
                      placeholder="搜索文章..."
                      defaultValue={search}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    搜索
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Link
                    href="/blog"
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      !tagFilter 
                        ? "bg-violet-500 text-white" 
                        : "bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    全部
                  </Link>
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}${search ? `&search=${search}` : ""}`}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        tagFilter === tag.slug
                          ? "bg-violet-500 text-white"
                          : "bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 glass-card rounded-2xl">
                <p className="text-xl text-slate-500">
                  {search || tagFilter ? "没有找到相关文章" : "文章正在创作中..."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <article className="glass-card rounded-2xl overflow-hidden h-full group cursor-pointer">
                        <div className="aspect-video overflow-hidden">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                              <span className="text-4xl font-bold gradient-text">K</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 3).map((tag: any) => (
                              <span
                                key={tag.id}
                                className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                            {post.excerpt || "暂无摘要"}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="w-3 h-3" />
                            {post.publishedAt &&
                              format(new Date(post.publishedAt), "yyyy-MM-dd", { locale: zhCN })}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {page > 1 && (
                      <Link
                        href={`/blog?page=${page - 1}${search ? `&search=${search}` : ""}${tagFilter ? `&tag=${tagFilter}` : ""}`}
                      >
                        <button className="btn-secondary">← 上一页</button>
                      </Link>
                    )}
                    <span className="px-4 py-2 rounded-xl bg-white/5 text-slate-400">
                      {page} / {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link
                        href={`/blog?page=${page + 1}${search ? `&search=${search}` : ""}${tagFilter ? `&tag=${tagFilter}` : ""}`}
                      >
                        <button className="btn-primary">下一页 →</button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Kairos Blog
          </p>
        </div>
      </footer>
    </>
  )
}
