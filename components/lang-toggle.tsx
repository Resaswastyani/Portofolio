"use client"

import { useLang } from "@/components/lang-provider"

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === "id" ? "en" : "id")}
      className="flex items-center gap-0.5 h-7 rounded-lg border border-black/10 dark:border-white/10 overflow-hidden text-[10px] font-medium tracking-widest hover:border-black/20 dark:hover:border-white/20 transition-all duration-200"
      title={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      aria-label="Toggle language"
    >
      <span
        className={`px-2.5 h-full flex items-center transition-colors duration-200 ${
          lang === "id"
            ? "bg-black/[0.07] dark:bg-white/[0.1] text-black dark:text-white"
            : "text-black/40 dark:text-white/40 hover:text-black/60"
        }`}
      >
        ID
      </span>
      <span className="w-px h-4 bg-black/10 dark:bg-white/10" />
      <span
        className={`px-2.5 h-full flex items-center transition-colors duration-200 ${
          lang === "en"
            ? "bg-black/[0.07] dark:bg-white/[0.1] text-black dark:text-white"
            : "text-black/40 dark:text-white/40 hover:text-black/60"
        }`}
      >
        EN
      </span>
    </button>
  )
}
