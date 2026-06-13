import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { site } from "@/lib/site"
import { Reveal } from "@/components/reveal"

export function AboutPreview() {
  return (
    <section className="py-20 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="card p-8 sm:p-12">
            <div className="grid sm:grid-cols-[auto_1fr] gap-8 items-start">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/18 via-accent-light/12 to-transparent blur-xl" />
                <div className="relative w-full h-full rounded-full border hairline-strong bg-card p-1 shadow-sm transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.015] hover:rotate-[-0.8deg]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- next/image disabled by output:export */}
                  <img
                    src={`${site.basePath}/avatar.svg`}
                    alt={site.author}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                  关于作者
                </p>
                <h2 className="serif text-2xl sm:text-3xl font-semibold leading-tight text-foreground mb-4">
                  你好，我是 <span className="italic text-primary">{site.name}</span>。
                </h2>
                <p className="text-muted leading-relaxed mb-6">
                  我是河南大学 2024 级网络工程专业的学生。平时写代码、折腾计算机网络，
                  也爱听 Dubstep / Bass Music，看英雄联盟比赛。
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-300 group"
                >
                  更多关于我
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
