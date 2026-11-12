import { createMerkleProof } from '@ethereumjs/mpt'
import { accountToBinaryAccount } from '@ethereumjs/util'

import { networkGenesisHash } from '../net/genesisStatus.ts'
import { SnapPivotStore } from '../persist/snapStore.ts'
import { createSnapBuckets, syncBucketCursorFields } from '../spine/buckets.ts'
import type { SnapBucket } from '../spine/types.ts'
import { SyntheticSnapPeer } from './syntheticPeer.ts'

export type SeedDemoStateResult = {
  pivotBlock: bigint
  stateRoot: Uint8Array
  accountsDir: string
  accountCount: number
}

/** Synthetic 16-bucket EOA pivot with proof sidecars for ETHY/0 loopback (WP-06c). */
export async function seedDemoEthyPivot(opts: {
  dataDir: string
  network: string
  chainId: bigint
}): Promise<SeedDemoStateResult> {
  const peer = await SyntheticSnapPeer.create(1)
  const store = SnapPivotStore.open({
    dataDir: opts.dataDir,
    network: opts.network,
    chainId: opts.chainId,
    genesisHash: networkGenesisHash(opts.network),
    enabled: true,
  })
  const pivotBlock = 100n
  const pivotHash = new Uint8Array(32)
  pivotHash[31] = 0x64
  store.activatePivot({
    blockNumber: pivotBlock,
    blockHash: pivotHash,
    stateRoot: peer.rootHash,
  })
  const buckets = createSnapBuckets()
  const trie = peer.merkleTrie()
  let accountCount = 0
  for (let nibble = 0; nibble < 16; nibble++) {
    const rows = peer.accounts.filter((a) => a.accountHash[0]! >> 4 === nibble)
    if (rows.length === 0) {
      markBucketDone(buckets[nibble]!, 0)
      continue
    }
    const slab = new Uint8Array(rows.length * 136)
    for (let i = 0; i < rows.length; i++) {
      const off = i * 136
      slab.set(rows[i]!.accountHash, off)
      accountToBinaryAccount(rows[i]!.account, slab, off + 32)
    }
    const origin = nibble === 0 ? new Uint8Array(buckets[0]!.startHash) : rows[0]!.accountHash
    const nextNibbleFirst =
      nibble === 0 ? peer.accounts.find((a) => a.accountHash[0]! >> 4 === 1) : undefined
    const last =
      nextNibbleFirst !== undefined
        ? nextNibbleFirst.accountHash
        : rows[rows.length - 1]!.accountHash
    const proofNodes = [
      ...(await createMerkleProof(trie, origin)),
      ...(await createMerkleProof(trie, last)),
    ]
    await store.appendVerifiedSlabAsync(nibble, slab, buckets, 'prefix', {
      slabByteOffset: 0,
      slabByteLength: slab.length,
      originHash: origin,
      lastHash: last,
      hasRight: 1,
      chunkStateRoot: peer.rootHash,
      chunkBlockNumber: pivotBlock,
      proofNodes,
    })
    accountCount += rows.length
    markBucketDone(buckets[nibble]!, rows.length)
  }
  const mask = store.ethyBucketsBitmaskFromBuckets(buckets)
  store.flushBuckets(buckets)
  store.markBaseSyncComplete(pivotBlock)
  store.persistEthyBucketsBitmask(mask)
  const accountsDir = store.activePivotAccountsDir()
  if (accountsDir === undefined) {
    throw new Error('seedDemoEthyPivot: accounts dir missing after activate')
  }
  return {
    pivotBlock,
    stateRoot: peer.rootHash,
    accountsDir,
    accountCount,
  }
}

function markBucketDone(bucket: SnapBucket, loaded: number): void {
  bucket.accountsLoaded = loaded
  bucket.status = 'done'
  syncBucketCursorFields(bucket)
}
