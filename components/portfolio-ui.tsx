"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"

// ─── Device capability ───────────────────────────────────────────────────────
// Tilt effects only make sense with a real pointer; on touch devices they just cost frames.
export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return fine
}

// Writes the pointer position into CSS vars for the `.spotlight` glow — no React state involved
export function trackSpotlight(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty("--mx", `${e.clientX - r.left}px`)
  el.style.setProperty("--my", `${e.clientY - r.top}px`)
}

// ─── 3D tilt wrapper ─────────────────────────────────────────────────────────
export function Tilt3D({
  children,
  className = "",
  max = 7,
  glare = true,
}: {
  children: React.ReactNode
  className?: string
  max?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 })
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const gx = useTransform(sx, [0, 1], ["0%", "100%"])
  const gy = useTransform(sy, [0, 1], ["0%", "100%"])
  const glareBg = useMotionTemplate`radial-gradient(500px circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 45%)`
  const rectRef = useRef<DOMRect | null>(null)

  // Same element tree either way: swapping wrappers would remount children (and their observers)
  return (
    <div className={`h-full ${className}`} style={fine ? { perspective: "1100px" } : undefined}>
      <motion.div
        ref={ref}
        onPointerEnter={fine ? () => { rectRef.current = ref.current?.getBoundingClientRect() ?? null } : undefined}
        onPointerMove={fine ? (e) => {
          const r = rectRef.current
          if (!r) return
          x.set((e.clientX - r.left) / r.width)
          y.set((e.clientY - r.top) / r.height)
        } : undefined}
        onPointerLeave={fine ? () => { x.set(0.5); y.set(0.5) } : undefined}
        style={fine ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative h-full group/tilt"
      >
        {children}
        {glare && fine && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300 mix-blend-soft-light z-20"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  )
}

// ─── Hero 3D scene: device mockups + spinning tech cube ──────────────────────
export function HeroScene() {
  const fine = useFinePointer()
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 120, damping: 20 })
  const sy = useSpring(y, { stiffness: 120, damping: 20 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-16, 16])

  return (
    <div
      ref={ref}
      className="relative w-full h-full select-none"
      style={{ perspective: "1200px" }}
      onPointerMove={fine ? (e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left) / r.width - 0.5)
        y.set((e.clientY - r.top) / r.height - 0.5)
      } : undefined}
      onPointerLeave={fine ? () => { x.set(0); y.set(0) } : undefined}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Back glow */}
        <div
          className="absolute w-[70%] h-[70%] rounded-full opacity-60 dark:opacity-40"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35), transparent 65%)", transform: "translateZ(-120px)" }}
        />

        {/* Desktop window */}
        <div
          className="absolute w-[360px] h-[230px] xl:w-[420px] xl:h-[270px] bg-white dark:bg-[#1c1c1a] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden flex flex-col"
          style={{ transform: "translateZ(20px)", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.04)" }}
        >
          <div className="h-7 w-full bg-[#f0eeea] dark:bg-[#2a2a28] border-b border-black/[0.05] dark:border-white/[0.05] flex items-center px-3 gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            <div className="mx-auto px-3 h-4 bg-black/[0.06] dark:bg-white/[0.06] rounded-full flex items-center">
              <span className="font-mono text-[8px] text-black/40 dark:text-white/40">resa.dev/app.tsx</span>
            </div>
          </div>
          <div className="flex-1 bg-[#fafaf8] dark:bg-[#161614] p-4 font-mono text-[10px] leading-[1.7] overflow-hidden">
            <div><span className="text-violet-600 dark:text-violet-300">const</span> <span className="text-black/70 dark:text-white/70">developer</span> = {"{"}</div>
            <div className="pl-4"><span className="text-sky-600 dark:text-sky-300">name</span>: <span className="text-emerald-600 dark:text-emerald-300">&apos;Resa Swastyani&apos;</span>,</div>
            <div className="pl-4"><span className="text-sky-600 dark:text-sky-300">stack</span>: [<span className="text-emerald-600 dark:text-emerald-300">&apos;Next.js&apos;</span>, <span className="text-emerald-600 dark:text-emerald-300">&apos;Laravel&apos;</span>, <span className="text-emerald-600 dark:text-emerald-300">&apos;Python&apos;</span>],</div>
            <div className="pl-4"><span className="text-sky-600 dark:text-sky-300">gpa</span>: <span className="text-amber-600 dark:text-amber-300">3.94</span>,</div>
            <div className="pl-4"><span className="text-sky-600 dark:text-sky-300">errorRate</span>: <span className="text-amber-600 dark:text-amber-300">~0</span>,</div>
            <div className="pl-4"><span className="text-sky-600 dark:text-sky-300">available</span>: <span className="text-violet-600 dark:text-violet-300">true</span>,</div>
            <div>{"}"}<span className="inline-block w-[6px] h-[11px] align-middle ml-0.5 bg-black/60 dark:bg-white/70" style={{ animation: "caret-blink 1s steps(1) infinite" }} /></div>
            <div className="mt-3 flex gap-2">
              <div className="h-10 flex-1 rounded-lg bg-indigo-500/10 border border-indigo-500/15" />
              <div className="h-10 flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15" />
              <div className="h-10 flex-1 rounded-lg bg-amber-500/10 border border-amber-500/15" />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div
          className="absolute right-[2%] bottom-[0%] w-[104px] h-[210px] bg-[#f5f4f0] dark:bg-[#2a2a28] rounded-[1.8rem] overflow-hidden flex flex-col border border-black/[0.08] dark:border-white/[0.08]"
          style={{ transform: "translateZ(110px)", boxShadow: "0 30px 60px -10px rgba(0,0,0,0.3)", animation: "float-y 6s ease-in-out infinite", ["--z" as string]: "110px" }}
        >
          <div className="absolute top-0 inset-x-0 h-4 bg-[#1a1a1a] rounded-b-xl w-[40%] mx-auto z-10" />
          <div className="w-full h-full bg-[#fafaf8] dark:bg-[#1a1a18] flex flex-col p-2 pt-6 gap-1.5">
            <div className="h-8 w-full bg-indigo-500/15 rounded-xl flex items-center px-2 gap-1">
              <div className="w-3 h-3 rounded-full bg-indigo-400/50" />
              <div className="h-1.5 bg-black/10 dark:bg-white/15 rounded-full flex-1" />
            </div>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-6 w-full bg-black/[0.04] dark:bg-white/[0.05] rounded-lg" />
            ))}
          </div>
        </div>

        {/* Spinning cube */}
        <div className="absolute left-[0%] top-[2%]" style={{ transform: "translateZ(80px)" }}>
          <div className="cube" style={{ ["--s" as string]: "78px" }}>
            <span>NEXT</span><span>PHP</span><span>PY</span><span>SQL</span><span>IoT</span><span>ML</span>
          </div>
        </div>

        {/* Floating chips */}
        <div
          className="absolute left-[6%] bottom-[6%] px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#222220]/90 border border-black/[0.08] dark:border-white/[0.1] text-[10px] font-mono text-black/60 dark:text-white/60 shadow-lg flex items-center gap-1.5"
          style={{ animation: "float-y 5s ease-in-out infinite", animationDelay: "-2s", ["--z" as string]: "140px" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> build passing
        </div>
        <div
          className="absolute right-[10%] top-[0%] px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#222220]/90 border border-black/[0.08] dark:border-white/[0.1] text-[10px] font-mono text-black/60 dark:text-white/60 shadow-lg"
          style={{ animation: "float-y 7s ease-in-out infinite", animationDelay: "-4s", ["--z" as string]: "60px" }}
        >
          IPK 3.94 ★
        </div>
      </motion.div>
    </div>
  )
}

// ─── Rotating role line in the hero ──────────────────────────────────────────
export function RoleTicker({ roles }: { roles: readonly string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => setI(v => (v + 1) % roles.length), 2400)
    return () => clearInterval(t)
  }, [roles.length])

  return (
    <span className="relative inline-grid align-bottom overflow-hidden" style={{ perspective: "400px" }} aria-live="polite">
      {roles.map((r, idx) => (
        <span
          key={r}
          className="col-start-1 row-start-1 whitespace-nowrap"
          style={{
            opacity: idx === i ? 1 : 0,
            transform: idx === i ? "translateY(0) rotateX(0deg)" : "translateY(-60%) rotateX(80deg)",
            transformOrigin: "50% 100%",
            transition: "opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)",
          }}
          aria-hidden={idx !== i}
        >
          {r}
        </span>
      ))}
    </span>
  )
}

// ─── Bento card ──────────────────────────────────────────────────────────────
export function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      onPointerMove={trackSpotlight}
      className={`spotlight reveal-3d ${inView ? "is-in" : ""} group relative rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-[#1c1c1a] overflow-hidden hover:border-black/[0.15] dark:hover:border-white/[0.15] hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.18)] [transition-property:opacity,transform,border-color,box-shadow] ${className}`}
      style={{ ["--d" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─── Pill tag ────────────────────────────────────────────────────────────────
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/45 dark:text-white/45 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.04] dark:border-white/[0.05]">
      <span className="w-1 h-1 rounded-full bg-indigo-500/70" />
      {children}
    </span>
  )
}

// ─── Skill bar ───────────────────────────────────────────────────────────────
export function SkillBar({ label, level }: { label: string; level: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-xs text-black/45 dark:text-white/45">
        <span>{label}</span>
        <span className="font-mono tabular-nums">{level}%</span>
      </div>
      <div className="h-1.5 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full w-full rounded-full origin-left bg-gradient-to-r from-black/30 to-indigo-500/70 dark:from-white/30 dark:to-indigo-400/80"
          style={{
            transform: `scaleX(${inView ? level / 100 : 0})`,
            transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.2s",
          }}
        />
      </div>
    </div>
  )
}

// ─── Shared reveal wrapper for project tiles ─────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={`reveal-3d ${inView ? "is-in" : ""} h-full ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </div>
  )
}

function BrowserBar({ label, href, accent }: { label: string; href?: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] bg-[#fafaf8] dark:bg-[#222220] shrink-0">
      <div className="flex gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
      </div>
      <div className="flex-1 h-5 bg-black/[0.05] dark:bg-white/[0.05] rounded-full flex items-center px-3 gap-1.5 min-w-0">
        {accent && (
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        )}
        <span className="text-[10px] text-black/35 dark:text-white/35 tracking-wide truncate">{label}</span>
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-7 h-7 -mr-1 rounded-lg flex items-center justify-center text-black/35 dark:text-white/35 hover:text-black dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
          title="Buka website"
          aria-label={`Open ${label}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
        </a>
      )}
    </div>
  )
}

const CARD_SHELL = "relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1a] overflow-hidden h-full flex flex-col transition-[box-shadow,border-color] duration-500 hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.3)] hover:border-black/[0.14] dark:hover:border-white/[0.16]"

// ─── Image gallery with arrows, dots & swipe (native scroll-snap) ─────────────
function Gallery({ images, title, prevLabel, nextLabel }: { images: string[]; title: string; prevLabel: string; nextLabel: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)

  const go = (to: number) => {
    const el = trackRef.current
    if (!el) return
    const n = (to + images.length) % images.length
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" })
  }

  return (
    <div className="absolute inset-0 group/gal">
      <div
        ref={trackRef}
        className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar overscroll-x-contain"
        onScroll={(e) => {
          const el = e.currentTarget
          setIdx(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
        }}
      >
        {images.map((img, i) => (
          <img
            key={img}
            src={img}
            alt={`${title} — ${i + 1}/${images.length}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="w-full h-full shrink-0 object-cover object-top snap-center"
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(idx - 1)}
            aria-label={prevLabel}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 text-white flex items-center justify-center sm:opacity-0 sm:group-hover/gal:opacity-100 focus-visible:opacity-100 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            aria-label={nextLabel}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 text-white flex items-center justify-center sm:opacity-0 sm:group-hover/gal:opacity-100 focus-visible:opacity-100 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 rounded-full bg-black/30">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}`}
                className="h-1.5 rounded-full bg-white transition-[width,opacity] duration-300"
                style={{ width: i === idx ? 14 : 6, opacity: i === idx ? 1 : 0.5 }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Project card (image based) ──────────────────────────────────────────────
export function ProjectCard({
  title, category, tech, desc, link, image, images, delay = 0, prevLabel = "Prev", nextLabel = "Next",
}: {
  title: string; category: string; tech: string; desc: string; link: string
  image?: string; images?: string[]; delay?: number; prevLabel?: string; nextLabel?: string
}) {
  const gallery = images ?? (image ? [image] : [])
  return (
    <Reveal delay={delay}>
      <Tilt3D>
        <article className={CARD_SHELL}>
          {gallery.length > 0 && (
            <div className="relative overflow-hidden h-[200px] sm:h-[220px] bg-black/[0.03] dark:bg-white/[0.03]">
              <Gallery images={gallery} title={title} prevLabel={prevLabel} nextLabel={nextLabel} />
            </div>
          )}
          <div className="p-5 sm:p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest text-black/40 dark:text-white/40 bg-black/[0.04] dark:bg-white/[0.06]">
                {category}
              </span>
              {link !== "#" && (
                <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${title}`}
                  className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-light mb-2">{title}</h3>
            <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed mb-5 flex-1">{desc}</p>
            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-wrap gap-1.5">
              {tech.split(",").map(s => (
                <span key={s} className="px-2 py-0.5 rounded-md text-[11px] text-black/45 dark:text-white/45 bg-black/[0.04] dark:bg-white/[0.06]">{s.trim()}</span>
              ))}
            </div>
          </div>
        </article>
      </Tilt3D>
    </Reveal>
  )
}

// ─── Local video card — loads only near the viewport, plays only while visible ─
export function LocalVideoEmbed({ src, title, desc, delay = 0, isLive = false }: { src: string; title: string; desc: string; delay?: number; isLive?: boolean }) {
  const near = useInView({ rootMargin: "400px 0px", threshold: 0 })            // start fetching shortly before it scrolls in
  const vis = useInView({ once: false, threshold: 0.35, rootMargin: "0px" })  // play / pause
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v || !near.inView) return
    if (vis.inView) v.play().catch(() => { })
    else v.pause()
  }, [vis.inView, near.inView])

  return (
    <Reveal delay={delay}>
      <Tilt3D max={5}>
        <article ref={near.ref} className={CARD_SHELL}>
          <BrowserBar label={title} />
          <div ref={vis.ref} className="relative aspect-video bg-black/[0.04] dark:bg-black/30 overflow-hidden">
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-black/10 dark:border-white/10 border-t-black/40 dark:border-t-white/50 animate-spin" />
              </div>
            )}
            {near.inView && (
              <video
                ref={videoRef}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => setReady(true)}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: ready ? 1 : 0 }}
                src={src}
              />
            )}
            {isLive && (
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] tracking-widest font-medium text-white bg-black/50 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE
                </div>
              </div>
            )}
          </div>
          <div className="px-5 py-4 border-t border-black/[0.05] dark:border-white/[0.05] flex-1">
            <h3 className="text-sm sm:text-base font-light text-black/80 dark:text-white/80">{title}</h3>
            <p className="text-xs sm:text-[13px] text-black/45 dark:text-white/45 mt-1 leading-relaxed">{desc}</p>
          </div>
        </article>
      </Tilt3D>
    </Reveal>
  )
}

// ─── Live website card — iframe/images mounted only when scrolled near ───────
export function LiveWebsiteEmbed({
  url, images, displayUrl, title, desc, accentColor = "#167E6C", logoText = "WEB", delay = 0, prevLabel = "Prev", nextLabel = "Next",
}: {
  url?: string; images?: string[]; displayUrl: string; title: string; desc: string
  accentColor?: string; logoText?: string; delay?: number; prevLabel?: string; nextLabel?: string
}) {
  const near = useInView({ rootMargin: "300px 0px", threshold: 0 })
  const [loaded, setLoaded] = useState(false)
  const hasImages = !!images && images.length > 0

  return (
    <Reveal delay={delay}>
      <Tilt3D max={5}>
        <article ref={near.ref} className={CARD_SHELL}>
          <BrowserBar label={displayUrl} href={url || images?.[0]} accent={accentColor} />

          <div className="relative aspect-[16/10] overflow-hidden bg-white dark:bg-[#161614]">
            {hasImages ? (
              near.inView && <Gallery images={images!} title={title} prevLabel={prevLabel} nextLabel={nextLabel} />
            ) : url && near.inView ? (
              <iframe
                src={url}
                title={title}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                scrolling="no"
                tabIndex={-1}
                className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left transition-opacity duration-700"
                style={{ width: "400%", height: "400%", transform: "scale(0.25)", opacity: loaded ? 1 : 0 }}
              />
            ) : null}

            {/* Loading skeleton (iframes only) */}
            {!hasImages && !loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                    <span className="text-[10px] font-black" style={{ color: accentColor }}>{logoText}</span>
                  </div>
                  <div className="text-[10px] text-black/30 dark:text-white/30 animate-pulse">Memuat website...</div>
                </div>
              </div>
            )}

            {/* Click-through overlay so the scaled preview opens the real site */}
            {url && !hasImages && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-[5]" aria-label={`Open ${title}`} />
            )}

            <div className="absolute top-2 right-2 z-10 pointer-events-none">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-medium text-white tracking-wide" style={{ background: accentColor }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse shrink-0" />
                LIVE WEBSITE
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-black/[0.05] dark:border-white/[0.05] flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-light text-black/80 dark:text-white/80">{title}</h3>
              <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>Live</span>
            </div>
            <p className="text-xs sm:text-[13px] text-black/45 dark:text-white/45 mt-1 leading-relaxed">{desc}</p>
          </div>
        </article>
      </Tilt3D>
    </Reveal>
  )
}
