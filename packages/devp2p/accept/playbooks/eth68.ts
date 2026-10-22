import { hexToBytes, intToBytes } from '@ethereumjs/util'

import { ETH, encodeGetBlockHeaders } from '../../src/protocol/eth.ts'

import type { Common } from '@ethereumjs/common'
import type { EthStatusOpts } from '../../src/protocol/eth.ts'

export const GENESIS_HASH =
  '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' as const

export const eth68Playbook = {
  capability: ETH.eth68,
  status(_common: Common): EthStatusOpts {
    return {
      // Plausible mainnet status so peers stay connected for a genesis header get.
      td: intToBytes(17_179_869_184),
      bestHash: hexToBytes(GENESIS_HASH),
      genesisHash: hexToBytes(GENESIS_HASH),
    }
  },
  headerGet: () =>
    encodeGetBlockHeaders(
      68,
      {
        startBlock: hexToBytes(GENESIS_HASH),
        limit: intToBytes(1),
        skip: intToBytes(0),
        reverse: intToBytes(0),
      },
      intToBytes(1),
    ),
  expectedHeaderHash: GENESIS_HASH,
}
