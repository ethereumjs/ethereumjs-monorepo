import { createBlock } from '@ethereumjs/block'
import { Mainnet, createCustomCommon } from '@ethereumjs/common'
import { equalsBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import mergeGenesisParams from '../../client/test/testdata/common/mergeTestnet.json'
import { createBlockchain } from '../src/index.js'

describe('[Blockchain]: 4444/optimistic spec', () => {
  const common = createCustomCommon(mergeGenesisParams, Mainnet, { name: 'post-merge' })
  const genesisBlock = createBlock({ header: { extraData: new Uint8Array(97) } }, { common })

  const block1 = createBlock(
    { header: { number: 1, parentHash: genesisBlock.hash(), difficulty: 100 } },
    { common, setHardfork: true },
  )
  const block2 = createBlock(
    { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
    { common, setHardfork: true },
  )
  const block3PoS = createBlock(
    { header: { number: 3, parentHash: block2.hash() } },
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
    { header: { number: 6, parentHash: block5.hash() } },
    { common, setHardfork: true },
  )
  const block7 = createBlock(
    { header: { number: 7, parentHash: block6.hash() } },
    { common, setHardfork: true },
  )
  const block8 = createBlock(
    { header: { number: 8, parentHash: block7.hash() } },
    { common, setHardfork: true },
  )

  const block51 = createBlock(
    { header: { number: 5, parentHash: block4.hash(), gasLimit: 999 } },
    { common, setHardfork: true },
  )
  const block61 = createBlock(
    { header: { number: 6, parentHash: block51.hash() } },
    { common, setHardfork: true },
  )
  const block71 = createBlock(
    { header: { number: 7, parentHash: block61.hash() } },
    { common, setHardfork: true },
  )
  const block81 = createBlock(
    { header: { number: 8, parentHash: block71.hash() } },
    { common, setHardfork: true },
  )

  it('should allow optimistic non canonical insertion unless specified explictly', async () => {
    let dbBlock
    const blockchain = await createBlockchain({ genesisBlock, common, validateBlocks: false })

    // randomly insert the blocks with gaps will be inserted as non canonical
    for (const block of [block4, block3PoS, block7, block2]) {
      // without explicit flag their insertion will fail as parent not present and canonicality
      // can't be established
      await blockchain.putBlock(block).catch((_e) => {
        undefined
      })
      dbBlock = await blockchain.getBlock(block.hash()).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'block should be inserted')

      // however the block by number should still not fetch it
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(dbBlock === undefined, true, 'block number index should not exit')
    }
    const headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(
      headBlock.header.number,
      genesisBlock.header.number,
      'head should still be at genesis',
    )
  })

  it('should allow explicit non canonical insertion', async () => {
    let dbBlock, headBlock
    const blockchain = await createBlockchain({ genesisBlock, common, validateBlocks: false })

    for (const block of [block1, block2, block3PoS, block4, block5, block6, block7, block8]) {
      await blockchain.putBlock(block, { canonical: false }).catch((_e) => {
        undefined
      })
    }

    for (const block of [block1, block2, block3PoS, block4, block5, block6, block7, block8]) {
      dbBlock = await blockchain.getBlock(block.hash()).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'block should be inserted')

      const td = await blockchain.getTotalDifficulty(block.hash()).catch((_e) => undefined)
      assert.equal(td !== undefined, true, 'block should be marked complete')

      // however the block by number should still not fetch it
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(dbBlock === undefined, true, 'block number index should not exit')
    }

    // head should not move
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(
      headBlock.header.number,
      genesisBlock.header.number,
      'head should still be at genesis',
    )

    // however normal insertion should respect canonicality updates
    for (const block of [block1, block2, block3PoS, block4, block5, block6, block7, block8]) {
      await blockchain.putBlock(block).catch((_e) => {
        undefined
      })
    }
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block8.header.number, 'head should still be at genesis')

    for (const block of [block1, block2, block3PoS, block4, block5, block6, block7, block8]) {
      // however the block by number should still not fetch it
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'block number index should not exit')
    }

    // since block61 doesn't has the parent block51 inserted yet, they will still be inserted as non
    // canonical
    for (const block of [block61, block71]) {
      await blockchain.putBlock(block).catch((_e) => {
        undefined
      })
    }
    // verify
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block8.header.number, 'head should still be at genesis')

    for (const block of [block61, block71]) {
      // however the block by number should still not fetch it
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(
        equalsBytes(dbBlock.hash(), block.hash()),
        false,
        'block number index should not exit',
      )

      const td = await blockchain.getTotalDifficulty(block.hash()).catch((_e) => undefined)
      assert.equal(td, undefined, 'block should be not be marked complete')
    }

    // insert the side chain blocks as non canonical and they should not impact the current canonical chain
    for (const block of [block51, block61, block71]) {
      await blockchain.putBlock(block, { canonical: false }).catch((_e) => {
        undefined
      })
    }

    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block8.header.number, 'head should still be at block8')
    assert.equal(
      equalsBytes(headBlock.hash(), block8.hash()),
      true,
      'head should still be at block 8',
    )

    for (const block of [block1, block2, block3PoS, block4, block5, block6, block7, block8]) {
      // however the block by number should still not fetch it
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'block number index should not exit')

      const td = await blockchain.getTotalDifficulty(block.hash()).catch((_e) => undefined)
      assert.equal(td !== undefined, true, 'block should be marked complete')
    }

    // lets make the side chain canonical
    await blockchain.putBlock(block81).catch((_e) => undefined)
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block8.header.number, 'head should still be at block8')
    assert.equal(
      equalsBytes(headBlock.hash(), block81.hash()),
      true,
      'head should still be at block 8',
    )

    // alternate chain should now be canonical
    for (const block of [block1, block2, block3PoS, block4, block51, block61, block71, block81]) {
      // however the block by number should still not fetch it
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'block number index should not exit')
      assert.equal(
        equalsBytes(dbBlock.hash(), block.hash()),
        true,
        'head should still be at block 8',
      )
    }
  })

  it('should be able to insert block optimistically', async () => {
    const blockchain = await createBlockchain({ genesisBlock, common, validateBlocks: false })
    await blockchain.putBlock(block5, { canonical: true })
    await blockchain.putBlock(block4, { canonical: true })
    await blockchain.putBlock(block3PoS, { canonical: true })

    let dbBlock = await blockchain.getBlock(block5.hash()).catch((_e) => undefined)
    assert.equal(dbBlock !== undefined, true, 'optimistic block by hash should be found')
    dbBlock = await blockchain.getBlock(block5.header.number).catch((_e) => undefined)
    assert.equal(dbBlock !== undefined, true, 'optimistic block by number should be found')

    // pow block should be allowed to inserted only in backfill mode
    await blockchain.putBlock(block2).catch((_e) => undefined)
    dbBlock = await blockchain.getBlock(block2.header.number).catch((_e) => undefined)
    assert.equal(
      dbBlock === undefined,
      true,
      'pow block should not be inserted as a non canonical block',
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

    await blockchain.putBlock(block1)
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block1.header.number, 'head should move')

    for (const block of [block2, block3PoS, block4, block5]) {
      dbBlock = await blockchain.getBlock(block.header.number).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'the forward index should still be untouched')
    }

    for (const block of [block2, block3PoS, block4, block51]) {
      await blockchain.putBlock(block).catch((_e) => undefined)
    }
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(
      headBlock.header.number,
      block5.header.number,
      'head should move along the new canonical chain',
    )
    assert.equal(
      equalsBytes(headBlock.hash(), block51.hash()),
      true,
      'head should move along the new canonical chain',
    )

    for (const blockNumber of Array.from({ length: 5 }, (_v, i) => i + 1)) {
      dbBlock = await blockchain.getBlock(blockNumber).catch((_e) => undefined)
      assert.equal(dbBlock !== undefined, true, 'the blocks should be available from index')
    }
  })

  it('should be able to specify a 4444 checkpoint and forward fill', async () => {
    const blockchain = await createBlockchain({ genesisBlock, common, validateBlocks: false })

    let dbBlock, headBlock
    await blockchain.putBlock(block2).catch((_e) => undefined)
    dbBlock = await blockchain.getBlock(block2.header.number).catch((_e) => undefined)
    assert.equal(dbBlock === undefined, true, 'pow block2 should not be inserted without parents')

    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, genesisBlock.header.number, 'head should be at genesis')

    // insert block2 as checkpoint without needing block1 by specifying parent td which could be anything
    // > difficulty of the checkpoint's parent
    await blockchain.putBlock(block2, { parentTd: 102n })
    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(
      headBlock.header.number,
      block2.header.number,
      'head should be at the new checkpoint',
    )
    dbBlock = await blockchain.getBlock(block2.header.number).catch((_e) => undefined)
    assert.equal(dbBlock !== undefined, true, 'pow block2 should be found with number')

    for (const block of [block3PoS, block4, block5, block6, block7, block8]) {
      await blockchain.putBlock(block).catch((_e) => {
        undefined
      })
    }

    headBlock = await blockchain.getCanonicalHeadBlock()
    assert.equal(headBlock.header.number, block8.header.number, 'head should be at block5')

    // block1 would not be available
    dbBlock = await blockchain.getBlock(1n).catch((_e) => {})
    assert.equal(dbBlock === undefined, true, 'block 1 should be unavailable')

    // check from 2...8 by number
    for (const blockNumber of Array.from({ length: 6 }, (_v, i) => i + 2)) {
      dbBlock = await blockchain.getBlock(blockNumber).catch((_e) => {})
      assert.equal(dbBlock !== undefined, true, 'the blocks should be available from index')
    }
  })
})
