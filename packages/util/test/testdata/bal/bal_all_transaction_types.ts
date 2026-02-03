import type { Accesses } from '../../../src/bal.ts'
import type { PrefixedHexString } from '../../../src/types.ts'

import { hexToBytes } from '../../../src/bytes.ts'

export const balAllTransactionTypesHash: PrefixedHexString =
  '0x656055f6f0599b43484b03a8a379b14a61b87c116aca83829f6d0c1f435b285c'

export const balAllTransactionTypesRLP: PrefixedHexString =
  '0xf9028ede9400000961ef480eb55e80d19ad83579a64c007002c0c480010203c0c0c0de940000bbddc7ce488642fb579f8b00f3a590007251c0c480010203c0c0c0f840940000f90827f1c53a10cb7a02335b175320002935e6e580e3e280a08567617f5fede9ef173b5a29d6b35d856c2c98ebab2397331cb670791ec1dddbc0c0c0c0e394000f3df6d732807ef1319fb7b8bb8522d0beac02c6c50cc3c2800cc382200bc0c0c0f83d940c7dcbd9e1c8f0cafb629cd4251570cd9c8c8ad2c6c501c3c20505c0c0c3c20501dad90597ef0100bf0980440e98d1dc6ef4714a120302d7229671d9f838942adc25665018aa1fe0e6bc666dac8fc2697ff9bac0c0dec5018301fad3c502830411c6c50383075e7bc504830aab30c505830ee93ec0c0e9943c138d679072c173dabdc3fd45380f41ead0b3d4c0c0cccb03893635c9adc5de9814b4c3c20301c0e99495c7ed676f490cd77cdb941c70f49b2256e3a0e4c0c0cccb02893635c9adc5de9908d6c3c20201c0e994a0a12c0d5ddf86a31979ac889518fb57c9ee1d69c0c0cccb05893635c9adc5de95d178c3c20501c0e994b06f60a2a3d59e7902432200a69612c1970d3d67c0c0cccb04893635c9adc5de9614b4c3c20401c0e094bf0980440e98d1dc6ef4714a120302d722966dd9c6c501c3c20101c0c0c0c0e094bf0980440e98d1dc6ef4714a120302d722966ed9c6c501c3c20202c0c0c0c0e094bf0980440e98d1dc6ef4714a120302d722966fd9c6c501c3c20303c0c0c0c0e094bf0980440e98d1dc6ef4714a120302d7229670d9c6c501c3c20404c0c0c0c0da94bf0980440e98d1dc6ef4714a120302d7229671d9c0c0c0c0c0e994bf9375cb0fa8610da19655ba849d9e2b276416c0c0c0cccb01893635c9adc5de996696c3c20101c0'

/**
 * Internal Accesses format, converted from equivalent JSON file.
 *
 * Release : https://github.com/ethereum/execution-spec-tests/releases/tag/bal%40v5.0.0
 * Date    : Jan 27 2026
 * File    : blockchain_tests/amsterdam/eip7928_block_level_access_lists/bal_all_transaction_types.json
 *
 * RLP taken from blockchain_tests_engine folder.
 */
export const balAllTransactionTypes: Accesses = {
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
        [0, hexToBytes('0x8567617f5fede9ef173b5a29d6b35d856c2c98ebab2397331cb670791ec1dddb')],
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
    },
    storageReads: new Set<PrefixedHexString>(['0x200b']),
  },
  '0x0c7dcbd9e1c8f0cafb629cd4251570cd9c8c8ad2': {
    nonceChanges: new Map<number, PrefixedHexString>([[5, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [[5, hexToBytes('0xef0100bf0980440e98d1dc6ef4714a120302d7229671d9')]],
    storageChanges: {
      '0x01': [[5, hexToBytes('0x05')]],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>([
      [1, '0x01fad3'],
      [2, '0x0411c6'],
      [3, '0x075e7b'],
      [4, '0x0aab30'],
      [5, '0x0ee93e'],
    ]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x3c138d679072c173dabdc3fd45380f41ead0b3d4': {
    nonceChanges: new Map<number, PrefixedHexString>([[3, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>([[3, '0x3635c9adc5de9814b4']]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0x95c7ed676f490cd77cdb941c70f49b2256e3a0e4': {
    nonceChanges: new Map<number, PrefixedHexString>([[2, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>([[2, '0x3635c9adc5de9908d6']]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xa0a12c0d5ddf86a31979ac889518fb57c9ee1d69': {
    nonceChanges: new Map<number, PrefixedHexString>([[5, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>([[5, '0x3635c9adc5de95d178']]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xb06f60a2a3d59e7902432200a69612c1970d3d67': {
    nonceChanges: new Map<number, PrefixedHexString>([[4, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>([[4, '0x3635c9adc5de9614b4']]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xbf0980440e98d1dc6ef4714a120302d722966dd9': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {
      '0x01': [[1, hexToBytes('0x01')]],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xbf0980440e98d1dc6ef4714a120302d722966ed9': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {
      '0x01': [[2, hexToBytes('0x02')]],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xbf0980440e98d1dc6ef4714a120302d722966fd9': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {
      '0x01': [[3, hexToBytes('0x03')]],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xbf0980440e98d1dc6ef4714a120302d7229670d9': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {
      '0x01': [[4, hexToBytes('0x04')]],
    },
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xbf0980440e98d1dc6ef4714a120302d7229671d9': {
    nonceChanges: new Map<number, PrefixedHexString>(),
    balanceChanges: new Map<number, PrefixedHexString>(),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
  '0xbf9375cb0fa8610da19655ba849d9e2b276416c0': {
    nonceChanges: new Map<number, PrefixedHexString>([[1, '0x01']]),
    balanceChanges: new Map<number, PrefixedHexString>([[1, '0x3635c9adc5de996696']]),
    codeChanges: [],
    storageChanges: {},
    storageReads: new Set<PrefixedHexString>(),
  },
}
