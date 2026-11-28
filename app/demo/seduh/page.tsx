import type { Metadata } from "next"
import { SeduhDemo } from "@/components/demos/seduh"

export const metadata: Metadata = {
  title: "Seduh — Kopi Drip Bag Nusantara (Demo konsep) · Resa Swastyani",
  description: "Demo interaktif kopi drip bag: sachet berserakan, klik untuk mendekat, balik untuk melihat profil rasa dan cara seduh.",
  robots: { index: false },
}

export default function Page() {
  return <SeduhDemo />
}
