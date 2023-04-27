export type BatchDBOp = PutBatch | DelBatch

export interface PutBatch {
  type: 'put'
  key: Uint8Array
  value: Uint8Array
}

export interface DelBatch {
  type: 'del'
  key: Uint8Array
}

export interface DB {
  /**
   * Retrieves a raw value from db.
   * @param key
   * @returns A Promise that resolves to `Uint8Array` if a value is found or `null` if no value is found.
   */
  get(key: Uint8Array): Promise<Uint8Array | null>

  /**
   * Writes a value directly to db.
   * @param key The key as a `Uint8Array`
   * @param value The value to be stored
   */
  put(key: Uint8Array, val: Uint8Array): Promise<void>

  /**
   * Removes a raw value in the underlying db.
   * @param keys
   */
  del(key: Uint8Array): Promise<void>

  /**
   * Performs a batch operation on db.
   * @param opStack A stack of levelup operations
   */
  batch(opStack: BatchDBOp[]): Promise<void>

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying db instance.
   */
  copy(): DB
}
