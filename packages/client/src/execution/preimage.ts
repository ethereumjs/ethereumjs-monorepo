import { DBKey, MetaDBManager } from '../util/metaDBManager'

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
