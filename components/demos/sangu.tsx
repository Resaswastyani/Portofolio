"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { DemoBadge, rupiah, usePointerParallax } from "./demo-shared"

// ─── Data ────────────────────────────────────────────────────────────────────
type Key = "tumbler" | "bekal" | "tas" | "botol"
type Item = { kind: ItemKind; x: number; y: number; size: number; rot: number; depth: number; blur?: number }
type ItemKind = "ice" | "bean" | "mint" | "lemon" | "onigiri" | "egg" | "broccoli" | "tomato" | "apple" | "sandwich" | "drop"

const PRODUCTS: {
  key: Key; word: string; name: string; desc: string; price: number; bg: string; pair: string; items: Item[]
}[] = [
  {
    key: "tumbler", word: "TUMBLER", name: "Tumbler 900 ml", price: 149000, bg: "#D9643A",
    desc: "Dinding ganda baja tahan karat. Es tetap utuh 24 jam, kopi tetap hangat 12 jam.",
    pair: "Kopi susu, es teh, wedang jahe",
    items: [
      { kind: "ice", x: 12, y: 22, size: 92, rot: -14, depth: 0.6 },
      { kind: "bean", x: 24, y: 64, size: 46, rot: 30, depth: 0.35 },
      { kind: "mint", x: 76, y: 18, size: 88, rot: 22, depth: 0.5 },
      { kind: "ice", x: 84, y: 58, size: 130, rot: 18, depth: 1, blur: 6 },
      { kind: "bean", x: 66, y: 74, size: 40, rot: -40, depth: 0.3 },
      { kind: "bean", x: 4, y: 84, size: 120, rot: 12, depth: 1.1, blur: 7 },
      { kind: "lemon", x: 34, y: 12, size: 54, rot: 0, depth: 0.25, blur: 2 },
    ],
  },
  {
    key: "bekal", word: "BEKAL", name: "Kotak Bekal 3 Sekat", price: 119000, bg: "#E5AE36",
    desc: "Tiga sekat, tutup rapat anti tumpah, aman untuk microwave dan mesin cuci piring.",
    pair: "Nasi, telur dadar, tumis brokoli",
    items: [
      { kind: "onigiri", x: 10, y: 20, size: 96, rot: -12, depth: 0.6 },
      { kind: "broccoli", x: 80, y: 16, size: 96, rot: 14, depth: 0.5 },
      { kind: "egg", x: 22, y: 66, size: 70, rot: 18, depth: 0.4 },
      { kind: "tomato", x: 70, y: 70, size: 52, rot: 0, depth: 0.35 },
      { kind: "tomato", x: 88, y: 54, size: 120, rot: 0, depth: 1, blur: 6 },
      { kind: "broccoli", x: 2, y: 86, size: 130, rot: -20, depth: 1.1, blur: 7 },
      { kind: "egg", x: 36, y: 10, size: 46, rot: -8, depth: 0.25, blur: 2 },
    ],
  },
  {
    key: "tas", word: "TAS BEKAL", name: "Tas Bekal Termal", price: 89000, bg: "#2E8A7E",
    desc: "Lapisan termal tebal menjaga bekal tetap segar sampai jam makan siang. Muat 2 kotak.",
    pair: "Kotak bekal, botol minum, buah potong",
    items: [
      { kind: "apple", x: 12, y: 22, size: 88, rot: -10, depth: 0.6 },
      { kind: "sandwich", x: 78, y: 18, size: 100, rot: 16, depth: 0.5 },
      { kind: "lemon", x: 24, y: 70, size: 60, rot: 20, depth: 0.4 },
      { kind: "apple", x: 86, y: 60, size: 128, rot: 14, depth: 1, blur: 6 },
      { kind: "onigiri", x: 66, y: 76, size: 50, rot: -16, depth: 0.3 },
      { kind: "sandwich", x: 3, y: 84, size: 130, rot: -14, depth: 1.1, blur: 7 },
    ],
  },
  {
    key: "botol", word: "BOTOL", name: "Botol Minum 750 ml", price: 99000, bg: "#3557D6",
    desc: "Tutup flip satu tangan, penanda waktu minum, dan tali pegangan yang kokoh.",
    pair: "Air putih, infused water, jus jeruk",
    items: [
      { kind: "drop", x: 14, y: 22, size: 70, rot: -10, depth: 0.6 },
      { kind: "lemon", x: 78, y: 18, size: 96, rot: 24, depth: 0.5 },
      { kind: "mint", x: 22, y: 66, size: 74, rot: -30, depth: 0.4 },
      { kind: "drop", x: 70, y: 72, size: 44, rot: 10, depth: 0.3 },
      { kind: "lemon", x: 88, y: 58, size: 130, rot: -10, depth: 1, blur: 6 },
      { kind: "ice", x: 3, y: 84, size: 120, rot: 20, depth: 1.1, blur: 7 },
      { kind: "drop", x: 36, y: 12, size: 36, rot: 0, depth: 0.25, blur: 2 },
    ],
  },
]

const DIAL_ANGLES = [-66, -22, 22, 66]
const CREAM = "#FFF4E2"
const INK = "#1E1B18"

// ─── Product illustrations (SVG, shaded with gradients) ──────────────────────
function Shade({ id, dark, base, light }: { id: string; dark: string; base: string; light: string }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor={dark} />
      <stop offset="0.32" stopColor={base} />
      <stop offset="0.52" stopColor={light} />
      <stop offset="0.72" stopColor={base} />
      <stop offset="1" stopColor={dark} />
    </linearGradient>
  )
}

function Tumbler() {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 240 440" className="h-full w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.28)]" aria-hidden>
      <defs>
        <Shade id={`b${id}`} dark="#BFAE90" base="#EFE4CF" light="#FFFDF7" />
        <Shade id={`l${id}`} dark="#111" base="#2A2724" light="#4A4540" />
        <clipPath id={`c${id}`}><path d="M42 104 L198 104 L182 400 Q180 414 166 414 L74 414 Q60 414 58 400 Z" /></clipPath>
      </defs>
      <path d="M190 150 C252 150 252 290 178 300" fill="none" stroke="#2A2724" strokeWidth="20" strokeLinecap="round" />
      <path d="M42 104 L198 104 L182 400 Q180 414 166 414 L74 414 Q60 414 58 400 Z" fill={`url(#b${id})`} />
      <g clipPath={`url(#c${id})`}>
        <rect x="30" y="236" width="180" height="70" fill="#D9643A" />
        <text x="120" y="275" textAnchor="middle" fontSize="30" fontWeight="700" fill={CREAM} fontFamily="var(--font-demo)">sangu</text>
        <text x="120" y="296" textAnchor="middle" fontSize="10" letterSpacing="3" fill={CREAM} opacity=".85">24 JAM DINGIN</text>
        <rect x="76" y="104" width="14" height="320" fill="#fff" opacity=".35" />
      </g>
      <rect x="30" y="66" width="180" height="44" rx="12" fill={`url(#l${id})`} />
      <ellipse cx="120" cy="66" rx="90" ry="14" fill="#3A3632" />
      <rect x="132" y="54" width="44" height="10" rx="5" fill="#57514B" />
      <rect x="104" y="0" width="14" height="70" rx="7" fill="#2A2724" transform="rotate(8 111 70)" />
    </svg>
  )
}

function Bekal() {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 360 330" className="h-full w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.25)]" aria-hidden>
      <defs>
        <linearGradient id={`f${id}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3B8670" /><stop offset="1" stopColor="#1F4D41" /></linearGradient>
        <linearGradient id={`t${id}`} x1="0" x2="1"><stop offset="0" stopColor="#E9DCC2" /><stop offset=".5" stopColor="#FFF8EA" /><stop offset="1" stopColor="#E3D3B6" /></linearGradient>
        <clipPath id={`w${id}`}><path d="M78 72 L282 72 L306 132 L54 132 Z" /></clipPath>
      </defs>
      <rect x="34" y="150" width="292" height="160" rx="26" fill={`url(#f${id})`} />
      <rect x="34" y="150" width="292" height="26" fill="#000" opacity=".12" />
      <path d="M60 50 L300 50 L338 140 Q340 156 324 156 L36 156 Q20 156 22 140 Z" fill={`url(#t${id})`} />
      <path d="M78 72 L282 72 L306 132 L54 132 Z" fill="#cfe7dc" opacity=".55" />
      <g clipPath={`url(#w${id})`}>
        <ellipse cx="118" cy="110" rx="44" ry="24" fill="#fff" />
        <rect x="104" y="112" width="30" height="20" fill="#24302b" />
        <rect x="166" y="92" width="56" height="30" rx="8" fill="#F6C443" />
        <rect x="166" y="102" width="56" height="4" fill="#E2A92C" />
        <circle cx="254" cy="100" r="16" fill="#3E9B4F" /><circle cx="270" cy="112" r="14" fill="#4FB061" /><circle cx="246" cy="118" r="13" fill="#3E9B4F" />
        <circle cx="290" cy="124" r="10" fill="#E5483A" />
      </g>
      <path d="M78 72 L282 72 L306 132 L54 132 Z" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" />
      <rect x="10" y="132" width="26" height="62" rx="9" fill="#173D33" />
      <rect x="324" y="132" width="26" height="62" rx="9" fill="#173D33" />
      <text x="180" y="245" textAnchor="middle" fontSize="34" fontWeight="700" fill={CREAM} fontFamily="var(--font-demo)">sangu</text>
      <text x="180" y="268" textAnchor="middle" fontSize="10" letterSpacing="3" fill={CREAM} opacity=".8">BENTO · 3 SEKAT</text>
    </svg>
  )
}

function Tas() {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 320 400" className="h-full w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.28)]" aria-hidden>
      <defs>
        <Shade id={`s${id}`} dark="#C35F37" base="#F08A5D" light="#FFB28C" />
      </defs>
      <path d="M100 130 C100 22 220 22 220 130" fill="none" stroke="#3A2E2A" strokeWidth="18" strokeLinecap="round" />
      <rect x="40" y="118" width="240" height="262" rx="34" fill={`url(#s${id})`} />
      <path d="M40 160 Q160 122 280 160" fill="none" stroke="#3A2E2A" strokeWidth="5" strokeDasharray="7 6" />
      <rect x="198" y="140" width="12" height="34" rx="5" fill="#3A2E2A" />
      <rect x="72" y="232" width="176" height="118" rx="22" fill="#000" opacity=".14" />
      <rect x="72" y="232" width="176" height="118" rx="22" fill="none" stroke={CREAM} strokeOpacity=".55" strokeWidth="2" strokeDasharray="5 6" />
      <path d="M72 262 H248 M72 292 H248 M72 322 H248" stroke={CREAM} strokeOpacity=".25" strokeWidth="2" strokeDasharray="4 6" />
      <rect x="112" y="190" width="96" height="30" rx="8" fill={CREAM} />
      <text x="160" y="211" textAnchor="middle" fontSize="18" fontWeight="700" fill="#C35F37" fontFamily="var(--font-demo)">sangu</text>
      <rect x="82" y="118" width="12" height="262" fill="#fff" opacity=".18" />
    </svg>
  )
}

function Botol() {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 200 450" className="h-full w-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.3)]" aria-hidden>
      <defs>
        <Shade id={`y${id}`} dark="#D69A00" base="#FFD24D" light="#FFF1B0" />
        <clipPath id={`win${id}`}><rect x="118" y="160" width="22" height="230" rx="11" /></clipPath>
      </defs>
      <path d="M58 92 Q58 116 34 136 L34 410 Q34 440 64 440 L136 440 Q166 440 166 410 L166 136 Q142 116 142 92 Z" fill={`url(#y${id})`} />
      <rect x="118" y="160" width="22" height="230" rx="11" fill="#fff" opacity=".35" />
      <g clipPath={`url(#win${id})`}>
        <g className="sangu-wave"><path d="M80 250 Q95 242 110 250 T140 250 T170 250 T200 250 V400 H80 Z" fill="#6FC3FF" opacity=".85" /></g>
      </g>
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x="146" y={178 + i * 44} width="12" height="3" rx="1.5" fill="#8A6300" opacity=".55" />)}
      <text x="88" y="300" textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} fontFamily="var(--font-demo)" transform="rotate(-90 88 300)" letterSpacing="2">SANGU · 750 ML</text>
      <rect x="50" y="40" width="100" height="56" rx="16" fill="#1D1D1F" />
      <rect x="64" y="22" width="56" height="26" rx="10" fill="#2E2E31" />
      <circle cx="140" cy="34" r="20" fill="none" stroke="#1D1D1F" strokeWidth="9" />
      <rect x="54" y="136" width="10" height="290" rx="5" fill="#fff" opacity=".35" />
    </svg>
  )
}

const PRODUCT_ART: Record<Key, () => React.ReactElement> = { tumbler: Tumbler, bekal: Bekal, tas: Tas, botol: Botol }
// Each illustration has its own aspect ratio, so each gets its own height (capped by width on phones)
const ART_HEIGHT: Record<Key, string> = {
  tumbler: "min(60vh, 120vw, 560px)", bekal: "min(38vh, 72vw, 380px)", tas: "min(50vh, 92vw, 470px)", botol: "min(60vh, 130vw, 560px)",
}

// ─── Floating ingredients ────────────────────────────────────────────────────
function ItemArt({ kind }: { kind: ItemKind }) {
  switch (kind) {
    case "ice": return <svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" rx="20" fill="#E6F6FF" fillOpacity=".75" stroke="#fff" strokeWidth="3" /><path d="M26 30 Q40 22 56 26" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" /><rect x="58" y="58" width="18" height="18" rx="6" fill="#fff" opacity=".6" /></svg>
    case "bean": return <svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="30" ry="40" fill="#5B3A24" /><path d="M50 12 C36 36 64 62 50 88" stroke="#2E1C10" strokeWidth="6" fill="none" strokeLinecap="round" /><ellipse cx="38" cy="36" rx="7" ry="12" fill="#fff" opacity=".18" /></svg>
    case "mint": return <svg viewBox="0 0 100 100"><path d="M50 92 C10 70 10 26 50 8 C90 26 90 70 50 92 Z" fill="#43A65A" /><path d="M50 92 L50 14 M50 40 L34 30 M50 56 L66 44 M50 70 L36 62" stroke="#2C7A3F" strokeWidth="4" strokeLinecap="round" /></svg>
    case "lemon": return <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#F7D84A" /><circle cx="50" cy="50" r="36" fill="#FFF3A6" />{[0, 45, 90, 135].map(a => <line key={a} x1="50" y1="16" x2="50" y2="84" stroke="#F7D84A" strokeWidth="4" transform={`rotate(${a} 50 50)`} />)}</svg>
    case "onigiri": return <svg viewBox="0 0 100 100"><path d="M50 10 C62 10 92 66 88 80 C84 92 16 92 12 80 C8 66 38 10 50 10 Z" fill="#fff" /><rect x="32" y="62" width="36" height="30" rx="4" fill="#24302B" /><circle cx="42" cy="40" r="2.5" fill="#d9d4c8" /><circle cx="58" cy="46" r="2.5" fill="#d9d4c8" /></svg>
    case "egg": return <svg viewBox="0 0 100 100"><rect x="8" y="26" width="84" height="48" rx="12" fill="#F6C443" /><path d="M8 42 H92 M8 58 H92" stroke="#E2A92C" strokeWidth="4" /><rect x="16" y="30" width="30" height="8" rx="4" fill="#fff" opacity=".35" /></svg>
    case "broccoli": return <svg viewBox="0 0 100 100"><rect x="42" y="56" width="16" height="38" rx="7" fill="#8CC56B" /><circle cx="34" cy="40" r="20" fill="#3E9B4F" /><circle cx="64" cy="38" r="22" fill="#4FB061" /><circle cx="50" cy="22" r="18" fill="#3E9B4F" /></svg>
    case "tomato": return <svg viewBox="0 0 100 100"><circle cx="50" cy="56" r="38" fill="#E5483A" /><path d="M50 22 L56 10 M50 22 L38 14 M50 22 L64 18 M50 22 L42 28 M50 22 L60 30" stroke="#3E8E41" strokeWidth="6" strokeLinecap="round" /><ellipse cx="36" cy="44" rx="8" ry="12" fill="#fff" opacity=".3" /></svg>
    case "apple": return <svg viewBox="0 0 100 100"><path d="M50 30 C20 14 6 46 18 72 C28 94 44 90 50 86 C56 90 72 94 82 72 C94 46 80 14 50 30 Z" fill="#D9363E" /><path d="M50 30 C50 20 54 12 60 8" stroke="#5B3A24" strokeWidth="5" strokeLinecap="round" fill="none" /><path d="M56 18 C66 8 80 12 80 12 C76 22 64 24 56 18 Z" fill="#43A65A" /><ellipse cx="32" cy="48" rx="7" ry="13" fill="#fff" opacity=".3" /></svg>
    case "sandwich": return <svg viewBox="0 0 100 100"><path d="M8 78 L50 14 L92 78 Z" fill="#F2D29B" /><path d="M14 70 L50 22 L86 70" fill="none" stroke="#5FB35C" strokeWidth="7" strokeLinejoin="round" /><path d="M20 62 L50 30 L80 62" fill="none" stroke="#E5483A" strokeWidth="6" strokeLinejoin="round" /><path d="M8 78 L92 78 L92 88 L8 88 Z" fill="#E2B572" /></svg>
    case "drop": return <svg viewBox="0 0 100 100"><path d="M50 6 C66 34 82 50 82 66 A32 32 0 0 1 18 66 C18 50 34 34 50 6 Z" fill="#9AD8FF" fillOpacity=".85" stroke="#fff" strokeWidth="3" /><ellipse cx="38" cy="62" rx="7" ry="12" fill="#fff" opacity=".6" /></svg>
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────
export function SanguDemo() {
  const [idx, setIdx] = useState(0)
  const [cart, setCart] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const heroRef = usePointerParallax<HTMLElement>()
  const p = PRODUCTS[idx]
  const Art = PRODUCT_ART[p.key]

  const select = useCallback((i: number) => setIdx((i + PRODUCTS.length) % PRODUCTS.length), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIdx(i => Math.min(PRODUCTS.length - 1, i + 1))
      if (e.key === "ArrowLeft") setIdx(i => Math.max(0, i - 1))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const addToCart = (name: string) => { setCart(c => c + 1); setToast(`${name} masuk keranjang`) }

  return (
    <div className="min-h-screen text-[#FFF4E2] selection:bg-black/20" style={{ fontFamily: "var(--font-demo), system-ui, sans-serif" }}>
      <style>{`
        @keyframes sangu-float { 0%,100% { transform: translate3d(0,0,0) rotate(var(--r)) } 50% { transform: translate3d(0,-14px,0) rotate(calc(var(--r) + 6deg)) } }
        @keyframes sangu-wave { from { transform: translateX(0) } to { transform: translateX(-60px) } }
        .sangu-float { animation: sangu-float var(--d) ease-in-out infinite; }
        .sangu-wave { animation: sangu-wave 2.4s linear infinite; }
        .sangu-par { transform: translate3d(calc(var(--px, 0) * var(--dp) * 36px), calc(var(--py, 0) * var(--dp) * 26px), 0); transition: transform .25s ease-out; }
        @media (prefers-reduced-motion: reduce) { .sangu-float, .sangu-wave { animation: none } }
      `}</style>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[620px] overflow-hidden transition-colors duration-700 ease-out"
        style={{ backgroundColor: p.bg }}
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 45%, rgba(255,255,255,0.18), transparent 70%)" }} />

        {/* header */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-10 sm:py-6">
          <span className="text-2xl font-bold tracking-tight">sangu<span className="opacity-60">.</span></span>
          <nav className="hidden items-center gap-7 text-sm font-medium sm:flex">
            <a href="#pilih" className="opacity-85 hover:opacity-100">Produk</a>
            <a href="#pilih" className="opacity-85 hover:opacity-100">Paket hemat</a>
            <a href="#cerita" className="opacity-85 hover:opacity-100">Cerita</a>
          </nav>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border-2 border-[#FFF4E2]/80 px-4 py-1.5 text-sm font-semibold">
            Keranjang
            <motion.span key={cart} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="grid h-6 min-w-6 place-items-center rounded-full bg-[#FFF4E2] px-1.5 text-xs" style={{ color: p.bg }}>{cart}</motion.span>
          </button>
        </header>

        {/* giant word behind the product */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={p.word} className="flex whitespace-nowrap font-bold leading-none tracking-[-0.04em]" style={{ fontSize: p.word.length > 6 ? "clamp(4.5rem, 17vw, 19rem)" : "clamp(5.5rem, 24vw, 26rem)" }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
              {p.word.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "45%", opacity: 0, rotate: 6 }}
                  animate={{ y: 0, opacity: 0.95, rotate: 0 }}
                  transition={{ delay: 0.05 + i * 0.045, type: "spring", stiffness: 240, damping: 22 }}
                  className="inline-block"
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* floating ingredients */}
        <AnimatePresence initial={false}>
          {p.items.map((it, i) => (
            <motion.div
              key={`${p.key}-${i}`}
              className="pointer-events-none absolute"
              style={{ left: `${it.x}%`, top: `${it.y}%`, width: it.size, height: it.size, zIndex: it.depth >= 1 ? 25 : 5, filter: it.blur ? `blur(${it.blur}px)` : undefined }}
              initial={{ opacity: 0, scale: 0.4, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.12 + i * 0.05, type: "spring", stiffness: 160, damping: 16 } }}
              exit={{ opacity: 0, scale: 0.6, y: -80, transition: { duration: 0.3 } }}
            >
              <div className="sangu-par h-full w-full" style={{ ["--dp" as string]: it.depth }}>
                <div className="sangu-float h-full w-full" style={{ ["--r" as string]: `${it.rot}deg`, ["--d" as string]: `${5 + (i % 3) * 1.3}s` }}>
                  <ItemArt kind={it.kind} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* product */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={p.key}
              style={{ height: ART_HEIGHT[p.key] }}
              initial={{ opacity: 0, y: 120, rotate: -14, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } }}
              exit={{ opacity: 0, y: -90, rotate: 12, scale: 0.9, transition: { duration: 0.3 } }}
            >
              <div className="sangu-par h-full" style={{ ["--dp" as string]: -0.25 }}>
                <Art />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* info */}
        <div className="absolute bottom-16 left-5 z-30 max-w-[19rem] sm:bottom-12 sm:left-10">
          {/* no exit animation on purpose: "wait" mode can leave this empty when the dial is spun quickly */}
            <motion.div key={p.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{p.name}</h1>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{p.desc}</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-bold">{rupiah(p.price)}</span>
                <button
                  type="button"
                  onClick={() => addToCart(p.name)}
                  className="rounded-full bg-[#1E1B18] px-5 py-2.5 text-sm font-semibold text-[#FFF4E2] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  + Keranjang
                </button>
              </div>
            </motion.div>
        </div>

        <Dial idx={idx} onSelect={select} accent={p.bg} />
      </section>

      {/* ── PICK SECTION ── */}
      <section id="pilih" className="bg-[#1E1B18] px-5 py-20 sm:px-10 sm:py-28">
        <h2 className="text-center text-5xl font-bold tracking-tight sm:text-7xl">PILIH SANGUMU</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-sm opacity-70">Empat teman makan siang. Arahkan kursor untuk melihat pasangannya, klik untuk melihat lebih dekat.</p>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4">
          {PRODUCTS.map((q, i) => {
            const A = PRODUCT_ART[q.key]
            return (
              <button
                key={q.key}
                type="button"
                onClick={() => { select(i); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                className="group relative aspect-[3/4] overflow-hidden rounded-[28px] p-5 text-left transition-transform duration-300 hover:-translate-y-2"
                style={{ backgroundColor: q.bg }}
              >
                <div className="relative z-10 text-2xl font-bold">{q.word}</div>
                <div className="relative z-10 mt-1 max-w-[12rem] text-xs leading-relaxed opacity-0 transition-opacity duration-300 group-hover:opacity-90 group-focus-visible:opacity-90">
                  Cocok untuk: {q.pair}
                </div>
                <div className="absolute inset-x-0 bottom-5 flex h-[54%] justify-center transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <A />
                </div>
                <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/25 px-3 py-1 text-xs font-semibold">{rupiah(q.price)}</div>
              </button>
            )
          })}
        </div>
      </section>

      <footer id="cerita" className="flex flex-col items-center justify-between gap-2 bg-[#1E1B18] px-5 pb-16 pt-6 text-xs opacity-80 sm:flex-row sm:px-10 sm:pb-8">
        <span className="font-bold">sangu.</span>
        <span>Bekal dari rumah, rasanya tetap rumah. · Demo konsep, bukan toko sungguhan.</span>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[70] flex items-center gap-2 rounded-full bg-[#FFF4E2] px-4 py-2.5 text-sm font-semibold text-[#1E1B18] shadow-xl"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full text-[11px] text-white" style={{ backgroundColor: p.bg }}>✓</span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <DemoBadge />
    </div>
  )
}

// ─── Rotary dial ─────────────────────────────────────────────────────────────
function Dial({ idx, onSelect, accent }: { idx: number; onSelect: (i: number) => void; accent: string }) {
  const knobRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const pick = (clientX: number, clientY: number) => {
    const r = knobRef.current!.getBoundingClientRect()
    const a = (Math.atan2(clientX - (r.left + r.width / 2), -(clientY - (r.top + r.height / 2))) * 180) / Math.PI
    let best = 0
    DIAL_ANGLES.forEach((d, i) => { if (Math.abs(d - a) < Math.abs(DIAL_ANGLES[best] - a)) best = i })
    if (best !== idx) onSelect(best)
  }

  return (
    <div className="absolute bottom-6 right-4 z-30 h-[150px] w-[200px] sm:bottom-10 sm:right-10 sm:scale-110 origin-bottom-right">
      {PRODUCTS.map((q, i) => {
        const a = (DIAL_ANGLES[i] * Math.PI) / 180
        return (
          <button
            key={q.key}
            type="button"
            onClick={() => onSelect(i)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-bold tracking-wider transition-opacity ${i === idx ? "opacity-100" : "opacity-55 hover:opacity-90"}`}
            style={{ left: 100 + Math.sin(a) * 84, top: 100 - Math.cos(a) * 84 }}
          >
            {q.word.split(" ")[0]}
          </button>
        )
      })}
      <div
        ref={knobRef}
        role="slider"
        aria-label="Pilih produk"
        aria-valuemin={0}
        aria-valuemax={PRODUCTS.length - 1}
        aria-valuenow={idx}
        aria-valuetext={PRODUCTS[idx].name}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") { e.preventDefault(); onSelect(Math.min(PRODUCTS.length - 1, idx + 1)) }
          if (e.key === "ArrowDown") { e.preventDefault(); onSelect(Math.max(0, idx - 1)) }
        }}
        onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); pick(e.clientX, e.clientY) }}
        onPointerMove={(e) => { if (dragging.current) pick(e.clientX, e.clientY) }}
        onPointerUp={() => { dragging.current = false }}
        className="absolute left-[100px] top-[100px] h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full active:cursor-grabbing"
        style={{ background: "radial-gradient(circle at 35% 30%, #fff, #EDE6DA 60%, #CFC6B8)", boxShadow: "0 18px 30px -10px rgba(0,0,0,.45), inset 0 -4px 8px rgba(0,0,0,.12)" }}
      >
        <div className="absolute inset-[-10px] rounded-full border-2 border-dashed border-[#FFF4E2]/45" />
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: DIAL_ANGLES[idx] }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          <div className="absolute left-1/2 top-2 h-5 w-[6px] -translate-x-1/2 rounded-full" style={{ backgroundColor: accent }} />
        </motion.div>
      </div>
    </div>
  )
}
