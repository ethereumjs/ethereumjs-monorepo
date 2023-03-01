import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { VM } from '../../src/vm'

import * as testnetVerkle from './testdata/testnetVerkleBeverlyHills.json'
import * as verkleBlockJSON from './testdata/verkleBeverlyHillsBlock93261.json'
import * as simpleVerkleBlockJSON from './testdata/verkleSampleBlock.json'

tape('Verkle-enabled VM', async (t) => {
  t.test('should run a simple verkle block (no storage/contract accesses)', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [999001] })
    const block = Block.fromBlockData(simpleVerkleBlockJSON, { common })
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initPreState(block.header.verkleProof!, block.header.verklePreState!)

    const vm = await VM.create({ common, stateManager })

    await vm.runBlock({
      block,
      skipHeaderValidation: true,
    })

    st.pass('Should run verkle block successfully')

    st.end()
  })

  t.test('should run a verkle block', async (st) => {
    const common = Common.fromGethGenesis(testnetVerkle, {
      chain: 'customChain',
      hardfork: Hardfork.Merge,
      eips: [999001],
    })

    const block = Block.fromBlockData(verkleBlockJSON as any, { common })
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initPreState(block.header.verkleProof!, block.header.verklePreState!)

    const vm = await VM.create({ common, stateManager })

    await vm.runBlock({
      block,
      skipHeaderValidation: true,
      skipBlockValidation: true,
      skipBalance: true,
      skipNonce: true,
    })

    st.pass('Should run verkle block successfully')

    st.end()
  })
})
