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

    console.log('before create')
    const vm = await VM.create({ common, stateManager })
    console.log('after  create')

    const blockResult = await vm.runBlock({
      block: verkleBlock,
      skipHeaderValidation: true,
      skipBlockValidation: true,
    })

    console.log('blockresult', blockResult)

    st.end()
  })
})
