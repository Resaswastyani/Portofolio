"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "@/hooks/use-in-view"

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

// Progress bar that creeps forward — pure CSS transform, no per-frame React renders
function ProgressBar({ initial }: { initial: number }) {
  return (
    <div className="w-full h-[2px] rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full w-full rounded-full bg-black/35 dark:bg-white/40 origin-left"
        style={{
          transform: `scaleX(${initial / 100})`,
          animation: "agentProgress 40s linear forwards",
          ["--p0" as string]: initial / 100,
        }}
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
  const keyRef = useRef(100)
  const { ref, inView } = useInView({ once: false, rootMargin: "100px" })

  useEffect(() => {
    setRows(Array.from({ length: 6 }, (_, i) => randomRow(i)))
  }, [])

  // Only tick while the feed is on screen
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      keyRef.current++
      setRows(prev => [...prev.slice(1), randomRow(keyRef.current)])
    }, 2800)
    return () => clearInterval(t)
  }, [inView])

  return (
    <div ref={ref} className="border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden bg-white/80 dark:bg-[#1c1c1a]/80 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
      {/* Table header */}
      <div className="grid grid-cols-[88px_1fr_64px] sm:grid-cols-[96px_1fr_72px_72px] px-4 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.03] gap-2">
        {["AGENT", "TASK", "REGION", "STATUS"].map(h => (
          <span key={h} className={`text-[9px] tracking-[0.16em] text-black/35 dark:text-white/35 font-mono ${h === "REGION" ? "hidden sm:block" : ""}`}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className="grid grid-cols-[88px_1fr_64px] sm:grid-cols-[96px_1fr_72px_72px] px-4 py-3 border-b border-black/[0.04] dark:border-white/[0.04] gap-2 items-center"
            style={{
              animation: i === rows.length - 1 ? "rowSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) both" : "none",
            }}
          >
            {/* Agent */}
            <div className="min-w-0">
              <div className="text-[10px] font-mono text-black/65 dark:text-white/65 mb-px truncate">{row.name}</div>
              <div className="text-[8.5px] font-mono text-black/30 dark:text-white/30">#{row.id}</div>
            </div>

            {/* Task + progress */}
            <div className="min-w-0">
              <div className="text-[10px] text-black/55 dark:text-white/55 leading-[1.35] mb-[5px] truncate">
                {row.task}
              </div>
              <ProgressBar initial={row.progress} />
            </div>

            {/* Region */}
            <div className="hidden sm:block text-[9px] font-mono text-black/35 dark:text-white/35">{row.region}</div>

            {/* Status */}
            <div className="flex items-center gap-[5px]">
              <span className="w-[6px] h-[6px] rounded-full shrink-0" style={{
                background: row.status.color,
                boxShadow: row.status.label === "running" ? `0 0 6px ${row.status.color}` : "none",
                animation: row.status.label === "running" ? "statusPulse 2s ease-in-out infinite" : "none",
              }} />
              <span className="text-[9px] font-mono text-black/40 dark:text-white/40">{row.status.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LiveAgentCounter() {
  const [count, setCount] = useState(3847)
  const { ref, inView } = useInView<HTMLSpanElement>({ once: false })

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      setCount(v => v + Math.floor(Math.random() * 3 - 1))
    }, 1200)
    return () => clearInterval(t)
  }, [inView])

  return (
    <span ref={ref} className="font-mono tabular-nums text-[clamp(3rem,6vw,5rem)] font-light text-black/85 dark:text-white/85 leading-none tracking-[-0.02em]">
      {count.toLocaleString("en-US")}
    </span>
  )
}
