import { RLP } from '@ethereumjs/rlp'
import { keccak_256 } from '@noble/hashes/sha3.js'

/**
 * Structural helper class for block level access lists
 *
 * EXPERIMENTAL: DO NOT USE IN PRODUCTION!
 */
export class BlockLevelAccessList {
  public raw(): Uint8Array[] {
    return []
  }

  public serialize(): Uint8Array {
    return RLP.encode(this.raw())
  }

  /**
   * This hash is used in the block header
   *
   * @returns the hash of the serialized block level access list
   */
  public hash(): Uint8Array {
    return keccak_256(this.serialize())
  }
}

export function createBlockLevelAccessList(): BlockLevelAccessList {
  return new BlockLevelAccessList()
}
