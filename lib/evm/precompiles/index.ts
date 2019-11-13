import { PrecompileInput, PrecompileFunc } from './types'
import { default as p1 } from './01-ecrecover'
import { default as p2 } from './02-sha256'
import { default as p3 } from './03-ripemd160'
import { default as p4 } from './04-identity'
import { default as p5 } from './05-modexp'
import { default as p6 } from './06-ecadd'
import { default as p7 } from './07-ecmul'
import { default as p8 } from './08-ecpairing'
import { default as p9 } from './09-blake2f'

interface Precompiles {
  [key: string]: PrecompileFunc
}

const ripemdPrecompileAddress = '0000000000000000000000000000000000000003'
const precompiles: Precompiles = {
  '0000000000000000000000000000000000000001': p1,
  '0000000000000000000000000000000000000002': p2,
  [ripemdPrecompileAddress]: p3,
  '0000000000000000000000000000000000000004': p4,
  '0000000000000000000000000000000000000005': p5,
  '0000000000000000000000000000000000000006': p6,
  '0000000000000000000000000000000000000007': p7,
  '0000000000000000000000000000000000000008': p8,
  '0000000000000000000000000000000000000009': p9,
}

function getPrecompile(address: string): PrecompileFunc {
  return precompiles[address]
}

export { precompiles, getPrecompile, PrecompileFunc, PrecompileInput, ripemdPrecompileAddress }
