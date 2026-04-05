import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Search, Calendar, ArrowRight, Clock } from "lucide-react"

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
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800">
              博客<span className="gradient-text">文章</span>
            </h1>
            <p className="text-gray-500 text-lg">
              分享技术心得与学习笔记
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="card p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <form className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      placeholder="搜索文章..."
                      defaultValue={search}
                      className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border-0 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    搜索
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Link
                    href="/blog"
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      !tagFilter 
                        ? "bg-orange-500 text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    全部
                  </Link>
                  {tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}${search ? `&search=${search}` : ""}`}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        tagFilter === tag.slug
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
          <div className="max-w-5xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 card">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-orange-400" />
                </div>
                <p className="text-xl text-gray-500 font-medium">
                  {search || tagFilter ? "没有找到相关文章" : "文章正在创作中..."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post: any) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <article className="card overflow-hidden h-full group cursor-pointer">
                        <div className="aspect-video overflow-hidden">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                              <span className="text-4xl font-bold gradient-text">K</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 3).map((tag: any) => (
                              <span
                                key={tag.id}
                                className="text-xs px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-medium"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-800 group-hover:text-orange-500 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                            {post.excerpt || "暂无摘要"}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
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
                    <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 font-semibold">
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

      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Kairos Blog
          </p>
        </div>
      </footer>
    </>
  )
}
