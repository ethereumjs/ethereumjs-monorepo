import { DBKey, MetaDBManager } from '../util/metaDBManager.ts'

/**
 * The `PreImagesManager` saves the preimages of hashed keys. This is necessary for the State tree transitions.
 * A "PreImage" of a hash is whatever the input is to the hashed function. So, if one calls `keccak256(X)` with
 * output `Y` then `X` is the preimage of `Y`. It thus serves to recover the input to the trapdoor hash function,
 * which would otherwise not be feasible.
 */
export class PreimagesManager extends MetaDBManager {
  /**
   * Returns the preimage for a given hashed key
   * @param key the hashed key
   * @returns the preimage of the hashed key
   */
  async getPreimage(key: Uint8Array): Promise<Uint8Array | null> {
    return this.get(DBKey.Preimage, key)
  }

  /**
   * Saves a preimage to the db for a given hashed key.
   * @param key The hashed key
   * @param preimage The preimage to save
   */
  async savePreimage(key: Uint8Array, preimage: Uint8Array) {
    await this.put(DBKey.Preimage, key, preimage)
  }
}
