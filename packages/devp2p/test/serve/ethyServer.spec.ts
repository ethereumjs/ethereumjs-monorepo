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
})
