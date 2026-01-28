import type { Accesses } from '../../../src/bal.ts'
import type { PrefixedHexString } from '../../../src/types.ts'

import { hexToBytes } from '../../../src/bytes.ts'

export const balSimpleHash: PrefixedHexString =
  '0xf487a8de6b5b4c5ed1238362d193bb840e9ac76cf13df283cb1ccfc23a69f673'

/**
 * Converts the JSON BAL representation to the internal Accesses format.
 * This is equivalent to the data in bal_simple.json.
 */
export const balSimple: Accesses = {
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
        [0, hexToBytes('0x372103e56664908ceaa2479eae7f3e852363b920a2ee7a19559b0a2035ba3d21')],
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
  '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba': {
    nonceChanges: [],
    balanceChanges: [
      [1, '0xf618'],
      [2, '0x01ec30'],
    ],
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x6032d7702ce646223d30c900bfc4d8641ce84dd1': {
    nonceChanges: [],
    balanceChanges: [
      [1, '0x0a'],
      [2, '0x14'],
    ],
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x9c450aafafe41b35edac4bc49eddb23209a250dc': {
    nonceChanges: [[2, '0x01']],
    balanceChanges: [[2, '0x3635c9adc5de9ccba6']],
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xf5ffa27864bf419390eaa7c520b528a740c594de': {
    nonceChanges: [[1, '0x01']],
    balanceChanges: [[1, '0x3635c9adc5de9ccba6']],
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
}
