import { createBlock } from '@ethereumjs/block'
import { Hardfork, createCustomCommon } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { createTxFromSerializedData } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { describe, it } from 'vitest'

import * as verkleBlockJSON from '../../../../statemanager/test/testdata/verkleKaustinen6Block72.json'
import { VM, runBlock } from '../../../src/index.js'

import type { BlockData } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

const customChainParams = { name: 'custom', chainId: 69420 }
const common = createCustomCommon(customChainParams, {
  hardfork: Hardfork.Cancun,
  eips: [2935, 4895, 6800],
})
const decodedTxs = verkleBlockJSON.transactions.map((tx) =>
  createTxFromSerializedData(hexToBytes(tx as PrefixedHexString)),
)

const parentStateRoot = hexToBytes(
  '0x64e1a647f42e5c2e3c434531ccf529e1b3e93363a40db9fc8eec81f492123510',
)

const block = createBlock({ ...verkleBlockJSON, transactions: decodedTxs } as BlockData, {
  common,
})

describe('EIP 6800 tests', () => {
  it('successfully run transactions statelessly using the block witness', async () => {
    const verkleCrypto = await loadVerkleCrypto()
    const verkleStateManager = new StatelessVerkleStateManager({ common, verkleCrypto })
    const evm = await createEVM({ common, stateManager: verkleStateManager })
    const vm = await VM.create({
      common,
      evm,
      stateManager: verkleStateManager,
    })

    // We need to skip validation of the header validation
    // As otherwise the vm will attempt retrieving the parent block, which is not available in a stateless context
    await runBlock(vm, { block, skipHeaderValidation: true, parentStateRoot })
  })
})
