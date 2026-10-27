import { concatBytes, hexToBytes, intToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Common, Mainnet } from '@ethereumjs/common'
import { EthMessageCodes } from '../../src/protocol/eth/codes.ts'
import { ETH } from '../../src/protocol/index.ts'
import { destroyRLPXs, initTwoPeerRLPXSetup } from '../helpers.ts'

import type { Peer } from '../../src/rlpx/peer.ts'

async function connectedPeers(
  basePort: number,
): Promise<{ rlpxs: ReturnType<typeof initTwoPeerRLPXSetup>['rlpxs']; local: Peer; remote: Peer }> {
  const { rlpxs, peer } = initTwoPeerRLPXSetup(
    2,
    [ETH.eth68],
    new Common({ chain: Mainnet }),
    basePort,
  )
  const connected = new Promise<void>((resolve, reject) => {
    rlpxs[0]!.events.once('peer:added', () => resolve())
    rlpxs[0]!.events.once('error', reject)
  })
  await rlpxs[0]!.connect({ ...peer, id: rlpxs[1]!.id })
  await connected
  await new Promise((r) => setTimeout(r, 200))
  const local = rlpxs[0]!.getPeers()[0]!
  const remote = rlpxs[1]!.getPeers()[0]!
  return { rlpxs, local, remote }
}

function captureOutboundFrames(socket: import('net').Socket): () => Uint8Array {
  const parts: Uint8Array[] = []
  socket.write = ((chunk: string | Uint8Array | Buffer) => {
    if (typeof chunk === 'string') {
      parts.push(new Uint8Array(Buffer.from(chunk)))
    } else {
      parts.push(new Uint8Array(chunk))
    }
    return true
  }) as typeof socket.write
  return () => concatBytes(...parts)
}

describe('[Devp2p/RLPx]: Peer socket buffering', () => {
  it('Peer._onSocketData() reassembles a large ETH frame fed in 32 TCP chunks', async () => {
    const { rlpxs, local, remote } = await connectedPeers(30480)

    const remoteEth = remote.getProtocols().find((p) => p.constructor.name === 'ETH') as ETH
    const gotMessage = new Promise<number>((resolve) => {
      remoteEth.events.once('message', (code) => {
        if (code === EthMessageCodes.GET_BLOCK_BODIES) resolve(code)
      })
    })

    const remoteSocket = remote['_socket'] as import('net').Socket
    remoteSocket.pause()
    remoteSocket.removeAllListeners('data')

    const localEth = local.getProtocols().find((p) => p.constructor.name === 'ETH') as ETH
    const localSocket = local['_socket'] as import('net').Socket
    const finishCapture = captureOutboundFrames(localSocket)
    const bodyHashes = Array.from({ length: 18000 }, (_, i) => {
      const hash = new Uint8Array(32)
      hash[0] = i & 0xff
      hash[1] = (i >> 8) & 0xff
      hash[2] = (i >> 16) & 0xff
      hash[31] = 0xa5
      return hash
    })
    localEth.sendMessage(EthMessageCodes.GET_BLOCK_BODIES, [intToBytes(1), bodyHashes])

    await new Promise((r) => setTimeout(r, 300))
    const wire = finishCapture()
    assert.ok(
      wire.length >= 64 * 1024,
      `expected a large RLPx frame (snappy-compressed bodies list), got ${wire.length} bytes`,
    )

    const slices = 32
    const sliceSize = Math.ceil(wire.length / slices)
    for (let i = 0; i < slices; i++) {
      const start = i * sliceSize
      const end = Math.min(start + sliceSize, wire.length)
      if (start >= wire.length) break
      remote._onSocketData(wire.subarray(start, end))
    }

    const code = await Promise.race([
      gotMessage,
      new Promise<number>((_, reject) =>
        setTimeout(() => reject(new Error('timeout waiting for GET_BLOCK_BODIES')), 5000),
      ),
    ])
    assert.strictEqual(code, EthMessageCodes.GET_BLOCK_BODIES)

    destroyRLPXs(rlpxs)
  })
})
