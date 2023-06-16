import { Hardfork } from '@ethereumjs/common'
import { Address } from '@ethereumjs/util'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils.js'

import { precompile01 } from './01-ecrecover.js'
import { precompile02 } from './02-sha256.js'
import { precompile03 } from './03-ripemd160.js'
import { precompile04 } from './04-identity.js'
import { precompile05 } from './05-modexp.js'
import { precompile06 } from './06-ecadd.js'
import { precompile07 } from './07-ecmul.js'
import { precompile08 } from './08-ecpairing.js'
import { precompile09 } from './09-blake2f.js'
import { precompile0a } from './0a-bls12-g1add.js'
import { precompile0b } from './0b-bls12-g1mul.js'
import { precompile0c } from './0c-bls12-g1multiexp.js'
import { precompile0d } from './0d-bls12-g2add.js'
import { precompile0e } from './0e-bls12-g2mul.js'
import { precompile0f } from './0f-bls12-g2multiexp.js'
import { precompile10 } from './10-bls12-pairing.js'
import { precompile11 } from './11-bls12-map-fp-to-g1.js'
import { precompile12 } from './12-bls12-map-fp2-to-g2.js'
import { precompile14 } from './14-kzg-point-evaluation.js'

import type { PrecompileFunc, PrecompileInput } from './types.js'
import type { Common } from '@ethereumjs/common'

interface Precompiles {
  [key: string]: PrecompileFunc
}

interface PrecompileAvailability {
  [key: string]: PrecompileAvailabilityCheckType
}

type PrecompileAvailabilityCheckType =
  | PrecompileAvailabilityCheckTypeHardfork
  | PrecompileAvailabilityCheckTypeEIP

enum PrecompileAvailabilityCheck {
  EIP,
  Hardfork,
}

interface PrecompileAvailabilityCheckTypeHardfork {
  type: PrecompileAvailabilityCheck.Hardfork
  param: string
}

interface PrecompileAvailabilityCheckTypeEIP {
  type: PrecompileAvailabilityCheck.EIP
  param: number
}

const ripemdPrecompileAddress = '0000000000000000000000000000000000000003'
const precompiles: Precompiles = {
  '0000000000000000000000000000000000000001': precompile01,
  '0000000000000000000000000000000000000002': precompile02,
  [ripemdPrecompileAddress]: precompile03,
  '0000000000000000000000000000000000000004': precompile04,
  '0000000000000000000000000000000000000005': precompile05,
  '0000000000000000000000000000000000000006': precompile06,
  '0000000000000000000000000000000000000007': precompile07,
  '0000000000000000000000000000000000000008': precompile08,
  '0000000000000000000000000000000000000009': precompile09,
  '000000000000000000000000000000000000000a': precompile0a,
  '000000000000000000000000000000000000000b': precompile0b,
  '000000000000000000000000000000000000000c': precompile0c,
  '000000000000000000000000000000000000000d': precompile0d,
  '000000000000000000000000000000000000000e': precompile0e,
  '000000000000000000000000000000000000000f': precompile0f,
  '0000000000000000000000000000000000000010': precompile10,
  '0000000000000000000000000000000000000011': precompile11,
  '0000000000000000000000000000000000000012': precompile12,
  '0000000000000000000000000000000000000014': precompile14,
}

const precompileAvailability: PrecompileAvailability = {
  '0000000000000000000000000000000000000001': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Chainstart,
  },
  '0000000000000000000000000000000000000002': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Chainstart,
  },
  [ripemdPrecompileAddress]: {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Chainstart,
  },
  '0000000000000000000000000000000000000004': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Chainstart,
  },
  '0000000000000000000000000000000000000005': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Byzantium,
  },
  '0000000000000000000000000000000000000006': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Byzantium,
  },
  '0000000000000000000000000000000000000007': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Byzantium,
  },
  '0000000000000000000000000000000000000008': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Byzantium,
  },
  '0000000000000000000000000000000000000009': {
    type: PrecompileAvailabilityCheck.Hardfork,
    param: Hardfork.Istanbul,
  },
  '000000000000000000000000000000000000000a': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000b': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000c': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000d': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000f': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '000000000000000000000000000000000000000e': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '0000000000000000000000000000000000000010': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '0000000000000000000000000000000000000011': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '0000000000000000000000000000000000000012': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 2537,
  },
  '0000000000000000000000000000000000000014': {
    type: PrecompileAvailabilityCheck.EIP,
    param: 4844,
  },
}

function getPrecompile(address: Address, common: Common): PrecompileFunc {
  const addr = bytesToHex(address.bytes)
  if (precompiles[addr] !== undefined) {
    const availability = precompileAvailability[addr]
    if (
      (availability.type === PrecompileAvailabilityCheck.Hardfork &&
        common.gteHardfork(availability.param)) ||
      (availability.type === PrecompileAvailabilityCheck.EIP &&
        common.isActivatedEIP(availability.param))
    ) {
      return precompiles[addr]
    }
  }
  return precompiles['']
}

type DeletePrecompile = {
  address: Address
}

type AddPrecompile = {
  address: Address
  function: PrecompileFunc
}

type CustomPrecompile = AddPrecompile | DeletePrecompile

function getActivePrecompiles(
  common: Common,
  customPrecompiles?: CustomPrecompile[]
): Map<string, PrecompileFunc> {
  const precompileMap = new Map()
  if (customPrecompiles) {
    for (const precompile of customPrecompiles) {
      precompileMap.set(
        bytesToHex(precompile.address.bytes),
        'function' in precompile ? precompile.function : undefined
      )
    }
  }
  for (const addressString in precompiles) {
    if (precompileMap.has(addressString)) {
      continue
    }

    const address = new Address(hexToBytes(addressString))
    const precompileFunc = getPrecompile(address, common)
    if (precompileFunc !== undefined) {
      precompileMap.set(addressString, precompileFunc)
    }
  }
  return precompileMap
}

export { getActivePrecompiles, precompiles, ripemdPrecompileAddress }

export type { AddPrecompile, CustomPrecompile, DeletePrecompile, PrecompileFunc, PrecompileInput }
