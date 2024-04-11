import { Block } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { describe, it } from 'vitest'

import * as verkleBlockJSON from '../../../../statemanager/test/testdata/verkleKaustinenBlock.json'
import { VM } from '../../../src'

const customChainParams = { name: 'custom', chainId: 69420, networkId: 678 }
const common = Common.custom(customChainParams, { hardfork: Hardfork.Cancun, eips: [6800] })
const block = Block.fromBlockData(verkleBlockJSON, { common })

describe('EIP 6800 tests', () => {
  it('successfully run transactions statelessly using the block witness', async () => {
    const verkleStateManager = new StatelessVerkleStateManager({ common })
    const evm = await EVM.create({ common, stateManager: verkleStateManager })
    const vm = await VM.create({
      common,
      evm,
      stateManager: verkleStateManager,
    })
    verkleStateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    //await vm.runBlock({ block })

    for (let i = 0; i < block.transactions.length; i++) {
      await vm.runTx({ tx: block.transactions[i], block })
    }
  })
})
