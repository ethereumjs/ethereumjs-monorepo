import { createFlatStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it } from 'vitest'

import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { createSpine, setPhase } from '../src/spine/createSpine.ts'
import { BalChainStreamer, type VerifiedBalBlock } from '../src/sync/balSync.ts'
import { planResumeStart, shouldReleaseSnapBridge } from '../src/sync/resumeCoordinator.ts'

describe('[Ethy/Sync]: bridge-pivot resume', () => {
  it('restoreBuffered plus pivot steps release snap inside the live window', async () => {
    const spine = createSpine('sepolia', 11155111n)
    setPhase(spine, 'SNAP_SYNCING')
    const pivot = 10_000n
    const head = pivot + 250n
    spine.pivotBlockNumber = pivot
    spine.pivotStateRoot = new Uint8Array(32)
    spine.totalAccountsSynced = 3_100_000

    const plan = planResumeStart('bridge-pivot', pivot, head)
    assert.isDefined(plan.pivotBridging)
    spine.pivotBridging = plan.pivotBridging
    assert.isFalse(plan.startSnap)

    const blocks: VerifiedBalBlock[] = []
    for (let i = 1; i <= 250; i++) {
      blocks.push({
        blockNumber: pivot + BigInt(i),
        blockHash: new Uint8Array(32),
        stateRoot: new Uint8Array(32),
        headerRlp: new Uint8Array([0x80]),
        balRlp: new Uint8Array(0),
      })
    }

    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const sm = createFlatStateManager()
    let snapReleased = false
    const streamer = new BalChainStreamer({
      spine,
      stateManager: sm,
      chain,
      hardfork,
      getClient: () => {
        throw new Error('no network in unit test')
      },
      sendEthMessage: () => {},
      pickEthPeer: () => undefined,
      putServableBlock: () => {},
      onPivotStep: (newPivot) => {
        if (spine.pivotBridging !== undefined) {
          spine.pivotBridging = {
            ...spine.pivotBridging,
            currentBlock: newPivot.blockNumber,
          }
          if (shouldReleaseSnapBridge(head, newPivot.blockNumber)) {
            spine.pivotBridging = undefined
            snapReleased = true
          }
        }
      },
    })
    streamer.restoreBuffered(blocks.slice(0, 10))
    assert.equal(spine.bufferedBalCount, 10)
    assert.isFalse(snapReleased)

    streamer.restoreBuffered(blocks)
    await new Promise<void>((resolve) => setTimeout(resolve, 20))
    assert.isTrue(snapReleased)
    assert.isUndefined(spine.pivotBridging)
    assert.equal(spine.pivotBlockNumber, 10_240n)
    assert.equal(spine.pivotStepsCompleted, 15)
  })
})
