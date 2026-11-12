import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import { hexToBigInt, hexToBytes } from '@ethereumjs/util'

import { lookupFunctionSelector } from '../contracts/signatureCatalog.ts'
import { formatEthFromWei, shortAddress } from './format.ts'
import type { BlockEconomyRecord, BlockMoment, BlockMomentKind } from './types.ts'

const WHALE_WEI = 10n ** 18n
const VETERAN_NONCE = 50_000n
const HEADLINE_MAX = 96

const BADGE: Record<BlockMomentKind, string> = {
  birth: '[NEW] ',
  choreography: '[FLOW]',
  whale: '[1ETH]',
  first_step: '[1ST] ',
  veteran: '[VET] ',
  eip7702: '[7702]',
  graffiti_note: '[NOTE]',
  blob_anchor: '[L2]  ',
  revert: '[REV] ',
  heartbeat: '[BEAT]',
}

const KIND_PRIORITY: BlockMomentKind[] = [
  'graffiti_note',
  'birth',
  'eip7702',
  'choreography',
  'whale',
  'first_step',
  'revert',
  'veteran',
  'blob_anchor',
  'heartbeat',
]

function clampHeadline(s: string): string {
  if (s.length <= HEADLINE_MAX) return s
  return `${s.slice(0, HEADLINE_MAX - 1)}…`
}

function printableRatio(data: Uint8Array): number {
  if (data.length === 0) return 0
  let n = 0
  for (const b of data) {
    if (b >= 0x20 && b <= 0x7e) n += 1
  }
  return n / data.length
}

function sanitizeAsciiMessage(data: Uint8Array): string {
  let out = ''
  for (const b of data) {
    if (b >= 0x20 && b <= 0x7e) out += String.fromCharCode(b)
    else if (b === 0x0a || b === 0x0d) out += ' '
  }
  return out.trim().replace(/\s+/g, ' ').slice(0, 120)
}

function tryGraffitiNote(record: BlockEconomyRecord, blockKey: string, ts: number): BlockMoment[] {
  const slices = record.observations?.txSlices ?? []
  const out: BlockMoment[] = []
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i]!
    const data = slice.data
    if (data === undefined || data.length < 5 || data.length > 160) continue
    if (data.length >= 4) {
      const sel = `0x${[...data.subarray(0, 4)].map((b) => b.toString(16).padStart(2, '0')).join('')}`
      if (lookupFunctionSelector(sel) !== undefined) continue
    }
    if (printableRatio(data) < 0.9) continue
    const msg = sanitizeAsciiMessage(data)
    if (msg.length < 4) continue
    const addr = slice.to !== undefined ? shortAddress(slice.to) : 'a wallet'
    out.push({
      id: `${blockKey}:graffiti_note:${i}`,
      blockNumber: blockKey,
      timestampSec: ts,
      kind: 'graffiti_note',
      badge: BADGE.graffiti_note,
      headline: clampHeadline(`${addr} wrote on-chain: "${msg}"`),
      address: slice.to,
    })
  }
  out.sort((a, b) => b.headline.length - a.headline.length)
  return out.slice(0, 1)
}

function archetypeBadge(
  address: string | undefined,
  addressArchetypes?: ReadonlyMap<string, string>,
): string {
  if (address === undefined || addressArchetypes === undefined) return ''
  const arch = addressArchetypes.get(address.toLowerCase())
  if (arch === undefined || arch === 'Contract') return ''
  return ` [${arch}]`
}

function tryBirth(
  record: BlockEconomyRecord,
  bal: BALJSONBlockAccessList | undefined,
  blockKey: string,
  ts: number,
  classifyCode?: (code: Uint8Array) => string | undefined,
): BlockMoment[] {
  const out: BlockMoment[] = []
  if (bal !== undefined) {
    for (let i = 0; i < bal.length; i++) {
      const acct = bal[i]!
      if (acct.codeChanges.length === 0) continue
      const last = acct.codeChanges[acct.codeChanges.length - 1]!
      let byteLen = 0
      try {
        byteLen = hexToBytes(last.newCode).length
      } catch {
        byteLen = 0
      }
      const writes = acct.storageChanges.reduce((n, row) => n + row.slotChanges.length, 0)
      const kb = (byteLen / 1024).toFixed(1)
      const suffix = writes > 0 ? ` (${writes} slot writes)` : ''
      let archTag = ''
      if (classifyCode !== undefined && byteLen > 0) {
        try {
          const codeBytes = hexToBytes(last.newCode)
          const label = classifyCode(codeBytes)
          if (label !== undefined) archTag = ` [${label}]`
        } catch {
          /* skip */
        }
      }
      out.push({
        id: `${blockKey}:birth:${i}`,
        blockNumber: blockKey,
        timestampSec: ts,
        kind: 'birth',
        badge: BADGE.birth,
        headline: clampHeadline(
          `New ${kb} KB${archTag} deployed at ${shortAddress(acct.address)}${suffix}`,
        ),
        address: acct.address.toLowerCase(),
      })
    }
  }
  if ((record.contractCreationCount ?? 0) > 0 && out.length === 0) {
    out.push({
      id: `${blockKey}:birth:tx`,
      blockNumber: blockKey,
      timestampSec: ts,
      kind: 'birth',
      badge: BADGE.birth,
      headline: clampHeadline(
        `New contract deployed in block (${record.contractCreationCount} creation tx)`,
      ),
    })
  }
  out.sort((a, b) => b.headline.length - a.headline.length)
  return out.slice(0, 1)
}

function tryEip7702(
  record: BlockEconomyRecord,
  bal: BALJSONBlockAccessList | undefined,
  blockKey: string,
  ts: number,
): BlockMoment[] {
  if (record.txTypeSplit.setCode > 0) {
    return [
      {
        id: `${blockKey}:eip7702:0`,
        blockNumber: blockKey,
        timestampSec: ts,
        kind: 'eip7702',
        badge: BADGE.eip7702,
        headline: clampHeadline(
          `${record.txTypeSplit.setCode} EIP-7702 smart-account delegation tx(s) in block`,
        ),
      },
    ]
  }
  if (bal !== undefined) {
    for (let i = 0; i < bal.length; i++) {
      const acct = bal[i]!
      for (const ch of acct.codeChanges) {
        const code = ch.newCode.toLowerCase()
        if (code.startsWith('0xef0100') || code.startsWith('ef0100')) {
          return [
            {
              id: `${blockKey}:eip7702:${i}`,
              blockNumber: blockKey,
              timestampSec: ts,
              kind: 'eip7702',
              badge: BADGE.eip7702,
              headline: clampHeadline(
                `Account ${shortAddress(acct.address)} activated EIP-7702 delegation`,
              ),
              address: acct.address.toLowerCase(),
            },
          ]
        }
      }
    }
  }
  return []
}

function callLabel(selector: string | undefined): string {
  if (selector === undefined) return 'call'
  const row = lookupFunctionSelector(selector)
  if (row === undefined) return 'call'
  const name = row.signature.split('(')[0] ?? row.name
  return name
}

function tryChoreography(
  record: BlockEconomyRecord,
  bal: BALJSONBlockAccessList | undefined,
  blockKey: string,
  ts: number,
  addressArchetypes?: ReadonlyMap<string, string>,
): BlockMoment[] {
  const indexAccounts = new Map<number, number>()
  if (bal !== undefined) {
    for (const acct of bal) {
      const touched = new Set<number>()
      for (const row of acct.balanceChanges) {
        const idx = Number.parseInt(row.blockAccessIndex, 16)
        if (idx > 0) touched.add(idx)
      }
      for (const row of acct.nonceChanges) {
        const idx = Number.parseInt(row.blockAccessIndex, 16)
        if (idx > 0) touched.add(idx)
      }
      for (const row of acct.codeChanges) {
        const idx = Number.parseInt(row.blockAccessIndex, 16)
        if (idx > 0) touched.add(idx)
      }
      for (const slot of acct.storageChanges) {
        for (const ch of slot.slotChanges) {
          const idx = Number.parseInt(ch.blockAccessIndex, 16)
          if (idx > 0) touched.add(idx)
        }
      }
      for (const idx of touched) {
        indexAccounts.set(idx, (indexAccounts.get(idx) ?? 0) + 1)
      }
    }
  }
  let bestIdx = -1
  let bestCount = 0
  for (const [idx, count] of indexAccounts) {
    if (count >= 6 && count > bestCount) {
      bestCount = count
      bestIdx = idx
    }
  }
  if (bestIdx >= 0) {
    const slice = record.observations?.txSlices[bestIdx - 1]
    const label = callLabel(slice?.selector)
    const to = slice?.to
    const badge = archetypeBadge(to, addressArchetypes)
    const knownSel =
      slice?.selector !== undefined && lookupFunctionSelector(slice.selector) !== undefined
    let headline: string
    if (knownSel && to !== undefined) {
      headline = `Tx #${bestIdx} orchestrated ${bestCount} accounts · ${label}() on ${shortAddress(to)}${badge}`
    } else if (to !== undefined && badge.length > 0) {
      headline = `Tx #${bestIdx} orchestrated ${bestCount} accounts via ${shortAddress(to)}${badge}`
    } else {
      headline = `Tx #${bestIdx} orchestrated ${bestCount} accounts · ${label}() path`
    }
    return [
      {
        id: `${blockKey}:choreography:${bestIdx}`,
        blockNumber: blockKey,
        timestampSec: ts,
        kind: 'choreography',
        badge: BADGE.choreography,
        headline: clampHeadline(headline),
      },
    ]
  }
  const slices = record.observations?.txSlices ?? []
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i]!
    if (slice.logs.length >= 4) {
      const label = callLabel(slice.selector)
      return [
        {
          id: `${blockKey}:choreography:logs:${i}`,
          blockNumber: blockKey,
          timestampSec: ts,
          kind: 'choreography',
          badge: BADGE.choreography,
          headline: clampHeadline(`Tx #${i + 1} emitted ${slice.logs.length} events · ${label}()`),
        },
      ]
    }
  }
  return []
}

function tryWhale(record: BlockEconomyRecord, blockKey: string, ts: number): BlockMoment[] {
  if (record.largestTransferWei < WHALE_WEI) return []
  const eth = formatEthFromWei(record.largestTransferWei)
  const to =
    record.largestTransferTo !== undefined ? shortAddress(record.largestTransferTo) : 'unknown'
  return [
    {
      id: `${blockKey}:whale:0`,
      blockNumber: blockKey,
      timestampSec: ts,
      kind: 'whale',
      badge: BADGE.whale,
      headline: clampHeadline(`${eth} transferred to ${to} in a single move`),
      address: record.largestTransferTo,
    },
  ]
}

function parsePostNonce(hex: string): bigint | undefined {
  try {
    const prefixed = (hex.startsWith('0x') ? hex : `0x${hex}`) as `0x${string}`
    return hexToBigInt(prefixed)
  } catch {
    return undefined
  }
}

function tryFirstStep(
  bal: BALJSONBlockAccessList | undefined,
  blockKey: string,
  ts: number,
): BlockMoment[] {
  if (bal === undefined) return []
  for (let i = 0; i < bal.length; i++) {
    const acct = bal[i]!
    for (const ch of acct.nonceChanges) {
      const n = parsePostNonce(ch.postNonce)
      if (n === 1n) {
        return [
          {
            id: `${blockKey}:first_step:${i}`,
            blockNumber: blockKey,
            timestampSec: ts,
            kind: 'first_step',
            badge: BADGE.first_step,
            headline: clampHeadline(
              `New wallet ${shortAddress(acct.address)} signed its very first transaction on Ethereum`,
            ),
            address: acct.address.toLowerCase(),
          },
        ]
      }
    }
  }
  return []
}

function tryVeteran(
  bal: BALJSONBlockAccessList | undefined,
  blockKey: string,
  ts: number,
): BlockMoment[] {
  if (bal === undefined) return []
  let best: { addr: string; nonce: bigint } | undefined
  for (const acct of bal) {
    for (const ch of acct.nonceChanges) {
      const n = parsePostNonce(ch.postNonce)
      if (n !== undefined && n >= VETERAN_NONCE) {
        if (best === undefined || n > best.nonce) {
          best = { addr: acct.address.toLowerCase(), nonce: n }
        }
      }
    }
  }
  if (best === undefined) return []
  return [
    {
      id: `${blockKey}:veteran:0`,
      blockNumber: blockKey,
      timestampSec: ts,
      kind: 'veteran',
      badge: BADGE.veteran,
      headline: clampHeadline(
        `Veteran actor ${shortAddress(best.addr)} signed its #${best.nonce.toLocaleString('en-US')}th lifetime transaction`,
      ),
      address: best.addr,
    },
  ]
}

function tryRevert(
  record: BlockEconomyRecord,
  blockKey: string,
  ts: number,
  addressArchetypes?: ReadonlyMap<string, string>,
): BlockMoment[] {
  const reverts = record.receiptReverts ?? 0
  if (reverts <= 0) return []
  const to = record.firstRevertTo !== undefined ? shortAddress(record.firstRevertTo) : 'a contract'
  const badge = archetypeBadge(record.firstRevertTo, addressArchetypes)
  return [
    {
      id: `${blockKey}:revert:0`,
      blockNumber: blockKey,
      timestampSec: ts,
      kind: 'revert',
      badge: BADGE.revert,
      headline: clampHeadline(
        `Transaction to ${to}${badge} reverted on-chain (${reverts} revert in block)`,
      ),
      address: record.firstRevertTo,
    },
  ]
}

function tryBlob(record: BlockEconomyRecord, blockKey: string, ts: number): BlockMoment[] {
  const blobs = record.txTypeSplit.blob
  if (blobs <= 0 && (record.blobGasUsed === undefined || record.blobGasUsed === 0n)) return []
  const n = blobs > 0 ? blobs : 1
  return [
    {
      id: `${blockKey}:blob_anchor:0`,
      blockNumber: blockKey,
      timestampSec: ts,
      kind: 'blob_anchor',
      badge: BADGE.blob_anchor,
      headline: clampHeadline(`L2 rollup batch anchored ${n} blob tx(s) onto Ethereum`),
    },
  ]
}

function tryHeartbeat(record: BlockEconomyRecord, blockKey: string, ts: number): BlockMoment[] {
  const active = record.activeAccounts ?? 0
  const writes = record.storageWrites ?? 0
  return [
    {
      id: `${blockKey}:heartbeat:0`,
      blockNumber: blockKey,
      timestampSec: ts,
      kind: 'heartbeat',
      badge: BADGE.heartbeat,
      headline: clampHeadline(
        `Block #${blockKey}: ${active} accounts touched across ${writes} storage writes (${record.gasFullPct}% full)`,
      ),
    },
  ]
}

export type DetectBlockMomentsInput = {
  record: BlockEconomyRecord
  balJson?: BALJSONBlockAccessList
  classifyCode?: (code: Uint8Array) => string | undefined
  addressArchetypes?: ReadonlyMap<string, string>
}

/** Pure zero-EVM moment extraction; up to 3 moments by rarity. */
export function detectBlockMoments(input: DetectBlockMomentsInput): BlockMoment[] {
  const { record, balJson, classifyCode, addressArchetypes } = input
  const blockKey = record.blockNumber.toString()
  const ts = record.timestamp ?? 0
  const candidates: BlockMoment[] = [
    ...tryGraffitiNote(record, blockKey, ts),
    ...tryBirth(record, balJson, blockKey, ts, classifyCode),
    ...tryEip7702(record, balJson, blockKey, ts),
    ...tryChoreography(record, balJson, blockKey, ts, addressArchetypes),
    ...tryWhale(record, blockKey, ts),
    ...tryFirstStep(balJson, blockKey, ts),
    ...tryRevert(record, blockKey, ts, addressArchetypes),
    ...tryVeteran(balJson, blockKey, ts),
    ...tryBlob(record, blockKey, ts),
  ]
  if (candidates.length === 0) {
    return tryHeartbeat(record, blockKey, ts)
  }
  const byKind = new Map<BlockMomentKind, BlockMoment>()
  for (const m of candidates) {
    const prev = byKind.get(m.kind)
    if (prev === undefined) byKind.set(m.kind, m)
  }
  const ranked: BlockMoment[] = []
  for (const kind of KIND_PRIORITY) {
    const m = byKind.get(kind)
    if (m !== undefined) ranked.push(m)
    if (ranked.length >= 3) break
  }
  return ranked
}
