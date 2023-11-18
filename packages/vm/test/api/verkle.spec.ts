import { Block } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it } from 'vitest'

import { VM } from '../../src/vm'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as blockJSON from './testdata/verkleKaustinenBlock.json'

describe('Verkle-enabled VM', async () => {
  it('should run verkle blocks (kaustinen)', async () => {
    const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
      chain: 'customChain',
      eips: [6800],
    })

    const block = Block.fromBlockData(blockJSON, { common })
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initVerkleExecutionWitness(block.executionWitness)
    const vm = await VM.create({ common, stateManager })
    await vm.runBlock({
      block,
    })

    assert.ok(true, `Should run verkle block successfully`)
  })
})
