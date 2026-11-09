import { MerklePatriciaTrie, createMerkleProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import { SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE } from '@ethereumjs/statemanager'
import {
  accountBodyFromSlim,
  accountBodyToBinary,
  accountBodyToRLP,
  accountBodyToSlim,
  bytesToBigInt,
  createAccount,
  equalsBytes,
  getBinaryAccountCodeHash,
  getBinaryAccountStorageRoot,
  isBinaryAccountContract,
  isBinaryAccountEmptyStorage,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { verifyAccountRangeJob } from './snapVerifyJob.ts'

import type { Account, AccountBodyBytes } from '@ethereumjs/util'

function asBytes(value: unknown): Uint8Array | undefined {
  if (value instanceof Uint8Array) return value
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (ArrayBuffer.isView(value)) {
    const view = value as ArrayBufferView
    return new Uint8Array(view.buffer, view.byteOffset, view.byteLength)
  }
  return undefined
}

/** Slim account body is RLP bytes, or an already-decoded 4-field list from the wire. */
function decodeAccountBody(rlp: unknown): AccountBodyBytes {
  if (Array.isArray(rlp) && rlp.length === 4) {
    const parts = rlp.map(asBytes)
    if (parts.every((part): part is Uint8Array => part !== undefined)) {
      return [parts[0], parts[1], parts[2], parts[3]]
    }
  }
  const bytes = asBytes(rlp)
  if (bytes === undefined) {
    throw new Error('Invalid account body')
  }
  const body = RLP.decode(bytes)
  if (!Array.isArray(body) || body.length !== 4) {
    throw new Error('Invalid account body RLP')
  }
  const parts = body.map(asBytes)
  if (!parts.every((part): part is Uint8Array => part !== undefined)) {
    throw new Error('Invalid account body RLP')
  }
  return [parts[0], parts[1], parts[2], parts[3]]
}

export type SyntheticAccount = {
  address: Uint8Array
  accountHash: Uint8Array
  account: Account
  slimRlp: Uint8Array
  code?: Uint8Array
  storageTrie?: MerklePatriciaTrie
}

export class SyntheticSnapPeer {
  readonly rootHash: Uint8Array
  readonly accounts: SyntheticAccount[]
  private readonly trie: MerklePatriciaTrie
  private readonly codeByHash = new Map<string, Uint8Array>()
  faultedBucket3 = false

  private constructor(trie: MerklePatriciaTrie, accounts: SyntheticAccount[]) {
    this.trie = trie
    this.accounts = accounts
    this.rootHash = trie.root()
    for (const row of accounts) {
      if (row.code !== undefined) {
        this.codeByHash.set(bytesKey(row.account.codeHash), row.code)
      }
    }
  }

  static async create(accountsPerBucket = 10): Promise<SyntheticSnapPeer> {
    const trie = new MerklePatriciaTrie({ useKeyHashing: false })
    const accounts: SyntheticAccount[] = []
    for (let nibble = 0; nibble < 16; nibble++) {
      let found = 0
      let counter = nibble * 10_000
      while (found < accountsPerBucket) {
        const address = new Uint8Array(20)
        address[19] = counter & 0xff
        address[18] = (counter >> 8) & 0xff
        address[0] = nibble
        const accountHash = keccak_256(address)
        if (accountHash[0]! >> 4 !== nibble) {
          counter++
          continue
        }
        const account = createAccount({
          nonce: BigInt(found),
          balance: BigInt((nibble + 1) * 1_000_000_000_000_000_000),
        })
        const full = account.serialize()
        const slimBody = accountBodyToSlim(decodeAccountBody(full)) as AccountBodyBytes
        const slim = accountBodyToRLP(slimBody, false)
        await trie.put(accountHash, full)
        accounts.push({ address, accountHash, account, slimRlp: slim })
        found++
        counter++
      }
    }
    accounts.sort((a, b) => compareBytes32(a.accountHash, b.accountHash))
    await attachContractToFirstAccount(trie, accounts)
    return new SyntheticSnapPeer(trie, accounts)
  }

  buildByteCodesReply(getPayload: Uint8Array): Uint8Array {
    const decoded = RLP.decode(getPayload) as unknown[]
    const reqId = decoded[0]
    const hashesRaw = decoded[1] as Uint8Array[]
    const codes: Uint8Array[] = []
    for (const hash of hashesRaw) {
      const code = this.codeByHash.get(bytesKey(hash))
      if (code !== undefined) codes.push(code)
    }
    return RLP.encode([reqId, codes] as never)
  }

  async buildStorageRangesReply(getPayload: Uint8Array): Promise<Uint8Array> {
    const decoded = RLP.decode(getPayload) as unknown[]
    const reqId = decoded[0]
    const accountHashes = decoded[2] as Uint8Array[]
    const origin = decoded[3] as Uint8Array
    const limit = decoded[4] as Uint8Array
    if (accountHashes.length === 0) {
      return RLP.encode([reqId, [[]], []] as never)
    }
    const ranges: Array<Array<[Uint8Array, Uint8Array]>> = []
    for (const accountHash of accountHashes) {
      const row = this.accounts.find((a) => equalsAccountHash(a.accountHash, accountHash))
      if (row?.storageTrie === undefined) {
        ranges.push([])
        continue
      }
      const trie = row.storageTrie
      const slotHash = keccak_256(new Uint8Array([0x01]))
      if (compareBytes32(slotHash, origin) < 0 || compareBytes32(slotHash, limit) > 0) {
        ranges.push([])
        continue
      }
      const slotRlp = RLP.encode(new Uint8Array([0x02]))
      const slots: Array<[Uint8Array, Uint8Array]> = [[slotHash, slotRlp]]
      if (accountHashes.length === 1) {
        const proof = await createMerkleProof(trie, slotHash)
        return RLP.encode([reqId, [slots], proof] as never)
      }
      ranges.push(slots)
    }
    return RLP.encode([reqId, ranges, []] as never)
  }

  /** Test/demo: trie backing Merkle proofs (WP-06c seed dir). */
  merkleTrie(): MerklePatriciaTrie {
    return this.trie
  }

  /** Build ACCOUNT_RANGE RLP for a GET_ACCOUNT_RANGE payload. */
  async buildAccountRangeReply(getPayload: Uint8Array): Promise<Uint8Array> {
    const decoded = RLP.decode(getPayload) as unknown[]
    const origin = decoded[2] as Uint8Array
    const limit = decoded[3] as Uint8Array
    const originNibble = origin[0]! >> 4
    const inRange = this.accounts.filter(
      (a) =>
        compareBytes32(a.accountHash, origin) >= 0 && compareBytes32(a.accountHash, limit) <= 0,
    )
    const slice = inRange.slice(0, 10)
    if (slice.length === 0) {
      const proof = await createMerkleProof(this.trie, origin)
      return RLP.encode([decoded[0], [], proof] as never)
    }
    const last = slice[slice.length - 1]!.accountHash
    // Snap proves the requested origin (often not an account) through the last account returned.
    let proof = [
      ...(await createMerkleProof(this.trie, origin)),
      ...(await createMerkleProof(this.trie, last)),
    ]
    if (originNibble === 0x3 && !this.faultedBucket3) {
      this.faultedBucket3 = true
      if (proof.length > 0) {
        const corrupted = new Uint8Array(proof[0]!)
        corrupted[0] ^= 0xff
        proof = [corrupted, ...proof.slice(1)]
      }
    }
    const accountsList = slice.map((a) => [a.accountHash, a.slimRlp])
    return RLP.encode([decoded[0], accountsList, proof] as never)
  }
}

async function attachContractToFirstAccount(
  trie: MerklePatriciaTrie,
  accounts: SyntheticAccount[],
): Promise<void> {
  const row = accounts[0]
  if (row === undefined) return
  const code = new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xfd])
  const codeHash = keccak_256(code)
  const storageTrie = new MerklePatriciaTrie({ useKeyHashing: false })
  const slotHash = keccak_256(new Uint8Array([0x01]))
  const slotRlp = RLP.encode(new Uint8Array([0x02]))
  await storageTrie.put(slotHash, slotRlp)
  const account = createAccount({
    nonce: row.account.nonce,
    balance: row.account.balance,
    codeHash,
    storageRoot: storageTrie.root(),
  })
  const full = account.serialize()
  await trie.put(row.accountHash, full)
  const slimBody = accountBodyToSlim(decodeAccountBody(full)) as AccountBodyBytes
  row.account = account
  row.slimRlp = accountBodyToRLP(slimBody, false)
  row.code = code
  row.storageTrie = storageTrie
}

function bytesKey(hash: Uint8Array): string {
  return Array.from(hash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function equalsAccountHash(a: Uint8Array, b: Uint8Array): boolean {
  return equalsBytes(a, b)
}

export function compareBytes32(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < 32; i++) {
    if (a[i]! !== b[i]!) return a[i]! - b[i]!
  }
  return 0
}

export function incrementKey32(key: Uint8Array): Uint8Array {
  const out = new Uint8Array(key)
  for (let i = 31; i >= 0; i--) {
    if (out[i]! < 255) {
      out[i]!++
      break
    }
    out[i] = 0
  }
  return out
}

export type ParsedAccountRangeReply = {
  reqId: bigint
  entries: Array<{ accountHash: Uint8Array; binaryAccount: Uint8Array }>
  proof: Uint8Array[]
  lastKey?: Uint8Array
}

export type DecodedAccountRangePayload = {
  reqId: bigint
  accountsRaw: Array<[unknown, unknown]>
  proof: Uint8Array[]
}

/** Last account hash in an ACCOUNT_RANGE reply without decoding account bodies (WP-06e). */
export function peekAccountRangeLastKey(
  payload: Uint8Array,
): { lastKey: Uint8Array; count: number } | undefined {
  const decoded = decodeAccountRangePayload(payload)
  if (decoded === undefined || decoded.accountsRaw.length === 0) return undefined
  const lastPair = decoded.accountsRaw[decoded.accountsRaw.length - 1]
  if (!Array.isArray(lastPair) || lastPair.length < 1) return undefined
  const accountHash = asBytes(lastPair[0])
  if (accountHash === undefined || accountHash.length !== 32) return undefined
  return { lastKey: new Uint8Array(accountHash), count: decoded.accountsRaw.length }
}

/** Outer ACCOUNT_RANGE RLP (reqId, account pairs, proof nodes). */
export function decodeAccountRangePayload(
  payload: Uint8Array,
): DecodedAccountRangePayload | undefined {
  const bytes = asBytes(payload)
  if (bytes === undefined) return undefined
  let decoded: unknown[]
  try {
    decoded = RLP.decode(bytes) as unknown[]
  } catch {
    return undefined
  }
  const reqRaw = decoded[0]
  if (!(reqRaw instanceof Uint8Array)) return undefined
  const reqId = reqRaw.length === 0 ? 0n : bytesToBigInt(reqRaw)
  const accountsRaw = decoded[1] as Array<[unknown, unknown]>
  if (!Array.isArray(accountsRaw)) return undefined
  let proof: Uint8Array[]
  try {
    proof = proofNodeList(decoded[2])
  } catch {
    return undefined
  }
  return { reqId, accountsRaw, proof }
}

/** Expand slim account bodies into trie keys, canonical RLP values, and optional slab rows. */
export function accountRangeRowsFromRaw(
  accountsRaw: Array<[unknown, unknown]>,
  slab?: Uint8Array,
): { keys: Uint8Array[]; values: Uint8Array[] } | undefined {
  const keys: Uint8Array[] = []
  const values: Uint8Array[] = []
  let offset = 0
  try {
    for (const pair of accountsRaw) {
      if (!Array.isArray(pair) || pair.length < 2) return undefined
      const [h, slim] = pair
      const accountHash = asBytes(h)
      if (accountHash === undefined || accountHash.length !== 32) return undefined
      const body = accountBodyFromSlim(decodeAccountBody(slim)) as AccountBodyBytes
      keys.push(accountHash)
      values.push(accountBodyToRLP(body, false))
      if (slab !== undefined) {
        slab.set(accountHash, offset)
        accountBodyToBinary(body, false, slab, offset + 32)
        offset += SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE
      }
    }
  } catch {
    return undefined
  }
  return { keys, values }
}

/** Decode an ACCOUNT_RANGE RLP payload once (reqId, accounts, proof). */
export function parseAccountRangeReply(payload: Uint8Array): ParsedAccountRangeReply | undefined {
  const decoded = decodeAccountRangePayload(payload)
  if (decoded === undefined) return undefined
  const { reqId, accountsRaw, proof } = decoded
  const slab = new Uint8Array(accountsRaw.length * SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE)
  const rows = accountRangeRowsFromRaw(accountsRaw, slab)
  if (rows === undefined) return undefined
  const entries: ParsedAccountRangeReply['entries'] = []
  for (let i = 0; i < rows.keys.length; i++) {
    const rowOffset = i * SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE
    entries.push({
      accountHash: rows.keys[i]!,
      binaryAccount: slab.subarray(
        rowOffset + 32,
        rowOffset + SNAP_BINARY_ACCOUNT_SLAB_RECORD_SIZE,
      ),
    })
  }
  const lastKey = rows.keys[rows.keys.length - 1]
  return { reqId, entries, proof, lastKey }
}

export async function ingestAccountRangeReply(
  stateRoot: Uint8Array,
  replyPayload: Uint8Array,
  putBatch: (entries: Array<{ accountHash: Uint8Array; binaryAccount: Uint8Array }>) => void,
  /** Request origin. Live snap proofs start here, not at the first returned account. */
  origin?: Uint8Array,
): Promise<{
  ok: boolean
  hasRight: boolean
  count: number
  reason?: string
  lastKey?: Uint8Array
}> {
  const result = await verifyAccountRangeJob({ stateRoot, origin, payload: replyPayload })
  if (result.ok && result.slab !== undefined && result.count > 0) {
    const stride = 136
    const batch: Array<{ accountHash: Uint8Array; binaryAccount: Uint8Array }> = []
    for (let offset = 0; offset < result.slab.length; offset += stride) {
      batch.push({
        accountHash: result.slab.subarray(offset, offset + 32),
        binaryAccount: result.slab.subarray(offset + 32, offset + stride),
      })
    }
    putBatch(batch)
  }
  return result
}

function proofNodeList(raw: unknown): Uint8Array[] {
  if (!Array.isArray(raw)) return []
  return raw.map((node) => {
    const bytes = asBytes(node)
    if (bytes === undefined) throw new Error('account range proof node is not bytes')
    return bytes
  })
}

/** Binary journal rows from a verified ACCOUNT_RANGE reply (single RLP decode). */
export function accountRecordsFromRangeReply(
  payload: Uint8Array,
): Array<{ accountHash: Uint8Array; binaryAccount: Uint8Array }> {
  const parsed = parseAccountRangeReply(payload)
  if (parsed === undefined) return []
  return parsed.entries.map(({ accountHash, binaryAccount }) => ({ accountHash, binaryAccount }))
}

/** Contract or non-empty-storage rows for code/storage scheduling (no extra RLP decode). */
export function ingestedMetaFromBinarySlab(slab: Uint8Array): Array<{
  accountHash: Uint8Array
  codeHash: Uint8Array
  storageRoot: Uint8Array
}> {
  const out: Array<{ accountHash: Uint8Array; codeHash: Uint8Array; storageRoot: Uint8Array }> = []
  const stride = 136
  for (let offset = 0; offset + stride <= slab.length; offset += stride) {
    const binaryAccount = slab.subarray(offset + 32, offset + stride)
    if (!isBinaryAccountContract(binaryAccount) && isBinaryAccountEmptyStorage(binaryAccount)) {
      continue
    }
    out.push({
      accountHash: new Uint8Array(slab.subarray(offset, offset + 32)),
      codeHash: new Uint8Array(getBinaryAccountCodeHash(binaryAccount)),
      storageRoot: new Uint8Array(getBinaryAccountStorageRoot(binaryAccount)),
    })
  }
  return out
}

/** @deprecated Use {@link ingestedMetaFromBinarySlab} or pass hash triplets directly. */
export function ingestedMetaFromBinaryEntries(
  entries: Array<{ accountHash: Uint8Array; binaryAccount: Uint8Array }>,
): Array<{ accountHash: Uint8Array; codeHash: Uint8Array; storageRoot: Uint8Array }> {
  const body = new Uint8Array(entries.length * 136)
  let offset = 0
  for (const row of entries) {
    body.set(row.accountHash.subarray(0, 32), offset)
    body.set(row.binaryAccount.subarray(0, 104), offset + 32)
    offset += 136
  }
  return ingestedMetaFromBinarySlab(body)
}
