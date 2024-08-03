import { createBlockFromBlockData } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { KeyEncoding, ValueEncoding, bytesToHex, equalsBytes, utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { Chain } from '../src/chain.js'
import { Skeleton } from '../src/skeleton.js'

import type { ChainConfig } from '../src/chain.js'
import type { LevelDB } from '../src/level.js'

const common = new Common({ chain: 1 })
const block49 = createBlockFromBlockData({ header: { number: 49 } }, { common })
const block50 = createBlockFromBlockData(
  { header: { number: 50, parentHash: block49.hash() } },
  { common }
)
const block51 = createBlockFromBlockData(
  { header: { number: 51, parentHash: block50.hash() } },
  { common }
)

const syncConfig = {
  syncedStateRemovalPeriod: 60000,
  engineParentLookupMaxDepth: 128,
  snapTransitionSafeDepth: 5n,
  skeletonSubchainMergeMinimum: 1000,
  numBlocksPerIteration: 100,
  skeletonFillCanonicalBackStep: 100,
  maxPerRequest: 100,
}

describe('[Skeleton]/ startup scenarios ', () => {
  it('should test blockchain DB is initialized', async () => {
    const config: ChainConfig = {
      ...syncConfig,
      chainCommon: common,
    }
    const chain = await Chain.create({ config })

    const db = chain.chainDB as LevelDB
    const testKey = 'name'
    const testValue = 'test'
    await db.put(testKey, testValue, {
      keyEncoding: KeyEncoding.String,
      valueEncoding: ValueEncoding.String,
    })

    const value = await db.get(testKey, {
      keyEncoding: KeyEncoding.String,
      valueEncoding: ValueEncoding.String,
    })
    assert.equal(value, testValue, 'read value matches written value')
  })

  it('construct skeleton and test basic put/get block ops', async () => {
    const config: ChainConfig = {
      syncedStateRemovalPeriod: 60000,
      engineParentLookupMaxDepth: 128,
      snapTransitionSafeDepth: 5n,
      skeletonSubchainMergeMinimum: 1000,
      numBlocksPerIteration: 100,
      skeletonFillCanonicalBackStep: 100,
      maxPerRequest: 100,
      chainCommon: common,
    }
    const chain = await Chain.create({ config })
    const skeleton = new Skeleton({ chain })
    assert.equal(chain.opened, false, 'chain is not started')
    await skeleton.open()
    assert.equal(chain.opened, true, 'chain is opened by skeleton')

    await skeleton['putBlock'](block51)
    const skeletonBlock = await skeleton.getBlock(block51.header.number)
    assert.equal(
      equalsBytes(skeletonBlock.hash(), block51.hash()),
      true,
      'same block should be retrived'
    )
  })
})
