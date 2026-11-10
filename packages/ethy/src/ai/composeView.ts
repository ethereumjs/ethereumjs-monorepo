import type { FlatStateManager } from '@ethereumjs/statemanager'

import { readDomainSnapshots } from '../domains/domainManagers.ts'
import type { EthySpine, WidgetSpec } from '../spine/types.ts'
import { bucketsTableWidget, diagnosticsTableWidget, peersTableWidget } from '../tools/diagnose.ts'
import { economyDeepViewWidget } from '../tools/economyTools.ts'

const MAX_COLS = 8
const MAX_ROWS = 16
const MAX_CELL = 48

export type ComposeDataset =
  | 'peers'
  | 'peersByClient'
  | 'buckets'
  | 'economy'
  | 'topContracts'
  | 'diag'

export type ComposeRequest =
  | { kind: 'dataset'; dataset: ComposeDataset; minWrites?: number; viewTitle: string }
  | {
      kind: 'literal'
      viewTitle: string
      table?: { headers: string[]; rows: string[][] }
      keyValue?: Array<{ key: string; value: string }>
    }

function sanitizeCell(v: string): string {
  let s = v.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\x1b\[[0-9;]*m/g, '')
  if (s.length > MAX_CELL) s = `${s.slice(0, MAX_CELL - 1)}…`
  return s
}

function clampTable(headers: string[], rows: string[][]): { headers: string[]; rows: string[][] } {
  const h = headers.slice(0, MAX_COLS).map(sanitizeCell)
  const r = rows.slice(0, MAX_ROWS).map((row) => row.slice(0, h.length).map(sanitizeCell))
  return { headers: h, rows: r }
}

function peersByClientWidget(spine: EthySpine, viewTitle: string): WidgetSpec {
  const families = new Map<string, { count: number; latencySum: number; snapOk: number }>()
  for (const p of spine.peers.values()) {
    const fam = p.clientName.split('/')[0] ?? p.clientName
    const row = families.get(fam) ?? { count: 0, latencySum: 0, snapOk: 0 }
    row.count += 1
    row.latencySum += p.avgLatencyMs
    row.snapOk += p.snapResponsesOk
    families.set(fam, row)
  }
  const rows: string[][] = []
  for (const [fam, row] of [...families.entries()].sort((a, b) => b[1].count - a[1].count)) {
    const avg = row.count > 0 ? Math.round(row.latencySum / row.count) : 0
    rows.push([fam, String(row.count), `${avg} ms`, row.snapOk.toLocaleString('en-US')])
  }
  if (rows.length === 0) {
    rows.push(['—', '0', '—', '0'])
  }
  return {
    kind: 'table',
    title: viewTitle,
    headers: ['Client family', 'Peers', 'Avg latency', 'Snap OK'],
    rows,
  }
}

function topContractsWidget(spine: EthySpine, viewTitle: string, minWrites: number): WidgetSpec {
  const econ = readDomainSnapshots(spine).economy
  const filtered = econ.topContracts.filter((c) => c.storageWrites >= minWrites)
  const rows = filtered.map((c) => [
    c.address,
    String(c.blocksActive),
    String(c.storageWrites),
    String(c.storageReads),
  ])
  if (rows.length === 0) {
    rows.push(['—', '0', '0', '0'])
  }
  return {
    kind: 'table',
    title: viewTitle,
    headers: ['Contract', 'Blocks', 'Writes', 'Reads'],
    rows,
  }
}

export function composeViewFromRequest(
  spine: EthySpine,
  stateManager: FlatStateManager,
  req: ComposeRequest,
): WidgetSpec {
  if (req.kind === 'literal') {
    if (req.table !== undefined) {
      const { headers, rows } = clampTable(req.table.headers, req.table.rows)
      return { kind: 'table', title: req.viewTitle, headers, rows }
    }
    if (req.keyValue !== undefined) {
      const entries = req.keyValue.slice(0, MAX_ROWS).map((e) => ({
        key: sanitizeCell(e.key),
        value: sanitizeCell(e.value),
      }))
      return { kind: 'key_value', title: req.viewTitle, entries }
    }
    return {
      kind: 'key_value',
      title: req.viewTitle,
      entries: [{ key: 'Note', value: 'Empty literal compose' }],
    }
  }

  switch (req.dataset) {
    case 'peers': {
      const w = peersTableWidget(spine)
      return w.kind === 'table' ? { ...w, title: req.viewTitle } : w
    }
    case 'peersByClient':
      return peersByClientWidget(spine, req.viewTitle)
    case 'buckets': {
      const w = bucketsTableWidget(spine)
      return w.kind === 'table' ? { ...w, title: req.viewTitle } : w
    }
    case 'economy': {
      const w = economyDeepViewWidget(spine)
      return w.kind === 'table' ? { ...w, title: req.viewTitle } : w
    }
    case 'topContracts':
      return topContractsWidget(spine, req.viewTitle, req.minWrites ?? 0)
    case 'diag': {
      const w = diagnosticsTableWidget(spine)
      return w.kind === 'table' ? { ...w, title: req.viewTitle } : w
    }
    default:
      return {
        kind: 'key_value',
        title: req.viewTitle,
        entries: [{ key: 'Error', value: 'Unknown dataset' }],
      }
  }
}

export function parseComposeAction(
  action: Record<string, unknown>,
  defaultTitle: string,
): ComposeRequest | undefined {
  const type = action.type
  if (type === 'compose' && typeof action.dataset === 'string') {
    const ds = action.dataset as ComposeDataset
    const minWrites =
      typeof action.minWrites === 'number' ? Math.floor(action.minWrites) : undefined
    return { kind: 'dataset', dataset: ds, minWrites, viewTitle: defaultTitle }
  }
  if (type === 'literal') {
    const table = action.table
    const kv = action.keyValue
    if (table !== null && typeof table === 'object' && !Array.isArray(table)) {
      const headers = Array.isArray((table as { headers?: unknown }).headers)
        ? ((table as { headers: unknown[] }).headers as string[])
        : []
      const rows = Array.isArray((table as { rows?: unknown }).rows)
        ? ((table as { rows: unknown[] }).rows as string[][])
        : []
      return { kind: 'literal', viewTitle: defaultTitle, table: { headers, rows } }
    }
    if (Array.isArray(kv)) {
      return {
        kind: 'literal',
        viewTitle: defaultTitle,
        keyValue: kv as Array<{ key: string; value: string }>,
      }
    }
  }
  return undefined
}
