"use client"

import { useEffect, useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { DemoBadge, rupiah, usePointerParallax } from "./demo-shared"

// ─── Data ────────────────────────────────────────────────────────────────────
type Motif = "mountain" | "sun" | "volcano" | "leaf" | "wave"
type Origin = {
  id: string; name: string; region: string; process: string; alt: string; notes: string
  color: string; ink: string; accent: string; motif: Motif; roast: number
  taste: { asam: number; manis: number; body: number; pahit: number }; price: number
}

const ORIGINS: Origin[] = [
  { id: "gayo", name: "Gayo", region: "Aceh", process: "Full wash", alt: "1.400 mdpl", notes: "Rempah, cokelat hitam, herbal", color: "#2F5D50", ink: "#F4E9D8", accent: "#E9B949", motif: "mountain", roast: 3, taste: { asam: 3, manis: 3, body: 4, pahit: 3 }, price: 10000 },
  { id: "toraja", name: "Toraja", region: "Sulawesi Selatan", process: "Semi wash", alt: "1.600 mdpl", notes: "Karamel, kayu manis, buah kering", color: "#8C3B2A", ink: "#FBEBDD", accent: "#F2C14E", motif: "mountain", roast: 4, taste: { asam: 2, manis: 4, body: 4, pahit: 3 }, price: 11000 },
  { id: "kintamani", name: "Kintamani", region: "Bali", process: "Natural", alt: "1.300 mdpl", notes: "Jeruk, gula aren, floral", color: "#E39B3B", ink: "#2B1A12", accent: "#FFF1D6", motif: "sun", roast: 2, taste: { asam: 4, manis: 4, body: 2, pahit: 2 }, price: 10000 },
  { id: "bajawa", name: "Bajawa", region: "Flores", process: "Full wash", alt: "1.500 mdpl", notes: "Kacang, cokelat susu, manis", color: "#6D4C8F", ink: "#F3ECFA", accent: "#F2B5A0", motif: "volcano", roast: 3, taste: { asam: 2, manis: 4, body: 3, pahit: 2 }, price: 10000 },
  { id: "preanger", name: "Preanger", region: "Jawa Barat", process: "Honey", alt: "1.500 mdpl", notes: "Gula merah, apel, teh", color: "#3D7A9E", ink: "#EEF6FB", accent: "#F6D55C", motif: "leaf", roast: 2, taste: { asam: 3, manis: 4, body: 3, pahit: 2 }, price: 9000 },
  { id: "kerinci", name: "Kerinci", region: "Jambi", process: "Natural", alt: "1.400 mdpl", notes: "Stroberi, anggur, cokelat", color: "#C04A5B", ink: "#FFF0F2", accent: "#FFD6A5", motif: "volcano", roast: 2, taste: { asam: 4, manis: 4, body: 3, pahit: 1 }, price: 12000 },
  { id: "temanggung", name: "Temanggung", region: "Jawa Tengah", process: "Natural", alt: "1.100 mdpl", notes: "Tembakau manis, cokelat, rempah", color: "#5B6B2F", ink: "#F3F5E6", accent: "#E9C46A", motif: "leaf", roast: 4, taste: { asam: 1, manis: 3, body: 5, pahit: 4 }, price: 8000 },
  { id: "ijen", name: "Ijen", region: "Jawa Timur", process: "Full wash", alt: "1.400 mdpl", notes: "Lemon, madu, bersih", color: "#2F7E8C", ink: "#EAF7F8", accent: "#B8F2E6", motif: "wave", roast: 2, taste: { asam: 4, manis: 3, body: 2, pahit: 2 }, price: 10000 },
  { id: "wamena", name: "Wamena", region: "Papua", process: "Full wash", alt: "1.600 mdpl", notes: "Floral, kacang, bersih", color: "#2D3A6B", ink: "#EEF0FA", accent: "#F4A261", motif: "mountain", roast: 3, taste: { asam: 3, manis: 3, body: 3, pahit: 2 }, price: 12000 },
  { id: "sidikalang", name: "Sidikalang", region: "Sumatera Utara", process: "Semi wash", alt: "1.200 mdpl", notes: "Earthy, pedas, body tebal", color: "#4A2E22", ink: "#F5E9DF", accent: "#D98E04", motif: "leaf", roast: 5, taste: { asam: 1, manis: 2, body: 5, pahit: 5 }, price: 9000 },
  { id: "malabar", name: "Malabar", region: "Jawa Barat", process: "Natural", alt: "1.500 mdpl", notes: "Nangka, anggur, wine", color: "#A8566F", ink: "#FFF0F5", accent: "#FFE0A3", motif: "sun", roast: 2, taste: { asam: 4, manis: 5, body: 3, pahit: 1 }, price: 11000 },
  { id: "semeru", name: "Semeru", region: "Jawa Timur", process: "Honey", alt: "1.400 mdpl", notes: "Cokelat, kacang mete, manis", color: "#B5651D", ink: "#FFF4E6", accent: "#2B1A12", motif: "volcano", roast: 3, taste: { asam: 2, manis: 4, body: 4, pahit: 2 }, price: 10000 },
]

// scattered around the headline: x/y in %, rotation, parallax depth
const SPOTS = [
  { x: 3, y: 9, r: -14, d: 0.6 }, { x: 19, y: 3, r: 8, d: 0.4 }, { x: 70, y: 4, r: -6, d: 0.5 }, { x: 86, y: 11, r: 12, d: 0.8 },
  { x: 1, y: 41, r: 10, d: 0.9 }, { x: 89, y: 40, r: -12, d: 0.7 }, { x: 5, y: 71, r: -8, d: 0.5 }, { x: 21, y: 79, r: 14, d: 0.8 },
  { x: 39, y: 83, r: -4, d: 0.35 }, { x: 57, y: 81, r: 9, d: 0.6 }, { x: 73, y: 74, r: -14, d: 0.45 }, { x: 89, y: 72, r: 6, d: 0.9 },
]

const INK = "#2B1A12"
const SAND = "#EAD7BB"

// ─── Sachet illustration ─────────────────────────────────────────────────────
function MotifArt({ o }: { o: Origin }) {
  const a = o.accent, ink = o.ink
  switch (o.motif) {
    case "mountain": return <g><circle cx="140" cy="92" r="16" fill={a} /><path d="M18 168 L72 92 L104 132 L132 104 L182 168 Z" fill={ink} opacity=".9" /><path d="M72 92 L84 110 L76 108 L68 116 L62 106 Z" fill={o.color} opacity=".5" /></g>
    case "sun": return <g>{Array.from({ length: 12 }, (_, k) => <rect key={k} x="98" y="66" width="4" height="26" rx="2" fill={a} transform={`rotate(${k * 30} 100 122)`} />)}<circle cx="100" cy="122" r="28" fill={a} /><path d="M20 170 Q60 150 100 168 T180 160 V176 H20 Z" fill={ink} opacity=".85" /></g>
    case "volcano": return <g><path d="M30 172 L82 104 L118 104 L170 172 Z" fill={ink} opacity=".9" /><path d="M82 104 L118 104 L110 116 L90 116 Z" fill={a} /><circle cx="92" cy="84" r="10" fill={ink} opacity=".35" /><circle cx="108" cy="70" r="14" fill={ink} opacity=".25" /><circle cx="96" cy="52" r="9" fill={ink} opacity=".18" /></g>
    case "leaf": return <g><path d="M100 172 C60 150 54 104 100 74 C146 104 140 150 100 172 Z" fill={ink} opacity=".9" /><path d="M100 172 V84" stroke={o.color} strokeWidth="4" /><circle cx="64" cy="152" r="10" fill={a} /><circle cx="78" cy="162" r="9" fill={a} /><circle cx="136" cy="150" r="10" fill={a} /></g>
    case "wave": return <g><circle cx="100" cy="96" r="18" fill={a} />{[0, 1, 2].map(k => <path key={k} d={`M18 ${134 + k * 16} Q 41 ${122 + k * 16} 64 ${134 + k * 16} T 110 ${134 + k * 16} T 156 ${134 + k * 16} T 202 ${134 + k * 16}`} stroke={ink} strokeOpacity={0.9 - k * 0.25} strokeWidth="6" fill="none" />)}</g>
  }
}

function Sachet({ o }: { o: Origin }) {
  const id = useId().replace(/:/g, "")
  const zig = Array.from({ length: 21 }, (_, k) => `L${k * 10} ${k % 2 ? 6 : 16}`).join(" ")
  return (
    <svg viewBox="0 0 200 270" className="block h-auto w-full drop-shadow-[0_14px_18px_rgba(43,26,18,0.28)]" aria-hidden>
      <defs>
        <linearGradient id={`sh${id}`} x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".16" /><stop offset=".25" stopColor="#fff" stopOpacity=".12" /><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></linearGradient>
      </defs>
      <path d={`M0 16 ${zig} L200 16 L200 258 Q200 270 188 270 L12 270 Q0 270 0 258 Z`} fill={o.color} />
      <rect x="0" y="16" width="200" height="30" fill="#000" opacity=".14" />
      <text x="100" y="37" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="2" fill={o.ink}>seduh.</text>
      <MotifArt o={o} />
      <text x="100" y="212" textAnchor="middle" fontSize={o.name.length > 8 ? 25 : 31} fontWeight="800" letterSpacing="1" fill={o.ink}>{o.name.toUpperCase()}</text>
      <text x="100" y="232" textAnchor="middle" fontSize="11" fill={o.ink} opacity=".8">{o.region}</text>
      <text x="100" y="256" textAnchor="middle" fontSize="9" letterSpacing="2" fill={o.ink} opacity=".7">DRIP BAG · 15 G</text>
      <path d={`M0 16 ${zig} L200 16 L200 258 Q200 270 188 270 L12 270 Q0 270 0 258 Z`} fill={`url(#sh${id})`} />
    </svg>
  )
}

function Dots({ n, max = 5, color }: { n: number; max?: number; color: string }) {
  return <span className="inline-flex gap-1">{Array.from({ length: max }, (_, k) => <span key={k} className="h-2 w-2 rounded-full" style={{ backgroundColor: k < n ? color : "rgba(43,26,18,.15)" }} />)}</span>
}

// ─── Page ────────────────────────────────────────────────────────────────────
export function SeduhDemo() {
  const [sel, setSel] = useState<string | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [cart, setCart] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [tiny, setTiny] = useState(0)
  const ref = usePointerParallax<HTMLDivElement>()
  const o = ORIGINS.find(x => x.id === sel) ?? null

  useEffect(() => { const t = setInterval(() => setTiny(i => (i + 1) % ORIGINS.length), 1800); return () => clearInterval(t) }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSel(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  useEffect(() => { setFlipped(false) }, [sel])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2200); return () => clearTimeout(t) }, [toast])

  const add = (x: Origin) => { setCart(c => c + 1); setToast(`Drip bag ${x.name} masuk keranjang`); setSel(null) }

  return (
    <div ref={ref} className="relative min-h-[100svh] overflow-hidden text-[#2B1A12]" style={{ backgroundColor: SAND, fontFamily: "var(--font-plex), var(--font-geist), system-ui, sans-serif" }}>
      <style>{`
        @keyframes seduh-float { 0%,100% { transform: translate3d(0,0,0) } 50% { transform: translate3d(0,-10px,0) } }
        .seduh-float { animation: seduh-float var(--t) ease-in-out infinite; }
        .seduh-par { transform: translate3d(calc(var(--px, 0) * var(--dp) * -30px), calc(var(--py, 0) * var(--dp) * -22px), 0); transition: transform .3s ease-out; }
        @media (prefers-reduced-motion: reduce) { .seduh-float { animation: none } }
      `}</style>
      <div className="pointer-events-none absolute inset-0 opacity-[.35]" style={{ backgroundImage: "radial-gradient(rgba(43,26,18,.18) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      <header className="relative z-30 flex items-center justify-between px-5 py-4 sm:px-8">
        <span className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-geist), system-ui" }}>seduh.</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#2B1A12] px-4 py-1.5 text-sm font-semibold text-[#EAD7BB]">
          Keranjang <motion.span key={cart} initial={{ scale: 1.7 }} animate={{ scale: 1 }} className="grid h-5 min-w-5 place-items-center rounded-full bg-[#EAD7BB] px-1 text-xs text-[#2B1A12]">{cart}</motion.span>
        </span>
      </header>

      {/* headline */}
      <section className="relative z-10 flex min-h-[calc(100svh-72px)] flex-col items-center justify-center px-6 pb-24 text-center">
        <h1 className="font-extrabold uppercase leading-[0.92] tracking-[-0.03em]" style={{ fontFamily: "var(--font-geist), system-ui", fontSize: "clamp(2.6rem, 8.5vw, 7.5rem)" }}>
          Satu sachet,
          <br />
          satu{" "}
          <span className="relative inline-block h-[0.9em] w-[0.62em] align-[-0.08em]">
            <AnimatePresence initial={false}>
              <motion.span
                key={tiny}
                className="absolute inset-0"
                initial={{ y: "60%", rotate: -20, opacity: 0 }} animate={{ y: 0, rotate: 8, opacity: 1 }} exit={{ y: "-60%", rotate: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <Sachet o={ORIGINS[tiny]} />
              </motion.span>
            </AnimatePresence>
          </span>{" "}
          cerita.
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed opacity-80 sm:text-base">Kopi drip bag dari 12 daerah di Nusantara. Pilih satu sachet untuk melihat rasa dan cara menyeduhnya.</p>
      </section>

      {/* scattered sachets */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {ORIGINS.map((x, i) => {
          const s = SPOTS[i]
          return (
            <div key={x.id} className="seduh-par absolute w-[clamp(64px,8.5vw,128px)]" style={{ left: `${s.x}%`, top: `calc(72px + ${s.y}% * 0.86)`, ["--dp" as string]: s.d }}>
              <div className="seduh-float" style={{ ["--t" as string]: `${5 + (i % 4)}s`, animationDelay: `${-i * 0.7}s` }}>
                {sel !== x.id && (
                  <motion.button
                    layoutId={`sachet-${x.id}`}
                    type="button"
                    onClick={() => setSel(x.id)}
                    aria-label={`Lihat kopi ${x.name}`}
                    className="pointer-events-auto block w-full"
                    initial={false}
                    animate={{ rotate: s.r }}
                    whileHover={{ scale: 1.08, rotate: 0, y: -6 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  >
                    <Sachet o={x} />
                  </motion.button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* selected sachet */}
      <AnimatePresence>
        {o && (
          <motion.div key="overlay" className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 px-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Tutup" onClick={() => setSel(null)} className="absolute inset-0 bg-[#EAD7BB]/70 backdrop-blur-md" />
            <button type="button" onClick={() => setSel(null)} aria-label="Tutup" className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#2B1A12] text-lg text-[#EAD7BB]">×</button>

            <motion.div layoutId={`sachet-${o.id}`} className="relative z-10 w-[min(300px,68vw)]" animate={{ rotate: 0 }} transition={{ type: "spring", stiffness: 160, damping: 20 }} style={{ perspective: 1400 }}>
              <motion.div className="relative" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 90, damping: 15 }}>
                <div style={{ backfaceVisibility: "hidden" }}><Sachet o={o} /></div>
                <div className="absolute inset-0 overflow-hidden rounded-xl bg-[#FBF4E8] p-[7%] text-left shadow-[0_14px_30px_rgba(43,26,18,.3)]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderTop: `10px solid ${o.color}` }}>
                  <div className="text-lg font-extrabold leading-tight">{o.name}</div>
                  <div className="text-[11px] opacity-70">{o.region} · {o.process} · {o.alt}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px]"><span className="opacity-70">Sangrai</span><Dots n={o.roast} color={o.color} /></div>
                  <div className="mt-2 space-y-1.5">
                    {(Object.entries(o.taste) as [keyof Origin["taste"], number][]).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2 text-[11px]">
                        <span className="w-10 capitalize opacity-70">{k}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#2B1A12]/10">
                          <motion.span className="block h-full rounded-full" style={{ backgroundColor: o.color }} initial={{ width: 0 }} animate={{ width: flipped ? `${v * 20}%` : 0 }} transition={{ delay: 0.25, duration: 0.6 }} />
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[11px] italic leading-snug opacity-80">“{o.notes}”</div>
                  <div className="mt-3 grid grid-cols-4 gap-1 text-center text-[10px]">
                    {[["15 g", "kopi"], ["200 ml", "air"], ["92°C", "suhu"], ["4 mnt", "seduh"]].map(([a, b]) => (
                      <div key={b} className="rounded-md bg-[#2B1A12]/[0.06] py-1"><div className="font-bold">{a}</div><div className="opacity-60">{b}</div></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="relative z-10 flex items-center gap-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }} exit={{ opacity: 0 }}>
              <button type="button" onClick={() => setFlipped(f => !f)} className="rounded-full border-2 border-[#2B1A12] px-4 py-2 text-sm font-semibold">
                {flipped ? "Lihat depan" : "Balik sachet"}
              </button>
              <button type="button" onClick={() => add(o)} className="rounded-full bg-[#2B1A12] px-4 py-2 text-sm font-semibold text-[#EAD7BB]">
                + Keranjang · {rupiah(o.price)}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 30, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }} className="fixed bottom-6 left-1/2 z-[70] rounded-full bg-[#2B1A12] px-4 py-2.5 text-sm font-semibold text-[#EAD7BB] shadow-xl">
            ✓ {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <DemoBadge />
    </div>
  )
}
