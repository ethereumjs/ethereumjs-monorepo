import { Proof } from '../index.js'
import { StatelessVerkleStateManager } from '../statelessVerkleStateManager.js'

import { Address, verifyVerkleProof } from '@ethereumjs/util'

export function getVerkleStateProof(
  sm: StatelessVerkleStateManager,
  _: Address,
  __: Uint8Array[] = [],
): Promise<Proof> {
  throw new Error('Not implemented yet')
}
/**
 * Verifies whether the execution witness matches the stateRoot
 * @param {Uint8Array} stateRoot - The stateRoot to verify the executionWitness against
 * @returns {boolean} - Returns true if the executionWitness matches the provided stateRoot, otherwise false
 */
export function verifyVerkleStateProof(sm: StatelessVerkleStateManager): boolean {
  if (sm['_executionWitness'] === undefined) {
    sm['DEBUG'] && sm['_debug']('Missing executionWitness')
    return false
  }

  return verifyVerkleProof(sm.verkleCrypto, sm['_executionWitness'])
}
