import { Frontispiece } from "@/components/frontispiece"
import { HeroSection } from "./sections/hero-section"
import { LatestPosts } from "./sections/latest-posts"
import { AboutPreview } from "./sections/about-preview"
import { SectionOrnament } from "@/components/section-ornament"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Frontispiece: occupies the first viewport as an entry curtain.
          Its "Turn ↓" CTA anchors to #beyond below, smooth-scrolling
          the reader into the home content. */}
      <Frontispiece mode="intro" />

      {/* The fold beyond the frontispiece — the home page proper. The
          id is the anchor target for the frontispiece's Turn CTA. */}
      <div id="beyond" className="scroll-mt-20">
        <HeroSection />
        <SectionOrnament />
        <LatestPosts />
        <SectionOrnament variant="rule" />
        <AboutPreview />
      </div>
    </div>
  )
}
