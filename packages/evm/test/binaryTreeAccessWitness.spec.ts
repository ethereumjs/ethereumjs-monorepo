import { Common, Mainnet } from '@ethereumjs/common'
import { StatefulBinaryTreeStateManager } from '@ethereumjs/statemanager'
import { Account, bytesToHex, createAddressFromString } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BinaryTreeAccessWitness, generateBinaryExecutionWitness } from '../src/index.ts'

import type { BinaryTreeStateManagerInterface } from '@ethereumjs/common'

describe('generateBinaryExecutionWitness', () => {
  it('should generate a witness for accessed state from any BinaryTreeStateManagerInterface', async () => {
    const common = new Common({ chain: Mainnet, eips: [7864] })
    const sm: BinaryTreeStateManagerInterface & StatefulBinaryTreeStateManager =
      new StatefulBinaryTreeStateManager({ common })
    const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')

    const parentStateRoot = await sm.getStateRoot()

    await sm.putAccount(address, new Account(1n, 0xfffn))

    const accessWitness = new BinaryTreeAccessWitness({ hashFunction: sm.hashFunction })
    accessWitness.writeAccountBasicData(address)
    accessWitness.writeAccountCodeHash(address)
    accessWitness.commit()

    const ew = await generateBinaryExecutionWitness(sm, accessWitness, parentStateRoot)

    assert.strictEqual(ew.parentStateRoot, bytesToHex(parentStateRoot))
    assert.strictEqual(ew.stateDiff.length, 1)
    const { suffixDiffs } = ew.stateDiff[0]
    assert.isAtLeast(suffixDiffs.length, 1)
    for (const diff of suffixDiffs) {
      assert.isNull(diff.currentValue)
      assert.isNotNull(diff.newValue)
    }
  })

  it('should release the tree lock after generating a witness', async () => {
    const common = new Common({ chain: Mainnet, eips: [7864] })
    const sm = new StatefulBinaryTreeStateManager({ common })

    const accessWitness = new BinaryTreeAccessWitness({ hashFunction: sm.hashFunction })
    await generateBinaryExecutionWitness(sm, accessWitness, await sm.getStateRoot())

    // would hang forever if generateBinaryExecutionWitness leaked the lock
    const reacquired = await sm.tree.withLock(async () => true)
    assert.isTrue(reacquired)
  })
})
