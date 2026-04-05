import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { getPublishedPosts, getPostBySlug } from "@/lib/posts"
import { marked } from "marked"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const htmlContent = marked(post.content)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-4">
          {/* Back Link */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            返回列表
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-orange-500 prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-white"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-500 mr-2">标签:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </footer>
        </article>
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
