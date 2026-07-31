"use client"

import React, { useEffect, useState } from "react"

const ITEMS = ["Portofolio", "Resa", "Swastyani"]

const ITEM_IN_STAGGER  = 150   // ms between each item appearing
const ITEM_IN_DUR      = 700   // duration of each item appear transition
const HOLD_DURATION    = 400   // hold fully visible before exit
const ITEMS_IN_TOTAL   = ITEM_IN_STAGGER * (ITEMS.length - 1) + ITEM_IN_DUR + HOLD_DURATION

const ITEM_OUT_STAGGER = 100   // ms between each item disappearing
const ITEM_OUT_DUR     = 450   // duration of each item fade out
const ITEMS_OUT_TOTAL  = ITEM_OUT_STAGGER * (ITEMS.length - 1) + ITEM_OUT_DUR

const CURTAIN_DELAY      = ITEMS_IN_TOTAL + 100
const CURTAIN_DURATION   = 1300  // matches the CSS transition on the curtain div
const ANIM_TOTAL         = CURTAIN_DELAY + ITEMS_OUT_TOTAL + 1400

// Exported: moment the curtain finishes retracting — when the bg is fully visible
export const INTRO_DURATION_MS = CURTAIN_DELAY + CURTAIN_DURATION
// Exported: ms before curtain fully done to start hero animations (overlap for smoothness)
export const HERO_REVEAL_MS = CURTAIN_DELAY + CURTAIN_DURATION - 150

type Phase = "idle" | "in" | "out" | "done"

export function IntroAnimation({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [curtainUp, setCurtainUp] = useState(false)

  useEffect(() => {
    // Tiny delay so the browser has painted before we start transitioning
    const t0 = setTimeout(() => setPhase("in"), 80)
    const t1 = setTimeout(() => setPhase("out"), ITEMS_IN_TOTAL)
    const t2 = setTimeout(() => setCurtainUp(true), CURTAIN_DELAY)
    const t3 = setTimeout(() => onDone(), HERO_REVEAL_MS)
    const t4 = setTimeout(() => setPhase("done"), ANIM_TOTAL)

    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onDone])

  if (phase === "done") return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none" aria-hidden="true">

      {/* Gradient curtain — retracts upward, revealing mountains from bottom */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          bottom: curtainUp ? "100%" : "0%",
          transition: curtainUp ? "bottom 1.3s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
          background: "#f5f4f1",
        }}
      />

      {/* Intro text */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="flex flex-wrap justify-center items-center" style={{ gap: "0.3em" }}>
          {ITEMS.map((item, i) => {
            const inDelay  = i * ITEM_IN_STAGGER
            const outDelay = i * ITEM_OUT_STAGGER

            // idle → invisible starting position
            const isIdle = phase === "idle"
            const isIn   = phase === "in"
            const isOut  = phase === "out"

            const opacity    = isIdle ? 0 : isIn ? 1 : 0
            const blur       = isIdle ? 24 : isIn ? 0 : 16
            const translateY = isIdle ? 32 : isIn ? 0 : -16

            const transition = isOut
              ? `opacity ${ITEM_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms,
                 filter  ${ITEM_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms,
                 transform ${ITEM_OUT_DUR}ms cubic-bezier(0.4,0,1,1) ${outDelay}ms`
              : isIn
              ? `opacity ${ITEM_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms,
                 filter  ${ITEM_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms,
                 transform ${ITEM_IN_DUR}ms cubic-bezier(0.16,1,0.3,1) ${inDelay}ms`
              : "none"

            return (
              <React.Fragment key={i}>
                <span
                  className="font-sans font-bold text-[#111] leading-none select-none text-center"
                  style={{
                    fontSize: `clamp(3rem, 11vw, 8rem)`,
                    letterSpacing: "-0.02em",
                    opacity,
                    filter: `blur(${blur}px)`,
                    transform: `translateY(${translateY}px)`,
                    transition,
                    willChange: "opacity, filter, transform",
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
