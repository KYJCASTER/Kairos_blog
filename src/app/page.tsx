import { HeroSection } from "./sections/hero-section"
import { LatestPosts } from "./sections/latest-posts"
import { AboutPreview } from "./sections/about-preview"
import { SectionOrnament } from "@/components/section-ornament"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SectionOrnament />
      <LatestPosts />
      <SectionOrnament variant="rule" />
      <AboutPreview />
    </div>
  )
}
