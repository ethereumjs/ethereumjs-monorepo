import type { EthyDomainSnapshots } from '../domains/types.ts'

export const MAX_AI_OVERVIEW_CHARS = 280

export type OverviewTrigger = 'welcome' | 'pulse'

function clampProse(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= MAX_AI_OVERVIEW_CHARS) return t
  return `${t.slice(0, MAX_AI_OVERVIEW_CHARS - 1)}…`
}

export function buildDeterministicOverview(
  snapshots: EthyDomainSnapshots,
  trigger: OverviewTrigger,
): string {
  const phase = snapshots.pulse.phase
  const peers = snapshots.p2p.connected

  if (trigger === 'welcome' || phase === 'BOOTING' || phase === 'P2P_WARMUP') {
    const pivot = snapshots.pulse.pivotBlockNumber
    const pct = Math.round(snapshots.pulse.progressPct)
    const acc = snapshots.snap.totalAccountsSynced
    const accNote = acc > 0 ? `, ${(acc / 1_000_000).toFixed(1)}M acc` : ''
    const resume =
      pivot !== undefined
        ? `Resuming near #${pivot} (${pct}% progress${accNote}).`
        : 'Starting fresh sync.'
    const peerLine = peers === 0 ? 'No peers yet — warming discovery.' : `${peers} peers connected.`
    return clampProse(
      `${resume} ${peerLine} Tip: Tab cycles domains; Enter opens the deep view for the active lens.`,
    )
  }

  if (phase === 'SNAP_SYNCING') {
    const pct = Math.round(snapshots.pulse.progressPct)
    const eta =
      snapshots.pulse.snapEtaMinutes !== undefined && snapshots.pulse.snapEtaMinutes > 0
        ? ` ETA ~${Math.round(snapshots.pulse.snapEtaMinutes)}m.`
        : ''
    const bal =
      snapshots.economy.hasBlocks && snapshots.economy.tps !== undefined
        ? ` Live BALs show ~${snapshots.economy.tps.toFixed(1)} TPS on recent blocks.`
        : ''
    const stall = peers <= 1 ? ' Only one peer — try /peers or Ctrl+D for discovery stats.' : ''
    if (snapshots.snap.bucketsDone === 16) {
      const codeDone = snapshots.snap.codesSynced
      const codeTot = snapshots.snap.codesTotal ?? codeDone
      const storDone = snapshots.snap.storageAccountsSynced ?? 0
      const storTot = snapshots.snap.storageAccountsTotal ?? storDone
      return clampProse(
        `Accounts 16/16 complete! Syncing bytecode (${codeDone.toLocaleString('en-US')}/${codeTot.toLocaleString('en-US')}) and storage (${storDone.toLocaleString('en-US')}/${storTot.toLocaleString('en-US')}) — ${pct}% overall.${eta}${bal}${stall}`,
      )
    }
    return clampProse(`Snap sync ${pct}% complete.${eta}${bal}${stall}`)
  }

  if (phase === 'BAL_CATCHUP') {
    return clampProse(
      `BAL catch-up in progress toward head. ${peers} peers active. Enter opens /bal; Tab switches domain lens.`,
    )
  }

  const econ = snapshots.economy
  if (econ.hasBlocks && econ.baseFeeGwei !== undefined) {
    const trend = econ.trend === 'up' ? 'rising' : econ.trend === 'down' ? 'falling' : 'flat'
    const tps = econ.tps !== undefined ? `${econ.tps.toFixed(1)} TPS` : 'activity on chain'
    const vol = econ.ethTransferredWindowEth ?? '0 ETH'
    const hot = econ.topContracts[0]?.address
    const hotBit = hot !== undefined ? ` Hottest contract ${hot.slice(0, 6)}…${hot.slice(-4)}.` : ''
    return clampProse(
      `Head following — base fee ${econ.baseFeeGwei} Gwei (${trend}), ${tps}, ${vol} (64 blk).${hotBit}`,
    )
  }

  return clampProse(
    `Head following live. ${peers} peers. Press Enter for domain view or /economy for activity.`,
  )
}
