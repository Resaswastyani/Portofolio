"use client"

import { useInView } from "@/hooks/use-in-view"

// Splits text into words and flips each one up in 3D with a stagger.
// Only opacity + transform are animated (GPU friendly, no blur filters).
export function RevealText({
  children,
  className = "",
  as: Tag = "h2",
  stagger = 60,       // ms between each word
  duration = 800,     // ms per word transition
  delay = 0,          // initial delay before first word
  threshold = 0.2,    // IntersectionObserver threshold
}: {
  children: string
  className?: string
  as?: "h1" | "h2" | "h3" | "p" | "span"
  stagger?: number
  duration?: number
  delay?: number
  threshold?: number
}) {
  const { ref, inView: visible } = useInView<HTMLElement>({ threshold })

  // Split on spaces but preserve line breaks (rendered via <br />)
  const parts = children.split(/(\n)/g)
  const words: { word: string; index: number }[] = []
  let wordIndex = 0
  parts.forEach((part) => {
    if (part === "\n") {
      words.push({ word: "\n", index: wordIndex++ })
    } else {
      part.split(" ").forEach((w, i, arr) => {
        if (w) words.push({ word: i < arr.length - 1 ? w + " " : w, index: wordIndex++ })
      })
    }
  })

  const ease = "cubic-bezier(0.16,1,0.3,1)"

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} className={className} style={{ display: "block", perspective: "600px" }} aria-label={children.replace(/\n/g, " ")}>
      {words.map(({ word, index }) => {
        if (word === "\n") return <br key={`br-${index}`} />

        const wordDelay = delay + index * stagger

        return (
          <span key={index} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
            <span
              className="inline-block"
              style={{
                opacity:         visible ? 1 : 0,
                transform:       visible ? "translateY(0) rotateX(0deg)" : "translateY(70%) rotateX(-75deg)",
                transformOrigin: "50% 100%",
                transition:      visible
                  ? `opacity ${duration}ms ${ease} ${wordDelay}ms, transform ${duration}ms ${ease} ${wordDelay}ms`
                  : "none",
              }}
            >
              {word}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}
