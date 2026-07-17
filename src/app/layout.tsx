import type { Metadata } from "next"
import { Inter, Fraunces, JetBrains_Mono, Noto_Serif_SC } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { SearchPalette } from "@/components/search-palette"
import { WebsiteJsonLd } from "@/components/json-ld"
import { site, rssAlternates } from "@/lib/site"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  // Variable font — weight stays "variable" so the axes config is allowed.
  // SOFT/WONK add the nib-and-ink character the display headings lean on.
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
})

// CJK display serif — pairs with Fraunces for Chinese headings/quotes.
// Variable weight; CJK subsets load on demand via unicode-range (only
// latin is preloaded), so the per-page cost stays small.
const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: ["技术博客", "Java", "Go", "Python", "React", "Next.js", "网络安全"],
  authors: [{ name: site.author }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/og-default.png"],
  },
  alternates: {
    canonical: "/",
    // metadata.alternates does NOT auto-prefix basePath, so the URL must be
    // absolute. Shared with article pages via rssAlternates so feed discovery
    // never drifts. Without it the <link rel="alternate"> would point at
    // /rss.xml on the bare domain and 404 on GitHub Pages.
    types: rssAlternates,
  },
  // Favicon comes from the file-convention `src/app/favicon.ico`, which Next
  // serves under the basePath. A manual `icons: "/favicon.ico"` here would
  // resolve against the bare domain root and 404 on GitHub Pages.
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.language}
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${notoSerif.variable} ${mono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            跳转到主要内容
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <SearchPalette />
        </ThemeProvider>
        <WebsiteJsonLd />
      </body>
    </html>
  )
}
