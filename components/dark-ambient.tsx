"use client"

import { useEffect, useRef, useState } from "react"

// Ambient backdrop for dark mode only: drifting colour glows that change per section,
// floating code glyphs at different depths (far ones blurred) and a giant outlined word —
// the same ideas as a product hero, applied behind the portfolio.
// Everything animates transform/opacity only; the layer sits behind content (z -10 inside an isolated root).

const PALETTES: Record<string, { c: [string, string, string]; word: string }> = {
  about:        { c: ["rgba(99,102,241,.30)", "rgba(168,85,247,.20)", "rgba(56,189,248,.16)"], word: "ABOUT" },
  skills:       { c: ["rgba(20,184,166,.26)", "rgba(56,189,248,.18)", "rgba(132,204,22,.12)"], word: "SKILLS" },
  projects:     { c: ["rgba(249,115,22,.24)", "rgba(236,72,153,.18)", "rgba(250,204,21,.12)"], word: "WORK" },
  publications: { c: ["rgba(244,63,94,.24)", "rgba(168,85,247,.18)", "rgba(251,146,60,.12)"], word: "PAPERS" },
  experience:   { c: ["rgba(59,130,246,.28)", "rgba(14,165,233,.18)", "rgba(99,102,241,.14)"], word: "CAREER" },
  education:    { c: ["rgba(16,185,129,.24)", "rgba(250,204,21,.14)", "rgba(56,189,248,.14)"], word: "STUDY" },
  contact:      { c: ["rgba(168,85,247,.26)", "rgba(99,102,241,.20)", "rgba(236,72,153,.14)"], word: "HELLO" },
}
const DEFAULT = PALETTES.about

// x/y in %, size in px, depth 0–1.2 (bigger = closer = moves more), blur for out-of-focus ones
const GLYPHS = [
  { t: "</>", x: 6, y: 14, s: 64, d: 0.7, b: 0, r: -12, tint: true },
  { t: "{ }", x: 84, y: 10, s: 54, d: 0.5, b: 0, r: 10 },
  { t: "=>", x: 72, y: 46, s: 42, d: 0.35, b: 1.5, r: -6 },
  { t: "( )", x: 14, y: 58, s: 48, d: 0.45, b: 0, r: 14 },
  { t: ";", x: 46, y: 22, s: 40, d: 0.25, b: 2, r: 0, tint: true },
  { t: "#", x: 90, y: 72, s: 120, d: 1.15, b: 7, r: 18 },
  { t: "[ ]", x: 2, y: 86, s: 130, d: 1.2, b: 8, r: -16, tint: true },
  { t: "∑", x: 58, y: 80, s: 46, d: 0.4, b: 0, r: 8 },
  { t: "01", x: 32, y: 40, s: 34, d: 0.2, b: 2.5, r: -4 },
  { t: "</>", x: 64, y: 6, s: 30, d: 0.15, b: 3, r: 20 },
]

const RINGS = [
  { x: 24, y: 24, s: 18, d: 0.3 },
  { x: 78, y: 30, s: 12, d: 0.55 },
  { x: 40, y: 70, s: 22, d: 0.8 },
  { x: 92, y: 50, s: 10, d: 0.2 },
]

export function DarkAmbient() {
  const ref = useRef<HTMLDivElement>(null)
  const [word, setWord] = useState(DEFAULT.word)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const apply = (id: string) => {
      const p = PALETTES[id]
      if (!p) return
      el.style.setProperty("--amb1", p.c[0])
      el.style.setProperty("--amb2", p.c[1])
      el.style.setProperty("--amb3", p.c[2])
      setWord(p.word)
    }

    // A section "owns" the backdrop while it crosses the middle of the viewport
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) apply(e.target.id) }),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    )
    Object.keys(PALETTES).forEach(id => { const s = document.getElementById(id); if (s) io.observe(s) })

    let raf = 0
    let mx = 0, my = 0
    const fine = window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = (e.clientY / window.innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0
        el.style.setProperty("--mx", mx.toFixed(3))
        el.style.setProperty("--my", my.toFixed(3))
      })
    }
    if (fine) window.addEventListener("pointermove", onMove, { passive: true })

    return () => { io.disconnect(); window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div ref={ref} aria-hidden className="dark-ambient pointer-events-none fixed inset-0 -z-10 hidden dark:block overflow-hidden">
      <div className="amb-glow amb-g1" />
      <div className="amb-glow amb-g2" />
      <div className="amb-glow amb-g3" />

      <div className="amb-par absolute inset-x-0 bottom-[4vh] flex justify-center" style={{ ["--d" as string]: 0.15 }}>
        <span key={word} className="amb-word">{word}</span>
      </div>

      {RINGS.map((r, i) => (
        <span key={`r${i}`} className="amb-par absolute" style={{ left: `${r.x}%`, top: `${r.y}%`, ["--d" as string]: r.d }}>
          <span className="amb-float amb-ring" style={{ width: r.s, height: r.s, ["--t" as string]: `${9 + i * 2}s`, ["--r" as string]: "0deg" }} />
        </span>
      ))}

      {GLYPHS.map((g, i) => (
        <span key={i} className="amb-par absolute" style={{ left: `${g.x}%`, top: `${g.y}%`, ["--d" as string]: g.d }}>
          <span
            className={`amb-float amb-glyph ${g.tint ? "amb-tint" : ""}`}
            style={{
              fontSize: g.s,
              filter: g.b ? `blur(${g.b}px)` : undefined,
              ["--t" as string]: `${8 + (i % 4) * 2.5}s`,
              ["--r" as string]: `${g.r}deg`,
              animationDelay: `${-i * 1.7}s`,
            }}
          >
            {g.t}
          </span>
        </span>
      ))}
    </div>
  )
}
