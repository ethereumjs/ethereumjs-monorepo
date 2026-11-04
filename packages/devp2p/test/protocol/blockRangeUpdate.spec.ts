import { Common, Mainnet } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { bigIntToUnpaddedBytes, hexToBytes, intToUnpaddedBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EthMessageCodes } from '../../src/protocol/eth/codes.ts'
import { ETH } from '../../src/protocol/index.ts'

describe('[Devp2p/Protocol]: BLOCK_RANGE_UPDATE', () => {
  it('peerStatusHead() reflects latest block and hash after BLOCK_RANGE_UPDATE on eth/69+', () => {
    const common = new Common({ chain: Mainnet })
    const peer = {
      common,
      disconnect: () => {},
      _socket: { remoteAddress: '127.0.0.1', remotePort: 30303 },
    } as never
    const eth = new ETH(69, peer, () => {})
    eth['_peerStatusValidated'] = true
    eth['_peerStatus'] = [
      intToUnpaddedBytes(1),
      intToUnpaddedBytes(1),
      hexToBytes('0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
      [hexToBytes('0x00'), intToUnpaddedBytes(0)],
      intToUnpaddedBytes(0),
      intToUnpaddedBytes(100),
      hexToBytes('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
    ]

    const latestHash = hexToBytes(
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    )
    const latestBlock = bigIntToUnpaddedBytes(12_055_140n)
    const earliest = intToUnpaddedBytes(0)
    const payload = RLP.encode([earliest, latestBlock, latestHash])
    eth._handleMessage(EthMessageCodes.BLOCK_RANGE_UPDATE, payload)

    const head = eth.peerStatusHead()
    assert.ok(head !== null)
    assert.strictEqual(head!.latestBlock, 12_055_140n)
    assert.strictEqual(
      Buffer.from(head!.bestHash).toString('hex'),
      Buffer.from(latestHash).toString('hex'),
    )
  })
})
