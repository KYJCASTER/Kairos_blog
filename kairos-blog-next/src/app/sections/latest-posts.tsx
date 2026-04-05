import { prisma } from "@/lib/db"
import { ComicCard } from "@/components/ui/comic-card"
import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface PostWithTags {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  publishedAt: Date | null
  tags: {
    id: string
    name: string
    color: string
  }[]
}

export async function LatestPosts() {
  let posts: PostWithTags[] = []
  
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { tags: true },
    })
  } catch (error) {
    // Database not available during build, return empty state
    console.log('Database not available, showing empty state')
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-comic text-4xl sm:text-5xl text-center mb-12 tracking-wider">
          <span className="bg-[#FFD60A] px-4 py-2 border-4 border-black comic-shadow inline-block transform -rotate-2">
            最新文章
          </span>
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-comic text-2xl text-gray-500">文章正在创作中...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: PostWithTags, index: number) => (
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
                        className="px-2 py-1 text-xs border-2 border-black text-black"
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
            <span className="inline-block font-comic text-xl px-6 py-3 bg-[#4361EE] text-white border-4 border-black comic-shadow hover:comic-shadow-sm hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
              查看全部文章 →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
