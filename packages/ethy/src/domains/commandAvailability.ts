import { snapBucketsDoneCount } from '../spine/buckets.ts'
import { headInspectUnlocked } from '../spine/headInspect.ts'
import type { EthySpine } from '../spine/types.ts'

export type CommandAvailability = {
  status: 'ready' | 'partial' | 'locked'
  shortTag?: string
  title?: string
  reason?: string
  suggestion?: string
}

function normalizeSlash(command: string): string {
  const base = command.trim().split(/\s+/)[0] ?? command
  const slash = base.split('·')[0]?.trim() ?? base
  return slash.toLowerCase()
}

function economyReady(spine: EthySpine): CommandAvailability {
  const e = spine.economy
  if (e?.hasBlocks !== true) {
    return {
      status: 'locked',
      shortTag: 'awaiting blocks',
      reason: 'Economy telemetry needs at least one verified execution block.',
      suggestion: 'Wait for BAL streaming or try /peers while sync progresses.',
    }
  }
  if (e.hasTxBody !== true) {
    return {
      status: 'partial',
      shortTag: 'headers only',
      reason: 'Block headers are live but transaction bodies are not in the 64-block lens yet.',
    }
  }
  return { status: 'ready' }
}

function contractAvailability(spine: EthySpine, args?: string): CommandAvailability {
  const arg = args?.trim() ?? ''
  if (arg.length > 0 && spine.totalAccountsSynced > 0) {
    return { status: 'ready' }
  }
  if ((spine.economy?.topContracts.length ?? 0) > 0) {
    return { status: 'ready' }
  }
  return {
    status: 'locked',
    shortTag: 'awaiting BAL activity',
    reason: 'Contract intelligence needs BAL or receipt activity in the economy lens.',
    suggestion: 'Try /economy or wait until head following ingests live blocks.',
  }
}

export function getCommandAvailability(
  command: string,
  spine: EthySpine,
  opts?: { args?: string },
): CommandAvailability {
  const cmd = normalizeSlash(command)
  switch (cmd) {
    case '/live':
    case '/plaza':
    case '/head':
      if (
        spine.phase === 'HEAD_FOLLOWING' ||
        (spine.demoClock === true && spine.economy?.hasBlocks === true)
      ) {
        return { status: 'ready' }
      }
      return {
        status: 'locked',
        shortTag: 'awaiting blocks',
        reason: 'Ethereum Plaza activates once sync reaches live chain head.',
        suggestion: 'Wait for base sync and BAL catch-up to reach head.',
      }
    case '/economy':
    case '/e':
      return economyReady(spine)
    case '/contract':
    case '/co':
      return contractAvailability(spine, opts?.args)
    case '/buckets':
    case '/snap':
    case '/cl':
    case '/peers':
    case '/ethy':
      return { status: 'ready' }
    case '/rpc':
      return { status: 'ready' }
    case '/diag':
    case '/help':
    case '/h':
      return { status: 'ready' }
    case '/range':
    case '/sample':
      if (
        spine.phase === 'HEAD_FOLLOWING' ||
        spine.phase === 'BAL_CATCHUP' ||
        snapBucketsDoneCount(spine.snapBuckets) === 16
      ) {
        return { status: 'ready' }
      }
      if (spine.totalAccountsSynced > 0) {
        return {
          status: 'partial',
          shortTag: 'syncing',
          reason: 'Accounts are on disk but the full 16-bucket snap pass is not finished.',
        }
      }
      return {
        status: 'locked',
        shortTag: 'awaiting accounts',
        reason: 'No synced accounts yet to sample.',
      }
    case '/account':
      if (headInspectUnlocked(spine) && snapBucketsDoneCount(spine.snapBuckets) === 16) {
        return { status: 'ready' }
      }
      if (headInspectUnlocked(spine) || spine.totalAccountsSynced > 0) {
        return {
          status: 'partial',
          shortTag: 'partial state',
          reason: 'Some state is available but snap buckets or BAL stream are not complete.',
        }
      }
      return {
        status: 'locked',
        shortTag: 'awaiting state',
        reason: 'Account microscope unlocks after snap accounts or BAL catch-up.',
      }
    case '/bal':
      if (spine.balWindow.some((w) => w.balJson !== undefined)) {
        return { status: 'ready' }
      }
      return {
        status: 'locked',
        shortTag: 'awaiting BALs',
        reason: 'Waiting for the first EIP-7928 Block Access List on a verified block.',
        suggestion: 'Try /economy or /peers while sync catches up.',
      }
    case '/pause':
      if (spine.phase === 'SNAP_SYNCING') {
        return { status: 'ready' }
      }
      return {
        status: 'locked',
        shortTag:
          spine.phase === 'BAL_CATCHUP' || spine.phase === 'HEAD_FOLLOWING'
            ? 'snap complete'
            : 'not syncing',
        reason: 'Pause only applies during active snap/1 account sync.',
      }
    case '/resume':
      if (spine.phase === 'SNAP_SYNCING') {
        return { status: 'ready' }
      }
      return {
        status: 'locked',
        shortTag:
          spine.phase === 'BAL_CATCHUP' || spine.phase === 'HEAD_FOLLOWING'
            ? 'snap complete'
            : 'not syncing',
        reason: 'Resume only applies during active snap/1 account sync.',
      }
    case '/reassign':
      if (spine.phase === 'SNAP_SYNCING' && snapBucketsDoneCount(spine.snapBuckets) < 16) {
        return { status: 'ready' }
      }
      return {
        status: 'locked',
        shortTag: 'snap complete',
        reason: 'Bucket reassignment is only for in-progress snap sync.',
      }
    case '/drop':
      if (spine.peers.size > 0) return { status: 'ready' }
      return {
        status: 'locked',
        shortTag: 'no peers',
        reason: 'Connect to at least one peer before dropping a session.',
      }
    case '/simulate':
      if (!headInspectUnlocked(spine)) {
        return {
          status: 'locked',
          shortTag: 'awaiting state',
          reason: 'Simulation needs head-verified flat state.',
        }
      }
      return { status: 'ready', reason: 'On-demand EVM call at head (overlay sandbox).' }
    case '/send':
      return { status: 'ready', reason: 'Broadcast a signed raw transaction to eth peers.' }
    default:
      return { status: 'ready' }
  }
}
