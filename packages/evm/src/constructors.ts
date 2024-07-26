import { Chain, Common } from '@ethereumjs/common'
import { SimpleStateManager } from '@ethereumjs/statemanager'
import { initRustBN } from 'rustbn-wasm'

import { DefaultBlockchain } from './types.js'

import { EVM } from './index.js'

import type { EVMOpts, bn128 } from './index.js'

let initializedRustBN: bn128 | undefined = undefined

/**
 * Use this async static constructor for the initialization
 * of an EVM object
 *
 * @param createOpts The EVM options
 * @returns A new EVM
 */
export async function createEVM(createOpts?: EVMOpts) {
  const opts = createOpts ?? ({} as EVMOpts)
  const bn128 = initializedRustBN ?? ((await initRustBN()) as bn128)
  initializedRustBN = bn128

  if (opts.common === undefined) {
    opts.common = new Common({ chain: Chain.Mainnet })
  }

  if (opts.blockchain === undefined) {
    opts.blockchain = new DefaultBlockchain()
  }

  if (opts.stateManager === undefined) {
    opts.stateManager = new SimpleStateManager()
  }

  return new EVM(opts, bn128)
}
