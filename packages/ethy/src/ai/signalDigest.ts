import type { EconomySnapshot } from '../economy/types.ts'

export type SignalDigest = {
  headBlock?: string
  macro?: EconomySnapshot['macroBaseline']
  signals: NonNullable<EconomySnapshot['signals']>
  l2: NonNullable<EconomySnapshot['l2RollupStats']>
  momentHeadline?: string
}

export function buildSignalDigest(snap: EconomySnapshot | undefined): SignalDigest | undefined {
  if (snap?.hasBlocks !== true) return undefined
  const signals = (snap.signals ?? []).slice(0, 4)
  const l2 = (snap.l2RollupStats ?? []).slice(0, 3)
  const moment = snap.moments?.[0]
  return {
    headBlock: snap.latestBlockNumber,
    macro: snap.macroBaseline,
    signals,
    l2,
    momentHeadline: moment?.headline,
  }
}

export function digestForPrompt(digest: SignalDigest): string {
  return JSON.stringify(digest, (_key, val) => (typeof val === 'bigint' ? val.toString() : val))
}
