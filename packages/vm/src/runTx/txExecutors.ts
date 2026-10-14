import { TransactionType } from '@ethereumjs/tx'

import type { RunTxOpts, RunTxResult } from '../types.ts'
import type { VM } from '../vm.ts'

export type TxExecutor = (vm: VM, opts: RunTxOpts) => Promise<RunTxResult>

/** Optional per-type executors (e.g. EIP-8141 frame txs on `new-eips`). */
export const TX_EXECUTORS: Map<number, TxExecutor> = new Map()

export function resolveTxExecutor(txType: number, defaultExecutor: TxExecutor): TxExecutor {
  return TX_EXECUTORS.get(txType) ?? TX_EXECUTORS.get(TransactionType.Legacy) ?? defaultExecutor
}
