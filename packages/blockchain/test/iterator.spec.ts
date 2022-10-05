import * as tape from 'tape'

import { Blockchain } from '../src'

import { createTestDB, generateBlockchain, generateConsecutiveBlock } from './util'

import type { Block } from '@ethereumjs/block'

tape('blockchain test', (t) => {
  t.test('should iterate through 24 blocks without reorg', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    let i = 0
    let reorged = 0
    const iterated = await blockchain.iterator('test', (block: Block, reorg: boolean) => {
      if (reorg) reorged++
      if (block.hash().equals(blocks[i + 1].hash())) {
        i++
      }
    })
    st.equal(iterated, 24)
    st.equal(i, 24)
    st.equal(reorged, 0)
    st.end()
  })

  t.test('should iterate through 24 blocks with reorg', async (st) => {
    const { blockchain, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    let reorged = 0
    const reorgedBlocks: Block[] = []
    let servedReorged = 0

    const iterated = await blockchain.iterator(
      'test',
      async (block: Block, reorg: boolean) => {
        if (reorg) reorged++
        if (reorged === 0) {
          if (block.header.number === BigInt(10)) {
            // let rewrite the chain from this block onwards to cause a reorg, but first
            // we need to get the parent of this block to build a new chain onwards
            let reorgParent = await blockchain.getBlock(4)
            // Generate and add blocks from block 5 till block num 25 to reorg the chain
            for (let j = 5; j < 26; j++) {
              const reorgedBlock = generateConsecutiveBlock(reorgParent, 1, BigInt(8000001))
              reorgedBlocks.push(reorgedBlock)
              reorgParent = reorgedBlock
            }
            // we can do putBlocks even though it also aquire lock because we started this
            // with releaseLockOnCallback=true, so in this callback there are no pending locks
            await blockchain.putBlocks(reorgedBlocks)
          }
        } else {
          if (block.hash().equals(reorgedBlocks[Number(block.header.number) - 5].hash())) {
            servedReorged++
          }
        }
      },
      undefined,
      true
    )
    st.equal(reorged, 1, ' should have reorged once')
    st.equal(
      servedReorged,
      reorgedBlocks.length,
      'should have served all 21 reorged blocks with head resetting'
    )
    st.equal(iterated, 31, 'should have iterated 10 + 21 blocks in total')
    st.end()
  })

  t.test(
    'should iterate through maxBlocks blocks if maxBlocks parameter is provided',
    async (st) => {
      const { blockchain, blocks, error } = await generateBlockchain(25)
      st.error(error, 'no error')
      let i = 0
      const iterated = await blockchain.iterator(
        'test',
        (block: Block) => {
          if (block.hash().equals(blocks[i + 1].hash())) {
            i++
          }
        },
        5
      )
      st.equal(iterated, 5)
      st.equal(i, 5)
      st.end()
    }
  )

  t.test(
    'should iterate through 0 blocks in case 0 maxBlocks parameter is provided',
    async (st) => {
      const { blockchain, blocks, error } = await generateBlockchain(25)
      st.error(error, 'no error')
      let i = 0
      const iterated = await blockchain
        .iterator(
          'test',
          (block: Block) => {
            if (block.hash().equals(blocks[i + 1].hash())) {
              i++
            }
          },
          0
        )
        .catch(() => {
          st.fail('Promise cannot throw when running 0 blocks')
        })
      st.equal(iterated, 0)
      st.equal(i, 0)
      st.end()
    }
  )

  t.test('should throw on a negative maxBlocks parameter in iterator', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    let i = 0
    await blockchain
      .iterator(
        'test',
        (block: Block) => {
          if (block.hash().equals(blocks[i + 1].hash())) {
            i++
          }
        },
        -1
      )
      .catch(() => {
        st.end()
      })
    // Note: if st.end() is not called (Promise did not throw), then this test fails, as it does not end.
  })

  t.test('should test setIteratorHead method', async (st) => {
    const { blockchain, blocks, error } = await generateBlockchain(25)
    st.error(error, 'no error')

    const headBlockIndex = 5

    const headHash = blocks[headBlockIndex].hash()
    await blockchain.setIteratorHead('myHead', headHash)
    const currentHeadBlock = await blockchain.getIteratorHead('myHead')

    st.ok(headHash.equals(currentHeadBlock.hash()), 'head hash equals the provided head hash')

    let i = 0
    // check that iterator starts from this head block
    await blockchain.iterator(
      'myHead',
      (block: Block) => {
        if (block.hash().equals(blocks[headBlockIndex + 1].hash())) {
          i++
        }
      },
      5
    )

    st.equal(i, 1)

    st.end()
  })

  t.test('should catch iterator func error', async (st) => {
    const { blockchain, error } = await generateBlockchain(25)
    st.error(error, 'no error')
    try {
      await blockchain.iterator('error', () => {
        throw new Error('iterator func error')
      })
    } catch (error: any) {
      st.ok(error)
      st.equal(error.message, 'iterator func error', 'should return correct error')
      st.end()
    }
  })

  t.test('should not call iterator function in an empty blockchain', async (st) => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })

    await blockchain.iterator('test', () => {
      st.fail('should not call iterator function')
    })

    st.pass('should finish iterating')
    st.end()
  })

  t.test('should get heads', async (st) => {
    const [db, genesis] = await createTestDB()
    const blockchain = await Blockchain.create({ db, genesisBlock: genesis })
    const head = await blockchain.getIteratorHead()
    if (typeof genesis !== 'undefined') {
      st.ok(head.hash().equals(genesis.hash()), 'should get head')
      st.equal(
        (blockchain as any)._heads['head0'].toString('hex'),
        'abcd',
        'should get state root heads'
      )
      st.end()
    } else {
      st.fail()
    }
  })
})
