import tape from 'tape'
import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { Chain } from '../../lib/blockchain'
import { Skeleton, errReorgDenied } from '../../lib/sync/skeleton'
const level = require('level-mem')

type Subchain = {
  head: BN
  tail: BN
}

const common = new Common({ chain: 1 })
const block49 = Block.fromBlockData({ header: { number: 49 } }, { common })
const block49B = Block.fromBlockData(
  { header: { number: 49, extraData: Buffer.from('B') } },
  { common }
)
const block50 = Block.fromBlockData(
  { header: { number: 50, parentHash: block49.hash() } },
  { common }
)
const block51 = Block.fromBlockData(
  { header: { number: 51, parentHash: block50.hash() } },
  { common }
)

tape('[Skeleton]', async (t) => {
  // Tests various sync initializations based on previous leftovers in the database
  // and announced heads.
  t.test('should pass sync init test cases', async (st) => {
    interface TestCase {
      blocks?: Block[] /** Database content (besides the genesis) */
      oldState?: Subchain[] /** Old sync state with various interrupted subchains */
      head: Block /** New head header to announce to reorg to */
      newState: Subchain[] /** Expected sync state after the reorg */
    }
    const testCases: TestCase[] = [
      // Completely empty database with only the genesis set. The sync is expected
      // to create a single subchain with the requested head.
      {
        head: block50,
        newState: [{ head: new BN(50), tail: new BN(50) }],
      },
      // Empty database with only the genesis set with a leftover empty sync
      // progress. This is a synthetic case, just for the sake of covering things.
      { oldState: [], head: block50, newState: [{ head: new BN(50), tail: new BN(50) }] },
      // A single leftover subchain is present, older than the new head. The
      // old subchain should be left as is and a new one appended to the sync
      // status.
      {
        oldState: [{ head: new BN(10), tail: new BN(5) }],
        head: block50,
        newState: [
          { head: new BN(50), tail: new BN(50) },
          { head: new BN(10), tail: new BN(5) },
        ],
      },
      // Multiple leftover subchains are present, older than the new head. The
      // old subchains should be left as is and a new one appended to the sync
      // status.
      {
        oldState: [
          { head: new BN(20), tail: new BN(15) },
          { head: new BN(10), tail: new BN(5) },
        ],
        head: block50,
        newState: [
          { head: new BN(50), tail: new BN(50) },
          { head: new BN(20), tail: new BN(15) },
          { head: new BN(10), tail: new BN(5) },
        ],
      },
      // A single leftover subchain is present, newer than the new head. The
      // newer subchain should be deleted and a fresh one created for the head.
      {
        oldState: [{ head: new BN(65), tail: new BN(60) }],
        head: block50,
        newState: [{ head: new BN(50), tail: new BN(50) }],
      },
      // Multiple leftover subchain is present, newer than the new head. The
      // newer subchains should be deleted and a fresh one created for the head.
      {
        oldState: [
          { head: new BN(75), tail: new BN(70) },
          { head: new BN(65), tail: new BN(60) },
        ],
        head: block50,
        newState: [{ head: new BN(50), tail: new BN(50) }],
      },
      // Two leftover subchains are present, one fully older and one fully
      // newer than the announced head. The head should delete the newer one,
      // keeping the older one.
      {
        oldState: [
          { head: new BN(65), tail: new BN(60) },
          { head: new BN(10), tail: new BN(5) },
        ],
        head: block50,
        newState: [
          { head: new BN(50), tail: new BN(50) },
          { head: new BN(10), tail: new BN(5) },
        ],
      },
      // Multiple leftover subchains are present, some fully older and some
      // fully newer than the announced head. The head should delete the newer
      // ones, keeping the older ones.
      {
        oldState: [
          { head: new BN(75), tail: new BN(70) },
          { head: new BN(65), tail: new BN(60) },
          { head: new BN(20), tail: new BN(15) },
          { head: new BN(10), tail: new BN(5) },
        ],
        head: block50,
        newState: [
          { head: new BN(50), tail: new BN(50) },
          { head: new BN(20), tail: new BN(15) },
          { head: new BN(10), tail: new BN(5) },
        ],
      },
      // A single leftover subchain is present and the new head is extending
      // it with one more header. We expect the subchain head to be pushed
      // forward.
      {
        blocks: [block49],
        oldState: [{ head: new BN(49), tail: new BN(5) }],
        head: block50,
        newState: [{ head: new BN(50), tail: new BN(5) }],
      },
      // A single leftover subchain is present. A new head is announced that
      // links into the middle of it, correctly anchoring into an existing
      // header. We expect the old subchain to be truncated and extended with
      // the new head.
      {
        blocks: [block49],
        oldState: [{ head: new BN(100), tail: new BN(5) }],
        head: block50,
        newState: [{ head: new BN(50), tail: new BN(5) }],
      },
      // A single leftover subchain is present. A new head is announced that
      // links into the middle of it, but does not anchor into an existing
      // header. We expect the old subchain to be truncated and a new chain
      // be created for the dangling head.
      {
        blocks: [block49B],
        oldState: [{ head: new BN(100), tail: new BN(5) }],
        head: block50,
        newState: [
          { head: new BN(50), tail: new BN(50) },
          { head: new BN(49), tail: new BN(5) },
        ],
      },
    ]
    for (const [testCaseIndex, testCase] of testCases.entries()) {
      const config = new Config({ transports: [] })
      const chain = new Chain({ config })
      const metaDB = level()
      const skeleton = new Skeleton({ chain, config, metaDB })
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
        if (!subchain.head.eq(testCase.newState[i].head)) {
          st.fail(
            `test ${testCaseIndex}: subchain head mismatch: have ${subchain.head}, want ${testCase.newState[i].head}`
          )
        } else if (!subchain.tail.eq(testCase.newState[i].tail)) {
          st.fail(
            `test ${testCaseIndex}: subchain tail mismatch: have ${subchain.tail}, want ${testCase.newState[i].tail}`
          )
        } else {
          st.pass(`test ${testCaseIndex}: subchain[${i}] matched`)
        }
      }
    }
  })

  // Tests that a running skeleton sync can be extended with properly linked up
  // headers but not with side chains.
  t.test('should pass sync extend test cases', async (st) => {
    interface TestCase {
      head: Block /** New head header to announce to reorg to */
      extend: Block /** New head header to announce to extend with */
      newState: Subchain[] /** Expected sync state after the reorg */
      err?: Error /** Whether extension succeeds or not */
    }
    const testCases: TestCase[] = [
      // Initialize a sync and try to extend it with a subsequent block.
      {
        head: block49,
        extend: block50,
        newState: [{ head: new BN(50), tail: new BN(49) }],
      },
      // Initialize a sync and try to extend it with the existing head block.
      {
        head: block49,
        extend: block49,
        newState: [{ head: new BN(49), tail: new BN(49) }],
      },
      // Initialize a sync and try to extend it with a sibling block.
      {
        head: block49,
        extend: block49B,
        newState: [{ head: new BN(49), tail: new BN(49) }],
        err: errReorgDenied,
      },
      // Initialize a sync and try to extend it with a number-wise sequential
      // header, but a hash wise non-linking one.
      {
        head: block49B,
        extend: block50,
        newState: [{ head: new BN(49), tail: new BN(49) }],
        err: errReorgDenied,
      },
      // Initialize a sync and try to extend it with a non-linking future block.
      {
        head: block49,
        extend: block51,
        newState: [{ head: new BN(49), tail: new BN(49) }],
        err: errReorgDenied,
      },
      // Initialize a sync and try to extend it with a past canonical block.
      {
        head: block50,
        extend: block49,
        newState: [{ head: new BN(50), tail: new BN(50) }],
        err: errReorgDenied,
      },
      // Initialize a sync and try to extend it with a past sidechain block.
      {
        head: block50,
        extend: block49B,
        newState: [{ head: new BN(50), tail: new BN(50) }],
        err: errReorgDenied,
      },
    ]
    for (const [testCaseIndex, testCase] of testCases.entries()) {
      const config = new Config({ transports: [] })
      const chain = new Chain({ config })
      const metaDB = level()
      const skeleton = new Skeleton({ chain, config, metaDB })
      await skeleton.open()

      await skeleton.initSync(testCase.head)

      try {
        await skeleton.setHead(testCase.extend)
        if (testCase.err) {
          st.fail(`test ${testCaseIndex}: should have failed`)
        } else {
          st.pass(`test ${testCaseIndex}: successfully passed`)
        }
      } catch (error: any) {
        if (error.message.includes(testCase.err?.message)) {
          st.pass(`test ${testCaseIndex}: passed with correct error`)
        } else {
          st.fail(`test ${testCaseIndex}: received wrong error`)
        }
      }

      const { progress } = (skeleton as any).status
      if (progress.subchains.length !== testCase.newState.length) {
        st.fail(
          `test ${testCaseIndex}: subchain count mismatch: have ${progress.subchains.length}, want ${testCase.newState.length}`
        )
      }
      for (const [i, subchain] of progress.subchains.entries()) {
        if (!subchain.head.eq(testCase.newState[i].head)) {
          st.fail(
            `test ${testCaseIndex}: subchain head mismatch: have ${subchain.head}, want ${testCase.newState[i].head}`
          )
        } else if (!subchain.tail.eq(testCase.newState[i].tail)) {
          st.fail(
            `test ${testCaseIndex}: subchain tail mismatch: have ${subchain.tail}, want ${testCase.newState[i].tail}`
          )
        } else {
          st.pass(`test ${testCaseIndex}: subchain[${i}] matched`)
        }
      }
    }
  })
})
