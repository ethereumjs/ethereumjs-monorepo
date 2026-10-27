import { RLP } from '@ethereumjs/rlp'
import { assert, describe, it } from 'vitest'

import { Common, Mainnet } from '@ethereumjs/common'
import { ETH } from '../../src/protocol/index.ts'
import { SNAP, SnapMessageCodes } from '../../src/protocol/snap.ts'
import { destroyRLPXs, initTwoPeerRLPXSetup } from '../helpers.ts'
describe('[Devp2p/Protocol]: SNAP snappy', () => {
  it('SNAP GET_ACCOUNT_RANGE round-trips between two peers on base protocol v5', async () => {
    const { rlpxs, peer } = initTwoPeerRLPXSetup(
      2,
      [ETH.eth68, SNAP.snap],
      new Common({ chain: Mainnet }),
      30460,
    )
    const done = new Promise<void>((resolve, reject) => {
      rlpxs[1]!.events.once('peer:added', (remote) => {
        const snap = remote.getProtocols().find((p) => p.constructor.name === 'SNAP') as SNAP
        snap.events.once('message', (code) => {
          if (code === SnapMessageCodes.GET_ACCOUNT_RANGE) {
            resolve()
          }
        })
      })
      rlpxs[1]!.events.once('error', reject)
    })
    await rlpxs[0]!.connect({ ...peer, id: rlpxs[1]!.id })
    await new Promise((r) => setTimeout(r, 500))
    const localPeer = rlpxs[0]!.getPeers()[0]
    assert.ok(localPeer)
    const snap = localPeer.getProtocols().find((p) => p.constructor.name === 'SNAP') as SNAP
    snap.sendMessage(SnapMessageCodes.GET_ACCOUNT_RANGE, [1, [0, 1, 0, 0]])
    await done
    destroyRLPXs(rlpxs)
  })

  it('SNAP.sendMessage() skips snappy when hello protocolVersion is below 5', () => {
    const fakePeer = {
      _hello: { protocolVersion: 4 },
      _socket: { remoteAddress: '127.0.0.1', remotePort: 1 },
    }
    const sent: Uint8Array[] = []
    const snap = new SNAP(1, fakePeer as never, (_code, data) => {
      sent.push(data)
    })
    const payload = [1, [0, 1, 0, 0]]
    snap.sendMessage(SnapMessageCodes.GET_ACCOUNT_RANGE, payload)
    const plain = RLP.encode(payload)
    assert.deepStrictEqual(sent[0], plain)
    const withSnappyHello = {
      _hello: { protocolVersion: 5 },
      _socket: { remoteAddress: '127.0.0.1', remotePort: 1 },
    }
    const sentV5: Uint8Array[] = []
    const snapV5 = new SNAP(1, withSnappyHello as never, (_code, data) => {
      sentV5.push(data)
    })
    snapV5.sendMessage(SnapMessageCodes.GET_ACCOUNT_RANGE, payload)
    assert.ok(!sentV5[0]!.every((b, i) => b === plain[i]))
  })
})
