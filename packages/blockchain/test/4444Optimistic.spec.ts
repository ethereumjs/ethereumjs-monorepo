import { createBlock } from '@ethereumjs/block'
import { Mainnet, createCustomCommon } from '@ethereumjs/common'
import { equalsBytes } from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import mergeGenesisParams from '../../client/test/testdata/common/mergeTestnet.json'
import { createBlockchain } from '../src/index.js'

describe('[Blockchain]: 4444/optimistic spec', () => {
  const common = createCustomCommon(mergeGenesisParams, Mainnet, { name: 'post-merge' })
  const genesisBlock = createBlock({ header: { extraData: new Uint8Array(97) } }, { common })

  const block1 = createBlock(
    { header: { number: 1, parentHash: genesisBlock.hash(), difficulty: 100 } },
    { common },
  )
  const block2 = createBlock(
    { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
    { common },
  )
  const block3PoW = createBlock(
    { header: { number: 3, parentHash: block2.hash(), difficulty: 100 } },
    { common },
  )
  const block3PoS = createBlock(
    { header: { number: 3, parentHash: block2.hash() } },
    { common, setHardfork: true },
  )
  const block4InvalidPoS = createBlock(
    { header: { number: 4, parentHash: block3PoW.hash() } },
    { common, setHardfork: true },
  )
  const block4 = createBlock(
    { header: { number: 4, parentHash: block3PoS.hash() } },
    { common, setHardfork: true },
  )
  const block5 = createBlock(
    { header: { number: 5, parentHash: block4.hash() } },
    { common, setHardfork: true },
  )
  const block6 = createBlock(
    { header: { number: 5, parentHash: block5.hash() } },
    { common, setHardfork: true },
  )
  const block7 = createBlock(
    { header: { number: 5, parentHash: block6.hash() } },
    { common, setHardfork: true },
  )
  const block8 = createBlock(
    { header: { number: 5, parentHash: block7.hash() } },
    { common, setHardfork: true },
  )

  const block51 = createBlock(
    { header: { number: 5, parentHash: block4.hash(), gasLimit: 999 } },
    { common, setHardfork: true },
  )
  const block61 = createBlock(
    { header: { number: 5, parentHash: block51.hash() } },
    { common, setHardfork: true },
  )
  const block71 = createBlock(
    { header: { number: 5, parentHash: block61.hash() } },
    { common, setHardfork: true },
  )
  const block81 = createBlock(
    { header: { number: 5, parentHash: block71.hash() } },
    { common, setHardfork: true },
  )

  it('should be able to insert block optimistically', async () => {
    const blockchain = await createBlockchain({ genesisBlock, common, validateBlocks: false })
    await blockchain.putBlock(block51)
    await blockchain.putBlock(block4)
    await blockchain.putBlock(block3PoS)

    let dbBlock = await blockchain.getBlock(block51.hash()).catch((_e) => undefined)
    assert.equal(dbBlock !== undefined, true, 'optimistic block by hash should be found')
    dbBlock = await blockchain.getBlock(block51.header.number).catch((_e) => undefined)
    assert.equal(dbBlock !== undefined, true, 'optimistic block by number should be found')

    // pow block should be allowed to inserted only in backfill mode
    await blockchain.putBlock(block2).catch((_e) => undefined)
    dbBlock = await blockchain.getBlock(block2.header.number).catch((_e) => undefined)
    assert.equal(
      dbBlock === undefined,
      true,
      'pow block should not be inserted with complete ancestor in blockchain',
    )

    await blockchain.putBlock(block2, { canonical: true })
    dbBlock = await blockchain.getBlock(block2.header.number).catch((_e) => undefined)
    assert.equal(
      dbBlock !== undefined,
      true,
      'pow block should be inserted in optimistic block if marked canonical',
    )

    let headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, genesisBlock.header.number, 'head still at genesis block')

    await blockchain.putBlock(block1, { canonical: true })
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block1.header.number, 'head should move')

    for (const block of [block2, block3PoS, block4, block5]) {
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'the forward index should still be untouched')
    }

    for (const block of [block2, block3PoS, block4, block5]) {
      await blockchain.putBlock(block).catch((_e) => undefined)
    }
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block5.header.number, 'head should move')
  })
})
