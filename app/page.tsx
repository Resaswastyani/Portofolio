"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion"
import { IntroAnimation, HERO_REVEAL_MS } from "@/components/intro-animation"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { StackingAgentCards } from "@/components/stacking-agent-cards"
import { MobileNav } from "@/components/mobile-nav"
import { DevExSection } from "@/components/devex-section"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── 3D MOCKUP COMPONENT ─────────────────────────────────────────────────────────
function TiltMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
      className="relative w-full h-full min-h-[320px] flex items-center justify-center cursor-pointer select-none"
    >
      {/* Desktop Mockup */}
      <motion.div
        className="absolute w-[340px] h-[220px] sm:w-[420px] sm:h-[270px] bg-white dark:bg-[#1c1c1a] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ transform: "translateZ(30px)", boxShadow: "0 40px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        {/* MacOS bar */}
        <div className="h-6 w-full bg-[#f0eeea] dark:bg-[#2a2a28] border-b border-black/[0.05] dark:border-white/[0.05] flex items-center px-3 gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          <div className="mx-auto w-36 h-3.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full" />
        </div>
        {/* Screen content */}
        <div className="flex-1 bg-[#fafaf8] dark:bg-[#1a1a18] p-4 flex gap-3 overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/4 flex flex-col gap-2 shrink-0">
            <div className="h-2.5 bg-black/10 dark:bg-white/10 rounded-full w-3/4" />
            <div className="h-2.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full" />
            <div className="h-2.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full w-2/3" />
            <div className="h-2.5 bg-black/[0.06] dark:bg-white/[0.06] rounded-full" />
            <div className="h-2.5 bg-indigo-400/30 rounded-full w-5/6 mt-2" />
          </div>
          {/* Main area */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-3 bg-black/10 dark:bg-white/10 rounded-full w-1/2" />
            <div className="h-2 bg-black/[0.06] dark:bg-white/[0.06] rounded-full w-3/4" />
            <div className="h-2 bg-black/[0.06] dark:bg-white/[0.06] rounded-full w-2/3" />
            <div className="mt-2 h-14 bg-indigo-400/10 rounded-lg border border-indigo-400/10" />
            <div className="h-2 bg-black/[0.06] dark:bg-white/[0.06] rounded-full w-5/6" />
            <div className="h-2 bg-black/[0.06] dark:bg-white/[0.06] rounded-full w-1/2" />
          </div>
        </div>
      </motion.div>

      {/* iPhone 13 Mockup */}
      <motion.div
        className="absolute right-[2%] bottom-[2%] sm:right-[5%] sm:bottom-[5%] w-[95px] h-[195px] sm:w-[115px] sm:h-[235px] bg-[#f5f4f0] dark:bg-[#2a2a28] rounded-[2rem] overflow-hidden flex flex-col border border-black/[0.08] dark:border-white/[0.08]"
        style={{ transform: "translateZ(90px)", boxShadow: "0 30px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.6)" }}
      >
        {/* Side buttons illusion */}
        <div className="absolute -right-[3px] top-[40px] w-[3px] h-[30px] bg-black/15 rounded-l-sm" />
        <div className="absolute -left-[3px] top-[35px] w-[3px] h-[20px] bg-black/15 rounded-r-sm" />
        <div className="absolute -left-[3px] top-[60px] w-[3px] h-[20px] bg-black/15 rounded-r-sm" />
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-5 bg-[#1a1a1a] rounded-b-xl w-[38%] mx-auto z-10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
        </div>
        {/* Screen */}
        <div className="w-full h-full bg-[#fafaf8] dark:bg-[#1a1a18] flex flex-col p-2 pt-7 gap-1.5 relative overflow-hidden">
          <div className="h-8 w-full bg-indigo-500/10 rounded-xl border border-indigo-500/10 flex items-center px-2 gap-1">
            <div className="w-3 h-3 rounded-full bg-indigo-400/30" />
            <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full flex-1" />
          </div>
          <div className="h-7 w-full bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/[0.04] dark:border-white/[0.04]" />
          <div className="h-7 w-full bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/[0.04] dark:border-white/[0.04]" />
          <div className="h-7 w-full bg-black/[0.04] dark:bg-white/[0.04] rounded-lg border border-black/[0.04] dark:border-white/[0.04]" />
          {/* Home indicator */}
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center">
            <div className="w-10 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Bento card ──────────────────────────────────────────────────────────────
function BentoCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-[#1c1c1a] overflow-hidden transition-all duration-700 hover:border-black/[0.15] dark:hover:border-white/[0.15] hover:bg-[#fafaf8] dark:hover:bg-[#222220] ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, border-color 0.3s ease, background-color 0.3s ease`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(128,128,128,0.05), transparent 60%)" }}
      />
      {children}
    </div>
  )
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 dark:text-white/40 bg-black/[0.04] dark:bg-white/[0.06]">
      {children}
    </span>
  )
}

// ─── Skill bar ────────────────────────────────────────────────────────────────
function SkillBar({ label, level }: { label: string; level: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-xs text-black/40 dark:text-white/40">
        <span>{label}</span>
        <span>{level}%</span>
      </div>
      <div className="h-1 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full bg-black/25 dark:bg-white/30 rounded-full"
          style={{
            width: inView ? `${level}%` : "0%",
            transition: "width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />
      </div>
    </div>
  )
}

// ─── 3D Project Card ─────────────────────────────────────────────────────────
function ProjectCard({
  title, category, tech, desc, link, image, images, accent = "#111", delay = 0, featured = false, isLive = false
}: {
  title: string; category: string; tech: string; desc: string; link: string;
  image?: string; images?: string[]; accent?: string; delay?: number; featured?: boolean; isLive?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 })
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])
  const { ref: inRef, inView } = useInView(0.1)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <div ref={inRef} className={featured ? "md:col-span-2" : ""} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "1000px" }}
        className="group relative rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1a] overflow-hidden cursor-pointer transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 hover:shadow-2xl h-full"
      >
        {/* Shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{ background: "radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(255,255,255,0.06), transparent 50%)" }}
        />

        {/* Image area */}
        {(image || images) && (
          <div className="relative overflow-hidden" style={{ height: featured ? "280px" : "200px" }}>
            {images ? (
              <div className="flex w-full h-full">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${title} ${i}`}
                    className="flex-1 h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ transform: "translateZ(20px)" }}
                  />
                ))}
              </div>
            ) : (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ transform: "translateZ(20px)" }}
              />
            )}
            {/* Gradient overlay on image */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, var(--bg-card) 100%)" }} />
            {/* Floating badge */}
            {isLive && (
              <div className="absolute top-3 right-3" style={{ transform: "translateZ(40px)" }}>
                <div className="px-2.5 py-1 rounded-full text-[10px] tracking-widest font-medium text-white backdrop-blur-md"
                  style={{ background: accent + "cc" }}>
                  LIVE
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col" style={{ transform: "translateZ(10px)" }}>
          <div className="flex justify-between items-start mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 dark:text-white/40 bg-black/[0.04] dark:bg-white/[0.06]">
              {category}
            </span>
            <a href={link} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-black/40 dark:text-white/40 hover:bg-black/[0.08] dark:hover:bg-white/[0.1] hover:text-black dark:hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
          </div>
          <h3 className="text-xl font-light mb-2">{title}</h3>
          <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed mb-5 flex-1">{desc}</p>
          <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-black/40 dark:text-white/40 tracking-wide">{tech}</span>
            <div className="flex gap-1">
              {tech.split(",").slice(0, 3).map((t, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/15 dark:bg-white/20" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Local Video Embed ─────────────────────────────────────────────────────────
function LocalVideoEmbed({ src, title, desc, delay = 0, isLive = false }: { src: string; title: string; desc: string; delay?: number; isLive?: boolean }) {
  const { ref: inRef, inView } = useInView(0.15)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (inView && videoRef.current) {
      videoRef.current.play().catch(() => {})
    } else if (!inView && videoRef.current) {
      videoRef.current.pause()
    }
  }, [inView])

  return (
    <div ref={inRef} className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1a] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 h-full flex flex-col"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {/* MacOS-style browser bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-black/[0.05] dark:border-white/[0.05] bg-[#fafaf8] dark:bg-[#222220] shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="flex-1 h-5 bg-black/[0.05] dark:bg-white/[0.05] rounded-full flex items-center px-3">
          <span className="text-[10px] text-black/30 dark:text-white/30 tracking-wide truncate">{title}</span>
        </div>
      </div>

      {/* Local Video Player */}
      <div className="relative flex-1 bg-black/5 dark:bg-black/30 flex items-center justify-center overflow-hidden min-h-[220px]">
        <video
          ref={videoRef}
          controls
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.7s ease" }}
        />
        {isLive && (
          <div className="absolute top-3 right-3 z-10">
            <div className="px-2.5 py-1 rounded-full text-[10px] tracking-widest font-medium text-white backdrop-blur-md bg-black/40 border border-white/10">
              LIVE
            </div>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-5 py-4 border-t border-black/[0.05] dark:border-white/[0.05] shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-light text-black/70 dark:text-white/70">{title}</h3>
            <p className="text-xs text-black/40 dark:text-white/40 mt-1 leading-relaxed">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── Live Website Iframe Embed ───────────────────────────────────────────────
function LiveWebsiteEmbed({
  url,
  displayUrl,
  title,
  desc,
  accentColor = "#167E6C",
  logoText = "WEB",
  delay = 0,
}: {
  url: string;
  displayUrl: string;
  title: string;
  desc: string;
  accentColor?: string;
  logoText?: string;
  delay?: number;
}) {
  const { ref: inRef, inView } = useInView(0.1)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loaded, setLoaded] = useState(false)

  // Auto-scroll the iframe after it loads
  useEffect(() => {
    if (!loaded || !iframeRef.current) return
    let pos = 0
    const tick = () => {
      try {
        const doc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document
        if (doc && doc.body) {
          pos += 1.2
          const max = doc.body.scrollHeight - (doc.documentElement?.clientHeight || 600)
          if (pos > max) pos = 0
          doc.documentElement.scrollTop = pos
        }
      } catch { /* cross-origin: scrolling blocked, just show the page */ }
    }
    const interval = setInterval(tick, 30)
    return () => clearInterval(interval)
  }, [loaded])

  return (
    <div
      ref={inRef}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#1c1c1a] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 h-full flex flex-col">

        {/* MacOS-style browser bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] bg-[#fafaf8] dark:bg-[#222220] shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 h-5 bg-black/[0.05] dark:bg-white/[0.05] rounded-full flex items-center px-3 gap-1.5 min-w-0">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="text-[10px] text-black/30 dark:text-white/30 tracking-wide truncate">{displayUrl}</span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-6 h-6 flex items-center justify-center text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
            title="Buka website"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>

        {/* Iframe container — scaled to fit */}
        <div className="relative flex-1 overflow-hidden min-h-[220px] bg-white">
          <iframe
            ref={iframeRef}
            src={url}
            title={title}
            onLoad={() => setLoaded(true)}
            scrolling="no"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "400%",
              height: "800px",
              border: "none",
              transformOrigin: "top left",
              transform: "scale(0.25)",
              pointerEvents: "none",
              display: "block",
              opacity: loaded && inView ? 1 : 0,
              transition: "opacity 0.7s ease",
            }}
          />

          {/* LIVE badge */}
          <div className="absolute bottom-2 right-2 z-10">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-medium text-white tracking-wide"
              style={{ background: accentColor }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse shrink-0" />
              LIVE WEBSITE
            </div>
          </div>

          {/* Loading skeleton */}
          {!loaded && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-0">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                  <span className="text-[10px] font-black" style={{ color: accentColor }}>{logoText}</span>
                </div>
                <div className="text-[10px] text-black/30 animate-pulse">Memuat website...</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3.5 border-t border-black/[0.05] dark:border-white/[0.05] shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-light text-black/70 dark:text-white/70">{title}</h3>
            <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>Live</span>
          </div>
          <p className="text-xs text-black/40 dark:text-white/40 mt-1 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  )
}







// ─── Main page ────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const handleIntroDone = useCallback(() => { setHeroReady(true) }, [])

  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-[#F5F4F0] dark:bg-[#111110] text-[#111] dark:text-[#ececea] min-h-screen font-sans antialiased transition-colors duration-300">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentic-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4"
          style={{ transform: videoReady ? "scale(1.05)" : "scale(0.85)", transition: "transform 2s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />

        {/* Gradients & blur */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "65%", background: "var(--gradient-main)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "20%", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "38%", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "55%", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", maskImage: "linear-gradient(to top, black 0%, transparent 100%)", WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)" }} />

        <div className="h-20" />

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col lg:flex-row items-end justify-between px-6 md:px-12 pb-12 gap-8">
          <div className="flex flex-col max-w-2xl">
            <h1
              className="text-6xl sm:text-7xl md:text-8xl font-light leading-[1.0] tracking-tight mb-10"
              style={{
                fontFamily: '"IBM Plex Sans", sans-serif',
                opacity: heroReady ? 1 : 0,
                filter: heroReady ? "blur(0px)" : "blur(24px)",
                transform: heroReady ? "translateY(0px)" : "translateY(32px)",
                transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, filter 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
              }}
            >
              Resa<br />Swastyani.<br />Developer &<br />Engineer.
            </h1>

            <div className="flex gap-8 sm:gap-12">
              {[
                { value: "~0%", label: "Error Rate" },
                { value: "6+", label: "Proyek Selesai" },
                { value: "3+", label: "Tahun Berpengalaman" },
              ].map((stat, i) => (
                <div key={i} style={{
                  opacity: heroReady ? 1 : 0,
                  filter: heroReady ? "blur(0px)" : "blur(16px)",
                  transform: heroReady ? "translateY(0px)" : "translateY(20px)",
                  transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${120 + i * 80}ms`,
                }}>
                  <div className="text-3xl sm:text-4xl font-light tracking-tight" style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}>{stat.value}</div>
                  <div className="text-xs text-black/40 dark:text-white/40 tracking-widest uppercase mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D Mockup — desktop only */}
          <div className="hidden lg:block w-[480px] h-[320px] shrink-0" style={{ opacity: heroReady ? 1 : 0, transition: "opacity 1.5s ease 0.8s" }}>
            <TiltMockup />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT ME
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>TENTANG SAYA</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
              {"Dedikasi tinggi pada\nkualitas & inovasi."}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" onMouseMove={handleMouse}>
            {/* Foto Profil */}
            <BentoCard className="lg:col-span-3 flex flex-col items-center justify-center p-8 min-h-[400px]" delay={0}>
              <div className="relative w-48 h-48 lg:w-full lg:h-72 rounded-2xl overflow-hidden mb-6 border border-black/[0.07] dark:border-white/[0.07]">
                <img
                  src="/images/resa.png"
                  alt="Resa Swastyani"
                  className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3"
                  }}
                />
              </div>
              <div className="text-center">
                <div className="font-pixel text-[11px] tracking-widest text-black/40 dark:text-white/40 mb-1">WEB DEVELOPER</div>
                <h3 className="text-lg font-light">Resa Swastyani</h3>
                <p className="text-xs text-black/35 dark:text-white/35 mt-1">Boyolali, Indonesia</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-black/40 dark:text-white/40">Available for work</span>
                </div>
              </div>
            </BentoCard>

            {/* Profil Teks */}
            <BentoCard className="lg:col-span-5 p-8 min-h-[400px] flex flex-col justify-between" delay={80}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h3 className="text-xl font-light mb-4">Profil Profesional</h3>
                <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed">
                  Saya seorang profesional web developer & software engineer. Saya percaya bahwa kualitas adalah kunci utama dalam menghasilkan produk teknologi yang memuaskan pengguna. Saya memiliki pengalaman dalam merancang dan mengimplementasikan pengembangan di proyek kampus dan luar kampus yang setiap fitur yang dirilis memiliki kinerja dan keandalan yang optimal dengan tingkat eror hampir 0%.
                </p>
              </div>
              <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2 mt-6">
                {[
                  { label: "Email", value: "resaarrazy@gmail.com" },
                  { label: "Telepon", value: "+62 8570 2212 770" },
                  { label: "Lokasi", value: "Ngesrep, Ngemplak, Boyolali 57375" },
                ].map(item => (
                  <div key={item.label} className="flex gap-4 text-sm">
                    <span className="text-black/30 dark:text-white/30 min-w-[60px] tracking-widest text-[11px] uppercase pt-0.5">{item.label}</span>
                    <span className="text-black/60 dark:text-white/60 font-light">{item.value}</span>
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* Skills bar card */}
            <BentoCard className="lg:col-span-4 p-8 min-h-[400px] flex flex-col justify-between" delay={160}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                </div>
                <h3 className="text-xl font-light mb-6">Technical Skills</h3>
                <div className="space-y-5">
                  <SkillBar label="Next.js / React" level={88} />
                  <SkillBar label="Laravel / PHP" level={85} />
                  <SkillBar label="Python / Scikit-learn" level={78} />
                  <SkillBar label="MySQL / Database" level={82} />
                  <SkillBar label="Bootstrap / CSS" level={90} />
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          KEY COMPETENCIES
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="skills" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>KEY COMPETENCIES</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Keahlian teknis &\nsoft skill unggulan."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-xs">
              Kombinasi keahlian teknis full-stack dengan kemampuan kepemimpinan dan manajemen yang telah teruji.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-3" onMouseMove={handleMouse}>
            <BentoCard className="col-span-12 md:col-span-8 p-8" delay={0}>
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <h3 className="text-lg font-light mb-5">Kompetensi Teknis</h3>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "React", "Laravel", "PHP", "Python", "Bootstrap", "MySQL", "Scikit-learn", "Pandas", "Streamlit", "Raspberry Pi Pico", "IoT", "REST API", "Web Server", "Machine Learning"].map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg text-sm text-black/55 dark:text-white/55 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-4 p-8" delay={80}>
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3 className="text-lg font-light mb-5">Soft Skills</h3>
              <div className="space-y-3">
                {[
                  "Leadership & Team Management",
                  "Target Oriented",
                  "Exceptional Organisation",
                  "Data Management",
                  "Analisis & Problem Solving",
                  "Microsoft Office & Spreadsheet",
                ].map(skill => (
                  <div key={skill} className="flex items-center gap-3 text-sm text-black/50 dark:text-white/50">
                    <div className="w-1 h-1 rounded-full bg-black/25 dark:bg-white/25 shrink-0" />
                    {skill}
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROJECT GALLERY — media items first
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="projects" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>PROJECT GALLERY</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Karya & inovasi\nyang telah dirilis."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-xs">
              Proyek nyata dari berbagai industri — mulai dari platform rental mobil live, desain Canva, hingga machine learning dan IoT.
            </p>
          </div>

          {/* ── Proyek Unggulan ── */}
          <div className="mb-8">
            <div className="text-[11px] text-black/25 dark:text-white/25 tracking-widest uppercase mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
              <span>Proyek Unggulan</span>
              <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LocalVideoEmbed
                src="/video/Perumahan.mp4"
                title="Property Management System"
                desc="Sistem manajemen perumahan PT Dewa Nusa Utama dengan integrasi gateway pembayaran dan user management."
                isLive={true}
              />
              <LocalVideoEmbed
                src="/video/Rupakata.mp4"
                title="Portfolio & Project Presentation"
                desc="Desain visual & presentasi profesional yang mencakup proyek kampus, materi pelatihan AI untuk guru, dan konten branding."
                isLive={true}
              />
            </div>
          </div>

          {/* ── Proyek Lainnya — media first ── */}
          <div className="text-[11px] text-black/25 dark:text-white/25 tracking-widests uppercase mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
            <span>Proyek Lainnya</span>
            <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* — DENGAN MEDIA (GAMBAR / VIDEO) DULU — */}
            <ProjectCard
              title="Maharani Transport — Car Rental Platform"
              category="Web App · Full Stack"
              tech="PHP, Bootstrap, MySQL"
              desc="Website penyewaan mobil yang live beroperasi. Dilengkapi katalog kendaraan, WooCommerce, dan pemesanan langsung via WhatsApp. Dibangun sebagai Full Stack Developer saat internship Feb–Mar 2023."
              link="https://maharanitransport.com"
              image="/images/maharani-web-preview.png"
              accent="#1e3a5f"
              delay={0}
            />
            <ProjectCard
              title="AI Training Materials"
              category="AI · Education"
              tech="AI Tools, Workshop"
              desc="Materi pelatihan AI untuk guru-guru MGMP Bahasa Inggris Kabupaten Sleman. Dirancang dan dipresentasikan oleh Resa."
              link="#"
              images={["/images/plt1 (1).jpeg", "/images/plt1 (2).jpeg"]}
              delay={80}
            />
            <LocalVideoEmbed
              src="/video/egg.mp4"
              title="Smart Egg Incubator"
              desc="Inkubator telur otomatis berbasis IoT untuk pemantauan suhu dan kelembaban real-time. Proyek kampus 2024."
            />
            <LocalVideoEmbed
              src="/video/Maharani.mp4"
              title="Maharani Transport App"
              desc="Demonstrasi platform penyewaan mobil Maharani Transport dengan sistem pemesanan via WhatsApp."
            />
            <LiveWebsiteEmbed 
              url="https://www.forexforbetterliving.com/"
              displayUrl="forexforbetterliving.com"
              title="Forex For Better Living"
              desc="Platform Edukasi & Konsultasi Forex Trading — Next.js, Robot Trading (EA), Indikator Canggih."
              accentColor="#167E6C"
              logoText="FBL"
              delay={160} 
            />
            <LiveWebsiteEmbed 
              url="https://absensielrahma.vercel.app/"
              displayUrl="absensielrahma.vercel.app"
              title="Sistem Absensi El Rahma"
              desc="Platform absensi online modern dengan fitur real-time dan rekap otomatis."
              accentColor="#0ea5e9"
              logoText="ABSEN"
              delay={240} 
            />
            <ProjectCard
              title="Water Metering & Billing"
              category="Utility"
              tech="Next.js, WA API"
              desc="Pencatatan meteran air dengan pengiriman tagihan otomatis dan notifikasi pengingat via WhatsApp API."
              link="#"
              delay={240}
            />
            <ProjectCard
              title="Student Graduation Prediction"
              category="Machine Learning"
              tech="Python, Scikit-learn"
              desc="Prediksi kelulusan mahasiswa menggunakan KNN, Decision Tree & Naïve Bayes dengan visualisasi Streamlit."
              link="#"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROFESSIONAL EXPERIENCE
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>PENGALAMAN KERJA</Tag></div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {"Rekam jejak profesional\ndi berbagai industri."}
            </RevealText>
          </div>

          <div className="space-y-3" onMouseMove={handleMouse}>
            {[
              {
                no: "01",
                role: "Leader Programmer",
                company: "CV Seven Smart Indonesia",
                period: "Juli 2025 – Sekarang",
                type: "Full-time",
                desc: "Memimpin dan mengoordinasikan tim developer dalam pengembangan aplikasi marketplace dan berbagai produk digital dengan arsitektur modern. Bertanggung jawab atas pengembangan backend menggunakan Laravel 12 dan frontend dengan Next.js.",
                stack: ["Laravel 12", "Next.js", "MySQL"],
                delay: 0,
              },
              {
                no: "02",
                role: "Fullstack Developer",
                company: "PT Agile Sapta Cahaya",
                period: "Agustus – Oktober 2025",
                type: "Contract",
                desc: "Mengembangkan aplikasi pencatatan meteran air yang terintegrasi dengan sistem pengiriman tagihan otomatis serta pengingat melalui WhatsApp. Menggunakan Next.js sebagai bahasa pemrograman utama.",
                stack: ["Next.js", "WhatsApp API", "MySQL"],
                delay: 80,
              },
              {
                no: "03",
                role: "Tim Penelitian Aplikasi Prediksi",
                company: "STMIK El Rahma Yogyakarta",
                period: "Februari – Juni 2025",
                type: "Research",
                desc: "Membuat aplikasi prediksi kelulusan mahasiswa dengan metodologi CRISP-DM, menggunakan algoritma KNN, Decision Tree, dan Naïve Bayes. Implementasi machine learning menggunakan Python (Scikit-learn, Pandas) dan Streamlit.",
                stack: ["Python", "Scikit-learn", "Streamlit", "Pandas"],
                delay: 120,
              },
              {
                no: "04",
                role: "Backend Developer",
                company: "PT Dewa Nusa Utama",
                period: "Februari – April 2025",
                type: "Contract",
                desc: "Bertanggung jawab untuk sistem backend website perumahan menggunakan Laravel, mencakup pengelolaan data properti, user management, dan integrasi pembayaran.",
                stack: ["Laravel", "PHP", "MySQL"],
                delay: 160,
              },
              {
                no: "05",
                role: "Tim Pemateri Pelatihan AI",
                company: "LPPM STMIK El Rahma",
                period: "September 2024",
                type: "Teaching",
                desc: "Kegiatan pelatihan merancang administrasi guru dengan Artificial Intelligence (AI) bagi guru-guru MGMP Bahasa Inggris Kabupaten Sleman.",
                stack: ["AI Tools", "Workshop"],
                delay: 200,
              },
              {
                no: "06",
                role: "Full Stack Web Developer",
                company: "Maharani Transport",
                period: "Februari – Maret 2023",
                type: "Internship",
                desc: "Mengembangkan dan memelihara situs web perusahaan, yang menawarkan layanan penyewaan mobil. Dibangun menggunakan Bootstrap, SQL, dan PHP.",
                stack: ["PHP", "Bootstrap", "MySQL"],
                delay: 240,
              },
            ].map((exp) => (
              <BentoCard key={exp.no} className="p-6 md:p-8 flex flex-col md:flex-row gap-6" delay={exp.delay}>
                <div className="shrink-0 flex flex-row md:flex-col md:items-start items-center gap-4 md:gap-0 md:w-48">
                  <span className="font-pixel text-[11px] text-black/20 dark:text-white/20 tracking-widest">{exp.no}</span>
                  <div className="md:mt-3">
                    <div className="text-xs text-black/25 dark:text-white/25 tracking-widest uppercase">{exp.period}</div>
                    <div className="mt-1 inline-flex px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[10px] text-black/35 dark:text-white/35 tracking-widest">{exp.type}</div>
                  </div>
                </div>
                <div className="flex-1 border-t md:border-t-0 md:border-l border-black/[0.06] dark:border-white/[0.06] pt-4 md:pt-0 md:pl-6">
                  <h3 className="text-xl font-light mb-1">{exp.role}</h3>
                  <div className="text-sm text-black/40 dark:text-white/40 mb-4">{exp.company}</div>
                  <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed mb-5">{exp.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.stack.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg text-[11px] text-black/40 dark:text-white/40 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.05]">{s}</span>
                    ))}
                  </div>
                </div>
              </BentoCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EDUCATION & CERTIFICATIONS
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="education" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>PENDIDIKAN & SERTIFIKASI</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {"Latar belakang akademik\n& prestasi profesional."}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-xs">
              Wisudawati terbaik dengan berbagai sertifikasi internasional dan penghargaan nasional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" onMouseMove={handleMouse}>
            <div className="space-y-3">
              <BentoCard className="p-8" delay={0}>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] text-black/30 dark:text-white/30 tracking-widest uppercase mb-1">2021 – 2025</div>
                    <h3 className="text-lg font-light mb-1">Sarjana Komputer (S.Kom)</h3>
                    <p className="text-sm text-black/40 dark:text-white/40">STMIK El Rahma Yogyakarta</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] border border-amber-200/60 dark:border-amber-500/30">🏆 Wisudawati Terbaik TA 2024/2025</span>
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-8" delay={80}>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] text-black/30 dark:text-white/30 tracking-widest uppercase mb-1">2018 – 2021</div>
                    <h3 className="text-lg font-light mb-1">MIPA — Matematika Ilmu Pengetahuan Alam</h3>
                    <p className="text-sm text-black/40 dark:text-white/40">SMA Negeri 5 Surakarta</p>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-8" delay={120}>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] text-black/30 dark:text-white/30 tracking-widest uppercase mb-1">2023 – 2024</div>
                    <h3 className="text-lg font-light mb-1">Ketua Umum HIMATIKA</h3>
                    <p className="text-sm text-black/40 dark:text-white/40">Himpunan Mahasiswa Informatika — STMIK El Rahma</p>
                    <p className="text-sm text-black/35 dark:text-white/35 leading-relaxed mt-2">Memimpin organisasi mahasiswa dengan program kerja lintas divisi dan kegiatan nasional.</p>
                  </div>
                </div>
              </BentoCard>
            </div>

            <div>
              <BentoCard className="p-6 h-full" delay={80}>
                <div className="text-xs text-black/30 dark:text-white/30 tracking-widest uppercase mb-6">Sertifikasi & Prestasi</div>
                <div className="space-y-4">
                  {[
                    { icon: "🏅", title: "MTCNA — MikroTik Certified Network Associate", sub: "MikroTik · 2025", highlight: true },
                    { icon: "💻", title: "HackerRank Software Engineer", sub: "HackerRank · 2025", highlight: true },
                    { icon: "🎓", title: "Peraih Pendanaan PM2W Nasional", sub: "Ditjen Diktiristek · 2023", highlight: false },
                    { icon: "🔬", title: "Penelitian Prediksi Kelulusan ML (KNN, DT, NB)", sub: "STMIK El Rahma · 2025", highlight: false },
                    { icon: "🤖", title: "Pemateri Pelatihan AI untuk Guru Sleman", sub: "LPPM STMIK El Rahma · 2024", highlight: false },
                    { icon: "📡", title: "IoT Raspberry Pi Pico — Inkubator Telur Otomatis", sub: "Proyek Kampus · 2024", highlight: false },
                  ].map((cert, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${cert.highlight ? "bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06]" : ""}`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{cert.icon}</span>
                      <div>
                        <h4 className="text-sm font-light text-black/70 dark:text-white/70">{cert.title}</h4>
                        <p className="text-xs text-black/35 dark:text-white/35 mt-0.5">{cert.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEVELOPER EXPERIENCE ──────────────────────────────────────────── */}
      <DevExSection />

      {/* ── MARQUEE — tech stack ──────────────────────────────────────────── */}
      <section className="py-0 border-t border-black/[0.06] dark:border-white/[0.06] overflow-hidden select-none">
        <div className="flex border-b border-black/[0.06] dark:border-white/[0.06]" style={{ animation: "marqueeLeft 28s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Next.js", "React", "Laravel", "PHP", "Python", "Bootstrap", "MySQL", "Scikit-Learn", "Streamlit", "IoT"].map((cap) => (
                <div key={`${rep}-${cap}`} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] dark:border-white/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20 shrink-0" />
                  <span className="text-sm text-black/45 dark:text-white/45 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex" style={{ animation: "marqueeRight 22s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Leadership", "Target Oriented", "Data Management", "Machine Learning", "API Integration", "Web Server", "Problem Solving", "Team Work", "Full-Stack Dev"].map((cap) => (
                <div key={`${rep}-${cap}`} className="flex items-center gap-6 px-10 py-5 border-r border-black/[0.06] dark:border-white/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/12 dark:bg-white/12 shrink-0" />
                  <span className="text-sm text-black/30 dark:text-white/30 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE AGENTS ────────────────────────────────────────────────────── */}
      <section id="highlight" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>DEDIKASI TANPA KOMPROMI</Tag></div>
              <RevealText className="mt-5 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
                {"Kualitas optimal,\ntingkat error ~0%."}
              </RevealText>
              <p className="mt-6 text-base text-black/40 dark:text-white/40 leading-relaxed max-w-sm">
                Setiap fitur yang saya rilis dirancang dengan standar keandalan tinggi. Pengujian menyeluruh sebelum dan sesudah deploy menjadi kebiasaan inti dalam setiap pengembangan.
              </p>
              <div className="mt-10 flex items-end gap-2">
                <LiveAgentCounter />
                <span className="text-black/30 dark:text-white/30 text-sm mb-1 tracking-wide">baris kode yang teruji</span>
              </div>
            </div>
            <div className="relative">
              <LiveAgentFeed />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — contact ────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <img src="/images/footer.png" alt="" aria-hidden="true" className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none opacity-85 dark:opacity-30" />
        <div className="absolute inset-0 pointer-events-none" style={{ maskImage: "linear-gradient(to top, transparent 0%, black 55%)", WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-cta)" }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
            Mari berkolaborasi<br />bersama saya.
          </h2>
          <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed mb-10">
            Terbuka untuk peluang kerja full-time, freelance, atau kolaborasi proyek inovatif. Hubungi saya sekarang.
          </p>
          {!submitted ? (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubmitted(true) }} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 bg-white dark:bg-[#1c1c1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-[#111] dark:text-[#ececea] placeholder:text-black/25 dark:placeholder:text-white/25 focus:outline-none focus:border-black/25 dark:focus:border-white/25 transition-colors" />
              <button type="submit" className="px-8 py-3 bg-[#111] dark:bg-[#ececea] text-white dark:text-[#111] text-sm rounded-xl hover:bg-[#333] dark:hover:bg-white transition-colors tracking-widest font-medium">HUBUNGI</button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-600/20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {"Pesan terkirim! Saya akan segera membalas."}
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <span className="font-pixel text-xs tracking-[0.25em] text-black/50 dark:text-white/50">RESA SWASTYANI</span>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              { label: "Tentang", href: "#about" },
              { label: "Skills", href: "#skills" },
              { label: "Projects", href: "#projects" },
              { label: "Pengalaman", href: "#experience" },
              { label: "Pendidikan", href: "#education" },
              { label: "Kontak", href: "#contact" },
            ].map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/35 dark:text-white/35 hover:text-black/70 dark:hover:text-white/70 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <a href="mailto:resaarrazy@gmail.com" className="text-xs text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors tracking-wide">resaarrazy@gmail.com</a>
            <span className="text-xs text-black/20 dark:text-white/20">+62 8570 2212 770</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.04] dark:border-white/[0.04] flex flex-col sm:flex-row justify-between gap-2">
          <span className="text-xs text-black/20 dark:text-white/20">© 2026 Resa Swastyani. All rights reserved.</span>
          <span className="text-xs text-black/15 dark:text-white/15">Ngesrep, Ngemplak, Boyolali 57375</span>
        </div>
      </footer>
    </div>
  )
}
