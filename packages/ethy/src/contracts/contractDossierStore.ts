import * as fs from 'node:fs'
import * as path from 'node:path'

import { networkPersistDir } from '../persist/peerBook.ts'
import type { ForensicStaticScan } from './contractForensics.ts'

export type ContractDossierProbes = {
  name?: string
  symbol?: string
  decimals?: number
  totalSupply?: string
  owner?: string
  paused?: boolean
  version?: string
  tokenUriSample?: string
  token0?: string
  token1?: string
  probedAtBlock?: string
  miss?: Record<string, true>
}

export type ContractDossierEntry = {
  address: string
  codeHash: string
  bytecodeSize: number
  compilerHint?: string
  proxyKind?: string
  implAddress?: string
  implCodeHash?: string
  archetype?: string
  knownSelectors: ForensicStaticScan['knownSelectors']
  unknownSelectorCount: number
  embeddedStrings: string[]
  embeddedAddresses: string[]
  opcodeFlags?: ForensicStaticScan['opcodeFlags']
  probes?: ContractDossierProbes
  aiNotes?: {
    summary?: string
    hypothesis?: string
    tags?: string[]
    updatedAtMs: number
    modelLabel?: string
  }
  firstSeenBlock?: string
  lastSeenBlock?: string
  timesFeatured: number
  lastFeaturedAtMs?: number
  previousHypotheses?: string[]
}

type StoreFile = { entries: Record<string, ContractDossierEntry> }

const LRU_CAP = 2000
const FLUSH_MS = 1500

export class ContractDossierStore {
  private readonly filePath: string
  private entries = new Map<string, ContractDossierEntry>()
  private dirty = false
  private flushTimer?: ReturnType<typeof setTimeout>

  private constructor(filePath: string) {
    this.filePath = filePath
  }

  static open(dataDir: string | undefined, network: string): ContractDossierStore | undefined {
    if (dataDir === undefined) return undefined
    const filePath = path.join(networkPersistDir(dataDir, network), 'contract-dossiers.json')
    const store = new ContractDossierStore(filePath)
    store.load()
    return store
  }

  private load(): void {
    if (!fs.existsSync(this.filePath)) return
    try {
      const doc = JSON.parse(fs.readFileSync(this.filePath, 'utf8')) as StoreFile
      for (const [addr, row] of Object.entries(doc.entries ?? {})) {
        this.entries.set(addr.toLowerCase(), row)
      }
    } catch {
      // corrupt store — start fresh
    }
  }

  private scheduleFlush(): void {
    if (this.flushTimer !== undefined) return
    this.flushTimer = setTimeout(() => {
      this.flushTimer = undefined
      this.flush()
    }, FLUSH_MS)
    this.flushTimer.unref?.()
  }

  private enforceLru(): void {
    while (this.entries.size > LRU_CAP) {
      let oldest: string | undefined
      let oldestBlock = ''
      for (const [addr, row] of this.entries) {
        const block = row.lastSeenBlock ?? '0'
        if (oldest === undefined || block < oldestBlock) {
          oldest = addr
          oldestBlock = block
        }
      }
      if (oldest !== undefined) this.entries.delete(oldest)
      else break
    }
  }

  flush(): void {
    if (!this.dirty) return
    this.enforceLru()
    const payload: StoreFile = {
      entries: Object.fromEntries(this.entries.entries()),
    }
    const dir = path.dirname(this.filePath)
    fs.mkdirSync(dir, { recursive: true })
    const tmp = `${this.filePath}.${process.pid}.tmp`
    fs.writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
    fs.renameSync(tmp, this.filePath)
    this.dirty = false
  }

  get(address: string): ContractDossierEntry | undefined {
    return this.entries.get(address.toLowerCase())
  }

  upsertStatic(
    address: string,
    blockNumber: string,
    scan: ForensicStaticScan,
    proxyKind?: string,
    implAddress?: string,
  ): ContractDossierEntry {
    const key = address.toLowerCase()
    const prev = this.entries.get(key)
    const codeChanged = prev !== undefined && prev.codeHash !== scan.codeHash
    const row: ContractDossierEntry = {
      address: key,
      codeHash: scan.codeHash,
      bytecodeSize: scan.bytecodeSize,
      compilerHint: scan.compilerHint,
      proxyKind: proxyKind ?? scan.fingerprint.proxyKind,
      implAddress,
      knownSelectors: scan.knownSelectors,
      unknownSelectorCount: scan.unknownSelectors.length,
      embeddedStrings: scan.embeddedStrings,
      embeddedAddresses: scan.embeddedAddresses,
      opcodeFlags: scan.opcodeFlags,
      firstSeenBlock: prev?.firstSeenBlock ?? blockNumber,
      lastSeenBlock: blockNumber,
      timesFeatured: prev?.timesFeatured ?? 0,
      lastFeaturedAtMs: prev?.lastFeaturedAtMs,
      aiNotes: codeChanged ? prev?.aiNotes : prev?.aiNotes,
      previousHypotheses: codeChanged
        ? [...(prev?.previousHypotheses ?? []), prev?.aiNotes?.hypothesis]
            .filter((x): x is string => typeof x === 'string' && x.length > 0)
            .slice(-3)
        : prev?.previousHypotheses,
      probes: codeChanged ? undefined : prev?.probes,
    }
    this.entries.set(key, row)
    this.dirty = true
    this.scheduleFlush()
    return row
  }

  noveltyBoost(address: string): number {
    return this.get(address) === undefined ? 1.45 : 1
  }

  noteFeatured(address: string, hypothesis?: string, modelLabel?: string): void {
    const key = address.toLowerCase()
    const row = this.entries.get(key)
    if (row === undefined) return
    row.timesFeatured += 1
    row.lastFeaturedAtMs = Date.now()
    if (hypothesis !== undefined) {
      row.aiNotes = {
        hypothesis,
        summary: hypothesis.slice(0, 140),
        updatedAtMs: Date.now(),
        modelLabel,
      }
    }
    this.entries.set(key, row)
    this.dirty = true
    this.scheduleFlush()
  }
}
