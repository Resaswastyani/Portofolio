"use client"

import { useEffect, useState, useRef } from "react"

const AGENT_NAMES = [
  "analyst-7f2a", "executor-3b1c", "monitor-9d4e", "researcher-2c8f",
  "planner-5a3d", "writer-1e9b", "auditor-4f2c", "coder-8d1a",
  "reviewer-6b3e", "scheduler-0c7f",
]

const TASKS = [
  "Reviewing 14 open PRs on main branch",
  "Summarizing weekly Slack threads",
  "Generating Q2 financial report",
  "Running integration test suite",
  "Scraping competitor pricing data",
  "Drafting 23 cold emails from CRM",
  "Parsing inbound invoices → DB",
  "Monitoring uptime across 8 regions",
  "Refactoring auth module — 3 files",
  "Analyzing user churn signals",
  "Syncing Notion docs with Linear",
  "Tagging 1,200 support tickets",
  "Deploying to staging environment",
  "Processing webhook payloads",
]

const REGIONS = ["us-east", "eu-west", "ap-south", "us-west", "eu-central"]
const STATUSES = [
  { label: "running",  color: "#4ade80" },
  { label: "running",  color: "#4ade80" },
  { label: "running",  color: "#4ade80" },
  { label: "queued",   color: "#facc15" },
  { label: "complete", color: "#60a5fa" },
]

type AgentRow = {
  id: string
  name: string
  task: string
  region: string
  status: typeof STATUSES[number]
  progress: number
  elapsed: string
  key: number
}

function randomRow(key: number): AgentRow {
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    name: AGENT_NAMES[Math.floor(Math.random() * AGENT_NAMES.length)],
    task: TASKS[Math.floor(Math.random() * TASKS.length)],
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    progress: Math.floor(Math.random() * 85 + 10),
    elapsed: `${Math.floor(Math.random() * 14 + 1)}m ${Math.floor(Math.random() * 59)}s`,
    key,
  }
}

// Animated progress bar that slowly ticks forward
function ProgressBar({ initial }: { initial: number }) {
  const [pct, setPct] = useState(initial)
  const rafRef = useRef<number>(0)
  const pctRef = useRef(initial)

  useEffect(() => {
    const tick = () => {
      pctRef.current = Math.min(99, pctRef.current + 0.015)
      setPct(Math.round(pctRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="w-full h-[2px] rounded-full bg-black/10 dark:bg-white/10">
      <div 
        className="h-full rounded-full bg-black/35 dark:bg-white/40 transition-all duration-500 ease-linear"
        style={{ width: `${pct}%` }} 
      />
    </div>
  )
}

// Stable seed rows — same on server and client, no random values
const SEED_ROWS: AgentRow[] = [
  { id: "A1B2C3", name: "analyst-7f2a",    task: "Generating Q2 financial report",       region: "us-east",    status: STATUSES[0], progress: 42, elapsed: "3m 12s", key: 0 },
  { id: "D4E5F6", name: "executor-3b1c",   task: "Running integration test suite",       region: "eu-west",    status: STATUSES[0], progress: 67, elapsed: "7m 48s", key: 1 },
  { id: "G7H8I9", name: "researcher-2c8f", task: "Scraping competitor pricing data",     region: "us-west",    status: STATUSES[3], progress: 18, elapsed: "1m 05s", key: 2 },
  { id: "J0K1L2", name: "planner-5a3d",    task: "Syncing Notion docs with Linear",      region: "eu-central", status: STATUSES[0], progress: 55, elapsed: "5m 30s", key: 3 },
  { id: "M3N4O5", name: "coder-8d1a",      task: "Refactoring auth module — 3 files",    region: "ap-south",   status: STATUSES[0], progress: 80, elapsed: "11m 22s", key: 4 },
  { id: "P6Q7R8", name: "monitor-9d4e",    task: "Monitoring uptime across 8 regions",   region: "us-east",    status: STATUSES[4], progress: 99, elapsed: "14m 01s", key: 5 },
]

export function LiveAgentFeed() {
  const [rows, setRows] = useState<AgentRow[]>(SEED_ROWS)
  const [mounted, setMounted] = useState(false)
  const keyRef = useRef(100)

  useEffect(() => {
    // Hydrate with random data only after client mount
    setMounted(true)
    setRows(Array.from({ length: 6 }, (_, i) => randomRow(i)))

    const t = setInterval(() => {
      keyRef.current++
      setRows(prev => [...prev.slice(1), randomRow(keyRef.current)])
    }, 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/70 dark:bg-[#1c1c1a]/70">
      {/* Table header */}
      <div className="grid grid-cols-[80px_1fr_80px_70px] px-4 py-2 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03]">
        {["AGENT", "TASK", "REGION", "STATUS"].map(h => (
          <span key={h} className="text-[8px] tracking-[0.16em] text-black/30 dark:text-white/30 font-mono">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className="grid grid-cols-[80px_1fr_80px_70px] px-4 py-2.5 border-b border-black/[0.04] dark:border-white/[0.04] gap-2 items-center"
            style={{
              animation: i === rows.length - 1 ? "rowSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" : "none",
            }}
          >
            {/* Agent */}
            <div>
              <div className="text-[9px] font-mono text-black/65 dark:text-white/65 mb-px">{row.name}</div>
              <div className="text-[7.5px] font-mono text-black/25 dark:text-white/25">#{row.id}</div>
            </div>

            {/* Task + progress */}
            <div className="min-w-0">
              <div className="text-[9px] text-black/50 dark:text-white/50 leading-[1.35] mb-[5px] overflow-hidden text-ellipsis whitespace-nowrap">
                {row.task}
              </div>
              <ProgressBar initial={row.progress} />
            </div>

            {/* Region */}
            <div className="text-[8px] font-mono text-black/30 dark:text-white/30">{row.region}</div>

            {/* Status */}
            <div className="flex items-center gap-[5px]">
              <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{
                background: row.status.color,
                boxShadow: row.status.label === "running" ? `0 0 6px ${row.status.color}` : "none",
                animation: row.status.label === "running" ? "statusPulse 2s ease-in-out infinite" : "none",
              }} />
              <span className="text-[8px] font-mono text-black/35 dark:text-white/35">{row.status.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export function LiveAgentCounter() {
  const [count, setCount] = useState(3847)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => {
      setCount(v => v + Math.floor(Math.random() * 3 - 1))
    }, 1200)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="font-mono text-[clamp(3rem,6vw,5rem)] font-light text-black/85 dark:text-white/85 leading-none tracking-[-0.02em] transition-colors duration-300">
      {mounted ? count.toLocaleString("en-US") : "3,847"}
    </span>
  )
}
