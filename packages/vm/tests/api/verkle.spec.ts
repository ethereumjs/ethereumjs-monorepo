import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import * as tape from 'tape'

import { VM } from '../../src/vm'

import * as verkleBlockJSON from './testdata/verkleBlock.json'

tape('Verkle-enabled VM', async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London, eips: [999001] })
  const verkleBlock = Block.fromBlockData(verkleBlockJSON, { common })

  t.test('should run a verkle block', async (st) => {
    const stateManager = new StatelessVerkleStateManager()
    await stateManager.initPreState(
      verkleBlock.header.verkleProof!,
      verkleBlock.header.verklePreState!
    )

    console.log('before create')
    const vm = await VM.create({ common, stateManager })
    console.log('after  create')

    // TODO: Running a verkle block should populate the stateManager
    // TODO: Running the first transaction should update the state for the 2nd transaction

    const blockResult = await vm.runBlock({
      block: verkleBlock,
      skipHeaderValidation: true,
    })

    console.log('blockresult', blockResult)

    st.end()
  })
})
