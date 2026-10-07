"use client"

import React, { useEffect, useState } from "react"

const ITEMS = ["Portofolio", "Resa", "Swastyani"]

const ITEM_IN_STAGGER  = 110   // ms between each item appearing
const ITEM_IN_DUR      = 600   // duration of each item appear transition
const HOLD_DURATION    = 250   // hold fully visible before exit
const ITEMS_IN_TOTAL   = ITEM_IN_STAGGER * (ITEMS.length - 1) + ITEM_IN_DUR + HOLD_DURATION

const ITEM_OUT_STAGGER = 70    // ms between each item disappearing
const ITEM_OUT_DUR     = 380   // duration of each item fade out
const ITEMS_OUT_TOTAL  = ITEM_OUT_STAGGER * (ITEMS.length - 1) + ITEM_OUT_DUR

const CURTAIN_DELAY      = ITEMS_IN_TOTAL + 80
const CURTAIN_DURATION   = 950   // matches the CSS transition on the curtain div
const ANIM_TOTAL         = CURTAIN_DELAY + Math.max(ITEMS_OUT_TOTAL, CURTAIN_DURATION) + 100

// Exported: moment the curtain finishes retracting — when the bg is fully visible
export const INTRO_DURATION_MS = CURTAIN_DELAY + CURTAIN_DURATION
// Exported: ms before curtain fully done to start hero animations (overlap for smoothness)
export const HERO_REVEAL_MS = CURTAIN_DELAY + CURTAIN_DURATION - 250

const SEEN_KEY = "intro-seen"

type Phase = "idle" | "in" | "out" | "done"

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [curtainUp, setCurtainUp] = useState(false)

  useEffect(() => {
    // Returning visitors (same tab session) or reduced-motion users skip the intro.
    // The `intro-seen` class is set by an inline script in <head> so the overlay never flashes.
    let skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    try {
      if (sessionStorage.getItem(SEEN_KEY)) skip = true
      sessionStorage.setItem(SEEN_KEY, "1")
    } catch { /* storage blocked — just play it */ }

    if (skip) {
      setPhase("done")
      onDone()
      return
    }

    document.documentElement.style.overflow = "hidden"
    const t0 = setTimeout(() => setPhase("in"), 60)
    const t1 = setTimeout(() => setPhase("out"), ITEMS_IN_TOTAL)
    const t2 = setTimeout(() => { setCurtainUp(true); document.documentElement.style.overflow = "" }, CURTAIN_DELAY)
    const t3 = setTimeout(() => onDone(), HERO_REVEAL_MS)
    const t4 = setTimeout(() => setPhase("done"), ANIM_TOTAL)

    return () => {
      document.documentElement.style.overflow = ""
      clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
    }
  }, [onDone])

  if (phase === "done") return null

  return (
    <div className="intro-overlay fixed inset-0 z-[100] pointer-events-none" aria-hidden="true">

      {/* Curtain — slides upward (transform only, no layout work) */}
      <div
        className="absolute inset-0 bg-[#F5F4F0] dark:bg-[#111110]"
        style={{
          transform: curtainUp ? "translate3d(0,-100%,0)" : "translate3d(0,0,0)",
          transition: curtainUp ? `transform ${CURTAIN_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)` : "none",
          willChange: "transform",
        }}
      />

      {/* Intro text */}
      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ perspective: "800px" }}>
        <div className="flex flex-wrap justify-center items-center" style={{ columnGap: "0.28em", fontSize: "clamp(2.75rem, 11vw, 8rem)" }}>
          {ITEMS.map((item, i) => {
            const inDelay  = i * ITEM_IN_STAGGER
            const outDelay = i * ITEM_OUT_STAGGER

            const isIdle = phase === "idle"
            const isIn   = phase === "in"
            const isOut  = phase === "out"

            const opacity   = isIdle ? 0 : isIn ? 1 : 0
            const transform = isIdle
              ? "translate3d(0,40px,0) rotateX(-60deg)"
              : isIn
              ? "translate3d(0,0,0) rotateX(0deg)"
              : "translate3d(0,-24px,0) rotateX(35deg)"

            const transition = isOut
              ? `opacity ${ITEM_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms,
                 transform ${ITEM_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms`
              : isIn
              ? `opacity ${ITEM_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms,
                 transform ${ITEM_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms`
              : "none"

            return (
              <React.Fragment key={i}>
                <span
                  className="font-sans font-bold text-[#111] dark:text-[#ececea] leading-none select-none text-center"
                  style={{
                    fontSize: "1em",
                    letterSpacing: "-0.02em",
                    opacity,
                    transform,
                    transformOrigin: "50% 100%",
                    transition,
                    willChange: "opacity, transform",
                  }}
                >
                  {item}
                </span>
                {/* Force break after Portofolio */}
                {i === 0 && <div className="basis-full h-0" />}
              </React.Fragment>
            )
          })}
        </div>
      </div>

    </div>
  )
}
