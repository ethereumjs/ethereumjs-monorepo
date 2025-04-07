import { createBlock } from '@ethereumjs/block'
import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import { Caches, StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { verkleKaustinen6Block72Data } from '@ethereumjs/testdata'
import { createTxFromRLP } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'
import * as verkle from 'micro-eth-signer/verkle'
import { describe, it } from 'vitest'

import { createVM, runBlock } from '../../../src/index.ts'

const customChainParams = { name: 'custom', chainId: 69420 }
const common = createCustomCommon(customChainParams, Mainnet, {
  hardfork: Hardfork.Cancun,
  eips: [2935, 4895, 6800],
  customCrypto: { verkle },
})
const decodedTxs = verkleKaustinen6Block72Data.transactions?.map((tx) =>
  createTxFromRLP(hexToBytes(tx), { common }),
)

const parentStateRoot = hexToBytes(
  '0x64e1a647f42e5c2e3c434531ccf529e1b3e93363a40db9fc8eec81f492123510',
)

const block = createBlock(
  { ...verkleKaustinen6Block72Data, transactions: decodedTxs },
  {
    common,
  },
)

describe('EIP 6800 tests', () => {
  // TODO: Turn back on once we have kaustinen7 block data
  it.skip('successfully run transactions statelessly using the block witness', async () => {
    common.customCrypto.verkle = verkle
    const verkleStateManager = new StatelessVerkleStateManager({
      caches: new Caches(),
      common,
    })
    const evm = await createEVM({ common, stateManager: verkleStateManager })
    const vm = await createVM({
      common,
      evm,
      stateManager: verkleStateManager,
    })

    // We need to skip validation of the header validation
    // As otherwise the vm will attempt retrieving the parent block, which is not available in a stateless context
    await runBlock(vm, { block, skipHeaderValidation: true, parentStateRoot })
  })
})
