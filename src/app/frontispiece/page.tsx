import type { Metadata } from "next"

import { Frontispiece } from "@/components/frontispiece"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "扉页",
  description: `${site.name} 的扉页 —— 像翻开一本厚书的前几页：印社徽记、卷首题词与一份小小的目录。`,
  alternates: { canonical: "/frontispiece" },
}

export default function FrontispiecePage() {
  return (
    <div>
      <Frontispiece mode="page" />
    </div>
  )
}
