import { Block } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { TransactionFactory } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes, randomBytes } from '@ethereumjs/util'
import { describe, expect, it } from 'vitest'

import * as verkleBlockJSON from '../../../../statemanager/test/testdata/verkleKaustinenBlock.json'
import { VM } from '../../../src'

import type { BlockData, VerkleStateDiff } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

const customChainParams = { name: 'custom', chainId: 69420, networkId: 678 }
const common = Common.custom(customChainParams, { hardfork: Hardfork.Cancun, eips: [4895, 6800] })
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

    await vm.runBlock({ block })

    expect(verkleStateManager.verifyPreStateAccesses()).toBe(true)
  })

  it('throws an error if the block witness contains extra preState data', async () => {
    const verkleStateManager = await StatelessVerkleStateManager.create({ common })
    const evm = await EVM.create({ common, stateManager: verkleStateManager })
    const vm = await VM.create({
      common,
      evm,
      stateManager: verkleStateManager,
    })

    const extraStateDiff: VerkleStateDiff = {
      stem: bytesToHex(randomBytes(31)),
      suffixDiffs: [
        {
          currentValue: bytesToHex(randomBytes(32)),
          newValue: bytesToHex(randomBytes(32)),
          suffix: 0,
        },
        {
          currentValue: bytesToHex(randomBytes(32)),
          newValue: bytesToHex(randomBytes(32)),
          suffix: 1,
        },
      ],
    }

    // Add the extraStateDiff to the block execution witness
    block.executionWitness!.stateDiff = block.executionWitness!.stateDiff.concat(extraStateDiff)

    verkleStateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    expect(await vm.runBlock({ block })).toThrowError('Verkle pre state verification failed')
  })
})
