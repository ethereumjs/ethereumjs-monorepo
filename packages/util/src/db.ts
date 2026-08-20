/** Key/value record stored in a {@link DB}. */
export type DBObject = {
  [key: string]: string | string[] | number
}
/** Batch write or delete operation for a {@link DB}. */
export type BatchDBOp<
  TKey extends Uint8Array | string | number = Uint8Array,
  TValue extends Uint8Array | string | DBObject = Uint8Array,
> = PutBatch<TKey, TValue> | DelBatch<TKey>

/** Supported key encodings for {@link DB} implementations. */
export type KeyEncoding = (typeof KeyEncoding)[keyof typeof KeyEncoding]

/** Supported key encodings for {@link DB} implementations. */
export const KeyEncoding = {
  String: 'string',
  Bytes: 'view',
  Number: 'number',
} as const

/** Supported value encodings for {@link DB} implementations. */
export type ValueEncoding = (typeof ValueEncoding)[keyof typeof ValueEncoding]

/** Supported value encodings for {@link DB} implementations. */
export const ValueEncoding = {
  String: 'string',
  Bytes: 'view',
  JSON: 'json',
} as const

/** Encoding options passed to {@link DB} get/put operations. */
export type EncodingOpts = {
  keyEncoding?: KeyEncoding
  valueEncoding?: ValueEncoding
}
/** Batch entry that inserts or updates a key. */
export interface PutBatch<
  TKey extends Uint8Array | string | number = Uint8Array,
  TValue extends Uint8Array | string | DBObject = Uint8Array,
> {
  type: 'put'
  key: TKey
  value: TValue
  opts?: EncodingOpts
}

/** Batch entry that deletes a key. */
export interface DelBatch<TKey extends Uint8Array | string | number = Uint8Array> {
  type: 'del'
  key: TKey
  opts?: EncodingOpts
}

/** Minimal async key/value database interface used across EthereumJS. */
export interface DB<
  TKey extends Uint8Array | string | number = Uint8Array,
  TValue extends Uint8Array | string | DBObject = Uint8Array,
> {
  /**
   * Retrieves a raw value from db.

   * @returns A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.
   */
  get(key: TKey, opts?: EncodingOpts): Promise<TValue | undefined>

  /**
   * Writes a value directly to db.
   * @param key The key as a `TValue`
   * @param val The value to be stored
   */
  put(key: TKey, val: TValue, opts?: EncodingOpts): Promise<void>

  /**
   * Removes a raw value in the underlying db.

   */
  del(key: TKey, opts?: EncodingOpts): Promise<void>

  /**
   * Performs a batch operation on db.
   * @param opStack A stack of levelup operations
   */
  batch(opStack: BatchDBOp<TKey, TValue>[]): Promise<void>

  /**
   * Returns a copy of the DB instance, with a reference
   * to the **same** underlying db instance.
   */
  shallowCopy(): DB<TKey, TValue>

  /**
   * Opens the database -- if applicable
   */
  open(): Promise<void>
  // TODO - decide if we actually need open/close - it's not required for maps and Level automatically opens the DB when you instantiate it
}
