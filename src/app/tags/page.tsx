import { prisma } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import Link from "next/link"
import { Tag, Hash } from "lucide-react"

export default async function TagsPage() {
  let tags: any[] = []

  try {
    tags = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
    })
  } catch (error) {
    console.log("Database not available")
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Header */}
        <section className="py-16 px-4 bg-[#7209B7]">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-comic text-5xl sm:text-6xl text-white mb-4 tracking-wider">
              标签云
            </h1>
            <p className="text-white/80 text-lg">
              按主题浏览文章
            </p>
          </div>
        </section>

        {/* Tags Grid */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {tags.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-comic text-2xl text-gray-500">暂无标签</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tags.map((tag: any, index: number) => (
                  <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                    <ComicCard
                      variant={[ "default", "explosion", "jagged" ][index % 3] as any}
                      color="white"
                      className="h-full transform hover:-translate-y-2 hover:rotate-1 transition-all cursor-pointer text-center"
                    >
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-4 border-black"
                        style={{ backgroundColor: tag.color }}
                      >
                        <Hash className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-comic text-2xl mb-2">{tag.name}</h3>
                      {tag.description && (
                        <p className="text-sm opacity-60 mb-3 line-clamp-2">
                          {tag.description}
                        </p>
                      )}
                      <p className="font-comic text-lg">
                        <span
                          className="px-3 py-1 border-2 border-black inline-block"
                          style={{ backgroundColor: tag.color, color: "white" }}
                        >
                          {tag._count.posts} 篇文章
                        </span>
                      </p>
                    </ComicCard>
                  </Link>
                ))}
              </div>
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
