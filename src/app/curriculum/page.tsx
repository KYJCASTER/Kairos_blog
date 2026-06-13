import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, GraduationCap, Wrench, Compass } from "lucide-react"

import { SectionOrnament } from "@/components/section-ornament"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "学习足迹",
  description: "Kairos 的课程档案、自学清单、读物与工具栈——一页持续修订的学习地图。",
  alternates: { canonical: "/curriculum" },
}

/**
 * The page is a public mirror of "我硬盘里的大学" — public on purpose, so
 * fellow students at HEU and elsewhere have a place to peek over the shoulder.
 *
 * Data lives inline (same shape as `/about` does it). Update frequency is low
 * and the field set is stable; an extra lib file just buys indirection.
 */

type Status = "done" | "doing" | "gnawing"

interface Entry {
  /** Display name. CJK + ASCII both fine. */
  name: string
  /** When-completed / when-began label. */
  meta?: string
  status: Status
  /** One-line memory or remark. */
  note?: string
}

interface Group {
  /** Mono small-caps eyebrow. */
  eyebrow: string
  /** Serif h2 title. */
  title: string
  icon: typeof BookOpen
  /** One-paragraph framing for the group. */
  intro: string
  entries: Entry[]
}

const groups: Group[] = [
  {
    eyebrow: "Coursework",
    title: "在校课程",
    icon: GraduationCap,
    intro:
      "网络工程的本科课程表，按学期收录我有写过实验报告、留下过代码或截图的科目。状态一格一更——做完一格才能往后写。",
    entries: [
      {
        name: "C 语言程序设计",
        meta: "2024 秋",
        status: "done",
        note: "约 600 行的链表 test.c 是这门课最长的一份作业；指针第一次让我“看见了”内存。",
      },
      {
        name: "C++ 程序设计",
        meta: "2025 春",
        status: "done",
        note: "集合操作大题写到凌晨；至今记得 set/map 是 RB-tree 的味道。",
      },
      {
        name: "数据结构",
        meta: "2025 春",
        status: "done",
        note: "栈、队列、二叉树——为后来读 LeetCode 刷题打了底。",
      },
      {
        name: "数字逻辑 / Logisim",
        meta: "2025 秋",
        status: "done",
        note: "用 Logisim 拼了一台单总线 CPU。看到自己写的指令真的跑起来那种感觉很难形容。",
      },
      {
        name: "数据库原理 (SQL)",
        meta: "2025 秋",
        status: "done",
        note: "8 个上机实验全打卡，至今 ER 图和范式分解的肌肉记忆还在。",
      },
      {
        name: "鸿蒙应用开发 / ArkTS",
        meta: "2025 秋 - 2026 春",
        status: "done",
        note: "8 综合 + 12 模块化实验。课程不是我最爱的，但 ArkTS 让我提前接触了声明式 UI。",
      },
      {
        name: "计算机网络",
        meta: "2026 春",
        status: "done",
        note: "第一次抓包看见三次握手，对“网络”这两个字的理解才真正落地。",
      },
      {
        name: "操作系统",
        meta: "2026 秋",
        status: "doing",
        note: "进程、虚存、调度——和正在啃的 Java 并发互相印证。",
      },
      {
        name: "计算机组成原理",
        meta: "2026 秋",
        status: "doing",
        note: "和 Logisim 那门课接得上；指令周期开始变成具体的时钟节拍。",
      },
    ],
  },
  {
    eyebrow: "Self-study",
    title: "自学清单",
    icon: Compass,
    intro:
      "课表外的功课。三年下来基本是“被某段代码绊倒 → 找一本书 → 啃完 → 再写一篇博客”的循环。",
    entries: [
      {
        name: "Java 并发编程",
        status: "gnawing",
        note: "synchronized、AQS、线程池——一边读《Java 并发编程实战》一边在玩具项目里手写。",
      },
      {
        name: "Go 语言 + Gin / GORM / Redis",
        status: "doing",
        note: "目前的主线。Gin + GORM + Redis + JWT 的玩具后端正在写，准备开源。",
      },
      {
        name: "网络安全基础",
        status: "doing",
        note: "DNS 投毒只是开篇——希望今年内补上 ARP、TLS、Web 漏洞三条线。",
      },
      {
        name: "算法 / 灵神题单",
        status: "doing",
        note: "跟着灵茶山艾府的题单刷，主要为了把 Go 写顺手。",
      },
      {
        name: "Linux 运维基础",
        status: "doing",
        note: "在自己的 VPS 上跑这个博客 + 几个小服务，systemd / nginx / cron 都自己折腾过。",
      },
    ],
  },
  {
    eyebrow: "Reading",
    title: "读物 / 教程",
    icon: BookOpen,
    intro:
      "读完才敢列。还在啃的不放进来——免得变成立 flag 的清单。",
    entries: [
      {
        name: "《Go 语言圣经》",
        meta: "2026 夏",
        status: "done",
        note: "一行一行抄完了。它让我相信“类型系统可以又简单又锋利”。",
      },
      {
        name: "枫枫《Gin 框架开发实战》",
        meta: "2026 夏",
        status: "done",
        note: "第一份让我从 0 写到部署的后端教程；project layout 的肌肉记忆来自这里。",
      },
      {
        name: "《Java 核心技术 卷 I》",
        meta: "2024 冬 - 2025 春",
        status: "done",
        note: "Java 入门书。写《Java 学习笔记》就是一边读一边整理出来的。",
      },
      {
        name: "灵茶山艾府《算法竞赛进阶指南》题单",
        status: "doing",
        note: "按题单刷，现在停在二分 / 双指针 / 滑窗这一档。",
      },
      {
        name: "《Java 并发编程实战》",
        status: "gnawing",
        note: "在啃。线程安全那几章读了三遍，仍觉得每次都能抠出新东西。",
      },
    ],
  },
  {
    eyebrow: "Tools",
    title: "工具栈",
    icon: Wrench,
    intro:
      "“工欲善其事”那一类。挑的标准是：装一次能用三年的东西。",
    entries: [
      {
        name: "Linux (Arch / Debian)",
        status: "doing",
        note: "笔记本主力 Arch；服务器跑 Debian。每次重装都比上一次更快。",
      },
      {
        name: "Wireshark",
        status: "done",
        note: "网络工程身份的“开光”工具。第一次看见包，之前所有抽象图都活了过来。",
      },
      {
        name: "Docker",
        status: "doing",
        note: "本机和 VPS 上多服务的标配。Compose 写得越来越像母语了。",
      },
      {
        name: "Git",
        status: "done",
        note: "rebase / cherry-pick / reflog 这一套终于不用现查了。",
      },
      {
        name: "Neovim + LazyVim",
        status: "doing",
        note: "主力 IDE。Go / TS / Markdown 三个语言写起来都很顺。",
      },
      {
        name: "tmux",
        status: "done",
        note: "会话恢复救过我太多次。",
      },
    ],
  },
]

const statusMap: Record<Status, { label: string; ink: string }> = {
  done: { label: "已完成", ink: "var(--success)" },
  doing: { label: "进行中", ink: "var(--primary)" },
  gnawing: { label: "在啃", ink: "var(--accent)" },
}

function StatusBadge({ status }: { status: Status }) {
  const { label, ink } = statusMap[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-light"
      title={label}
    >
      <span
        aria-hidden
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ background: ink }}
      />
      {label}
    </span>
  )
}

export default function CurriculumPage() {
  const total = groups.reduce((acc, g) => acc + g.entries.length, 0)
  const lastUpdated = new Date().toISOString().slice(0, 10)

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      {/* Hero */}
      <section className="max-w-3xl mx-auto mb-16">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
          Curriculum
        </p>
        <h1 className="serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-5">
          学习足迹
        </h1>
        <p className="text-muted leading-relaxed max-w-2xl">
          这里是我亲手翻修过的每一格抽屉——课程作业、自学清单、读过的书、用过的兵器。
          一篇博客太碎、一份简历太干，所以单独留出这一页。
          标记会持续更新；若哪格还空着，那就是我还没写完。
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mt-6">
          共 {total} 条 · 持续更新中
        </p>
      </section>

      <SectionOrnament variant="diamond" />

      {/* Group sections */}
      <div className="max-w-3xl mx-auto space-y-20">
        {groups.map((group, gi) => {
          const Icon = group.icon
          return (
            <section key={group.eyebrow}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-full bg-surface border hairline inline-flex items-center justify-center text-primary">
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-light">
                    {group.eyebrow}
                  </p>
                  <h2 className="serif text-2xl sm:text-3xl font-semibold text-foreground">
                    {group.title}
                  </h2>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-7 max-w-2xl">
                {group.intro}
              </p>

              <ol className="space-y-4 border-l border-border-strong/50 pl-6">
                {group.entries.map((entry) => (
                  <li key={entry.name} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[27px] top-2 w-2 h-2 rounded-full bg-primary/70 ring-4 ring-background"
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="serif text-lg font-semibold text-foreground">
                        {entry.name}
                      </h3>
                      {entry.meta && (
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-light tabular-nums">
                          {entry.meta}
                        </span>
                      )}
                      <StatusBadge status={entry.status} />
                    </div>
                    {entry.note && (
                      <p className="text-sm text-muted leading-relaxed mt-1.5">
                        {entry.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              {gi < groups.length - 1 && <SectionOrnament variant="rule" />}
            </section>
          )
        })}
      </div>

      {/* Colophon */}
      <SectionOrnament variant="diamond" />
      <section className="max-w-3xl mx-auto text-center">
        <p className="serif italic text-sm text-muted leading-relaxed">
          一格一格慢慢钉。如果你也在学这些，欢迎到《
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            关于
          </Link>
          》页找我聊。
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mt-4">
          上次修订 · {lastUpdated}
        </p>

        <div className="mt-8 flex justify-center">
          <Link href="/blog" className="btn-primary">
            读我的文章
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <p className="sr-only">本页内容由 {site.author} 维护。</p>
    </main>
  )
}
