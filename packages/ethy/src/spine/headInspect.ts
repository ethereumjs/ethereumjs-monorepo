import type { EthySpine } from './types.ts'

/** When /bal, /account, and /simulate may run (independent of `state` pill readiness). */
export function headInspectUnlocked(spine: EthySpine): boolean {
  if (spine.phase === 'BAL_CATCHUP' || spine.phase === 'HEAD_FOLLOWING') {
    return true
  }
  if (spine.phase === 'SNAP_SYNCING' && (spine.streamedBalCount ?? 0) > 0) {
    return true
  }
  return false
}
