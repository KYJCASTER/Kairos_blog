@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A personal blog by a Henan University network-engineering student, built as a
**Next.js 16 + React 19 App Router site, statically exported to GitHub Pages**
at base path `/Kairos_blog`. UI is mostly Simplified Chinese.

Content is **Markdown files in `content/posts/`** — no database, no API, no admin UI.
Adding a post = drop a new `.md` file and push.

## Commands

```bash
npm install
npm run dev           # next dev
npm run build         # next build → static export into ./dist
npm run lint          # eslint
```

There are no tests. Deployment runs automatically via `.github/workflows/deploy.yml`
on push to `master`/`main` and uploads `./dist` to GitHub Pages.

## Architecture — the non-obvious parts

### Static export with a base path
`next.config.ts` sets `output: 'export'`, `distDir: 'dist'`, `basePath: '/Kairos_blog'`.

- **No server runtime, no API routes, no server actions, no `next/image` optimizer**
  (`images.unoptimized: true`). Anything dynamic runs client-side or is precomputed
  at build.
- **Dynamic routes need `generateStaticParams()`** — see `src/app/blog/[slug]/page.tsx`.
- **Use `next/link` for internal links** — Next prepends the base path automatically.
  For hand-written `<img src>` / `<a href>` referring to assets in `public/`, prepend
  `site.basePath` (see `src/lib/site.ts`) yourself — `app-router` does NOT rewrite
  raw URLs in attributes.

### Single source of truth for site metadata
All host-name / author / domain references live in `src/lib/site.ts`. Don't hard-code.

### Content pipeline
- `src/lib/posts.ts` — gray-matter reader over `content/posts/*.md`, memoized after
  first call. Frontmatter fields: `title`, `slug`, `excerpt` (auto-derived if absent),
  `date` (YYYY-MM-DD), `tags`, `cover` (optional), `published`.
- `src/lib/markdown.ts` — `Marked` + **Shiki** dual-theme syntax highlighter
  (`github-light` / `github-dark`). Renders run inside server components, so the
  shiki tokenizer cost is paid once at build time. Heading IDs are injected here
  so the in-page TOC and `#anchor` links work.
- `src/lib/reading-time.ts` — CJK-aware reading-time. **Do not** count words with
  `split(/\s+/)` — Chinese has no spaces; use `computeReadingStats()` instead.

### Client-side search
The site has no server, so search runs entirely in the browser. `BlogIndex`
(`src/components/blog-index.tsx`) ships a small Fuse.js index built from
`getSearchIndex()` — bodies are truncated to ~2KB per post to keep the bundle small.
Don't re-introduce a server-side `searchParams` filter — it can't work under static
export and will silently no-op.

### Two designs no longer coexist
The old comic / pop-art primitives (`src/components/ui/comic-*.tsx`) and the
`admin/` + `login/` routes were removed. Public pages all share the warm-organic
tokens in `globals.css`. The `font-comic` class is gone.

### Path alias
`@/*` → `src/*`. Always prefer `@/...` over relative imports.

## Conventions

- **Next 16 async APIs**: `params` and `searchParams` are `Promise<...>` in
  server components — `await` them. New pages must match this shape.
- **Don't rely on memory for Next.js APIs.** This Next has breaking changes;
  consult `node_modules/next/dist/docs/` before writing new routing, caching,
  or data-fetching code.
- **Theme**: `next-themes` with the `class` attribute on `<html>`. Tokens live
  in `globals.css` under `:root` and `.dark`. Always reference colours through
  the CSS custom properties (`var(--primary)`, `bg-card`, etc.) so dark mode
  works automatically.
- **Typography**: serif (Fraunces) for display headings (`.serif` utility),
  Inter for body, JetBrains Mono for code and small caps labels. Fonts are
  served via `next/font/google` (self-hosted, no runtime Google request).
- **Code blocks** are wrapped in `.code-block` with a `data-lang` attribute —
  CSS shows the language pill in the top-right corner. The shiki output uses
  `--shiki-light` / `--shiki-dark` token swaps for dark mode.
