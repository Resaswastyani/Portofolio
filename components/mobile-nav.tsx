"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LangToggle } from "@/components/lang-toggle"
import { useLang } from "@/components/lang-provider"

const NAV_STYLE = {
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  background: "var(--bg-nav)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
} as const

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { t } = useLang()
  const close = () => setOpen(false)

  const NAV_LINKS = [
    { label: t.nav.about,      href: "#about" },
    { label: t.nav.skills,     href: "#skills" },
    { label: t.nav.projects,   href: "#projects" },
    { label: t.nav.experience, href: "#experience" },
    { label: t.nav.education,  href: "#education" },
  ]

  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-3xl">

        {/* Main bar */}
        <nav
          className="flex items-center justify-between px-5 py-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08]"
          style={NAV_STYLE}
        >
          <span className="font-pixel text-xs tracking-[0.25em] text-black/70 dark:text-white/70">RESA SWASTYANI</span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 tracking-wide"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LangToggle />
            <ThemeToggle />
            <a
              href="mailto:resaarrazy@gmail.com?subject=Hire%20Resa%20Swastyani&body=Halo%20Resa%2C%20saya%20tertarik%20untuk%20berkolaborasi%20dengan%20Anda."
              className="text-[11px] px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 tracking-wide hidden md:block"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              {t.nav.hireMe}
            </a>

            {/* Burger — mobile only */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] rounded-lg hover:bg-black/[0.04] transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span
                className="block h-px bg-black/60 dark:bg-white/60 transition-all duration-300 origin-center"
                style={{ width: "18px", transform: open ? "translateY(6px) rotate(45deg)" : "none" }}
              />
              <span
                className="block h-px bg-black/60 dark:bg-white/60 transition-all duration-300"
                style={{ width: "18px", opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }}
              />
              <span
                className="block h-px bg-black/60 dark:bg-white/60 transition-all duration-300 origin-center"
                style={{ width: "18px", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }}
              />
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div
          className="md:hidden mt-2 overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: open ? "360px" : "0px", opacity: open ? 1 : 0 }}
        >
          <div
            className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] px-2 py-2 flex flex-col"
            style={NAV_STYLE}
          >
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="px-4 py-3 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05] rounded-xl transition-colors tracking-wide"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-1 px-2 pb-1">
              <a
                href="mailto:resaarrazy@gmail.com?subject=Hire%20Resa%20Swastyani&body=Halo%20Resa%2C%20saya%20tertarik%20untuk%20berkolaborasi%20dengan%20Anda."
                className="block w-full text-center text-[11px] px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all duration-200 tracking-wide"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                {t.nav.hireMe}
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
