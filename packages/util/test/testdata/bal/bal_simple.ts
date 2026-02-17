import type { Accesses } from '../../../src/bal.ts'
import type { PrefixedHexString } from '../../../src/types.ts'

import { hexToBytes } from '../../../src/bytes.ts'

export const balSimpleHash: PrefixedHexString =
  '0xf487a8de6b5b4c5ed1238362d193bb840e9ac76cf13df283cb1ccfc23a69f673'

export const balSimpleRLP: PrefixedHexString =
  '0xf90147de9400000961ef480eb55e80d19ad83579a64c007002c0c480010203c0c0c0de940000bbddc7ce488642fb579f8b00f3a590007251c0c480010203c0c0c0f840940000f90827f1c53a10cb7a02335b175320002935e6e580e3e280a0372103e56664908ceaa2479eae7f3e852363b920a2ee7a19559b0a2035ba3d21c0c0c0c0eb94000f3df6d732807ef1319fb7b8bb8522d0beac02d1c50cc3c2800cca82200bc6c58083abcdefc0c0c0c0e5942adc25665018aa1fe0e6bc666dac8fc2697ff9bac0c0cbc40182f618c5028301ec30c0c0e0946032d7702ce646223d30c900bfc4d8641ce84dd1c0c0c6c2010ac20214c0c0e9949c450aafafe41b35edac4bc49eddb23209a250dcc0c0cccb02893635c9adc5de9ccba6c3c20201c0e994f5ffa27864bf419390eaa7c520b528a740c594dec0c0cccb01893635c9adc5de9ccba6c3c20101c0'

/**
 * Internal Accesses format, converted from equivalent JSON file.
 *
 * Release : https://github.com/ethereum/execution-spec-tests/releases/tag/bal%40v3.0.1
 * Date    : Jan 13 2026
 * File    : blockchain_tests/amsterdam/eip7928_block_level_access_lists/bal_simple.json
 *
 * RLP taken from blockchain_tests_engine folder.
 *
 * Note: Older test data, replace in case of problems or spec changes.
 */
export const balSimple: Accesses = {
  '0x00000961ef480eb55e80d19ad83579a64c007002': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(['0x00', '0x01', '0x02', '0x03']),
  },
  '0x0000bbddc7ce488642fb579f8b00f3a590007251': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(['0x00', '0x01', '0x02', '0x03']),
  },
  '0x0000f90827f1c53a10cb7a02335b175320002935': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {
      '0x00': [
        [0, hexToBytes('0x372103e56664908ceaa2479eae7f3e852363b920a2ee7a19559b0a2035ba3d21')],
      ],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x000f3df6d732807ef1319fb7b8bb8522d0beac02': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {
      '0x0c': [[0, hexToBytes('0x0c')]],
      '0x200b': [[0, hexToBytes('0xabcdef')]],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>([
      [1, '0xf618'],
      [2, '0x01ec30'],
    ]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x6032d7702ce646223d30c900bfc4d8641ce84dd1': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>([
      [1, '0x0a'],
      [2, '0x14'],
    ]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x9c450aafafe41b35edac4bc49eddb23209a250dc': {
    nonceChanges: new Map<number, PrefixedHexString>([[2, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>([[2, '0x3635c9adc5de9ccba6']]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xf5ffa27864bf419390eaa7c520b528a740c594de': {
    nonceChanges: new Map<number, PrefixedHexString>([[1, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>([[1, '0x3635c9adc5de9ccba6']]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
}
