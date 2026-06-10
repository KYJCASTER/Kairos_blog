import type { Metadata } from "next"
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WebsiteJsonLd } from "@/components/json-ld"
import { site } from "@/lib/site"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
})

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  // Variable font — weight stays "variable" so the axes config is allowed.
  style: ["normal", "italic"],
  axes: ["opsz"],
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.language}
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}
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
        </ThemeProvider>
        <WebsiteJsonLd />
      </body>
    </html>
  )
}
