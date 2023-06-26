import { Block, BlockHeader } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { equalsBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import { MemoryLevel } from 'memory-level'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { getLogger } from '../../src/logging'
import { Skeleton, errReorgDenied, errSyncMerged } from '../../src/sync/skeleton'
import { short } from '../../src/util'
import { wait } from '../integration/util'
import * as genesisJSON from '../testdata/geth-genesis/post-merge.json'
type Subchain = {
  head: bigint
  tail: bigint
}

const common = new Common({ chain: 1 })
const block49 = Block.fromBlockData({ header: { number: 49 } }, { common })
const block49B = Block.fromBlockData(
  { header: { number: 49, extraData: utf8ToBytes('B') } },
  { common }
)
const block50 = Block.fromBlockData(
  { header: { number: 50, parentHash: block49.hash() } },
  { common }
)
const block50B = Block.fromBlockData(
  { header: { number: 50, parentHash: block49.hash(), gasLimit: 999 } },
  { common }
)
const block51 = Block.fromBlockData(
  { header: { number: 51, parentHash: block50.hash() } },
  { common }
)

tape('[Skeleton] / initSync', async (t) => {
  // Tests various sync initializations based on previous leftovers in the database
  // and announced heads.
  interface TestCase {
    name: string
    blocks?: Block[] /** Database content (besides the genesis) */
    oldState?: Subchain[] /** Old sync state with various interrupted subchains */
    head: Block /** New head header to announce to reorg to */
    newState: Subchain[] /** Expected sync state after the reorg */
  }
  const testCases: TestCase[] = [
    // Completely empty database with only the genesis set. The sync is expected
    // to create a single subchain with the requested head.
    {
      name: 'Completely empty database with only the genesis set',
      head: block50,
      newState: [{ head: BigInt(50), tail: BigInt(50) }],
    },
    // Empty database with only the genesis set with a leftover empty sync
    // progress. This is a synthetic case, just for the sake of covering things.
    {
      name: 'Empty database with only the genesis set with a leftover empty sync',
      oldState: [],
      head: block50,
      newState: [{ head: BigInt(50), tail: BigInt(50) }],
    },
    // A single leftover subchain is present, older than the new head. The
    // old subchain should be left as is and a new one appended to the sync
    // status.
    {
      name: 'A single leftover subchain is present, older than the new head',
      oldState: [{ head: BigInt(10), tail: BigInt(5) }],
      head: block50,
      newState: [
        { head: BigInt(50), tail: BigInt(50) },
        { head: BigInt(10), tail: BigInt(5) },
      ],
    },
    // Multiple leftover subchains are present, older than the new head. The
    // old subchains should be left as is and a new one appended to the sync
    // status.
    {
      name: 'Multiple leftover subchains are present, older than the new head',
      oldState: [
        { head: BigInt(20), tail: BigInt(15) },
        { head: BigInt(10), tail: BigInt(5) },
      ],
      head: block50,
      newState: [
        { head: BigInt(50), tail: BigInt(50) },
        { head: BigInt(20), tail: BigInt(15) },
        { head: BigInt(10), tail: BigInt(5) },
      ],
    },
    // A single leftover subchain is present, newer than the new head. The
    // newer subchain should be deleted and a fresh one created for the head.
    {
      name: 'A single leftover subchain is present, newer than the new head.',
      oldState: [{ head: BigInt(65), tail: BigInt(60) }],
      head: block50,
      newState: [{ head: BigInt(50), tail: BigInt(50) }],
    },
    // Multiple leftover subchain is present, newer than the new head. The
    // newer subchains should be deleted and a fresh one created for the head.
    {
      name: 'Multiple leftover subchain is present, newer than the new head',
      oldState: [
        { head: BigInt(75), tail: BigInt(70) },
        { head: BigInt(65), tail: BigInt(60) },
      ],
      head: block50,
      newState: [{ head: BigInt(50), tail: BigInt(50) }],
    },
    // Two leftover subchains are present, one fully older and one fully
    // newer than the announced head. The head should delete the newer one,
    // keeping the older one.
    {
      name: 'Two leftover subchains are present, one fully older and one fully newer',
      oldState: [
        { head: BigInt(65), tail: BigInt(60) },
        { head: BigInt(10), tail: BigInt(5) },
      ],
      head: block50,
      newState: [
        { head: BigInt(50), tail: BigInt(50) },
        { head: BigInt(10), tail: BigInt(5) },
      ],
    },
    // Multiple leftover subchains are present, some fully older and some
    // fully newer than the announced head. The head should delete the newer
    // ones, keeping the older ones.
    {
      name: 'Multiple leftover subchains are present, some fully older and some fully newer',
      oldState: [
        { head: BigInt(75), tail: BigInt(70) },
        { head: BigInt(65), tail: BigInt(60) },
        { head: BigInt(20), tail: BigInt(15) },
        { head: BigInt(10), tail: BigInt(5) },
      ],
      head: block50,
      newState: [
        { head: BigInt(50), tail: BigInt(50) },
        { head: BigInt(20), tail: BigInt(15) },
        { head: BigInt(10), tail: BigInt(5) },
      ],
    },
    // A single leftover subchain is present and the new head is extending
    // it with one more header. We expect the subchain head to be pushed
    // forward.
    {
      name: 'A single leftover subchain is present and the new head is extending',
      blocks: [block49],
      oldState: [{ head: BigInt(49), tail: BigInt(5) }],
      head: block50,
      newState: [{ head: BigInt(50), tail: BigInt(5) }],
    },
    // A single leftover subchain is present. A new head is announced that
    // links into the middle of it, correctly anchoring into an existing
    // header. We expect the old subchain to be truncated and extended with
    // the new head.
    {
      name: 'Duplicate announcement should not modify subchain',
      blocks: [block49, block50],
      oldState: [{ head: BigInt(100), tail: BigInt(5) }],
      head: block50,
      newState: [{ head: BigInt(100), tail: BigInt(5) }],
    },
    // A single leftover subchain is present. A new head is announced that
    // links into the middle of it, correctly anchoring into an existing
    // header. We expect the old subchain to be truncated and extended with
    // the new head.
    {
      name: 'A new alternate head is announced in the middle should truncate subchain',
      blocks: [block49, block50],
      oldState: [{ head: BigInt(100), tail: BigInt(5) }],
      head: block50B,
      newState: [{ head: BigInt(50), tail: BigInt(5) }],
    },
    // A single leftover subchain is present. A new head is announced that
    // links into the middle of it, but does not anchor into an existing
    // header. We expect the old subchain to be truncated and a new chain
    // be created for the dangling head.
    {
      name: 'The old subchain to be truncated and a new chain be created for the dangling head',
      blocks: [block49B],
      oldState: [{ head: BigInt(100), tail: BigInt(5) }],
      head: block50,
      newState: [
        { head: BigInt(50), tail: BigInt(50) },
        { head: BigInt(49), tail: BigInt(5) },
      ],
    },
  ]
  for (const [testCaseIndex, testCase] of testCases.entries()) {
    t.test(`${testCase.name}`, async (st) => {
      const config = new Config({
        common,
        transports: [],
        logger: getLogger({ loglevel: 'debug' }),
        accountCache: 10000,
        storageCache: 1000,
      })
      const chain = await Chain.create({ config })
      const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
      await skeleton.open()

      for (const block of testCase.blocks ?? []) {
        await (skeleton as any).putBlock(block)
      }

      if (testCase.oldState) {
        ;(skeleton as any).status.progress.subchains = testCase.oldState
      }

      await skeleton.initSync(testCase.head)

      const { progress } = (skeleton as any).status
      if (progress.subchains.length !== testCase.newState.length) {
        st.fail(
          `test ${testCaseIndex}: subchain count mismatch: have ${progress.subchains.length}, want ${testCase.newState.length}`
        )
      }
      for (const [i, subchain] of progress.subchains.entries()) {
        if (subchain.head !== testCase.newState[i].head) {
          st.fail(
            `test ${testCaseIndex}: subchain head mismatch: have ${subchain.head}, want ${testCase.newState[i].head}`
          )
        } else if (subchain.tail !== testCase.newState[i].tail) {
          st.fail(
            `test ${testCaseIndex}: subchain tail mismatch: have ${subchain.tail}, want ${testCase.newState[i].tail}`
          )
        } else {
          st.pass(`test ${testCaseIndex}: subchain[${i}] matched`)
        }
      }
    })
  }
})
tape('[Skeleton] / setHead', async (t) => {
  // Tests that a running skeleton sync can be extended with properly linked up
  // headers but not with side chains.
  interface TestCase {
    name: string
    blocks?: Block[] /** Database content (besides the genesis) */
    head: Block /** New head header to announce to reorg to */
    extend: Block /** New head header to announce to extend with */
    force?: boolean /** To force set head not just to extend */
    newState: Subchain[] /** Expected sync state after the reorg */
    err?: Error /** Whether extension succeeds or not */
  }
  const testCases: TestCase[] = [
    // Initialize a sync and try to extend it with a subsequent block.
    {
      name: 'Initialize a sync and try to extend it with a subsequent block',
      head: block49,
      extend: block50,
      force: true,
      newState: [{ head: BigInt(50), tail: BigInt(49) }],
    },
    // Initialize a sync and try to extend it with the existing head block.
    {
      name: 'Initialize a sync and try to extend it with the existing head block',
      blocks: [block49],
      head: block49,
      extend: block49,
      newState: [{ head: BigInt(49), tail: BigInt(49) }],
    },
    // Initialize a sync and try to extend it with a sibling block.
    {
      name: 'Initialize a sync and try to extend it with a sibling block',
      head: block49,
      extend: block49B,
      newState: [{ head: BigInt(49), tail: BigInt(49) }],
      err: errReorgDenied,
    },
    // Initialize a sync and try to extend it with a number-wise sequential
    // header, but a hash wise non-linking one.
    {
      name: 'Initialize a sync and try to extend it with a number-wise sequential alternate block',
      head: block49B,
      extend: block50,
      newState: [{ head: BigInt(49), tail: BigInt(49) }],
      err: errReorgDenied,
    },
    // Initialize a sync and try to extend it with a non-linking future block.
    {
      name: 'Initialize a sync and try to extend it with a non-linking future block',
      head: block49,
      extend: block51,
      newState: [{ head: BigInt(49), tail: BigInt(49) }],
      err: errReorgDenied,
    },
    // Initialize a sync and try to extend it with a past canonical block.
    {
      name: 'Initialize a sync and try to extend it with a past canonical block',
      head: block50,
      extend: block49,
      newState: [{ head: BigInt(50), tail: BigInt(50) }],
      err: errReorgDenied,
    },
    // Initialize a sync and try to extend it with a past sidechain block.
    {
      name: 'Initialize a sync and try to extend it with a past sidechain block',
      head: block50,
      extend: block49B,
      newState: [{ head: BigInt(50), tail: BigInt(50) }],
      err: errReorgDenied,
    },
  ]
  for (const [testCaseIndex, testCase] of testCases.entries()) {
    t.test(`${testCase.name}`, async (st) => {
      const config = new Config({
        common,
        transports: [],
        logger: getLogger({ loglevel: 'debug' }),
        accountCache: 10000,
        storageCache: 1000,
      })
      const chain = await Chain.create({ config })
      const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
      await skeleton.open()
      for (const block of testCase.blocks ?? []) {
        await (skeleton as any).putBlock(block)
      }

      await skeleton.initSync(testCase.head)

      try {
        await skeleton.setHead(testCase.extend, testCase.force ?? false, false, true)
        if (testCase.err) {
          st.fail(`test ${testCaseIndex}: should have failed`)
        } else {
          st.pass(`test ${testCaseIndex}: successfully passed`)
        }
      } catch (error: any) {
        if (
          typeof testCase.err?.message === 'string' &&
          (error.message as string).includes(testCase.err.message)
        ) {
          st.pass(`test ${testCaseIndex}: passed with correct error`)
        } else {
          st.fail(
            `test ${testCaseIndex}: received wrong error expected=${testCase.err?.message} actual=${error.message}`
          )
        }
      }

      const { progress } = (skeleton as any).status
      if (progress.subchains.length !== testCase.newState.length) {
        st.fail(
          `test ${testCaseIndex}: subchain count mismatch: have ${progress.subchains.length}, want ${testCase.newState.length}`
        )
      }
      for (const [i, subchain] of progress.subchains.entries()) {
        if (subchain.head !== testCase.newState[i].head) {
          st.fail(
            `test ${testCaseIndex}: subchain head mismatch: have ${subchain.head}, want ${testCase.newState[i].head}`
          )
        } else if (subchain.tail !== testCase.newState[i].tail) {
          st.fail(
            `test ${testCaseIndex}: subchain tail mismatch: have ${subchain.tail}, want ${testCase.newState[i].tail}`
          )
        } else {
          st.pass(`test ${testCaseIndex}: subchain[${i}] matched`)
        }
      }
    })
  }

  t.test(`skeleton init should throw error if merge not set`, async (st) => {
    st.plan(1)
    const genesis = {
      ...genesisJSON,
      config: {
        ...genesisJSON.config,
        // skip the merge hardfork
        terminalTotalDifficulty: undefined,
        clique: undefined,
        ethash: {},
      },
      extraData: '0x00000000000000000',
      difficulty: '0x1',
    }
    const common = Common.fromGethGenesis(genesis, { chain: 'merge-not-set' })
    const config = new Config({ common, transports: [] })
    const chain = await Chain.create({ config })
    ;(chain.blockchain as any)._validateBlocks = false
    try {
      new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    } catch (e) {
      st.pass(`Skeleton init should error if merge not set`)
    }
    st.end()
  })

  t.test('should init/setHead properly from genesis', async (st) => {
    const config = new Config({ common, transports: [] })
    const chain = await Chain.create({ config })
    ;(chain.blockchain as any)._validateBlocks = false
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    await chain.open()

    const genesis = await chain.getBlock(BigInt(0))
    const block1 = Block.fromBlockData(
      { header: { number: 1, parentHash: genesis.hash(), difficulty: 100 } },
      { common, setHardfork: true }
    )
    const block2 = Block.fromBlockData(
      { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
      { common, setHardfork: true }
    )
    const block3 = Block.fromBlockData(
      { header: { number: 3, difficulty: 100 } },
      { common, setHardfork: true }
    )

    await skeleton.open()
    let reorg

    reorg = await skeleton.initSync(genesis)
    st.equal(reorg, false, 'should not reorg on genesis init')

    reorg = await skeleton.setHead(genesis, false)
    st.equal(reorg, false, 'should not reorg on genesis announcement')

    reorg = await skeleton.setHead(genesis, true)
    st.equal(reorg, false, 'should not reorg on genesis setHead')

    st.equal(
      (skeleton as any).status.progress.subchains.length,
      0,
      'no subchain should have been created'
    )
    try {
      await skeleton.putBlocks([block1])
      st.fail('should have not allowed putBlocks since no subchain set')
    } catch (_e) {
      st.pass('should not allow putBlocks since no subchain set')
    }
    st.equal(chain.blocks.height, BigInt(0), 'canonical height should be at genesis')

    reorg = await skeleton.setHead(block1, false)
    st.equal(reorg, false, 'should not reorg on valid first block')
    st.equal(
      (skeleton as any).status.progress.subchains.length,
      0,
      'no subchain should have been created'
    )
    reorg = await skeleton.setHead(block1, true)
    st.equal(reorg, false, 'should not reorg on valid first block')
    st.equal(
      (skeleton as any).status.progress.subchains.length,
      1,
      'subchain should have been created'
    )
    st.equal(
      (skeleton as any).status.progress.subchains[0].head,
      BigInt(1),
      'head should be set to first block'
    )
    st.equal(skeleton.isLinked(), true, 'subchain status should be linked')

    reorg = await skeleton.setHead(block2, true)
    st.equal(reorg, false, 'should not reorg on valid second block')
    st.equal((skeleton as any).status.progress.subchains.length, 1, 'subchain should be same')
    st.equal(
      (skeleton as any).status.progress.subchains[0].head,
      BigInt(2),
      'head should be set to first block'
    )
    st.equal(skeleton.isLinked(), true, 'subchain status should stay linked')

    reorg = await skeleton.setHead(block3, false)
    st.equal(reorg, true, 'should not extend on invalid third block')
    // since its not a forced update so shouldn't affect subchain status
    st.equal((skeleton as any).status.progress.subchains.length, 1, 'subchain should be same')
    st.equal(
      (skeleton as any).status.progress.subchains[0].head,
      BigInt(2),
      'head should be set to second block'
    )
    st.equal(skeleton.isLinked(), true, 'subchain status should stay linked')

    reorg = await skeleton.setHead(block3, true)
    st.equal(reorg, true, 'should not extend on invalid third block')
    // since its not a forced update so shouldn't affect subchain status
    st.equal(
      (skeleton as any).status.progress.subchains.length,
      2,
      'new subchain should be created'
    )
    st.equal(
      (skeleton as any).status.progress.subchains[0].head,
      BigInt(3),
      'head should be set to third block'
    )
    st.equal(skeleton.isLinked(), false, 'subchain status should not be linked anymore')
  })

  t.test('should fill the canonical chain after being linked to genesis', async (st) => {
    const config = new Config({ common, transports: [] })
    const chain = await Chain.create({ config })
    ;(chain.blockchain as any)._validateBlocks = false
    const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
    await chain.open()

    const genesis = await chain.getBlock(BigInt(0))
    const block1 = Block.fromBlockData(
      { header: { number: 1, parentHash: genesis.hash(), difficulty: 100 } },
      { common, setHardfork: true }
    )
    const block2 = Block.fromBlockData(
      { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
      { common, setHardfork: true }
    )
    const block3 = Block.fromBlockData(
      { header: { number: 3, parentHash: block2.hash(), difficulty: 100 } },
      { common, setHardfork: true }
    )
    const block4 = Block.fromBlockData(
      { header: { number: 4, parentHash: block3.hash(), difficulty: 100 } },
      { common, setHardfork: true }
    )
    const block5 = Block.fromBlockData(
      { header: { number: 5, parentHash: block4.hash(), difficulty: 100 } },
      { common, setHardfork: true }
    )

    await skeleton.open()

    await skeleton.initSync(block4)
    await skeleton.putBlocks([block3, block2])
    st.equal(chain.blocks.height, BigInt(0), 'canonical height should be at genesis')
    await skeleton.putBlocks([block1])
    await wait(200)
    st.equal(chain.blocks.height, BigInt(4), 'canonical height should update after being linked')
    await skeleton.setHead(block5, false)
    await wait(200)
    st.equal(
      chain.blocks.height,
      BigInt(4),
      'canonical height should not change when setHead is set with force=false'
    )
    await skeleton.setHead(block5, true)
    await wait(200)
    st.equal(
      chain.blocks.height,
      BigInt(5),
      'canonical height should change when setHead is set with force=true'
    )

    for (const block of [block1, block2, block3, block4, block5]) {
      st.equal(
        (await skeleton.getBlock(block.header.number, true))?.hash(),
        undefined,
        `skeleton block number=${block.header.number} should be cleaned up after filling canonical chain`
      )
      st.equal(
        (await skeleton.getBlockByHash(block.hash(), true))?.hash(),
        undefined,
        `skeleton block hash=${short(
          block.hash()
        )} should be cleaned up after filling canonical chain`
      )
    }
  })

  t.test(
    'should fill the canonical chain after being linked to a canonical block past genesis',
    async (st) => {
      const config = new Config({ common, transports: [] })
      const chain = await Chain.create({ config })
      ;(chain.blockchain as any)._validateBlocks = false

      const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
      await chain.open()
      await skeleton.open()

      const genesis = await chain.getBlock(BigInt(0))

      const block1 = Block.fromBlockData(
        { header: { number: 1, parentHash: genesis.hash(), difficulty: 100 } },
        { common, setHardfork: true }
      )
      const block2 = Block.fromBlockData(
        { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
        { common, setHardfork: true }
      )
      const block3 = Block.fromBlockData(
        { header: { number: 3, parentHash: block2.hash(), difficulty: 100 } },
        { common, setHardfork: true }
      )
      const block4 = Block.fromBlockData(
        { header: { number: 4, parentHash: block3.hash(), difficulty: 100 } },
        { common, setHardfork: true }
      )
      const block5 = Block.fromBlockData(
        { header: { number: 5, parentHash: block4.hash(), difficulty: 100 } },
        { common, setHardfork: true }
      )

      await chain.putBlocks([block1, block2])
      await skeleton.initSync(block4)
      st.equal(chain.blocks.height, BigInt(2), 'canonical height should be at block 2')
      await skeleton.putBlocks([block3])
      await wait(200)
      st.equal(chain.blocks.height, BigInt(4), 'canonical height should update after being linked')
      await skeleton.setHead(block5, false)
      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(4),
        'canonical height should not change when setHead with force=false'
      )
      await skeleton.setHead(block5, true)
      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(5),
        'canonical height should change when setHead with force=true'
      )
      for (const block of [block3, block4, block5]) {
        st.equal(
          (await skeleton.getBlock(block.header.number, true))?.hash(),
          undefined,
          `skeleton block number=${block.header.number} should be cleaned up after filling canonical chain`
        )
        st.equal(
          (await skeleton.getBlockByHash(block.hash(), true))?.hash(),
          undefined,
          `skeleton block hash=${short(
            block.hash()
          )} should be cleaned up after filling canonical chain`
        )
      }
    }
  )

  t.test(
    'should abort filling the canonical chain if the terminal block is invalid',
    async (st) => {
      const genesis = {
        ...genesisJSON,
        config: {
          ...genesisJSON.config,
          terminalTotalDifficulty: 200,
          clique: undefined,
          ethash: {},
        },
        extraData: '0x00000000000000000',
        difficulty: '0x1',
      }
      const common = Common.fromGethGenesis(genesis, { chain: 'post-merge' })
      common.setHardforkBy({ blockNumber: BigInt(0), td: BigInt(0) })
      const config = new Config({
        transports: [],
        common,
        accountCache: 10000,
        storageCache: 1000,
      })
      const chain = await Chain.create({ config })
      ;(chain.blockchain as any)._validateBlocks = false
      await chain.open()
      const genesisBlock = await chain.getBlock(BigInt(0))

      const block1 = Block.fromBlockData(
        { header: { number: 1, parentHash: genesisBlock.hash(), difficulty: 100 } },
        { common }
      )
      const block2 = Block.fromBlockData(
        { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
        { common }
      )
      const block3PoW = Block.fromBlockData(
        { header: { number: 3, parentHash: block2.hash(), difficulty: 100 } },
        { common }
      )
      const block3PoS = Block.fromBlockData(
        { header: { number: 3, parentHash: block2.hash(), difficulty: 0 } },
        { common, setHardfork: BigInt(200) }
      )
      const block4InvalidPoS = Block.fromBlockData(
        { header: { number: 4, parentHash: block3PoW.hash(), difficulty: 0 } },
        { common, setHardfork: BigInt(200) }
      )
      const block4PoS = Block.fromBlockData(
        { header: { number: 4, parentHash: block3PoS.hash(), difficulty: 0 } },
        { common, setHardfork: BigInt(200) }
      )
      const block5 = Block.fromBlockData(
        { header: { number: 5, parentHash: block4PoS.hash(), difficulty: 0 } },
        { common, setHardfork: BigInt(200) }
      )

      const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
      await skeleton.open()

      await skeleton.initSync(block4InvalidPoS)
      await skeleton.putBlocks([block3PoW, block2])
      st.equal(chain.blocks.height, BigInt(0), 'canonical height should be at genesis')
      await skeleton.putBlocks([block1])
      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(2),
        'canonical height should stop at block 2 (valid terminal block), since block 3 is invalid (past ttd)'
      )
      try {
        await skeleton.setHead(block5, false)
      } catch (error: any) {
        if (error !== errReorgDenied) {
          t.fail(error)
        }
      }
      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(2),
        'canonical height should not change when setHead is set with force=false'
      )
      // Put correct chain
      await skeleton.initSync(block4PoS)
      try {
        await skeleton.putBlocks([block3PoS])
      } catch (error: any) {
        if (error !== errSyncMerged) {
          t.fail(error)
        }
      }
      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(4),
        'canonical height should now be at head with correct chain'
      )
      const latestHash = chain.headers.latest?.hash()
      st.ok(
        latestHash !== undefined && equalsBytes(latestHash, block4PoS.hash()),
        'canonical height should now be at head with correct chain'
      )
      await skeleton.setHead(block5, true)
      await wait(200)
      st.equal(skeleton.bounds().head, BigInt(5), 'should update to new height')
    }
  )

  t.test(
    'should abort filling the canonical chain and backstep if the terminal block is invalid',
    async (st) => {
      const genesis = {
        ...genesisJSON,
        config: {
          ...genesisJSON.config,
          terminalTotalDifficulty: 200,
          clique: undefined,
          ethash: {},
        },
        extraData: '0x00000000000000000',
        difficulty: '0x1',
      }
      const common = Common.fromGethGenesis(genesis, { chain: 'post-merge' })
      common.setHardforkBy({ blockNumber: BigInt(0), td: BigInt(0) })
      const config = new Config({
        transports: [],
        common,
        accountCache: 10000,
        storageCache: 1000,
      })
      const chain = await Chain.create({ config })
      ;(chain.blockchain as any)._validateBlocks = false
      ;(chain.blockchain as any)._validateConsensus = false
      await chain.open()
      const genesisBlock = await chain.getBlock(BigInt(0))

      const block1 = Block.fromBlockData(
        { header: { number: 1, parentHash: genesisBlock.hash(), difficulty: 100 } },
        { common }
      )
      const block2 = Block.fromBlockData(
        { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
        { common }
      )
      const block3PoW = Block.fromBlockData(
        { header: { number: 3, parentHash: block2.hash(), difficulty: 100 } },
        { common }
      )
      const block4InvalidPoS = Block.fromBlockData(
        { header: { number: 4, parentHash: block3PoW.hash(), difficulty: 0 } },
        { common, setHardfork: 200 }
      )

      const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
      await skeleton.open()

      await skeleton.initSync(block4InvalidPoS)
      await skeleton.putBlocks([block3PoW, block2])
      st.equal(chain.blocks.height, BigInt(0), 'canonical height should be at genesis')
      await skeleton.putBlocks([block1])
      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(2),
        'canonical height should stop at block 2 (valid terminal block), since block 3 is invalid (past ttd)'
      )
      st.equal(
        (skeleton as any).status.progress.subchains[0].tail,
        BigInt(4),
        `Subchain should have been backstepped to 4`
      )
    }
  )

  t.test(
    'should abort filling the canonical chain if a PoS block comes too early without hitting ttd',
    async (st) => {
      const genesis = {
        ...genesisJSON,
        config: {
          ...genesisJSON.config,
          terminalTotalDifficulty: 200,
          skeletonFillCanonicalBackStep: 0,
        },
        difficulty: '0x1',
      }
      const common = Common.fromGethGenesis(genesis, { chain: 'post-merge' })
      common.setHardforkBy({ blockNumber: BigInt(0), td: BigInt(0) })
      const config = new Config({
        transports: [],
        common,
        logger: getLogger({ loglevel: 'debug' }),
        accountCache: 10000,
        storageCache: 1000,
      })

      const chain = await Chain.create({ config })
      ;(chain.blockchain as any)._validateConsensus = false
      // Only add td validations to the validateBlock
      chain.blockchain.validateBlock = async (block: Block) => {
        if (!(block.header._common.consensusType() === 'pos') && block.header.difficulty === 0n) {
          throw Error(
            `Invalid header difficulty=${
              block.header.difficulty
            } for consensus=${block.header._common.consensusType()}`
          )
        }
      }

      const originalValidate = BlockHeader.prototype._consensusFormatValidation
      BlockHeader.prototype._consensusFormatValidation = td.func<any>()
      td.replace<any>('@ethereumjs/block', { BlockHeader })
      await chain.open()
      const genesisBlock = await chain.getBlock(BigInt(0))

      const block1 = Block.fromBlockData(
        { header: { number: 1, parentHash: genesisBlock.hash(), difficulty: 100 } },
        { common }
      )
      const block2 = Block.fromBlockData(
        { header: { number: 2, parentHash: block1.hash(), difficulty: 100 } },
        { common }
      )
      const block2PoS = Block.fromBlockData(
        { header: { number: 2, parentHash: block1.hash(), difficulty: 0 } },
        { common }
      )
      const block3 = Block.fromBlockData(
        { header: { number: 3, parentHash: block2.hash(), difficulty: 0 } },
        { common }
      )

      const skeleton = new Skeleton({ chain, config, metaDB: new MemoryLevel() })
      await skeleton.open()

      await skeleton.initSync(block2PoS)
      await skeleton.putBlocks([block1])

      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(1),
        'canonical height should stop at block 1 (valid PoW block), since block 2 is invalid (invalid PoS, not past ttd)'
      )
      // Put correct chain
      await skeleton.initSync(block3)
      try {
        await skeleton.putBlocks([block2])
      } catch (error: any) {
        if (error !== errSyncMerged) {
          t.fail(error)
        }
      }
      await wait(200)
      st.equal(
        chain.blocks.height,
        BigInt(3),
        'canonical height should now be at head with correct chain'
      )
      const latestHash = chain.headers.latest?.hash()
      st.ok(
        latestHash !== undefined && equalsBytes(latestHash, block3.hash()),
        'canonical height should now be at head with correct chain'
      )

      BlockHeader.prototype._consensusFormatValidation = originalValidate
      td.reset()
    }
  )
})
