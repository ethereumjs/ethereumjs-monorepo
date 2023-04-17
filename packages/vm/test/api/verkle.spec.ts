import { Block } from '@ethereumjs/block'
import { Chain, Common } from '@ethereumjs/common'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import * as tape from 'tape'

import { VM } from '../../src/vm'

import * as testnetVerkleBeverlyHills from './testdata/testnetVerkleBeverlyHills.json'
import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as verkleBlockBeverlyHillsJSON from './testdata/verkleBeverlyHillsBlock83.json'
import * as verkleBlockKaustinenJSON from './testdata/verkleKaustinenBlock.json'
import * as simpleVerkleBlockJSON from './testdata/verkleSampleBlock.json'

tape('Verkle-enabled VM', async (t) => {
  t.test('should run a simple verkle block (no storage/contract accesses)', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, eips: [999001] })
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

  t.test('should run a verkle block (beverly hills)', async (st) => {
    const common = Common.fromGethGenesis(testnetVerkleBeverlyHills, {
      chain: 'customChain',
      eips: [999001],
    })

    const block = Block.fromBlockData(verkleBlockBeverlyHillsJSON as any, { common })
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

  t.test('should run a verkle block (Kaustinen)', async (st) => {
    const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
      chain: 'customChain',
      eips: [999001],
    })

    const block = Block.fromBlockData(verkleBlockKaustinenJSON as any, { common })
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
})
