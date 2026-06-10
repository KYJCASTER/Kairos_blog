import { HeroSection } from "./sections/hero-section"
import { LatestPosts } from "./sections/latest-posts"
import { AboutPreview } from "./sections/about-preview"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LatestPosts />
      <AboutPreview />
    </div>
  )
}
