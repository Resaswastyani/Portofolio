"use client"

import { useEffect, useRef, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LangToggle } from "@/components/lang-toggle"
import { useLang } from "@/components/lang-provider"

const HIRE_URL = "https://mail.google.com/mail/?view=cm&fs=1&to=resaarrazy@gmail.com&su=Hire%20Resa%20Swastyani&body=Halo%20Resa,%20saya%20tertarik%20untuk%20berkolaborasi%20dengan%20Anda."

const SECTION_IDS = ["home", "about", "skills", "projects", "experience", "education"]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string>("")
  const progressRef = useRef<HTMLDivElement>(null)
  const { t } = useLang()
  const close = () => setOpen(false)

  const NAV_LINKS = [
    { label: t.nav.about,      href: "#about" },
    { label: t.nav.skills,     href: "#skills" },
    { label: t.nav.projects,   href: "#projects" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.education,  href: "#education" },
  ]

  // Scroll progress + compact state — written straight to the DOM inside rAF, no re-render per scroll
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
      setScrolled(window.scrollY > 24)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  // Highlight the section currently in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: "-45% 0px -50% 0px" },
    )
    SECTION_IDS.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])

  // Close the mobile menu with Escape or when switching to desktop width
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    const mq = window.matchMedia("(min-width: 1024px)")
    const onMq = () => { if (mq.matches) setOpen(false) }
    window.addEventListener("keydown", onKey)
    mq.addEventListener("change", onMq)
    return () => { window.removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq) }
  }, [open])

  return (
    <>
      {/* Scroll progress */}
      <div className="fixed top-0 inset-x-0 h-[2px] z-[60] pointer-events-none">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Tap-outside backdrop for the mobile menu */}
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black/20 transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        onClick={close}
        aria-hidden="true"
      />

      <header
        className="fixed inset-x-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none transition-[top] duration-300"
        style={{ top: scrolled ? "10px" : "16px" }}
      >
        <div className="pointer-events-auto w-full max-w-4xl">

          {/* Main bar */}
          <nav
            aria-label="Main"
            className={`nav-glass flex items-center justify-between pl-4 pr-2 sm:pl-5 sm:pr-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] transition-[padding,box-shadow] duration-300 ${scrolled ? "py-2 shadow-[0_8px_32px_rgba(0,0,0,0.10)]" : "py-3 shadow-[0_4px_16px_rgba(0,0,0,0.05)]"}`}
          >
            <a href="#top" className="font-pixel whitespace-nowrap text-[11px] sm:text-xs tracking-[0.22em] text-black/75 dark:text-white/75 hover:text-black dark:hover:text-white transition-colors">
              RESA<span className="hidden min-[380px]:inline"> SWASTYANI</span>
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(l => {
                const isActive = active === l.href.slice(1)
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative text-[11px] px-3 py-1.5 rounded-lg tracking-wide transition-colors duration-200 ${isActive ? "text-black dark:text-white bg-black/[0.05] dark:bg-white/[0.08]" : "text-black/55 dark:text-white/55 hover:text-black dark:hover:text-white"}`}
                  >
                    {l.label}
                  </a>
                )
              })}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <LangToggle />
              <ThemeToggle />
              <a
                href={HIRE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block whitespace-nowrap text-[11px] px-4 py-2 rounded-xl bg-[#111] dark:bg-[#ececea] text-white dark:text-[#111] hover:-translate-y-px hover:shadow-lg transition-[transform,box-shadow] duration-200 tracking-wide font-medium"
              >
                {t.nav.hireMe}
              </a>

              {/* Burger — mobile only */}
              <button
                onClick={() => setOpen(v => !v)}
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                <span
                  className="block h-px bg-black/70 dark:bg-white/70 transition-transform duration-300 origin-center"
                  style={{ width: "18px", transform: open ? "translateY(6px) rotate(45deg)" : "none" }}
                />
                <span
                  className="block h-px bg-black/70 dark:bg-white/70 transition-[opacity,transform] duration-300"
                  style={{ width: "18px", opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }}
                />
                <span
                  className="block h-px bg-black/70 dark:bg-white/70 transition-transform duration-300 origin-center"
                  style={{ width: "18px", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }}
                />
              </button>
            </div>
          </nav>

          {/* Mobile dropdown */}
          <div
            id="mobile-menu"
            className="lg:hidden mt-2 origin-top transition-[opacity,transform] duration-300 ease-out"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.98)",
              pointerEvents: open ? "auto" : "none",
              visibility: open ? "visible" : "hidden",
            }}
          >
            <div className="nav-glass rounded-2xl border border-black/[0.06] dark:border-white/[0.08] p-2 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
              {NAV_LINKS.map((l, i) => {
                const isActive = active === l.href.slice(1)
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={close}
                    className={`flex items-center justify-between px-4 py-3.5 text-[15px] rounded-xl transition-colors tracking-wide ${isActive ? "text-black dark:text-white bg-black/[0.05] dark:bg-white/[0.07]" : "text-black/65 dark:text-white/65 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"}`}
                  >
                    {l.label}
                    <span className="font-mono text-[10px] text-black/25 dark:text-white/25">0{i + 1}</span>
                  </a>
                )
              })}
              <a
                href={HIRE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="mt-2 block w-full text-center text-xs px-4 py-3.5 rounded-xl bg-[#111] dark:bg-[#ececea] text-white dark:text-[#111] tracking-widest font-medium"
              >
                {t.nav.hireMe}
              </a>
            </div>
          </div>

        </div>
      </header>
    </>
  )
}
