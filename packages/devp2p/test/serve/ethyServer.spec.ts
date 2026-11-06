import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { MerklePatriciaTrie, createMerkleProof, verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import {
  MapDB,
  accountToBinaryAccount,
  bigIntToUnpaddedBytes,
  binaryAccountToRLP,
  createAccount,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

const ETHY_PROOF_SIDECAR_MAGIC = new Uint8Array([0x45, 0x54, 0x48, 0x59, 0x50, 0x52, 0x46, 0x31])

function appendProofSidecarRecord(
  filePath: string,
  fields: {
    slabByteOffset: number
    slabByteLength: number
    originHash: Uint8Array
    lastHash: Uint8Array
    hasRight: number
    chunkStateRoot: Uint8Array
    chunkBlockNumber: bigint
    proofNodes: Uint8Array[]
  },
): void {
  const body = RLP.encode([
    intToUnpaddedBytes(fields.slabByteOffset),
    intToUnpaddedBytes(fields.slabByteLength),
    fields.originHash,
    fields.lastHash,
    intToUnpaddedBytes(fields.hasRight),
    fields.chunkStateRoot,
    bigIntToUnpaddedBytes(fields.chunkBlockNumber),
    fields.proofNodes,
  ] as never)
  const len = new Uint8Array(4)
  new DataView(len.buffer).setUint32(0, body.length, false)
  const needMagic = !fs.existsSync(filePath) || fs.statSync(filePath).size === 0
  const fd = fs.openSync(filePath, 'a')
  try {
    if (needMagic) fs.writeSync(fd, ETHY_PROOF_SIDECAR_MAGIC)
    fs.writeSync(fd, len)
    fs.writeSync(fd, body)
  } finally {
    fs.closeSync(fd)
  }
}

import { EthyMessageCodes } from '../../src/protocol/ethy/codes.ts'
import { EthyChunkStore } from '../../src/serve/ethyChunkStore.ts'
import { tryServeEthyGet } from '../../src/serve/ethyServer.ts'
import { RollingBlockStore } from '../../src/serve/rollingBlockStore.ts'

describe('[Devp2p/ETHY]: worker serving', () => {
  it('tryServeEthyGet() serves PROVEN_ACCOUNT_CHUNK for verifyMerkleRangeProof', async () => {
    const accountKey = new Uint8Array(32)
    accountKey[31] = 0x42
    const acct = createAccount({ nonce: 1n, balance: 1000n })
    const slab = new Uint8Array(136)
    slab.set(accountKey, 0)
    accountToBinaryAccount(acct, slab, 32)
    const valueRlp = binaryAccountToRLP(slab, 32)
    const trie = new MerklePatriciaTrie({ db: new MapDB(), useKeyHashing: false })
    await trie.put(accountKey, valueRlp)
    const chunkStateRoot = trie.root()
    const proofNodes = await createMerkleProof(trie, accountKey)

    const chunks = new EthyChunkStore()
    chunks.put({
      bucketIndex: 0,
      originHash: accountKey,
      lastHash: accountKey,
      hasRight: 0,
      chunkStateRoot,
      chunkBlockNumber: 1n,
      binaryAccountsSlab: slab,
      proofNodes,
    })

    const req = RLP.encode([bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(0), accountKey])
    const served = tryServeEthyGet(
      chunks,
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_ACCOUNT_CHUNK',
      RLP.decode(req),
    )
    assert.notEqual(served, undefined)
    assert.equal(served!.code, EthyMessageCodes.PROVEN_ACCOUNT_CHUNK)
    assert.equal(served!.metric, 'chunk')

    const replySlab = served!.rlp[7] as Uint8Array
    const replyProof = served!.rlp[8] as Uint8Array[]
    const replyRoot = served!.rlp[5] as Uint8Array
    assert.isTrue(equalsBytes(replySlab, slab))
    assert.isTrue(equalsBytes(replyRoot, chunkStateRoot))
    await verifyMerkleRangeProof(
      replyRoot,
      accountKey,
      accountKey,
      [accountKey],
      [binaryAccountToRLP(replySlab, 32)],
      replyProof,
    )
  })

  it('tryServeEthyGet() serves chunk loaded from disk proof sidecar', async () => {
    const accountKey = new Uint8Array(32)
    accountKey[31] = 0x42
    const acct = createAccount({ nonce: 1n, balance: 1000n })
    const slab = new Uint8Array(136)
    slab.set(accountKey, 0)
    accountToBinaryAccount(acct, slab, 32)
    const valueRlp = binaryAccountToRLP(slab, 32)
    const trie = new MerklePatriciaTrie({ db: new MapDB(), useKeyHashing: false })
    await trie.put(accountKey, valueRlp)
    const chunkStateRoot = trie.root()
    const proofNodes = await createMerkleProof(trie, accountKey)

    const accountsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-disk-serve-'))
    const journalPath = path.join(accountsDir, '0.bin')
    fs.writeFileSync(journalPath, slab)
    appendProofSidecarRecord(path.join(accountsDir, '0.proof.idx'), {
      slabByteOffset: 0,
      slabByteLength: slab.length,
      originHash: accountKey,
      lastHash: accountKey,
      hasRight: 0,
      chunkStateRoot,
      chunkBlockNumber: 1n,
      proofNodes,
    })

    const chunks = new EthyChunkStore()
    chunks.setPivotAccountsDir(accountsDir)

    const req = RLP.encode([bigIntToUnpaddedBytes(1n), intToUnpaddedBytes(0), accountKey])
    const served = tryServeEthyGet(
      chunks,
      new RollingBlockStore(),
      [],
      new Uint8Array(64),
      undefined,
      'GET_PROVEN_ACCOUNT_CHUNK',
      RLP.decode(req),
    )
    assert.notEqual(served, undefined)
    assert.equal(served!.code, EthyMessageCodes.PROVEN_ACCOUNT_CHUNK)
    const replySlab = served!.rlp[7] as Uint8Array
    assert.isTrue(equalsBytes(replySlab, slab))
  })
})
