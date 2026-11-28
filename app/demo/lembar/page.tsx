import type { Metadata } from "next"
import { LembarDemo } from "@/components/demos/lembar"

export const metadata: Metadata = {
  title: "Lembar — Toko Buku (Demo konsep) · Resa Swastyani",
  description: "Demo interaktif toko buku: tarik buku dari rak, sampul terbuka, dan warna halaman mengikuti sampul.",
  robots: { index: false },
}

export default function Page() {
  return <LembarDemo />
}
