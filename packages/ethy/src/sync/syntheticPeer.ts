import { MerklePatriciaTrie, createMerkleProof, verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  accountBodyFromSlim,
  accountBodyToRLP,
  accountBodyToSlim,
  createAccount,
  createAccountFromRLP,
  equalsBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

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
    const accountHash = accountHashes[0]
    if (accountHash === undefined) {
      return RLP.encode([reqId, [[]], []] as never)
    }
    const row = this.accounts.find((a) => equalsAccountHash(a.accountHash, accountHash))
    if (row?.storageTrie === undefined) {
      return RLP.encode([reqId, [[]], []] as never)
    }
    const trie = row.storageTrie
    const slotHash = keccak_256(new Uint8Array([0x01]))
    if (compareBytes32(slotHash, origin) < 0 || compareBytes32(slotHash, limit) > 0) {
      return RLP.encode([reqId, [[]], []] as never)
    }
    const slotRlp = RLP.encode(new Uint8Array([0x02]))
    const proof = await createMerkleProof(trie, slotHash)
    const slots: Array<[Uint8Array, Uint8Array]> = [[slotHash, slotRlp]]
    return RLP.encode([reqId, [slots], proof] as never)
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
      return RLP.encode([decoded[0], [], []] as never)
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

function compareBytes32(a: Uint8Array, b: Uint8Array): number {
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

export async function ingestAccountRangeReply(
  stateRoot: Uint8Array,
  replyPayload: Uint8Array,
  putBatch: (
    entries: Array<{ accountHash: Uint8Array; account: Account; address?: never }>,
  ) => void,
  /** Request origin. Live snap proofs start here, not at the first returned account. */
  origin?: Uint8Array,
): Promise<{ ok: boolean; hasRight: boolean; count: number; reason?: string }> {
  const payload = asBytes(replyPayload)
  if (payload === undefined) return { ok: false, hasRight: false, count: 0 }
  let decoded: unknown[]
  try {
    decoded = RLP.decode(payload) as unknown[]
  } catch {
    return { ok: false, hasRight: false, count: 0 }
  }
  const accountsRaw = decoded[1] as Array<[unknown, unknown]>
  let proof: Uint8Array[]
  try {
    proof = proofNodeList(decoded[2])
  } catch (err: unknown) {
    return { ok: false, hasRight: false, count: 0, reason: errorText(err) }
  }
  if (!Array.isArray(accountsRaw) || accountsRaw.length === 0) {
    if (origin !== undefined && proof.length > 0) {
      try {
        await verifyMerkleRangeProof(stateRoot, origin, null, [], [], proof)
        return { ok: true, hasRight: false, count: 0 }
      } catch (err: unknown) {
        return { ok: false, hasRight: false, count: 0, reason: errorText(err) }
      }
    }
    return {
      ok: false,
      hasRight: false,
      count: 0,
      reason: 'empty account range without proof',
    }
  }
  try {
    const keys = accountsRaw.map(([h]) => {
      const hash = asBytes(h)
      if (hash === undefined) throw new Error('Invalid account hash')
      return hash
    })
    const values = accountsRaw.map(([, slim]) =>
      accountBodyToRLP(accountBodyFromSlim(decodeAccountBody(slim)) as AccountBodyBytes, false),
    )
    if (origin !== undefined && compareBytes32(origin, keys[keys.length - 1]!) > 0) {
      return {
        ok: false,
        hasRight: false,
        count: 0,
        reason: 'peer returned accounts below request origin',
      }
    }
    const firstKey = origin ?? keys[0]!
    const lastKey = keys[keys.length - 1]!
    const hasRight = await verifyMerkleRangeProof(stateRoot, firstKey, lastKey, keys, values, proof)
    putBatch(
      accountsRaw.map(([, slim], index) => ({
        accountHash: keys[index]!,
        account: createAccountFromRLP(
          accountBodyToRLP(accountBodyFromSlim(decodeAccountBody(slim)) as AccountBodyBytes, false),
        ),
      })),
    )
    return { ok: true, hasRight, count: accountsRaw.length }
  } catch (err: unknown) {
    return { ok: false, hasRight: false, count: 0, reason: errorText(err) }
  }
}

function proofNodeList(raw: unknown): Uint8Array[] {
  if (!Array.isArray(raw)) return []
  return raw.map((node) => {
    const bytes = asBytes(node)
    if (bytes === undefined) throw new Error('account range proof node is not bytes')
    return bytes
  })
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

/** Account rows from a verified ACCOUNT_RANGE reply (for on-disk journal append). */
export function accountRecordsFromRangeReply(
  payload: Uint8Array,
): Array<{ accountHash: Uint8Array; accountRlp: Uint8Array }> {
  const decoded = RLP.decode(payload) as unknown[]
  const accountsRaw = decoded[1] as Array<[unknown, unknown]>
  if (!Array.isArray(accountsRaw)) return []
  const out: Array<{ accountHash: Uint8Array; accountRlp: Uint8Array }> = []
  for (const [h, slim] of accountsRaw) {
    const accountHash = asBytes(h)
    if (accountHash === undefined) continue
    const accountRlp = accountBodyToRLP(
      accountBodyFromSlim(decodeAccountBody(slim)) as AccountBodyBytes,
      false,
    )
    out.push({ accountHash, accountRlp })
  }
  return out
}
