import type {
  AccountMissResult,
  CodeMissResult,
  StateResolutionPolicy,
  StorageMissResult,
} from '@ethereumjs/statemanager'

/** Late-bound open-world miss hooks (WP-16d). Filled when P2P starts. */
export type CustodyMissHookBundle = {
  resolveAccountMiss?: (
    accountHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<AccountMissResult>
  resolveStorageMiss?: (
    accountHash: Uint8Array,
    slotHash: Uint8Array,
    policy: StateResolutionPolicy,
  ) => Promise<StorageMissResult>
  resolveCodeMiss?: (codeHash: Uint8Array, policy: StateResolutionPolicy) => Promise<CodeMissResult>
}

export function wrapCustodyMissHooks(bundle: CustodyMissHookBundle): {
  resolveAccountMiss?: CustodyMissHookBundle['resolveAccountMiss']
  resolveStorageMiss?: CustodyMissHookBundle['resolveStorageMiss']
  resolveCodeMiss?: CustodyMissHookBundle['resolveCodeMiss']
} {
  return {
    resolveAccountMiss:
      bundle.resolveAccountMiss !== undefined
        ? (h, p) => bundle.resolveAccountMiss!(h, p)
        : undefined,
    resolveStorageMiss:
      bundle.resolveStorageMiss !== undefined
        ? (a, s, p) => bundle.resolveStorageMiss!(a, s, p)
        : undefined,
    resolveCodeMiss:
      bundle.resolveCodeMiss !== undefined ? (h, p) => bundle.resolveCodeMiss!(h, p) : undefined,
  }
}
