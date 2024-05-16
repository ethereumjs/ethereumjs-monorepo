import { Block } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'
import { describe, it } from 'vitest'

import * as verkleBlockJSON from '../../../../statemanager/test/testdata/verkleKaustinen6Block72.json'
import { VM } from '../../../src'

import type { BlockData } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

const customChainParams = { name: 'custom', chainId: 69420, networkId: 678 }
const common = Common.custom(customChainParams, {
  hardfork: Hardfork.Cancun,
  eips: [2935, 4895, 6800],
})
const decodedTxs = verkleBlockJSON.transactions.map((tx) =>
  TransactionFactory.fromSerializedData(hexToBytes(tx as PrefixedHexString))
)

const block = Block.fromBlockData({ ...verkleBlockJSON, transactions: decodedTxs } as BlockData, {
  common,
})

describe('EIP 6800 tests', () => {
  it('successfully run transactions statelessly using the block witness', async () => {
    const verkleStateManager = await StatelessVerkleStateManager.create({ common })
    const evm = await EVM.create({ common, stateManager: verkleStateManager })
    const vm = await VM.create({
      common,
      evm,
      stateManager: verkleStateManager,
    })
    verkleStateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    // We need to skip validation of the header validation as otherwise the vm will attempt retrieving the parent block, which is not available statelessly
    await vm.runBlock({ block, skipHeaderValidation: true })
  })
})
