"use client"

import React, { useEffect, useState, useCallback } from "react"
import { IntroAnimation } from "@/components/intro-animation"
import { PixelIcon } from "@/components/pixel-icon"
import { LiveAgentFeed, LiveAgentCounter } from "@/components/live-agent-feed"
import { RevealText } from "@/components/reveal-text"
import { MobileNav } from "@/components/mobile-nav"
import { DevExSection } from "@/components/devex-section"
import { useLang } from "@/components/lang-provider"
import { useInView } from "@/hooks/use-in-view"
import {
  BentoCard, Tag, SkillBar, ProjectCard, LocalVideoEmbed, LiveWebsiteEmbed,
  HeroScene, RoleTicker,
} from "@/components/portfolio-ui"

const HERO_VIDEO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agentic-hero-9yW3wnTNMfn2U6lsVhTTZSJFEvAoSj.mp4"

// ─── Hero background video — paused while scrolled away ──────────────────────
function HeroVideo({ ready }: { ready: boolean }) {
  const { ref, inView } = useInView<HTMLVideoElement>({ once: false, threshold: 0, rootMargin: "0px" })
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView) v.play().catch(() => { })
    else v.pause()
  }, [inView, ref])
  return (
    <video
      ref={ref}
      autoPlay loop muted playsInline
      preload="auto"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover z-0"
      src={HERO_VIDEO}
      style={{
        transform: ready ? "scale(1.04)" : "scale(0.9)",
        transition: "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform",
      }}
    />
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { t } = useLang()
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const handleIntroDone = useCallback(() => { setHeroReady(true) }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    const subject = encodeURIComponent("Collaboration Inquiry — Portfolio")
    const body = encodeURIComponent(`Halo Resa,\n\nSaya tertarik untuk berkolaborasi.\n\nEmail saya: ${email}\n\nSalam,`)
    window.location.href = `mailto:resaarrazy@gmail.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  // Shared entrance style for hero elements (opacity + transform only)
  const heroIn = (delay: number): React.CSSProperties => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? "translate3d(0,0,0)" : "translate3d(0,28px,0)",
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  })

  return (
    <div id="top" className="bg-[#F5F4F0] dark:bg-[#111110] text-[#111] dark:text-[#ececea] min-h-screen font-sans antialiased">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      <main>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-[100svh] overflow-hidden flex flex-col">
        <HeroVideo ready={heroReady} />

        {/* Single gradient fade (replaces stacked backdrop blurs — much cheaper to scroll over) */}
        <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none" style={{ height: "75%", background: "var(--gradient-main)" }} />

        {/* Animated perspective grid */}
        <div className="absolute inset-x-[-20%] bottom-0 h-[45%] z-10 pointer-events-none opacity-70" aria-hidden="true">
          <div className="grid-floor absolute inset-0" />
        </div>

        {/* Small 3D cube for mobile & tablet (desktop gets the full scene) */}
        <div className="lg:hidden absolute top-24 right-6 sm:top-28 sm:right-10 z-20 pointer-events-none" style={{ perspective: "700px", ...heroIn(500) }} aria-hidden="true">
          <div className="cube" style={{ ["--s" as string]: "64px" }}>
            <span>NEXT</span><span>PHP</span><span>PY</span><span>SQL</span><span>IoT</span><span>ML</span>
          </div>
        </div>

        <div className="flex-1" />

        {/* Hero content */}
        <div className="relative z-30 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between px-5 sm:px-6 md:px-12 pb-10 sm:pb-16 pt-32 gap-10">
          <div className="flex flex-col max-w-2xl w-full">
            <div style={heroIn(0)} className="mb-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-wide bg-white/70 dark:bg-black/30 border border-black/[0.06] dark:border-white/[0.1] text-black/60 dark:text-white/60">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                  <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
                </span>
                {t.heroBadge}
              </span>
            </div>

            <h1
              className="font-display text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-light tracking-tight mb-5"
              style={heroIn(60)}
            >
              Resa<br />Swastyani<span className="text-indigo-500">.</span>
            </h1>

            <div className="font-display text-xl sm:text-2xl md:text-3xl font-light text-black/55 dark:text-white/60 mb-8 flex flex-wrap items-baseline gap-x-2" style={heroIn(140)}>
              <span className="font-mono text-indigo-500/80 text-base sm:text-lg">&gt;</span>
              <RoleTicker roles={t.heroRoles} />
            </div>

            <div className="flex flex-col min-[420px]:flex-row gap-3 mb-10" style={heroIn(220)}>
              <a
                href="#projects"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#111] dark:bg-[#ececea] text-white dark:text-[#111] text-sm font-medium tracking-wide shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-transform duration-200"
              >
                {t.heroCtaPrimary}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-200 group-hover:translate-x-0.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-white/60 dark:bg-white/[0.04] text-sm tracking-wide text-black/75 dark:text-white/80 hover:bg-white dark:hover:bg-white/[0.08] hover:-translate-y-0.5 transition-[transform,background-color] duration-200"
              >
                {t.heroCtaSecondary}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-10 max-w-md">
              {t.heroStats.map((stat, i) => (
                <div key={i} style={heroIn(300 + i * 80)}>
                  <div className="font-display text-2xl sm:text-4xl font-light tracking-tight">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-black/45 dark:text-white/45 tracking-widest uppercase mt-1 leading-snug">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D scene — desktop only */}
          <div className="hidden lg:block w-[460px] xl:w-[520px] h-[380px] shrink-0" style={{ opacity: heroReady ? 1 : 0, transition: "opacity 1.2s ease 0.5s" }}>
            <HeroScene />
          </div>
        </div>

        {/* Scroll cue */}
        <a href="#about" aria-label="Scroll to about" className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-black/40 dark:text-white/40 hover:text-black/70 dark:hover:text-white/70 transition-colors" style={heroIn(700)}>
          <span className="w-5 h-8 rounded-full border border-current flex justify-center pt-1.5">
            <span className="w-0.5 h-1.5 rounded-full bg-current" style={{ animation: "scroll-cue 1.6s ease-in-out infinite" }} />
          </span>
          {t.scrollHint}
        </a>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT ME
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-20 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 md:mb-16">
            <PixelIcon type="platform" size={40} />
            <div className="mt-4"><Tag>{t.aboutTag}</Tag></div>
            <RevealText className="mt-5 text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
              {t.aboutHeading}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Foto Profil */}
            <BentoCard className="lg:col-span-3 flex flex-col items-center justify-center p-6 sm:p-8 lg:min-h-[400px]" delay={0}>
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-full lg:h-72 rounded-2xl overflow-hidden mb-6 border border-black/[0.07] dark:border-white/[0.07] shadow-[0_20px_40px_-20px_rgba(0,0,0,0.35)]">
                <img
                  src="/images/resa.webp"
                  alt="Resa Swastyani"
                  width={900}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0 transition-[filter,transform] duration-700 group-hover:scale-[1.03]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3"
                  }}
                />
              </div>
              <div className="text-center">
                <div className="font-pixel text-[11px] tracking-widest text-black/40 dark:text-white/40 mb-1">{t.aboutSubLabel}</div>
                <h3 className="text-lg font-light">Resa Swastyani</h3>
                <p className="text-xs text-black/35 dark:text-white/35 mt-1">{t.aboutLocation}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-black/40 dark:text-white/40">{t.aboutAvailable}</span>
                </div>
              </div>
            </BentoCard>

            {/* Profil Teks */}
            <BentoCard className="lg:col-span-5 p-6 sm:p-8 lg:min-h-[400px] flex flex-col justify-between" delay={80}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <h3 className="text-xl font-light mb-4">{t.profileTitle}</h3>
                <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed">
                  {t.profileDesc}
                </p>
              </div>
              <div className="pt-6 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2 mt-6">
                {t.contactInfo.map(item => (
                  <div key={item.label} className="flex gap-3 sm:gap-4 text-sm min-w-0">
                    <span className="text-black/30 dark:text-white/30 min-w-[60px] tracking-widest text-[11px] uppercase pt-0.5">{item.label}</span>
                    {'href' in item && item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer"
                        className="text-black/60 dark:text-white/60 font-light hover:text-black dark:hover:text-white transition-colors underline underline-offset-2 decoration-black/20 dark:decoration-white/20">
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-black/60 dark:text-white/60 font-light break-words min-w-0">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* Skills bar card */}
            <BentoCard className="md:col-span-2 lg:col-span-4 p-6 sm:p-8 lg:min-h-[400px] flex flex-col justify-between" delay={160}>
              <div>
                <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                </div>
                <h3 className="text-xl font-light mb-6">{t.skillsCardTitle}</h3>
                <div className="space-y-5">
                  <SkillBar label="Next.js / React" level={88} />
                  <SkillBar label="Laravel / PHP" level={85} />
                  <SkillBar label="Python / Scikit-learn" level={78} />
                  <SkillBar label="AI Tools" level={87} />
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
      <section id="skills" className="py-20 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-10 md:mb-16">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>{t.skillsTag}</Tag></div>
              <RevealText className="mt-5 text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {t.skillsHeading}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-xs">
              {t.skillsDesc}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-3 md:gap-4">
            <BentoCard className="col-span-12 md:col-span-7 lg:col-span-8 p-6 sm:p-8" delay={0}>
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <h3 className="text-lg font-light mb-5">{t.techTitle}</h3>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "React", "Laravel", "PHP", "Python", "Bootstrap", "MySQL", "Scikit-learn", "Pandas", "Streamlit", "Raspberry Pi Pico", "IoT", "REST API", "Web Server", "Machine Learning"].map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg text-sm text-black/55 dark:text-white/55 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] hover:-translate-y-0.5 transition-[background-color,transform] duration-200 cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </BentoCard>

            <BentoCard className="col-span-12 md:col-span-5 lg:col-span-4 p-6 sm:p-8" delay={80}>
              <div className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center mb-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h3 className="text-lg font-light mb-5">{t.softTitle}</h3>
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
      <section id="projects" className="py-20 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-10 md:mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>{t.projectTag}</Tag></div>
              <RevealText className="mt-5 text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {t.projectHeading}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-xs">
              {t.projectDesc}
            </p>
          </div>

          {/* ── Proyek Unggulan ── */}
          <div className="mb-8">
            <div className="text-[11px] text-black/25 dark:text-white/25 tracking-widest uppercase mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
              <span>{t.featuredLabel}</span>
              <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <LocalVideoEmbed
                src="/video/Perumahan.mp4"
                poster="/video/posters/Perumahan.webp"
                title="Property Management System"
                desc="Sistem manajemen perumahan PT Dewa Nusa Utama dengan integrasi gateway pembayaran dan user management."
                isLive={true}
              />
              <LocalVideoEmbed
                src="/video/Rupakata.mp4"
                poster="/video/posters/Rupakata.webp"
                title="Sistem Penerbitan Buku"
                desc="Sistem Managemen Penerbitan Buku yang terintegrasi dengan marketplace."
                isLive={true}
              />
            </div>
          </div>

          {/* ── Proyek Lainnya — media first ── */}
          <div className="text-[11px] text-black/25 dark:text-white/25 tracking-widest uppercase mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
            <span>{t.othersLabel}</span>
            <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.06]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* — DENGAN MEDIA (GAMBAR / VIDEO) DULU — */}
            <LiveWebsiteEmbed
              prevLabel={t.galleryPrev}
              nextLabel={t.galleryNext}
              url="https://www.forexforbetterliving.com/"
              displayUrl="forexforbetterliving.com"
              title="Forex For Better Living"
              desc="Platform Edukasi & Konsultasi Forex Trading — Next.js, Robot Trading (EA), Indikator Canggih, serta integrasi Customer Service dengan Chatbot AI."
              accentColor="#167E6C"
              logoText="FBL"
              delay={0}
            />
            <LiveWebsiteEmbed
              prevLabel={t.galleryPrev}
              nextLabel={t.galleryNext}
              url="https://tirtabening.sevensmarts-dev.com/"
              images={[
                "/images/water1.webp",
                "/images/water2.webp",
                "/images/water3.webp",
                "/images/water4.webp",
                "/images/water5.webp"
              ]}
              displayUrl="tirtabening.sevensmarts-dev.com"
              title="Water Metering & Billing"
              desc="Pencatatan meteran air dengan pengiriman tagihan otomatis dan notifikasi pengingat via WhatsApp API."
              accentColor="#0ea5e9"
              logoText="AIR"
              delay={80}
            />
            <LiveWebsiteEmbed
              prevLabel={t.galleryPrev}
              nextLabel={t.galleryNext}
              url="https://absensielrahma.vercel.app/"
              displayUrl="absensielrahma.vercel.app"
              title="Sistem Absensi El Rahma"
              desc="Platform absensi online modern dengan fitur real-time dan rekap otomatis."
              accentColor="#0ea5e9"
              logoText="ABSEN"
              delay={160}
            />
            <ProjectCard
              prevLabel={t.galleryPrev}
              nextLabel={t.galleryNext}
              title="AI Training Materials"
              category="AI · Education"
              tech="AI Tools, Workshop"
              desc="Materi pelatihan AI untuk guru-guru MGMP Bahasa Inggris Kabupaten Sleman. Dirancang dan dipresentasikan oleh Resa."
              link="#"
              images={["/images/plt1-1.webp", "/images/plt1-2.webp"]}
              delay={240}
            />
            <LocalVideoEmbed
              src="/video/egg.mp4"
                poster="/video/posters/egg.webp"
              title="Smart Egg Incubator"
              desc="Inkubator telur otomatis berbasis IoT untuk pemantauan suhu dan kelembaban real-time. Proyek kampus 2024."
              delay={320}
            />
            <LocalVideoEmbed
              src="/video/Maharani.mp4"
                poster="/video/posters/Maharani.webp"
              title="Maharani Transport App"
              desc="Demonstrasi platform penyewaan mobil Maharani Transport dengan sistem pemesanan via WhatsApp."
              delay={400}
            />
            <LiveWebsiteEmbed
              prevLabel={t.galleryPrev}
              nextLabel={t.galleryNext}
              images={["/images/prediksi1.webp", "/images/prediksi2.webp"]}
              displayUrl="Student Graduation Prediction"
              title="Student Graduation Prediction"
              desc="Prediksi kelulusan mahasiswa menggunakan KNN, Decision Tree & Naïve Bayes dengan visualisasi Streamlit."
              accentColor="#ff4b4b"
              logoText="PRED"
              delay={480}
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PROFESSIONAL EXPERIENCE
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="experience" className="py-20 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 md:mb-16">
            <PixelIcon type="workflow" size={40} />
            <div className="mt-4"><Tag>{t.expTag}</Tag></div>
            <RevealText className="mt-5 text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
              {t.expHeading}
            </RevealText>
          </div>

          <div className="space-y-3">
            {t.experience.map((exp, idx) => (
              <BentoCard key={exp.no} className="p-5 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-6" delay={idx * 40}>
                <div className="shrink-0 flex flex-row md:flex-col md:items-start items-center gap-4 md:gap-0 md:w-48">
                  <span className="font-pixel text-[11px] text-black/20 dark:text-white/20 tracking-widest">{exp.no}</span>
                  <div className="md:mt-3">
                    <div className="text-xs text-black/25 dark:text-white/25 tracking-widest uppercase">{exp.period}</div>
                    <div className="mt-1 inline-flex px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[10px] text-black/35 dark:text-white/35 tracking-widest">{exp.type}</div>
                  </div>
                </div>
                <div className="flex-1 border-t md:border-t-0 md:border-l border-black/[0.06] dark:border-white/[0.06] pt-4 md:pt-0 md:pl-6">
                  <h3 className="text-lg sm:text-xl font-light mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{exp.role}</h3>
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
      <section id="education" className="py-20 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8 mb-10 md:mb-16">
            <div>
              <PixelIcon type="integrations" size={40} />
              <div className="mt-4"><Tag>{t.eduTag}</Tag></div>
              <RevealText className="mt-5 text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
                {t.eduHeading}
              </RevealText>
            </div>
            <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed max-w-xs">
              {t.eduDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
              <BentoCard className="p-6 sm:p-8" delay={0}>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="w-12 h-12 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] text-black/30 dark:text-white/30 tracking-widest uppercase mb-1">2021 – 2025</div>
                    <h3 className="text-lg font-light mb-1">Sarjana Komputer (S.Kom)</h3>
                    <p className="text-sm text-black/40 dark:text-white/40">STMIK El Rahma Yogyakarta</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[11px] border border-amber-200/60 dark:border-amber-500/30">🏆 Wisudawati Terbaik TA 2024/2025</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[11px] border border-emerald-200/60 dark:border-emerald-500/30">🎓 IPK 3.94/4.00</span>
                    </div>
                  </div>
                </div>
              </BentoCard>

              <BentoCard className="p-6 sm:p-8" delay={80}>
                <div className="flex items-start gap-4 sm:gap-5">
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

              <BentoCard className="p-6 sm:p-8" delay={120}>
                <div className="flex items-start gap-4 sm:gap-5">
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
                      className={`flex items-start gap-4 p-4 rounded-xl transition-[background-color,transform] duration-200 hover:translate-x-1 hover:bg-black/[0.03] dark:hover:bg-white/[0.04] ${cert.highlight ? "bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06]" : ""}`}
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
        <div className="marquee flex w-max border-b border-black/[0.06] dark:border-white/[0.06]" style={{ animation: "marqueeLeft 36s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Next.js", "React", "Laravel", "PHP", "Python", "Bootstrap", "MySQL", "Scikit-Learn", "Streamlit", "IoT"].map((cap) => (
                <div key={`${rep}-${cap}`} className="flex items-center gap-6 px-6 sm:px-10 py-4 sm:py-5 border-r border-black/[0.06] dark:border-white/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20 shrink-0" />
                  <span className="text-sm text-black/45 dark:text-white/45 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="marquee flex w-max" style={{ animation: "marqueeRight 30s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0">
              {["Leadership", "Target Oriented", "Data Management", "Machine Learning", "API Integration", "Web Server", "Problem Solving", "Team Work", "Full-Stack Dev"].map((cap) => (
                <div key={`${rep}-${cap}`} className="flex items-center gap-6 px-6 sm:px-10 py-4 sm:py-5 border-r border-black/[0.06] dark:border-white/[0.06] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/12 dark:bg-white/12 shrink-0" />
                  <span className="text-sm text-black/30 dark:text-white/30 whitespace-nowrap tracking-wide">{cap}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE AGENTS ────────────────────────────────────────────────────── */}
      <section id="highlight" className="py-20 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <PixelIcon type="agents" size={40} />
              <div className="mt-4"><Tag>{t.dedicationTag}</Tag></div>
              <RevealText className="mt-5 text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05]">
                {t.dedicationHeading}
              </RevealText>
              <p className="mt-6 text-base text-black/40 dark:text-white/40 leading-relaxed max-w-sm">
                {t.dedicationDesc}
              </p>
              <div className="mt-10 flex items-end gap-2">
                <LiveAgentCounter />
                <span className="text-black/30 dark:text-white/30 text-sm mb-1 tracking-wide">{t.linesCode}</span>
              </div>
            </div>
            <div className="relative" style={{ perspective: "1200px" }}>
              <div className="lg:[transform:rotateY(-8deg)_rotateX(4deg)] transition-transform duration-700 hover:[transform:none]">
                <LiveAgentFeed />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — contact ────────────────────────────────────────────────── */}
      <section id="contact" className="relative py-20 md:py-32 px-5 sm:px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <img src="/images/footer.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute bottom-0 left-0 w-full h-full object-cover object-bottom pointer-events-none select-none opacity-85 dark:opacity-30" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-cta)" }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-display text-[2.1rem] sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.08] mb-6">
            {t.ctaHeading.split("\n").map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <p className="text-sm text-black/45 dark:text-white/45 leading-relaxed mb-10">
            {t.ctaDesc}
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input type="email" aria-label="Email" autoComplete="email" placeholder={t.ctaEmailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 bg-white dark:bg-[#1c1c1a] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-base sm:text-sm text-[#111] dark:text-[#ececea] placeholder:text-black/25 dark:placeholder:text-white/25 focus:outline-none focus:border-black/25 dark:focus:border-white/25 transition-colors" />
              <button type="submit" className="px-8 py-3.5 bg-[#111] dark:bg-[#ececea] text-white dark:text-[#111] text-sm rounded-xl hover:bg-[#333] dark:hover:bg-white hover:-translate-y-0.5 transition-[background-color,transform] duration-200 tracking-widest font-medium">{t.ctaButton}</button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-emerald-600/20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {t.ctaSuccess}
            </div>
          )}
        </div>
      </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 pb-24 sm:pb-10 px-5 sm:px-6 md:px-12 lg:px-20 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <span className="font-pixel text-xs tracking-[0.25em] text-black/50 dark:text-white/50">RESA SWASTYANI</span>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {t.footerLinks.map(l => (
              <a key={l.label} href={l.href} className="text-xs text-black/35 dark:text-white/35 hover:text-black/70 dark:hover:text-white/70 transition-colors tracking-widest">{l.label}</a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="mailto:resaarrazy@gmail.com" className="text-xs text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors tracking-wide">resaarrazy@gmail.com</a>
            <a
              href="https://www.linkedin.com/in/resa-swastyani-a1a425366"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/30 dark:text-white/30 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-colors"
              title="LinkedIn Resa Swastyani"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://github.com/Resaswastyani"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
              title="GitHub Resa Swastyani"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <span className="text-xs text-black/20 dark:text-white/20">+62 8570 2212 770</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-black/[0.04] dark:border-white/[0.04] flex flex-col sm:flex-row justify-between gap-2">
          <span className="text-xs text-black/20 dark:text-white/20">{t.footerCopy}</span>
          <span className="text-xs text-black/15 dark:text-white/15">{t.footerLocation}</span>
        </div>
      </footer>
    </div>
  )
}
