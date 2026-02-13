import type { Accesses } from '../../../src/bal.ts'
import type { PrefixedHexString } from '../../../src/types.ts'

import { hexToBytes } from '../../../src/bytes.ts'

export const balEmptyBlockNoCoinbaseHash: PrefixedHexString =
  '0xa6695ceda904efdec8a868ff6663cf44e9acd5a926720332897bca25589dba0b'

export const balEmptyBlockNoCoinbaseRLP: PrefixedHexString =
  '0xf8a4de9400000961ef480eb55e80d19ad83579a64c007002c0c480010203c0c0c0de940000bbddc7ce488642fb579f8b00f3a590007251c0c480010203c0c0c0f840940000f90827f1c53a10cb7a02335b175320002935e6e580e3e280a0f38ed3d9b968f777fef4d8f2c3caf4a9f02cdea52dc257a2b92118d4dd0c9357c0c0c0c0e394000f3df6d732807ef1319fb7b8bb8522d0beac02c6c50cc3c2800cc382200bc0c0c0'

/**
 * Internal Accesses format, converted from equivalent JSON file.
 *
 * Release : https://github.com/ethereum/execution-spec-tests/releases/tag/bal%40v5.0.0
 * Date    : Jan 27 2026
 * File    : blockchain_tests/amsterdam/eip7928_block_level_access_lists/block_access_lists/bal_empty_block_no_coinbase.json
 *
 * RLP taken from blockchain_tests_engine folder.
 */
export const balEmptyBlockNoCoinbase: Accesses = {
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
        [0, hexToBytes('0xf38ed3d9b968f777fef4d8f2c3caf4a9f02cdea52dc257a2b92118d4dd0c9357')],
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
}
