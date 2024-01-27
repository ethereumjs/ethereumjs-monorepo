import { Block } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { describe, it } from 'vitest'

import * as verkleBlockJSON from '../../../../statemanager/test/testdata/verkleKaustinenBlock.json'
import { VM } from '../../../src'

const customChainParams = { name: 'custom', chainId: 69420, networkId: 678 }
const common = Common.custom(customChainParams, { hardfork: Hardfork.Cancun, eips: [6800] })
const verkleStateManager = new StatelessVerkleStateManager({ common })
const evm = new EVM({ common, stateManager: verkleStateManager })
const block = Block.fromBlockData(verkleBlockJSON, { common })

describe('EIP 6800 tests tests', () => {
  it('succesfully run an EIP 6800 call', async () => {
    const verkleStateManager = new StatelessVerkleStateManager({ common })
    const evm = new EVM({ common, stateManager: verkleStateManager })
    const vm = await VM.create({
      common,
      evm,
      stateManager: verkleStateManager,
    })
    verkleStateManager.initVerkleExecutionWitness(block.executionWitness)

    await vm.runTx({ tx: block.transactions[0] })
  })
})
