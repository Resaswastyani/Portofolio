"use client"

import { useEffect, useRef, useState } from "react"

// One shared IntersectionObserver per option set — far cheaper than one per element.
type Entry = { cb: (visible: boolean) => void }
const observers = new Map<string, { io: IntersectionObserver; targets: Map<Element, Entry> }>()

function getObserver(threshold: number, rootMargin: string) {
  const key = `${threshold}|${rootMargin}`
  let rec = observers.get(key)
  if (!rec) {
    const targets = new Map<Element, Entry>()
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => targets.get(e.target)?.cb(e.isIntersecting)),
      { threshold, rootMargin },
    )
    rec = { io, targets }
    observers.set(key, rec)
  }
  return rec
}

/**
 * Reports whether the element is on screen.
 * `once` (default) keeps it true after the first reveal; pass false to track visibility live
 * (used to pause videos and timers when scrolled away).
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.12,
  rootMargin = "0px 0px -8% 0px",
  once = true,
}: { threshold?: number; rootMargin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const { io, targets } = getObserver(threshold, rootMargin)
    targets.set(el, {
      cb: (visible) => {
        if (visible) {
          setInView(true)
          if (once) { io.unobserve(el); targets.delete(el) }
        } else if (!once) {
          setInView(false)
        }
      },
    })
    io.observe(el)
    return () => { io.unobserve(el); targets.delete(el) }
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
