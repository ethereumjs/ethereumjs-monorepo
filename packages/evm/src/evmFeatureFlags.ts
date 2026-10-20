import type { Common } from '@ethereumjs/common'

/** Hot-path EIP gates computed once per hardfork / EIP set. */
export type EVMFeatureFlags = {
  chargeCodeAccesses: boolean
  enforceInitCodeSizeLimit: boolean
  limitContractSize: boolean
  selfdestructOnlySameTransaction: boolean
}

export function createEVMFeatureFlags(common: Common): EVMFeatureFlags {
  return {
    chargeCodeAccesses: common.isActivatedEIP(6800) || common.isActivatedEIP(7864),
    enforceInitCodeSizeLimit: common.isActivatedEIP(3860),
    limitContractSize: common.isActivatedEIP(3860),
    selfdestructOnlySameTransaction: common.isActivatedEIP(6780),
  }
}
