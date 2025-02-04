import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { StatelessVerkleStateManager } from '@ethereumjs/statemanager'
import { createTx, createTxFromRLP } from '@ethereumjs/tx'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.js'

import witness from './executionWitness.json'

describe('Precompiles: EXECUTE', () => {
  it('should execute a trace', async () => {
    const kzg = new microEthKZG(trustedSetup)
    const common = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Prague,
      eips: [6800, 9999],
      customCrypto: {
        kzg,
        verkle,
      },
    })
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(1n, witness.witness)
    const evm = await createEVM({ stateManager, common })
    const txs = witness.txs.map((tx) => createTxFromRLP(hexToBytes(tx), { common }))
    for (const tx of txs) {
      const res = await evm.runCall(tx)
      console.log(res)
    }
    const addressStr = '0000000000000000000000000000000000000012'
    const EXECUTE = getActivePrecompiles(common).get(addressStr)!

    const result = await EXECUTE({})
  })
})
