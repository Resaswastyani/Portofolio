"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"

// Small "back to portfolio" + "concept demo" badge shown on every demo page,
// so nobody mistakes a demo for a real shop.
export function DemoBadge({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="/#projects"
      className={`fixed left-3 bottom-3 z-[60] inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur-md transition-colors ${
        dark ? "bg-white/15 text-white hover:bg-white/25" : "bg-black/70 text-white hover:bg-black/85"
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6" /></svg>
      Demo konsep · Portfolio Resa
    </Link>
  )
}

// Writes the pointer position (-1…1) into --px / --py on the element, once per frame.
// Children read the vars for parallax, so moving the mouse never re-renders React.
export function usePointerParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return
    let raf = 0
    let x = 0, y = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x = ((e.clientX - r.left) / r.width) * 2 - 1
      y = ((e.clientY - r.top) / r.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0
        el.style.setProperty("--px", x.toFixed(3))
        el.style.setProperty("--py", y.toFixed(3))
      })
    }
    el.addEventListener("pointermove", onMove)
    return () => { el.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf) }
  }, [])
  return ref
}

export const rupiah = (n: number) => "Rp" + n.toLocaleString("id-ID")
