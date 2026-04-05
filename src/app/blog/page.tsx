import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import { ComicButton } from "@/components/ui/comic-button"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Search, Tag, Calendar } from "lucide-react"

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
      <main className="min-h-screen">
        {/* Header */}
        <section className="py-16 px-4 bg-[#4361EE]">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-comic text-5xl sm:text-6xl text-white mb-4 tracking-wider">
              博客文章
            </h1>
            <p className="text-white/80 text-lg">
              分享技术心得与学习笔记
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="py-8 px-4 bg-[#FEFAE0] border-b-4 border-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <form className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="search"
                    placeholder="搜索文章..."
                    defaultValue={search}
                    className="w-full pl-10 pr-4 py-3 border-4 border-black font-comic focus:outline-none focus:ring-2 focus:ring-[#4361EE]"
                  />
                </div>
                <ComicButton type="submit" variant="primary" skew={false}>
                  搜索
                </ComicButton>
              </form>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Link
                  href="/blog"
                  className={`px-3 py-1 border-2 border-black font-comic text-sm transition-all ${
                    !tagFilter ? "bg-[#4361EE] text-white" : "bg-white hover:bg-gray-100"
                  }`}
                >
                  全部
                </Link>
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}${search ? `&search=${search}` : ""}`}
                    className={`px-3 py-1 border-2 border-black font-comic text-sm transition-all ${
                      tagFilter === tag.slug
                        ? "text-white"
                        : "hover:opacity-80"
                    }`}
                    style={{
                      backgroundColor: tagFilter === tag.slug ? tag.color : "white",
                      color: tagFilter === tag.slug ? "white" : "black",
                    }}
                  >
                    {tag.name} ({tag._count.posts})
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-comic text-2xl text-gray-500">
                  {search || tagFilter ? "没有找到相关文章" : "文章正在创作中..."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post: any, index: number) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <ComicCard
                        variant={["explosion", "default", "jagged"][index % 3] as any}
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
                        <div className="flex items-center gap-4 text-xs opacity-60 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.publishedAt &&
                              format(new Date(post.publishedAt), "yyyy-MM-dd", {
                                locale: zhCN,
                              })}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag: any) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 text-xs border-2 border-black text-black"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </ComicCard>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {page > 1 && (
                      <Link
                        href={`/blog?page=${page - 1}${
                          search ? `&search=${search}` : ""
                        }${tagFilter ? `&tag=${tagFilter}` : ""}`}
                      >
                        <ComicButton variant="secondary" size="sm" skew={false}>
                          ← 上一页
                        </ComicButton>
                      </Link>
                    )}
                    <span className="px-4 py-2 font-comic border-4 border-black bg-white">
                      {page} / {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link
                        href={`/blog?page=${page + 1}${
                          search ? `&search=${search}` : ""
                        }${tagFilter ? `&tag=${tagFilter}` : ""}`}
                      >
                        <ComicButton variant="primary" size="sm" skew={false}>
                          下一页 →
                        </ComicButton>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-8 text-center">
        <p className="font-comic text-lg">
          © {new Date().getFullYear()} Kairos 博客
        </p>
        <p className="text-sm opacity-60 mt-2">Made with 💥 and ☕</p>
      </footer>
    </>
  )
}
