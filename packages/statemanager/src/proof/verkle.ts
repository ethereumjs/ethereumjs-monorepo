import { EthereumJSErrorWithoutCode, verifyVerkleProof } from '@ethereumjs/util'

import type { VerkleStateManagerInterface } from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'
import type { Proof } from '../index.ts'
import type { StatelessVerkleStateManager } from '../statelessVerkleStateManager.ts'

export function getVerkleStateProof(
  sm: StatelessVerkleStateManager,
  _: Address,
  __: Uint8Array[] = [],
): Promise<Proof> {
  throw EthereumJSErrorWithoutCode('Not implemented yet')
}
/**
 * Verifies whether the execution witness matches the stateRoot
 * @param {Uint8Array} stateRoot - The stateRoot to verify the executionWitness against
 * @returns {boolean} - Returns true if the executionWitness matches the provided stateRoot, otherwise false
 */
export function verifyVerkleStateProof(sm: VerkleStateManagerInterface): boolean {
  const stateManager = sm as StatelessVerkleStateManager
  if (stateManager['_executionWitness'] === undefined) {
    stateManager['DEBUG'] && stateManager['_debug']('Missing executionWitness')
    return false
  }

  return verifyVerkleProof(stateManager.verkleCrypto, stateManager['_executionWitness'])
}
