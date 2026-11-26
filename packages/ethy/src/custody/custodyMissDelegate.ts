import type {
  AccountMissResult,
  CodeMissResult,
  StateResolutionPolicy,
  StorageMissResult,
} from '@ethereumjs/statemanager'

import type { CustodyMissHookBundle } from './custodyMissHooks.ts'

/** Mutable miss-hook target wired after P2P starts (WP-16d). */
export type CustodyMissDelegate = CustodyMissHookBundle

export function createCustodyMissDelegate(): {
  delegate: CustodyMissDelegate
  bind: (bundle: CustodyMissHookBundle) => void
} {
  const delegate: CustodyMissDelegate = {}
  return {
    delegate,
    bind(bundle: CustodyMissHookBundle) {
      delegate.resolveAccountMiss = bundle.resolveAccountMiss
      delegate.resolveStorageMiss = bundle.resolveStorageMiss
      delegate.resolveCodeMiss = bundle.resolveCodeMiss
    },
  }
}

export function missHookOpts(delegate: CustodyMissDelegate): {
  resolveAccountMiss: (
    accountHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<AccountMissResult>
  resolveStorageMiss: (
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<StorageMissResult>
  resolveCodeMiss: (codeHash: Uint8Array, policy: StateResolutionPolicy) => Promise<CodeMissResult>
} {
  return {
    resolveAccountMiss: (h, p) =>
      delegate.resolveAccountMiss !== undefined
        ? delegate.resolveAccountMiss(h, p)
        : Promise.resolve(undefined),
    resolveStorageMiss: (a, s, p) =>
      delegate.resolveStorageMiss !== undefined
        ? delegate.resolveStorageMiss(a, s, p)
        : Promise.resolve(undefined),
    resolveCodeMiss: (h, p) =>
      delegate.resolveCodeMiss !== undefined
        ? delegate.resolveCodeMiss(h, p)
        : Promise.resolve(undefined),
  }
}
