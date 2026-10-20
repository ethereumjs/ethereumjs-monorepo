import { BIGINT_0 } from '@ethereumjs/util'

import { accessAddressEIP2929, accessStorageEIP2929 } from './opcodes/EIP2929.ts'
import { createAddressFromStackBigInt } from './opcodes/util.ts'

import type { Common } from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'
import type { RunState } from './interpreter.ts'

/**
 * Access-gas pricing resolved once per hardfork / EIP set (EIP-2929, 8038, 6800/7864 witness).
 */
export class AccessGasSchedule {
  readonly chargeExtcode8038: boolean
  readonly extcode8038Gas: bigint
  readonly useEIP2929: boolean
  readonly useStatelessWitness: boolean

  constructor(common: Common) {
    this.useStatelessWitness = common.isActivatedEIP(6800) || common.isActivatedEIP(7864)
    this.useEIP2929 = common.isActivatedEIP(2929)
    this.chargeExtcode8038 = common.isActivatedEIP(8038)
    this.extcode8038Gas = this.chargeExtcode8038 ? common.param('warmstoragereadGas') : BIGINT_0
  }

  /**
   * Stateless witness basic account read before EIP-2929 account access (CALL / EXTCODE* family).
   */
  async witnessAccountBasicData(
    runState: RunState,
    address: Address,
    common: Common,
  ): Promise<{ gas: bigint; charge2929Gas: boolean }> {
    if (!this.useStatelessWitness) {
      return { gas: BIGINT_0, charge2929Gas: true }
    }
    if (
      runState.interpreter._evm.getPrecompile(address) !== undefined ||
      address.equals(createAddressFromStackBigInt(common.param('systemAddress')))
    ) {
      return { gas: BIGINT_0, charge2929Gas: true }
    }
    const coldAccessGas = runState.env.accessWitness!.readAccountBasicData(address)
    return {
      gas: coldAccessGas,
      charge2929Gas: coldAccessGas === BIGINT_0,
    }
  }

  chargeAccountAccess(
    runState: RunState,
    address: Uint8Array,
    common: Common,
    charge2929Gas: boolean,
    isSelfdestruct = false,
  ): bigint {
    if (!this.useEIP2929) {
      return BIGINT_0
    }
    return accessAddressEIP2929(runState, address, common, charge2929Gas, isSelfdestruct)
  }

  chargeStorageAccess(
    runState: RunState,
    key: Uint8Array,
    isSstore: boolean,
    common: Common,
    charge2929Gas: boolean,
  ): bigint {
    if (!this.useEIP2929) {
      return BIGINT_0
    }
    return accessStorageEIP2929(runState, key, isSstore, common, charge2929Gas)
  }

  /** EIP-8038 code-reading surcharge on EXTCODE* after account access. */
  extcodeReadingSurcharge(): bigint {
    return this.extcode8038Gas
  }

  async witnessStorageRead(
    runState: RunState,
    address: Address,
    key: bigint,
  ): Promise<{ gas: bigint; charge2929Gas: boolean }> {
    if (!this.useStatelessWitness) {
      return { gas: BIGINT_0, charge2929Gas: true }
    }
    const coldAccessGas = runState.env.accessWitness!.readAccountStorage(address, key)
    return {
      gas: coldAccessGas,
      charge2929Gas: coldAccessGas === BIGINT_0,
    }
  }
}

export function createAccessGasSchedule(common: Common): AccessGasSchedule {
  return new AccessGasSchedule(common)
}
