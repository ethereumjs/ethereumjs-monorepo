import { headInspectUnlocked } from '../spine/headInspect.ts'
import type { EthySpine } from '../spine/types.ts'

export type ToolCatalogEntry = {
  id: string
  slash: string
  permission: 'read' | 'write'
  description: string
}

const READ_TOOLS: Omit<ToolCatalogEntry, 'permission'>[] = [
  { id: 'live', slash: '/live', description: 'Ethereum Plaza live head observatory' },
  { id: 'peers', slash: '/peers', description: 'Peer health table' },
  { id: 'ethy', slash: '/ethy', description: 'ETHY/0 swarm overview' },
  { id: 'rpc', slash: '/rpc', description: 'JSON-RPC endpoint telemetry' },
  { id: 'buckets', slash: '/buckets', description: '16 snap bucket progress' },
  { id: 'diag', slash: '/diag', description: 'Diagnostic ring buffer' },
  { id: 'economy', slash: '/economy', description: 'Live economy deep view' },
  { id: 'contract', slash: '/contract', description: 'Contract microscope (hot or address)' },
  { id: 'help', slash: '/help', description: 'Command list' },
  { id: 'range', slash: '/range', description: 'Inspect synced account range' },
  { id: 'sample', slash: '/sample', description: 'Sample synced accounts' },
  { id: 'cl', slash: '/cl', description: 'Consensus light client status' },
]

const HEAD_TOOLS: Omit<ToolCatalogEntry, 'permission'>[] = [
  { id: 'bal', slash: '/bal', description: 'Latest BAL window' },
  { id: 'account', slash: '/account', description: 'Inspect account by address' },
  { id: 'simulate', slash: '/simulate', description: 'EVM microscope at head' },
  { id: 'send', slash: '/send', description: 'Broadcast signed raw transaction' },
]

const WRITE_TOOLS: Omit<ToolCatalogEntry, 'permission'>[] = [
  { id: 'drop', slash: '/drop', description: 'Drop peer by id' },
  { id: 'reassign', slash: '/reassign', description: 'Reassign snap bucket' },
  { id: 'pause', slash: '/pause', description: 'Pause snap sync' },
  { id: 'resume', slash: '/resume', description: 'Resume snap sync' },
]

export function buildToolCatalog(
  spine: EthySpine,
  mode: 'pulse' | 'interactive',
): ToolCatalogEntry[] {
  const headLocked = !headInspectUnlocked(spine)
  const out: ToolCatalogEntry[] = []

  for (const t of READ_TOOLS) {
    out.push({ ...t, permission: 'read' })
  }
  if (!headLocked) {
    for (const t of HEAD_TOOLS) {
      out.push({ ...t, permission: 'read' })
    }
  }
  if (mode === 'interactive') {
    for (const t of WRITE_TOOLS) {
      out.push({ ...t, permission: 'write' })
    }
  }
  return out
}

export function toolIdToSlash(id: string): string | undefined {
  const all = [...READ_TOOLS, ...HEAD_TOOLS, ...WRITE_TOOLS]
  const row = all.find((t) => t.id === id.toLowerCase())
  return row?.slash
}

export function isToolAllowed(spine: EthySpine, toolId: string): boolean {
  const catalog = buildToolCatalog(spine, 'interactive')
  return catalog.some((t) => t.id === toolId.toLowerCase())
}
