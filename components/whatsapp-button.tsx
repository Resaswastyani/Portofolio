"use client"

import { useState } from "react"
import { useLang } from "@/components/lang-provider"

const WA_NUMBER = "6285702212770"
const WA_MESSAGE_ID = "Halo Resa, saya tertarik untuk berkolaborasi dengan Anda. Boleh kita diskusi lebih lanjut?"
const WA_MESSAGE_EN = "Hello Resa, I'm interested in collaborating with you. Can we discuss further?"

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)
  const { lang, t } = useLang()

  const message = lang === "id" ? WA_MESSAGE_ID : WA_MESSAGE_EN
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 group"
      aria-label="Chat via WhatsApp"
    >
      {/* Tooltip label */}
      <span
        className="text-[11px] tracking-wide text-white bg-[#25D366] px-3 py-1.5 rounded-full shadow-lg transition-all duration-300 whitespace-nowrap"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
          pointerEvents: "none",
        }}
      >
        {t.waTooltip}
      </span>

      {/* WhatsApp icon button */}
      <div
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 relative"
        style={{
          background: "#25D366",
          transform: hovered ? "scale(1.08)" : "scale(1)",
          boxShadow: hovered
            ? "0 8px 30px rgba(37,211,102,0.5)"
            : "0 4px 20px rgba(37,211,102,0.35)",
        }}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "rgba(37,211,102,0.3)",
            animation: "wa-pulse 2s ease-out infinite",
          }}
        />
        {/* WhatsApp SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="28"
          height="28"
          className="relative z-10"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.12 1.523 5.854L0 24l6.266-1.494A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.805 9.805 0 0 1-5.006-1.371l-.359-.213-3.72.886.941-3.622-.234-.372A9.783 9.783 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
        </svg>
      </div>

      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.5); opacity: 0;   }
          100% { transform: scale(1.5); opacity: 0;   }
        }
      `}</style>
    </a>
  )
}
