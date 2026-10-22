import { hexToBytes, intToBytes } from '@ethereumjs/util'

import { ETH, encodeGetBlockHeaders } from '../../src/protocol/eth.ts'

import type { Common } from '@ethereumjs/common'
import type { EthStatusOpts } from '../../src/protocol/eth.ts'

export const GENESIS_HASH =
  '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3' as const

export const eth69Playbook = {
  capability: ETH.eth69,
  status(_common: Common): EthStatusOpts {
    return {
      genesisHash: hexToBytes(GENESIS_HASH),
      earliestBlock: intToBytes(0),
      latestBlock: intToBytes(0),
      latestBlockHash: hexToBytes(GENESIS_HASH),
    }
  },
  headerGet: () =>
    encodeGetBlockHeaders(
      69,
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
