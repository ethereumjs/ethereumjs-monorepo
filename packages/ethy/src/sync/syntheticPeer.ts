import { MerklePatriciaTrie, createMerkleProof, verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  accountBodyFromSlim,
  accountBodyToRLP,
  accountBodyToSlim,
  createAccount,
  createAccountFromRLP,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import type { Account, AccountBodyBytes } from '@ethereumjs/util'

function decodeAccountBody(rlp: Uint8Array): AccountBodyBytes {
  const body = RLP.decode(rlp)
  if (!Array.isArray(body) || body.length !== 4) {
    throw new Error('Invalid account body RLP')
  }
  return [
    body[0] as Uint8Array,
    body[1] as Uint8Array,
    body[2] as Uint8Array,
    body[3] as Uint8Array,
  ]
}

export type SyntheticAccount = {
  address: Uint8Array
  accountHash: Uint8Array
  account: Account
  slimRlp: Uint8Array
}

export class SyntheticSnapPeer {
  readonly rootHash: Uint8Array
  readonly accounts: SyntheticAccount[]
  private readonly trie: MerklePatriciaTrie
  faultedBucket3 = false

  private constructor(trie: MerklePatriciaTrie, accounts: SyntheticAccount[]) {
    this.trie = trie
    this.accounts = accounts
    this.rootHash = trie.root()
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
    return new SyntheticSnapPeer(trie, accounts)
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
    const first = slice[0]!.accountHash
    const last = slice[slice.length - 1]!.accountHash
    let proof = [
      ...(await createMerkleProof(this.trie, first)),
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
): Promise<{ ok: boolean; hasRight: boolean; count: number }> {
  const decoded = RLP.decode(replyPayload) as unknown[]
  const accountsRaw = decoded[1] as Array<[Uint8Array, Uint8Array]>
  const proof = decoded[2] as Uint8Array[]
  if (accountsRaw.length === 0) {
    return { ok: true, hasRight: false, count: 0 }
  }
  const keys = accountsRaw.map(([h]) => h)
  const values = accountsRaw.map(([, slim]) =>
    accountBodyToRLP(accountBodyFromSlim(decodeAccountBody(slim)) as AccountBodyBytes, false),
  )
  try {
    const hasRight = await verifyMerkleRangeProof(
      stateRoot,
      keys[0]!,
      keys[keys.length - 1]!,
      keys,
      values,
      proof,
    )
    putBatch(
      accountsRaw.map(([accountHash, slim]) => ({
        accountHash,
        account: createAccountFromRLP(
          accountBodyToRLP(accountBodyFromSlim(decodeAccountBody(slim)) as AccountBodyBytes, false),
        ),
      })),
    )
    return { ok: true, hasRight, count: accountsRaw.length }
  } catch {
    return { ok: false, hasRight: false, count: 0 }
  }
}
