import type { InvestigationContext } from '../ai/investigationTools.ts'
import { probeContractViewLive } from '../ai/investigationTools.ts'
import type { ContractDossierProbes, ContractDossierStore } from './contractDossierStore.ts'
import type { ForensicStaticScan } from './contractForensics.ts'

const PROBE_BUDGET_MS = 100
const PROBE_MAX = 4

type ProbeField = keyof Omit<ContractDossierProbes, 'probedAtBlock' | 'miss'>

const FIELD_ORDER: ProbeField[] = [
  'name',
  'symbol',
  'decimals',
  'totalSupply',
  'owner',
  'paused',
  'version',
  'token0',
  'token1',
  'tokenUriSample',
]

function probeSatisfied(probes: ContractDossierProbes | undefined, field: ProbeField): boolean {
  if (probes === undefined) return false
  const val = probes[field]
  if (val !== undefined && String(val).length > 0) return true
  return probes.miss?.[field] === true
}

export function planDossierProbes(
  scan: ForensicStaticScan,
  cached?: ContractDossierProbes,
): string[] {
  const flags = scan.fingerprint.interfaceFlags
  const prefer: string[] = []
  if (flags.erc20 || flags.weth) {
    prefer.push('name', 'symbol', 'decimals', 'totalSupply')
  } else if (flags.erc721 || flags.erc1155) {
    prefer.push('name', 'symbol')
  }
  if (scan.fingerprint.proxyKind !== undefined) prefer.push('implementation')
  if (flags.dexPool || flags.dexRouter) prefer.push('token0', 'token1')
  prefer.push('owner', 'paused')

  const out: string[] = []
  for (const fn of prefer) {
    if (out.length >= PROBE_MAX) break
    const field = fn as ProbeField
    if (probeSatisfied(cached, field)) continue
    if (!out.includes(fn)) out.push(fn)
  }
  for (const field of FIELD_ORDER) {
    if (out.length >= PROBE_MAX) break
    const fn = field === 'tokenUriSample' ? 'tokenURI' : field
    if (out.includes(fn)) continue
    if (probeSatisfied(cached, field)) continue
    out.push(fn)
  }
  return out.slice(0, PROBE_MAX)
}

function applyProbeResult(probes: ContractDossierProbes, fn: string, value: unknown): void {
  if (typeof value !== 'string' || value.length === 0) {
    probes.miss = { ...probes.miss, [fn]: true }
    return
  }
  switch (fn) {
    case 'name':
      probes.name = value
      break
    case 'symbol':
      probes.symbol = value
      break
    case 'decimals':
      probes.decimals = Number.parseInt(value, 10)
      break
    case 'totalSupply':
      probes.totalSupply = value
      break
    case 'owner':
      probes.owner = value
      break
    case 'version':
      probes.version = value.slice(0, 64)
      break
    case 'token0':
      probes.token0 = value
      break
    case 'token1':
      probes.token1 = value
      break
    case 'tokenURI':
      probes.tokenUriSample = value.slice(0, 120)
      break
    case 'implementation':
      break
    case 'paused':
      probes.paused = value === 'true'
      break
    default:
      probes.miss = { ...probes.miss, [fn]: true }
  }
}

/** Budgeted read-only view probes; results are merged into the dossier store. */
export async function runDossierViewProbes(opts: {
  ctx: InvestigationContext
  address: string
  scan: ForensicStaticScan
  blockNumber: string
  store?: ContractDossierStore
}): Promise<ContractDossierProbes | undefined> {
  const cached = opts.store?.get(opts.address)?.probes
  const fns = planDossierProbes(opts.scan, cached)
  if (fns.length === 0) return cached
  if (opts.ctx.sandbox === undefined) return cached

  const deadline = Date.now() + PROBE_BUDGET_MS
  const merged: ContractDossierProbes = {
    ...cached,
    probedAtBlock: opts.blockNumber,
    miss: cached?.miss !== undefined ? { ...cached.miss } : undefined,
  }

  for (const fn of fns) {
    if (Date.now() >= deadline) break
    const res = await probeContractViewLive(opts.address, fn, opts.ctx)
    if ('error' in res && res.error !== undefined) {
      merged.miss = { ...merged.miss, [fn]: true }
      continue
    }
    applyProbeResult(merged, fn, res.value)
  }

  opts.store?.mergeProbes(opts.address, opts.blockNumber, merged)
  return merged
}
