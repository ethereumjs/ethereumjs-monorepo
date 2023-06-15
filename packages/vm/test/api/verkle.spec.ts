import { Block } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import * as tape from 'tape'

import { VM } from '../../src/vm'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as block1JSON from './testdata/verkleKaustinenBlock1.json'
import * as block2JSON from './testdata/verkleKaustinenBlock2.json'
import * as block3JSON from './testdata/verkleKaustinenBlock3.json'

tape('Verkle-enabled VM', async (t) => {
  t.test('should run verkle blocks (kaustinen)', async (st) => {
    const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
      chain: 'customChain',
      eips: [999001],
    })

    for (const [index, blockJSON] of [block1JSON, block2JSON, block3JSON].entries()) {
      const block = Block.fromBlockData(blockJSON, { common })
      const stateManager = new StatelessVerkleStateManager()
      stateManager.initVerkleExecutionWitness(block.header.executionWitness!)
      const vm = await VM.create({ common, stateManager })
      await vm.runBlock({
        block,
      })

      st.pass(`Should run verkle block ${index + 1} successfully`)
    }

    st.end()
  })
})
