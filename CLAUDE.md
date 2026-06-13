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
build. Deployment runs automatically via `.github/workflows/deploy.yml` on push
to `master`/`main` and uploads `./dist` to GitHub Pages. CI uses Node 20 and
`npm ci`.

## Architecture — the non-obvious parts

### Static export with a base path

`next.config.ts` sets `output: 'export'`, `distDir: 'dist'`, `basePath` and
`assetPrefix` to `/Kairos_blog`, plus `trailingSlash: true` for GitHub Pages URL
shape.

- **No server runtime, no API routes, no server actions, no `next/image` optimizer**
  (`images.unoptimized: true`). Anything dynamic must run client-side or be
  precomputed at build time.
- **Dynamic routes need `generateStaticParams()`** — see
  `src/app/blog/[slug]/page.tsx` and `src/app/tags/[slug]/page.tsx`.
- **Use `next/link` for internal links** — Next prepends the base path
  automatically. For hand-written `<img src>` / `<a href>` / `fetch()` URLs that
  refer to assets in `public/`, prepend `site.basePath` yourself (see
  `src/lib/site.ts` and `src/components/blog-index.tsx`). App Router does not
  rewrite raw attribute URLs.
- Metadata alternates and RSS links that must work on GitHub Pages should be
  absolute or hand-prefixed with `site.url`; do not assume `metadata.alternates`
  adds `basePath`.

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
  `excerpt` (auto-derived if absent), `date` (`YYYY-MM-DD`), `updated` (optional,
  for `dateModified`), `tags`, `cover`, `published`.
- `published: false` hides posts from published lists/routes and from the search
  index. `scripts/new-post.mjs` scaffolds drafts with `published: false`; switch
  it to `true` when ready.
- `src/lib/markdown.ts` uses `next-mdx-remote/rsc` + Shiki dual-theme syntax
  highlighting (`github-light` / `github-dark`). Rendering happens in server
  components during build. Heading IDs are injected here, and `extractHeadings()`
  must stay aligned so the in-page TOC and `#anchor` links work.
- Both `.md` and `.mdx` posts go through the same renderer. Custom MDX components
  are exported from `src/components/mdx/`.
- `src/lib/reading-time.ts` is CJK-aware. **Do not** count words with
  `split(/\s+/)` — Chinese has no spaces; use `computeReadingStats()` instead.

### Client-side search

The site has no server, so search runs entirely in the browser. The corpus is
built by `scripts/build-search-index.mjs` into `public/search-index.json` during
`prebuild` and at the start of `npm run dev`. `BlogIndex`
(`src/components/blog-index.tsx`) renders the year-grouped list immediately from
a lightweight props payload (no body content), then lazy-fetches the search index
and dynamically imports Fuse.js when the input is focused or `?search=...` is
present. Do not re-introduce a server-side `searchParams` filter; it cannot work
under static export and will silently no-op.

### Styling and UI conventions

- Theme is `next-themes` with the `class` attribute on `<html>`.
- Tokens live in `src/app/globals.css` under `:root` and `.dark`. Reference
  colors through CSS custom properties / Tailwind token utilities (`var(--primary)`,
  `bg-card`, etc.) so dark mode works automatically.
- Typography: Fraunces for display headings (`.serif` utility), Inter for body,
  JetBrains Mono for code and small-caps labels. Fonts are served via
  `next/font/google` (self-hosted, no runtime Google request).
- Code blocks are wrapped in `.code-block` with a `data-lang` attribute; CSS shows
  the language pill. Shiki output uses `--shiki-light` / `--shiki-dark` token
  swaps for dark mode.
- The old comic/pop-art primitives (`src/components/ui/comic-*.tsx`) and the old
  `admin/` + `login/` routes were removed. Public pages share the warm-organic
  tokens in `globals.css`; the `font-comic` class is gone.

### Imports

`@/*` maps to `src/*` in `tsconfig.json`. Prefer `@/...` over long relative
imports for source files.
