import type { EthyDomainSnapshots } from '../domains/types.ts'
import { type AiOverviewSections, DOMAIN_ORDER } from '../spine/types.ts'

export const MAX_AI_TOTAL_CHARS = 600
/** @deprecated Use `MAX_AI_TOTAL_CHARS` for the three-domain AI box. */
export const MAX_AI_OVERVIEW_CHARS = 280

export type OverviewTrigger = 'welcome' | 'pulse'

function clampLine(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}

export function clampOverviewSections(sections: AiOverviewSections): AiOverviewSections {
  const keys = DOMAIN_ORDER.filter((k) => sections[k] !== undefined)
  const focusNote =
    sections.focusNote !== undefined
      ? {
          domain: sections.focusNote.domain,
          text: clampLine(sections.focusNote.text, MAX_AI_OVERVIEW_CHARS),
        }
      : undefined
  if (keys.length === 0) return focusNote !== undefined ? { focusNote } : {}
  let budget = MAX_AI_TOTAL_CHARS
  const out: AiOverviewSections = focusNote !== undefined ? { focusNote } : {}
  const lengths = keys.map((k) => (sections[k] ?? '').length)
  const total = lengths.reduce((a, b) => a + b, 0)
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]!
    const raw = sections[k] ?? ''
    let share =
      total <= budget
        ? raw.length
        : Math.max(40, Math.floor((budget * raw.length) / Math.max(1, total)))
    share = Math.min(share, budget)
    out[k] = clampLine(raw, share)
    budget -= out[k]!.length
  }
  return out
}

export function buildDeterministicOverviewSections(
  snapshots: EthyDomainSnapshots,
  trigger: OverviewTrigger,
): AiOverviewSections {
  const phase = snapshots.pulse.phase
  const peers = snapshots.p2p.connected
  const sections: AiOverviewSections = {}

  const pivot = snapshots.pulse.pivotBlockNumber
  const pct = Math.round(snapshots.pulse.progressPct)
  const acc = snapshots.snap.totalAccountsSynced

  if (trigger === 'welcome' || phase === 'BOOTING' || phase === 'P2P_WARMUP') {
    if (acc > 0 || pivot !== undefined) {
      const accNote = acc > 0 ? `, ${(acc / 1_000_000).toFixed(1)}M accounts` : ''
      sections.state = `Resuming near #${pivot ?? '?'} (${pct}% progress${accNote}).`
    } else if (phase !== 'BOOTING') {
      sections.state = 'Starting sync — waiting for pivot header from peers.'
    }
    if (peers === 0) {
      sections.p2p = 'No peers yet — warming discovery.'
    } else {
      sections.p2p = `${peers} peer${peers === 1 ? '' : 's'} connected.`
    }
    sections.state = `${sections.state ?? 'Booting.'} Tab opens command help.`
    return clampOverviewSections(sections)
  }

  if (phase === 'SNAP_SYNCING') {
    const eta =
      snapshots.pulse.snapEtaMinutes !== undefined && snapshots.pulse.snapEtaMinutes > 0
        ? ` ETA ~${Math.round(snapshots.pulse.snapEtaMinutes)}m.`
        : ''
    const isEthy = snapshots.pulse.syncTransport === 'ethy'
    if (snapshots.snap.bucketsDone === 16) {
      const codeDone = snapshots.snap.codesSynced
      const codeTot = snapshots.snap.codesTotal ?? codeDone
      const storDone = snapshots.snap.storageAccountsSynced ?? 0
      const storTot = snapshots.snap.storageAccountsTotal ?? storDone
      sections.state = `Accounts 16/16 complete; bytecode ${codeDone.toLocaleString('en-US')}/${codeTot.toLocaleString('en-US')}, storage ${storDone.toLocaleString('en-US')}/${storTot.toLocaleString('en-US')} — ${pct}% overall.${eta}`
    } else {
      sections.state = `${isEthy ? 'Ethy' : 'Snap'} sync ${pct}% complete.${eta}`
    }
    if (snapshots.economy.hasBlocks && snapshots.economy.tps !== undefined) {
      sections.economy = `Live blocks ~${snapshots.economy.tps.toFixed(1)} TPS on recent traffic.`
    }
    if (isEthy && snapshots.p2p.ethySession > 0) {
      sections.p2p = `${snapshots.p2p.ethySession} ETHY/0 peer${snapshots.p2p.ethySession === 1 ? '' : 's'} streaming proven chunks.`
    } else if (peers <= 1) {
      sections.p2p = `Only ${peers} peer — try /peers or Ctrl+D for discovery.`
    } else {
      sections.p2p = `${peers} peers active for snap ranges.`
    }
    return clampOverviewSections(sections)
  }

  if (phase === 'BAL_CATCHUP') {
    const catchUp = snapshots.economy
    sections.state = 'BAL catch-up in progress toward head.'
    if (catchUp.hasBlocks && catchUp.baseFeeGwei !== undefined) {
      const trend =
        catchUp.trend === 'up' ? 'rising' : catchUp.trend === 'down' ? 'falling' : 'flat'
      const hotRow = catchUp.topContracts[0]
      const hotBit =
        hotRow !== undefined
          ? ` Hottest: ${hotRow.knownName ?? hotRow.archetype ?? 'contract'} ${hotRow.address.slice(0, 6)}…${hotRow.address.slice(-4)}.`
          : ''
      sections.economy = `Base fee ${catchUp.baseFeeGwei} Gwei (${trend}).${hotBit}`
    }
    sections.p2p = `${peers} peer${peers === 1 ? '' : 's'} active.`
    return clampOverviewSections(sections)
  }

  const econ = snapshots.economy
  if (econ.hasBlocks && econ.baseFeeGwei !== undefined) {
    const trend = econ.trend === 'up' ? 'rising' : econ.trend === 'down' ? 'falling' : 'flat'
    const tps = econ.tps !== undefined ? `${econ.tps.toFixed(1)} TPS` : 'activity on chain'
    const vol = econ.ethTransferredWindowEth ?? '0 ETH'
    sections.economy = `Base fee ${econ.baseFeeGwei} Gwei (${trend}), ${tps}, ${vol} (64 blk).`
    const hotRow = econ.topContracts[0]
    if (hotRow !== undefined) {
      const addr = `${hotRow.address.slice(0, 6)}…${hotRow.address.slice(-4)}`
      let badge: string | undefined
      if (hotRow.knownName !== undefined) badge = hotRow.knownName
      else if (hotRow.archetype !== undefined && hotRow.archetype !== 'Contract') {
        badge = hotRow.archetype
      } else if (hotRow.proxyKind !== undefined) badge = hotRow.proxyKind
      const badgeClause = badge !== undefined ? ` [${badge}]` : ''
      sections.economy += ` Hottest: ${addr}${badgeClause}.`
    }
  }
  const headN = econ.latestBlockNumber ?? snapshots.pulse.pivotBlockNumber ?? '—'
  if (snapshots.snap.bucketsDone === 16) {
    let stateLine = `Head following live at #${headN} (16/16 buckets synced).`
    const codeDone = snapshots.snap.codesSynced
    if (codeDone > 0) {
      stateLine += ` ${codeDone.toLocaleString('en-US')} contract bytecodes indexed.`
    }
    sections.state = stateLine
  } else {
    sections.state = `Head following live at #${headN} — accounts ${snapshots.snap.bucketsDone}/16.`
  }
  sections.p2p = `${peers} peers connected.`
  return clampOverviewSections(sections)
}

/** Single-string overview for legacy clamps (contract microscope note). */
export function buildDeterministicOverview(
  snapshots: EthyDomainSnapshots,
  trigger: OverviewTrigger,
): string {
  const sec = buildDeterministicOverviewSections(snapshots, trigger)
  const parts = [sec.state, sec.economy, sec.p2p].filter((p) => p !== undefined && p.length > 0)
  const joined = parts.join(' ')
  if (joined.length <= MAX_AI_OVERVIEW_CHARS) return joined
  return `${joined.slice(0, MAX_AI_OVERVIEW_CHARS - 1)}…`
}
