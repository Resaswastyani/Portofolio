"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { DemoBadge, rupiah } from "./demo-shared"

// ─── Data (all titles and authors are fictional) ─────────────────────────────
type Book = { title: string; author: string; genre: string; color: string; ink: string; accent: string }

const RAW: Book[] = [
  { title: "Hujan di Kota Pelajar", author: "Nara Wening", genre: "Novel", color: "#3B5BA9", ink: "#F4EEDF", accent: "#F2B53A" },
  { title: "Peta Rasa Nusantara", author: "Bayu Ardana", genre: "Kuliner", color: "#C2462E", ink: "#FFF3E0", accent: "#F7D38A" },
  { title: "Kopi Pukul Tiga", author: "Sekar Pratiwi", genre: "Cerpen", color: "#4A3426", ink: "#F3E6D3", accent: "#D99A5B" },
  { title: "Rumah di Ujung Rel", author: "Dimas Kalandra", genre: "Novel", color: "#2F6B5B", ink: "#EAF4EE", accent: "#E9C46A" },
  { title: "Seribu Jendela", author: "Laras Ayuningtyas", genre: "Puisi", color: "#E8C6C0", ink: "#3A2427", accent: "#B4475A" },
  { title: "Laut yang Menunggu", author: "Galih Mahendra", genre: "Novel", color: "#1F4E79", ink: "#E6F0FA", accent: "#7FC8F8" },
  { title: "Catatan Anak Kos", author: "Rara Kinanti", genre: "Esai", color: "#F2C14E", ink: "#2B2116", accent: "#C2462E" },
  { title: "Kode di Balik Senja", author: "Arya Pradipta", genre: "Teknologi", color: "#14141A", ink: "#E8E8F0", accent: "#8B7CF6" },
  { title: "Merapi dan Kita", author: "Wulan Sasmita", genre: "Sejarah", color: "#6B4E3D", ink: "#F3E7DA", accent: "#E07A5F" },
  { title: "Pasar Malam Terakhir", author: "Yoga Satria", genre: "Novel", color: "#7A2E5C", ink: "#FBEAF3", accent: "#F4A259" },
  { title: "Surat untuk Bapak", author: "Intan Maharani", genre: "Memoar", color: "#D9D2C3", ink: "#2C2A26", accent: "#5B7553" },
  { title: "Kereta Pagi", author: "Fajar Nugraha", genre: "Cerpen", color: "#2B6CB0", ink: "#F0F6FF", accent: "#F6E05E" },
  { title: "Belajar Diam", author: "Citra Lestari", genre: "Pengembangan diri", color: "#8FB3A6", ink: "#1E2E2A", accent: "#F2E8CF" },
  { title: "Angka-Angka Kecil", author: "Rizky Ananta", genre: "Sains", color: "#264653", ink: "#E9F5F2", accent: "#2A9D8F" },
  { title: "Gang Sempit, Mimpi Lebar", author: "Putri Anindya", genre: "Novel", color: "#E76F51", ink: "#FFF4EC", accent: "#264653" },
  { title: "Teh Tubruk & Hal Lainnya", author: "Bima Prasetya", genre: "Esai", color: "#9C6644", ink: "#FBEFE2", accent: "#EDE0D4" },
  { title: "Sungai Tanpa Nama", author: "Ayu Paramitha", genre: "Puisi", color: "#335C67", ink: "#EAF2F0", accent: "#E09F3E" },
  { title: "Pulang Lewat Selatan", author: "Hendra Wicaksana", genre: "Perjalanan", color: "#BC6C25", ink: "#FEFAE0", accent: "#283618" },
  { title: "Algoritma Rindu", author: "Nadia Safitri", genre: "Novel", color: "#5E548E", ink: "#F1EDFF", accent: "#F5CAC3" },
  { title: "Kebun di Atap", author: "Dewi Kartika", genre: "Hobi", color: "#6A994E", ink: "#F2F8EA", accent: "#F2E8CF" },
  { title: "Tiga Musim di Dieng", author: "Ilham Fadillah", genre: "Perjalanan", color: "#A7C4D9", ink: "#1D2D3A", accent: "#E76F51" },
  { title: "Malam Minggu Data", author: "Kevin Saputra", genre: "Teknologi", color: "#0B3C49", ink: "#E3F6F5", accent: "#FFD166" },
  { title: "Batik untuk Pemula", author: "Sri Handayani", genre: "Seni", color: "#7F4F24", ink: "#FAEDCD", accent: "#D4A373" },
  { title: "Lampu Kota Mati", author: "Reza Mahardika", genre: "Thriller", color: "#1B1B1E", ink: "#F5F5F5", accent: "#E63946" },
  { title: "Langit Boyolali", author: "Anisa Rahmawati", genre: "Novel", color: "#457B9D", ink: "#F1FAEE", accent: "#E9C46A" },
  { title: "Dapur Ibu", author: "Siti Nurjanah", genre: "Kuliner", color: "#E9C46A", ink: "#3A2E16", accent: "#C2462E" },
  { title: "Bermain dengan Cahaya", author: "Tegar Wibisono", genre: "Fotografi", color: "#F4F1DE", ink: "#2B2D42", accent: "#E07A5F" },
  { title: "Peron Nomor Dua", author: "Melati Puspita", genre: "Cerpen", color: "#9E2A2B", ink: "#FFF1E6", accent: "#E09F3E" },
]

const CHAPTERS = ["Pembuka", "Hujan Pertama", "Jalan Pulang", "Yang Tidak Diucapkan", "Pagi di Stasiun", "Surat yang Terlambat", "Sebuah Janji", "Musim Berganti", "Di Bawah Lampu", "Penutup"]
const EXCERPTS = [
  "Hujan turun tepat ketika lampu jalan menyala. Ia berdiri di bawah atap warung, menghitung tetes yang jatuh dari ujung seng, seolah setiap tetes adalah satu alasan untuk tidak pulang terlalu cepat.",
  "Kami tidak pernah benar-benar sepakat soal cara memasak sambal. Ibu bilang rahasianya ada di sabar, Bapak bilang rahasianya ada di cabai yang dipetik pagi. Malam itu aku tahu, rahasianya ada di siapa yang menunggu di meja makan.",
  "Kereta pertama berangkat pukul lima lewat dua belas. Di peron, orang-orang membawa cerita masing-masing dalam tas yang terlalu kecil, dan aku membawa satu pertanyaan yang belum sempat kutanyakan.",
  "Setiap baris kode yang ia tulis malam itu terasa seperti surat. Ada yang dikirim, ada yang dihapus, ada yang disimpan di folder bernama nanti saja, dan tidak pernah dibuka lagi.",
]

type Full = Book & { id: number; pages: number; year: number; price: number; width: number; height: number; pattern: number; chapters: { name: string; page: number }[]; excerpt: string }

const BOOKS: Full[] = RAW.map((b, i) => {
  const pages = 140 + ((i * 53) % 280)
  return {
    ...b, id: i, pages,
    year: 2019 + (i % 8),
    price: 59000 + ((i * 7) % 8) * 10000,
    width: 24 + ((i * 13) % 22),
    height: 150 + ((i * 29) % 56),
    pattern: i % 6,
    chapters: Array.from({ length: 6 }, (_, k) => ({ name: CHAPTERS[(i + k) % CHAPTERS.length], page: 1 + Math.round((pages / 6) * k) })),
    excerpt: EXCERPTS[i % EXCERPTS.length],
  }
})

const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif'

// ─── Cover art (generated, one of six patterns) ──────────────────────────────
function CoverPattern({ b }: { b: Full }) {
  const a = b.accent, ink = b.ink
  switch (b.pattern) {
    case 0: return <g><circle cx="150" cy="190" r="86" fill={a} /><rect x="0" y="250" width="300" height="200" fill={b.color} opacity=".55" /><path d="M0 262 Q75 240 150 262 T300 262" stroke={ink} strokeOpacity=".5" strokeWidth="2" fill="none" /></g>
    case 1: return <g opacity=".9">{Array.from({ length: 12 }, (_, k) => <rect key={k} x={-200 + k * 46} y="-50" width="18" height="600" fill={a} opacity={0.25 + (k % 3) * 0.2} transform="rotate(28 150 225)" />)}</g>
    case 2: return <g>{Array.from({ length: 7 }, (_, k) => <path key={k} d={`M-10 ${150 + k * 30} Q 65 ${130 + k * 30} 150 ${150 + k * 30} T 310 ${150 + k * 30}`} stroke={k % 2 ? a : ink} strokeOpacity={k % 2 ? 0.9 : 0.3} strokeWidth="6" fill="none" />)}</g>
    case 3: return <g>{Array.from({ length: 64 }, (_, k) => <circle key={k} cx={40 + (k % 8) * 31} cy={120 + Math.floor(k / 8) * 31} r={k % 9 === 0 ? 9 : 4} fill={k % 9 === 0 ? a : ink} opacity={k % 9 === 0 ? 1 : 0.35} />)}</g>
    case 4: return <g><path d="M-10 330 L90 170 L160 270 L215 200 L310 330 Z" fill={a} /><path d="M-10 330 L60 250 L120 330 Z" fill={ink} opacity=".25" /><circle cx="230" cy="130" r="22" fill={ink} opacity=".8" /></g>
    default: return <g>{[110, 86, 62, 38].map((r, k) => <circle key={r} cx="150" cy="215" r={r} fill="none" stroke={k % 2 ? ink : a} strokeOpacity={k % 2 ? 0.4 : 1} strokeWidth="14" />)}</g>
  }
}

function Cover({ b }: { b: Full }) {
  return (
    <svg viewBox="0 0 300 450" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
      <rect width="300" height="450" fill={b.color} />
      <CoverPattern b={b} />
      <rect x="0" y="0" width="14" height="450" fill="#000" opacity=".18" />
      <text x="28" y="56" fontSize="13" letterSpacing="3" fill={b.ink} opacity=".8" fontFamily={SERIF}>{b.genre.toUpperCase()}</text>
      <foreignObject x="24" y="330" width="256" height="90">
        <div style={{ fontFamily: SERIF, color: b.ink, fontSize: 27, lineHeight: 1.05, fontWeight: 700 }}>{b.title}</div>
      </foreignObject>
      <text x="28" y="432" fontSize="13" fill={b.ink} opacity=".85" fontFamily={SERIF}>{b.author}</text>
    </svg>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export function LembarDemo() {
  const [sel, setSel] = useState(0)
  const [open, setOpen] = useState(false)
  const [bag, setBag] = useState<number[]>([])
  const [progress, setProgress] = useState(0)
  const [reading, setReading] = useState(false)
  const [fontSize, setFontSize] = useState(13)
  const [marked, setMarked] = useState<Record<number, boolean>>({})
  const shelfRef = useRef<HTMLDivElement>(null)
  const b = BOOKS[sel]

  // pulling a new book off the shelf: closed first, then the cover swings open
  useEffect(() => {
    setOpen(false); setProgress(0); setReading(false)
    const t = setTimeout(() => setOpen(true), 850)
    const spine = shelfRef.current?.querySelector<HTMLElement>(`[data-id="${sel}"]`)
    spine?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    return () => clearTimeout(t)
  }, [sel])

  useEffect(() => {
    if (!reading) return
    const t = setInterval(() => setProgress(p => { if (p >= 100) { setReading(false); return 100 } return p + 1 }), 90)
    return () => clearInterval(t)
  }, [reading])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setSel(s => (s + 1) % BOOKS.length)
      if (e.key === "ArrowLeft") setSel(s => (s - 1 + BOOKS.length) % BOOKS.length)
      if (e.key === " " && (e.target as HTMLElement).tagName !== "BUTTON") { e.preventDefault(); setOpen(o => !o) }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const page = Math.max(1, Math.round((progress / 100) * b.pages))
  const chapterIdx = b.chapters.reduce((acc, c, i) => (page >= c.page ? i : acc), 0)
  const inBag = bag.includes(b.id)

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#17120F] text-[#F4EEDF]" style={{ fontFamily: SERIF }}>
      {/* colour wash taken from the selected cover */}
      <AnimatePresence initial={false}>
        <motion.div
          key={b.id}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
          style={{ background: `radial-gradient(70% 60% at 50% 34%, ${b.color}cc 0%, ${b.color}55 38%, #17120F 82%)` }}
        />
      </AnimatePresence>

      {/* top bar */}
      <header className="relative z-20 flex items-center justify-between px-5 py-4 text-sm sm:px-8">
        <span className="text-2xl font-bold italic tracking-tight">lembar.</span>
        <div className="flex items-center gap-1 rounded-full bg-black/30 p-1 text-xs backdrop-blur" style={{ fontFamily: "var(--font-geist), system-ui" }}>
          <span className="rounded-full bg-[#F4EEDF] px-3 py-1 font-semibold text-[#17120F]">Rak</span>
          <span className="px-3 py-1">Tas <motion.b key={bag.length} initial={{ scale: 1.8 }} animate={{ scale: 1 }} className="inline-block">{bag.length}</motion.b></span>
        </div>
        <span className="hidden text-xs opacity-75 md:block" style={{ fontFamily: "var(--font-geist), system-ui" }}>Toko buku · Yogyakarta · buka 10.00–21.00</span>
      </header>

      {/* stage */}
      <main className="relative z-10 grid flex-1 grid-cols-1 items-center gap-6 px-5 pb-4 sm:px-8 lg:grid-cols-[270px_1fr_250px]">
        {/* left: chapters + title */}
        <section className="order-2 rounded-2xl bg-black/35 p-5 backdrop-blur-md lg:order-1">
          <div className="mb-3 text-[11px] uppercase tracking-[0.25em] opacity-70" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Daftar bab</div>
          <ol className="hidden space-y-1 text-sm sm:block">
            {b.chapters.map((c, i) => (
              <li key={c.name} className={`flex justify-between rounded-md px-2 py-1 transition-colors ${i === chapterIdx && progress > 0 ? "bg-[#F4EEDF] text-[#17120F]" : "opacity-80"}`}>
                <span>{String(i + 1).padStart(2, "0")} · {c.name}</span><span className="tabular-nums opacity-70">{c.page}</span>
              </li>
            ))}
          </ol>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <h1 className="mt-5 text-3xl font-bold leading-[1.05]">{b.title}</h1>
              <p className="mt-1 text-sm italic opacity-80">{b.author}</p>
              <p className="mt-3 text-xs opacity-70" style={{ fontFamily: "var(--font-geist), system-ui" }}>{b.genre} · {b.pages} hlm · {b.year}</p>
              <div className="mt-4 flex items-center gap-3" style={{ fontFamily: "var(--font-geist), system-ui" }}>
                <span className="text-lg font-semibold">{rupiah(b.price)}</span>
                <button
                  type="button"
                  onClick={() => setBag(x => (inBag ? x.filter(id => id !== b.id) : [...x, b.id]))}
                  className="rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: inBag ? "transparent" : b.accent, color: inBag ? "#F4EEDF" : "#17120F", border: `1.5px solid ${b.accent}` }}
                >
                  {inBag ? "✓ Di tas" : "Tambah ke tas"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* centre: the book */}
        <section className="order-1 flex flex-col items-center lg:order-2">
          {/* height is capped by width too, so the open spread (2× the cover) always fits between the panels */}
          <div className="relative h-[min(40vh,62vw)] w-full lg:h-[min(42vh,460px,23vw)]" style={{ perspective: 1800 }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={b.id}
                className="absolute left-1/2 top-0 h-full"
                style={{ aspectRatio: "2 / 3", transformStyle: "preserve-3d" }}
                initial={{ x: "-50%", y: "70%", rotateX: 25, rotateZ: -6, opacity: 0 }}
                animate={{ x: open ? "0%" : "-50%", y: 0, rotateX: 6, rotateZ: 0, rotateY: open ? -8 : -22, opacity: 1 }}
                exit={{ y: "60%", opacity: 0, rotateZ: 6, transition: { duration: 0.35 } }}
                transition={{ type: "spring", stiffness: 90, damping: 16 }}
              >
                {/* page block */}
                <div className="absolute inset-0 rounded-r-md bg-[#FBF6EA] text-[#2A221C] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]" style={{ transform: "translateZ(-1px)" }}>
                  <div className="absolute inset-y-2 right-0 w-2 rounded-r bg-[repeating-linear-gradient(to_bottom,#e9e1cf_0_2px,#fbf6ea_2px_4px)]" />
                  <div className="flex h-full flex-col overflow-hidden p-[9%]">
                    <div className="text-[10px] uppercase tracking-[0.3em] opacity-50" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Bab {chapterIdx + 1}</div>
                    <div className="mt-2 font-bold" style={{ fontSize: fontSize + 3 }}>{b.chapters[chapterIdx].name}</div>
                    <p className="mt-3 leading-relaxed opacity-85" style={{ fontSize }}>{b.excerpt}</p>
                    <div className="mt-auto text-center text-[10px] tabular-nums opacity-50">{page}</div>
                  </div>
                </div>
                {/* cover: front face + inside face */}
                <motion.div
                  className="absolute inset-0 origin-left"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: open ? -168 : 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 14 }}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-r-md shadow-[0_30px_60px_-15px_rgba(0,0,0,.65)]" style={{ backfaceVisibility: "hidden" }}>
                    <Cover b={b} />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(255,255,255,.18),transparent_30%,transparent_70%,rgba(0,0,0,.18))]" />
                  </div>
                  <div className="absolute inset-0 rounded-l-md" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundColor: b.accent }}>
                    <div className="flex h-full items-center justify-center p-6 text-center text-sm italic" style={{ color: b.color }}>
                      Untuk semua yang pernah menunggu hujan reda.
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-full bg-black/40 px-4 py-1.5 text-xs backdrop-blur" style={{ fontFamily: "var(--font-geist), system-ui" }}>
            <button type="button" onClick={() => setOpen(o => !o)} className="font-semibold underline-offset-2 hover:underline">{open ? "Tutup buku" : "Buka buku"}</button>
            <span className="opacity-50">·</span>
            <span className="opacity-80">Terbit {b.year}</span>
            <span className="opacity-50">·</span>
            <span className="opacity-80">geser rak →</span>
          </div>
        </section>

        {/* right: sample reader */}
        <section className="order-3 hidden rounded-2xl bg-black/45 p-5 backdrop-blur-md lg:block" style={{ fontFamily: "var(--font-geist), system-ui" }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.25em] opacity-70" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Baca sampel</span>
            <button type="button" onClick={() => setMarked(m => ({ ...m, [b.id]: !m[b.id] }))} aria-label="Tandai buku" className="text-lg leading-none" style={{ color: marked[b.id] ? b.accent : undefined }}>
              {marked[b.id] ? "★" : "☆"}
            </button>
          </div>
          <div className="mt-4 text-sm font-semibold">{b.chapters[chapterIdx].name}</div>
          <div className="text-xs opacity-60">Halaman {page} dari {b.pages}</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: b.accent }} animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
          </div>
          <div className="mt-2 flex h-6 items-end gap-[3px]">
            {Array.from({ length: 28 }, (_, k) => (
              <span key={k} className="flex-1 rounded-sm transition-colors" style={{ height: `${30 + ((k * 37) % 70)}%`, backgroundColor: k / 28 < progress / 100 ? b.accent : "rgba(255,255,255,.18)" }} />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => { if (!open) setOpen(true); if (progress >= 100) setProgress(0); setReading(r => !r) }}
              className="flex-1 rounded-full py-2 text-xs font-semibold text-[#17120F]"
              style={{ backgroundColor: b.accent }}
            >
              {reading ? "❚❚ Jeda" : "▶ Baca"}
            </button>
            <button type="button" onClick={() => setFontSize(f => Math.max(11, f - 1))} className="h-8 w-8 rounded-full bg-white/10 text-xs" aria-label="Perkecil huruf">A-</button>
            <button type="button" onClick={() => setFontSize(f => Math.min(17, f + 1))} className="h-8 w-8 rounded-full bg-white/10 text-sm" aria-label="Perbesar huruf">A+</button>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed opacity-55">Pilih buku dari rak, atau pakai panah ← → di keyboard. Spasi untuk membuka buku.</p>
        </section>
      </main>

      {/* shelf */}
      <div className="relative z-10">
        <div ref={shelfRef} className="no-scrollbar flex h-[230px] items-end gap-[3px] overflow-x-auto px-6 pb-0 pt-8">
          {BOOKS.map(s => (
            <SpineButton key={s.id} s={s} active={s.id === sel} onClick={() => setSel(s.id)} />
          ))}
          <div className="w-6 shrink-0" />
        </div>
        <div className="h-5 bg-[linear-gradient(#8a5a35,#5c3a20)] shadow-[0_10px_25px_rgba(0,0,0,.6)]" />
        <div className="h-10 bg-[#120d0a]" />
      </div>

      <DemoBadge dark />
    </div>
  )
}

function SpineButton({ s, active, onClick }: { s: Full; active: boolean; onClick: () => void }) {
  // fit the vertical title to the spine height (~6.3px per character at 10px)
  const short = useMemo(() => {
    const max = Math.floor((s.height - 30) / 6.3)
    return s.title.length > max ? s.title.slice(0, max - 1).trimEnd() + "…" : s.title
  }, [s.title, s.height])
  return (
    <button
      type="button"
      data-id={s.id}
      onClick={onClick}
      title={`${s.title} — ${s.author}`}
      aria-label={`${s.title} oleh ${s.author}`}
      aria-pressed={active}
      className="group relative shrink-0 rounded-t-[3px] transition-transform duration-300 ease-out hover:-translate-y-3 focus-visible:-translate-y-3"
      style={{
        width: s.width, height: s.height, backgroundColor: s.color,
        transform: active ? "translateY(-30px)" : undefined,
        boxShadow: active ? `0 0 0 2px ${s.accent}, 0 18px 30px -8px rgba(0,0,0,.7)` : "inset -3px 0 0 rgba(0,0,0,.18), inset 2px 0 0 rgba(255,255,255,.12)",
      }}
    >
      <span className="absolute inset-x-0 top-2 h-[3px]" style={{ backgroundColor: s.accent }} />
      <span className="absolute inset-x-0 bottom-3 h-[3px]" style={{ backgroundColor: s.accent, opacity: 0.7 }} />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-bold"
        style={{ writingMode: "vertical-rl", transform: "translate(-50%,-50%) rotate(180deg)", color: s.ink, fontFamily: SERIF }}
      >
        {short}
      </span>
    </button>
  )
}
