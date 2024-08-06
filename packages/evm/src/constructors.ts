import { Common, Mainnet } from '@ethereumjs/common'
import { SimpleStateManager } from '@ethereumjs/statemanager'
import { initRustBN } from 'rustbn-wasm'

import { RustBN254 } from './precompiles/index.js'
import { DefaultBlockchain } from './types.js'

import { EVM } from './index.js'

import type { EVMOpts } from './index.js'

/**
 * Use this async static constructor for the initialization
 * of an EVM object
 *
 * @param createOpts The EVM options
 * @returns A new EVM
 */
export async function createEVM(createOpts?: EVMOpts) {
  const opts = createOpts ?? ({} as EVMOpts)
  const rustbn = await initRustBN()
  opts.bn254 = new RustBN254(rustbn)

  if (opts.common === undefined) {
    opts.common = new Common({ chain: Mainnet })
  }

  if (opts.blockchain === undefined) {
    opts.blockchain = new DefaultBlockchain()
  }

  if (opts.stateManager === undefined) {
    opts.stateManager = new SimpleStateManager()
  }

  return new EVM(opts)
}
