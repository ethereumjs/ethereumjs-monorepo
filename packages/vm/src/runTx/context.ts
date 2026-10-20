import type { Block } from '@ethereumjs/block'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { RunTxOpts, RunTxResult } from '../types.ts'
import type { VM } from '../vm.ts'

/**
 * Mutable per-transaction context for the {@link runTx} pipeline.
 * Populated step-by-step inside {@link runTxInner}.
 */
export type TxContext = {
  vm: VM
  opts: RunTxOpts
  block?: Block
  tx: TypedTransaction
  result?: RunTxResult
}

export function createTxContext(vm: VM, opts: RunTxOpts): TxContext {
  return {
    vm,
    opts,
    block: opts.block,
    tx: opts.tx,
  }
}
