# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this repo is

A personal blog by a Henan University network-engineering student, built as a
**Next.js 16 + React 19 App Router site, statically exported to GitHub Pages**
at base path `/Kairos_blog`. UI is mostly Simplified Chinese.

Content is **Markdown/MDX files in `content/posts/`** — no database, no API, no
admin UI. Adding a post = create a `.md`/`.mdx` file and push.

## Commands

```bash
npm install
npm run dev                         # builds public/search-index.json, then next dev
npm run lint                        # eslint
npm run typecheck                   # tsc --noEmit
npm run build                       # prebuild search index, then next build static export into ./dist
npm run new-post -- "文章标题"        # scaffold a draft post under content/posts/
npm run new-post -- "文章标题" --slug=my-post --tag=Java --tag=笔记
```

There is no test script in `package.json`; CI verifies with lint, typecheck, and
build. `npm run start` exists (`next start`) but is not used in production —
GitHub Pages serves the static `./dist` output. Deployment runs automatically via
`.github/workflows/deploy.yml` on push to `master`/`main` and uploads `./dist`
to GitHub Pages. CI uses Node 20 and `npm ci`.

## Architecture — the non-obvious parts

### Static export with a base path

`next.config.ts` sets `output: 'export'`, `distDir: 'dist'`, `basePath` and
`assetPrefix` to `/Kairos_blog`, plus `trailingSlash: true` and
`skipTrailingSlashRedirect: true` for GitHub Pages URL shape.
`experimental.optimizePackageImports: ['lucide-react']` tree-shakes the icon set
in server components.

- **No server runtime, no API routes, no server actions, no `next/image` optimizer**
  (`images.unoptimized: true`). Anything dynamic must run client-side or be
  precomputed at build time.
- **Dynamic routes need `generateStaticParams()`** — see
  `src/app/blog/[slug]/page.tsx`, `src/app/tags/[slug]/page.tsx`, and
  `src/app/series/[slug]/page.tsx`.
- **Use `next/link` for internal links** — Next prepends the base path
  automatically. For hand-written `<img src>` / `<a href>` / `fetch()` URLs that
  refer to assets in `public/`, prepend `site.basePath` yourself (see
  `src/lib/site.ts` and `src/components/blog-index.tsx`). App Router does not
  rewrite raw attribute URLs.
- `site.url` (`https://kyjcaster.github.io/Kairos_blog`) **already includes the
  basePath** — build absolute URLs by appending a bare path (`${site.url}/blog/...`),
  never re-prefix `site.basePath` onto it. Prefer the helpers in
  `src/lib/site.ts`:
  - `absUrl('/blog/foo')` returns a canonical trailing-slash absolute URL.
  - `resolveImage(cover)` turns a post cover into an absolute OG image URL,
    falling back to the default `site.ogImage`.

### Next 16 caveat

This project uses a Next.js version with breaking changes. Before writing new
routing, caching, metadata, or data-fetching code, read the relevant guide in
`node_modules/next/dist/docs/` as required by `AGENTS.md`. In server components,
`params` and `searchParams` are `Promise<...>` values and must be awaited.

### Single source of truth for site metadata

All host-name, author, domain, base path, and GitHub references live in
`src/lib/site.ts`. Do not hard-code these values elsewhere.

### Content pipeline

- `src/lib/posts.ts` reads `content/posts/*.md(x)` with gray-matter and memoizes
  after first call. Frontmatter keys are strictly validated: `title`, `slug`,
  `excerpt` (auto-derived if absent), `date` (`YYYY-MM-DD`; defaults to today if
  omitted), `updated` (optional, for `dateModified`), `tags`, `cover`, `series`
  (optional; groups multi-part articles), `published`.
  - `slug` defaults to the filename (without `.md`/`.mdx`).
  - `published: false` hides posts from published lists/routes and from the search
    index. `scripts/new-post.mjs` scaffolds drafts with `published: false`; switch
    it to `true` when ready.
- Allowed frontmatter keys are **mirrored in `scripts/build-search-index.mjs`**.
  Keep them in sync — adding a key in one without the other means typo'd keys
  pass `prebuild` and only fail at build.
- `src/lib/markdown.ts` uses `next-mdx-remote/rsc` + Shiki dual-theme syntax
  highlighting (`github-light` / `github-dark`). Rendering happens in server
  components during build. Heading IDs are injected here, and `extractHeadings()`
  must stay aligned so the in-page TOC and `#anchor` links work.
- Both `.md` and `.mdx` posts go through the same renderer. Custom MDX components
  are registered in `src/components/mdx/index.ts` (`Callout`, `Figure`, `Aside`)
  and passed to `compileMDX` as `mdxComponents`.
- `src/lib/reading-time.ts` is CJK-aware. **Do not** count words with
  `split(/\s+/)` — Chinese has no spaces; use `computeReadingStats()` instead.

### Series (multi-part articles)

Posts sharing the same `series:` frontmatter value are grouped under
`/series/<slug>` (`seriesSlug` is the same `slugify` used for tags). Series logic
lives in `src/lib/posts.ts` (`getAllSeries`, `getSeriesBySlug`,
`getSeriesContext`) and is surfaced by `src/app/series/page.tsx` (index) and
`src/app/series/[slug]/page.tsx` (detail).

- **Ordering is the subtle part.** The global post cache is DESC by date, but a
  series is meant to be read from the start, so `buildSeriesInfo()` re-sorts its
  posts **ASC by date**. The series *list* page, by contrast, shows
  most-recently-updated series first. Keep these two orderings straight when
  touching series code.
- `getSeriesContext(postSlug)` gives a post its in-series `index`/`prev`/`next`,
  where `prev` = earlier and `next` = later by date (semantic to the reader, not
  the DESC cache order). This drives the in-article series navigation.

### Client-side search

The site has no server, so search runs entirely in the browser. The corpus is
built by `scripts/build-search-index.mjs` into `public/search-index.json` during
`prebuild` and at the start of `npm run dev`. `BlogIndex`
(`src/components/blog-index.tsx`) renders the year-grouped list immediately from
a lightweight props payload (no body content), then lazy-fetches the search index
and dynamically imports Fuse.js when the input is focused or `?search=...` is
present. Do not re-introduce a server-side `searchParams` filter; it cannot work
under static export and will silently no-op.

### Comments (giscus)

`src/components/comments.tsx` mounts giscus (GitHub Discussions-backed) **client-side
only and lazily**: the loader `<script>` is injected via `IntersectionObserver` once
the reader scrolls within ~300px of the comments, and theme changes are pushed to the
iframe with `postMessage` rather than remounting (so an in-progress comment draft
survives a dark-mode toggle). All giscus IDs live in the `giscus` object in
`src/lib/site.ts`; `<Comments />` renders **nothing** until `repoId` and `categoryId`
are filled in, so a fresh fork never shows a broken iframe.

### SEO & structured data

- `src/components/json-ld.tsx` emits server-rendered JSON-LD — `ArticleJsonLd` +
  `BreadcrumbJsonLd` per post and `WebsiteJsonLd` site-wide. It escapes `<`
  characters in interpolated values so a stray `</script>` in a post body can't
  break out of the JSON-LD `<script>` block; preserve that if you edit it.
- `sitemap.ts`, `robots.ts`, and `rss.xml/route.ts` are generated at build time
  under static export. Because `trailingSlash: true`, the RSS route handler is
  exported as `/rss.xml/index.html`; GitHub Pages serves `index.html` at the
  directory path, so `/rss.xml` still works for feed readers. RSS carries
  full-text `content:encoded`. Covers and the default OG image are resolved to
  absolute URLs through `site.url` / `resolveImage` — see the basePath note above.

### Styling and UI conventions

- This project uses **Tailwind CSS v4** with CSS-based configuration. There is no
  `tailwind.config.ts`; design tokens are declared in `src/app/globals.css` via
  `@theme inline` and plain CSS custom properties under `:root` / `.dark`.
- Theme is `next-themes` with the `class` attribute on `<html>`.
- Reference colors through CSS custom properties / Tailwind token utilities
  (`var(--primary)`, `bg-card`, etc.) so dark mode works automatically.
- Typography: Fraunces for display headings (`.serif` utility), Inter for body,
  JetBrains Mono for code and small-caps labels. Fonts are served via
  `next/font/google` (self-hosted, no runtime Google request).
- Code blocks are wrapped in `.code-block` with a `data-lang` attribute; CSS shows
  the language pill. Shiki output uses `--shiki-light` / `--shiki-dark` token
  swaps for dark mode.
- The old comic/pop-art primitives (`src/components/ui/comic-*.tsx`) and the old
  `admin/` + `login/` routes were removed. Public pages share the warm-organic
  tokens in `globals.css`; the `font-comic` class is gone.
- **Per-topic reading themes**: `src/lib/article-theme.ts` maps tags/series to
  one of five themes (`engineering` / `security` / `market` / `music` /
  `essay`); the article page wraps everything in a `display: contents` div with
  `data-theme`, and globals.css swaps the accent custom properties (plus drop
  cap, hr glyph, the `.theme-rule` header ornament) under that attribute. The
  first tag wins, so tag order in frontmatter is meaningful. `essay` is the
  default and has no CSS block.
- Motion: shared easing tokens (`--ease-soft/out/back`) drive everything.
  Scroll-linked flourishes use CSS `animation-timeline: view()` behind
  `@supports` + `prefers-reduced-motion` gates — never JS observers — and must
  degrade to the fully-drawn static state.
- `src/lib/utils.ts` exports `cn(...)` (clsx + tailwind-merge) and
  `formatDate(...)`. Use `cn` for conditional class composition.

### Imports

`@/*` maps to `src/*` in `tsconfig.json`. Prefer `@/...` over long relative
imports for source files.

### Legacy / excluded directories

`backup-vite/` is the previous Vite-based version of the blog, excluded from
TypeScript (`tsconfig.json`) and ESLint. Do not import from it.
