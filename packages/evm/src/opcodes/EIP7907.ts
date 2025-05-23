import { BIGINT_0 } from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'
import type { RunState } from '../interpreter.ts'
import { ceil32 } from './util.ts'

/**
 * Adds address to accessAddressCode set if not already included.
 * Adjusts cost incurred for executing opcode based on whether address code
 * is warm/cold and whether the address is a large contract. (EIP 7907)
 * @param {RunState} runState
 * @param {Address}  address
 * @param {Common}   common
 * @param {Boolean}  chargeGas (default: true)
 * @param {Boolean}  isSelfdestruct (default: false)
 */
export function accessAddressCodeEIP7907(
  runState: RunState,
  address: Uint8Array,
  common: Common,
  chargeGas = true,
): bigint {
  if (!common.isActivatedEIP(7907)) return BIGINT_0

  // Cold
  if (!runState.interpreter.journal.isWarmedCodeAddress(address)) {
    runState.interpreter.journal.addWarmedCodeAddress(address)

    // CREATE, CREATE2 opcodes have the address code warmed for free.
    if (chargeGas) {
      // EIP 7907:
      // get the large contract cost gas
      // initCodeWordGas (2) * every byte (rounded up to the next 32 bytes) over the excessCodeSizeThreshold
      const excessContractSize = BigInt(
        Math.max(
          0,
          runState.env.contract.codeSize - Number(common.param('excessCodeSizeThreshold')),
        ),
      )
      const largeContractCost = ceil32(excessContractSize) * common.param('initCodeWordGas')
      return largeContractCost
    }
  }
  // No Warm case: there is no additional large contract cost for warm code addresses
  return BIGINT_0
}
