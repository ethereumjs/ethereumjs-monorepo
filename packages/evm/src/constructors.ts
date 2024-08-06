import { Common, Mainnet } from '@ethereumjs/common'
import { SimpleStateManager } from '@ethereumjs/statemanager'
import { initRustBN } from 'rustbn-wasm'

import { DefaultBlockchain } from './types.js'

import { EVM } from './index.js'

import type { EVMBN254Interface, EVMOpts } from './index.js'

let initializedRustBN: EVMBN254Interface | undefined = undefined

/**
 * Use this async static constructor for the initialization
 * of an EVM object
 *
 * @param createOpts The EVM options
 * @returns A new EVM
 */
export async function createEVM(createOpts?: EVMOpts) {
  const opts = createOpts ?? ({} as EVMOpts)
  const bn254 = initializedRustBN ?? ((await initRustBN()) as EVMBN254Interface)
  initializedRustBN = bn254

  if (opts.common === undefined) {
    opts.common = new Common({ chain: Mainnet })
  }

  if (opts.blockchain === undefined) {
    opts.blockchain = new DefaultBlockchain()
  }

  if (opts.stateManager === undefined) {
    opts.stateManager = new SimpleStateManager()
  }

  return new EVM(opts, bn254)
}
