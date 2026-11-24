import { createAiRunLog, llamaServerLogPath, tailTextFile } from '../ai/aiRunTrace.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'

export function aiLogWidget(spine: EthySpine, dataDir: string | undefined, limit = 8): WidgetSpec {
  if (dataDir === undefined) {
    return {
      kind: 'key_value',
      title: '/ai log',
      entries: [{ key: 'Trace', value: 'No dataDir — AI run log unavailable in demo mode' }],
    }
  }
  const log = createAiRunLog(dataDir, spine.network)
  const rows = log.readRecent(limit).map((r) => {
    const src = r.source === 'llm' ? 'LLM' : 'FB'
    const beat = (r.director as { beat?: string } | undefined)?.beat ?? '—'
    const lat = `${(r.totalLatencyMs / 1000).toFixed(1)}s`
    const head = (r.headline ?? r.fallbackReason ?? '—').slice(0, 36)
    return [src, beat, lat, head]
  })
  const tail = tailTextFile(llamaServerLogPath(dataDir, spine.network), 6)
  const llamaTail =
    tail.length > 0
      ? tail
          .filter((l) => /error|warn|fail|unknown/i.test(l))
          .slice(-3)
          .join(' · ')
      : undefined
  if (rows.length === 0) {
    return {
      kind: 'key_value',
      title: '/ai log',
      entries: [
        { key: 'Runs', value: 'No ai-runs.jsonl entries yet' },
        ...(llamaTail !== undefined && llamaTail.length > 0
          ? [{ key: 'llama-server', value: llamaTail }]
          : []),
      ],
    }
  }
  return {
    kind: 'table',
    title: '/ai log',
    headers: ['Src', 'Beat', 'Lat', 'Headline / reason'],
    rows,
    debugPage:
      llamaTail !== undefined
        ? [
            {
              title: 'llama-server',
              entries: tail.map((l, i) => ({ key: String(i + 1), value: l })),
            },
          ]
        : undefined,
  }
}

export function parseAiLogLimit(parts: string[]): number {
  const n = Number(parts[2])
  if (!Number.isFinite(n) || n < 1) return 8
  return Math.min(20, Math.floor(n))
}
