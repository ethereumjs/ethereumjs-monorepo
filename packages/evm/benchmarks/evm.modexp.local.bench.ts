import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { bench, describe } from 'vitest'

import { createEVM, getActivePrecompiles } from '../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const evm = await createEVM({ common })
const modexpPre = getActivePrecompiles(common).get('0000000000000000000000000000000000000005')!

const MODEXP_INPUT = hexToBytes(
  '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001',
)

/** Local-only — MODEXP under CodSpeed simulation is very slow in CI. */
describe('evm modexp (local)', () => {
  bench('evm modexp precompile', async () => {
    await modexpPre({
      data: MODEXP_INPUT,
      gasLimit: BigInt(0xffff_ffff),
      common,
      _EVM: evm,
    })
  })
})
