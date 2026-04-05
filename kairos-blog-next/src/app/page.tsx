import { Navbar } from "@/components/navbar"
import { HeroSection } from "./sections/hero-section"
import { LatestPosts } from "./sections/latest-posts"
import { AboutPreview } from "./sections/about-preview"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <LatestPosts />
        <AboutPreview />
      </main>
      <footer className="bg-black text-white py-8 text-center">
        <p className="font-comic text-lg">© {new Date().getFullYear()} Kairos 博客</p>
        <p className="text-sm opacity-60 mt-2">Made with 💥 and ☕</p>
      </footer>
    </>
  )
}
