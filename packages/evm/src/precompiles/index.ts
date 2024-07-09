import { Hardfork } from '@ethereumjs/common'
import { type Address, bytesToUnprefixedHex } from '@ethereumjs/util'

import { precompile01 } from './01-ecrecover.js'
import { precompile02 } from './02-sha256.js'
import { precompile03 } from './03-ripemd160.js'
import { precompile04 } from './04-identity.js'
import { precompile05 } from './05-modexp.js'
import { precompile06 } from './06-ecadd.js'
import { precompile07 } from './07-ecmul.js'
import { precompile08 } from './08-ecpairing.js'
import { precompile09 } from './09-blake2f.js'
import { precompile0a } from './0a-kzg-point-evaluation.js'
import { precompile0b } from './0b-bls12-g1add.js'
import { precompile0c } from './0c-bls12-g1mul.js'
import { precompile0d } from './0d-bls12-g1msm.js'
import { precompile0e } from './0e-bls12-g2add.js'
import { precompile0f } from './0f-bls12-g2mul.js'
import { precompile10 } from './10-bls12-g2msm.js'
import { precompile11 } from './11-bls12-pairing.js'
import { precompile12 } from './12-bls12-map-fp-to-g1.js'
import { precompile13 } from './13-bls12-map-fp2-to-g2.js'
import { MCLBLS, NobleBLS } from './bls12_381/index.js'

import type { PrecompileFunc, PrecompileInput } from './types.js'
import type { Common } from '@ethereumjs/common'

interface PrecompileEntry {
  address: string
  check: PrecompileAvailabilityCheckType
  precompile: PrecompileFunc
  name: string
}

interface Precompiles {
  [key: string]: PrecompileFunc
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

const precompileEntries: PrecompileEntry[] = [
  {
    address: '0000000000000000000000000000000000000001',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Chainstart,
    },
    precompile: precompile01,
    name: 'ECRECOVER (0x01)',
  },
  {
    address: '0000000000000000000000000000000000000002',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Chainstart,
    },
    precompile: precompile02,
    name: 'SHA256 (0x02)',
  },
  {
    address: '0000000000000000000000000000000000000003',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Chainstart,
    },
    precompile: precompile03,
    name: 'RIPEMD160 (0x03)',
  },
  {
    address: '0000000000000000000000000000000000000004',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Chainstart,
    },
    precompile: precompile04,
    name: 'Identity (0x04)',
  },
  {
    address: '0000000000000000000000000000000000000005',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Byzantium,
    },
    precompile: precompile05,
    name: 'MODEXP (0x05)',
  },
  {
    address: '0000000000000000000000000000000000000006',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Byzantium,
    },
    precompile: precompile06,
    name: 'ECADD (0x06)',
  },
  {
    address: '0000000000000000000000000000000000000007',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Byzantium,
    },
    precompile: precompile07,
    name: 'ECMUL (0x07)',
  },
  {
    address: '0000000000000000000000000000000000000008',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Byzantium,
    },
    precompile: precompile08,
    name: 'ECPAIR (0x08)',
  },
  {
    address: '0000000000000000000000000000000000000009',
    check: {
      type: PrecompileAvailabilityCheck.Hardfork,
      param: Hardfork.Istanbul,
    },
    precompile: precompile09,
    name: 'BLAKE2f (0x09)',
  },
  {
    address: '000000000000000000000000000000000000000a',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 4844,
    },
    precompile: precompile0a,
    name: 'KZG (0x0a)',
  },
  {
    address: '000000000000000000000000000000000000000b',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile0b,
    name: 'BLS12_G1ADD',
  },
  {
    address: '000000000000000000000000000000000000000c',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile0c,
    name: 'BLS12_G1MUL',
  },
  {
    address: '000000000000000000000000000000000000000d',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile0d,
    name: 'BLS12_G1MSM',
  },
  {
    address: '000000000000000000000000000000000000000e',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile0e,
    name: 'BLS12_G2ADD',
  },
  {
    address: '000000000000000000000000000000000000000f',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile0f,
    name: 'BLS12_G2MUL',
  },
  {
    address: '0000000000000000000000000000000000000010',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile10,
    name: 'BLS12_G2MSM',
  },
  {
    address: '0000000000000000000000000000000000000011',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile11,
    name: 'BLS12_PAIRING',
  },
  {
    address: '0000000000000000000000000000000000000012',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile12,
    name: 'BLS12_MAP_FP_TO_G1',
  },
  {
    address: '0000000000000000000000000000000000000013',
    check: {
      type: PrecompileAvailabilityCheck.EIP,
      param: 2537,
    },
    precompile: precompile13,
    name: 'BLS12_MAP_FP2_TO_G2',
  },
]

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
  '0000000000000000000000000000000000000013': precompile13,
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
        bytesToUnprefixedHex(precompile.address.bytes),
        'function' in precompile ? precompile.function : undefined
      )
    }
  }
  for (const entry of precompileEntries) {
    if (precompileMap.has(entry.address)) {
      continue
    }
    const type = entry.check.type

    if (
      (type === PrecompileAvailabilityCheck.Hardfork && common.gteHardfork(entry.check.param)) ||
      (entry.check.type === PrecompileAvailabilityCheck.EIP &&
        common.isActivatedEIP(entry.check.param))
    ) {
      precompileMap.set(entry.address, entry.precompile)
    }
  }
  return precompileMap
}

function getPrecompileName(addressUnprefixedStr: string) {
  for (const entry of precompileEntries) {
    if (entry.address === addressUnprefixedStr) {
      return entry.name
    }
  }
}

export {
  getActivePrecompiles,
  getPrecompileName,
  MCLBLS,
  NobleBLS,
  precompileEntries,
  precompiles,
  ripemdPrecompileAddress,
}

export type { AddPrecompile, CustomPrecompile, DeletePrecompile, PrecompileFunc, PrecompileInput }
