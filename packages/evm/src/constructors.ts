import { Common, Mainnet } from '@ethereumjs/common'
import { SimpleStateManager } from '@ethereumjs/statemanager'

import { EVM } from './index.ts'
import { NobleBN254 } from './precompiles/index.ts'
import { EVMMockBlockchain } from './types.ts'

import type { EVMOpts } from './index.ts'

/**
 * Async factory for initializing an {@link EVM} with sensible defaults.
 *
 * Supplies a {@link NobleBN254} precompile backend, mainnet {@link @ethereumjs/common!Common},
 * {@link EVMMockBlockchain}, and {@link @ethereumjs/statemanager!SimpleStateManager} when not provided.
 *
 * @param createOpts EVM configuration
 * @returns Initialized EVM instance
 */
export async function createEVM(createOpts?: EVMOpts) {
  const opts = createOpts ?? ({} as EVMOpts)

  opts.bn254 = new NobleBN254()

  if (opts.common === undefined) {
    opts.common = new Common({ chain: Mainnet })
  }

  if (opts.blockchain === undefined) {
    opts.blockchain = new EVMMockBlockchain()
  }

  if (opts.stateManager === undefined) {
    // Intentionally the only runtime import from @ethereumjs/statemanager in
    // this package (sane zero-config default); all other state manager usage
    // must go through the interfaces in @ethereumjs/common.
    opts.stateManager = new SimpleStateManager()
  }

  return new EVM(opts)
}
