// Component map handed to MDX. Each key is the JSX tag name authors can use
// inside .mdx files. Keep this list short — every component here is part of
// the public authoring vocabulary.

import { Callout } from "./callout"
import { Figure } from "./figure"
import { Aside } from "./aside"

export const mdxComponents = {
  Callout,
  Figure,
  Aside,
}

export { Callout, Figure, Aside }
