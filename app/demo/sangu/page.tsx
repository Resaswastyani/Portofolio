import type { Metadata } from "next"
import { SanguDemo } from "@/components/demos/sangu"

export const metadata: Metadata = {
  title: "Sangu — Tumbler & Bekal (Demo konsep) · Resa Swastyani",
  description: "Demo interaktif toko tumbler, kotak bekal, tas bekal, dan botol minum dengan pemilih produk berbentuk dial.",
  robots: { index: false },
}

export default function Page() {
  return (
    <div style={{ ["--font-demo" as string]: '"Arial Rounded MT Bold", ui-rounded, var(--font-geist), system-ui, sans-serif' }}>
      <SanguDemo />
    </div>
  )
}
