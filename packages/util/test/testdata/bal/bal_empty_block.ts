import type { Accesses } from '../../../src/bal.ts'
import type { PrefixedHexString } from '../../../src/types.ts'

import { hexToBytes } from '../../../src/bytes.ts'

export const balEmptyBlockHash: PrefixedHexString =
  '0x5a97cb33396576037bbad962facea607e719a31680c02a7671ac6d426a6a61e2'

/**
 * Converts the JSON BAL representation to the internal Accesses format.
 * This is equivalent to the data in bal_empty_block.json.
 */
export const balEmptyBlock: Accesses = {
  '0x00000961ef480eb55e80d19ad83579a64c007002': {
    nonceChanges: [],
    balanceChanges: [],
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(['0x00', '0x01', '0x02', '0x03']),
  },
  '0x0000bbddc7ce488642fb579f8b00f3a590007251': {
    nonceChanges: [],
    balanceChanges: [],
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(['0x00', '0x01', '0x02', '0x03']),
  },
  '0x0000f90827f1c53a10cb7a02335b175320002935': {
    nonceChanges: [],
    balanceChanges: [],
    codeChanges: [],
    storageChanges: {
      '0x00': [
        [0, hexToBytes('0x7f70ecfdb2f3ff276e1156fbf569c8d41047fc1cf00f32134d3d345404093ce2')],
      ],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x000f3df6d732807ef1319fb7b8bb8522d0beac02': {
    nonceChanges: [],
    balanceChanges: [],
    codeChanges: [],
    storageChanges: {
      '0x0c': [[0, hexToBytes('0x0c')]],
      '0x200b': [[0, hexToBytes('0xabcdef')]],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
}
