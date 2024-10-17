import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { DPT, LES, RLPx, SNAP } from '@ethereumjs/devp2p'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'
import { Peer, Protocol } from '@ethereumjs/devp2p'

import pectra3Json from './configs/pectra3.json'
import { Config } from '../../src/index.js'
import { Chain } from '../../src/blockchain/index.js'
import { SnapProtocol } from '../../src/net/protocol/index.js'

const STATIC_ID = hexToBytes(
  '0x' + 'a9faec679fb6d5a68dc7f0301e4e13f35747f74d25e80edbc8768c24f43b128b',
)
let rlpx: RLPx

describe('simple mainnet test run', async () => {
  try {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new SnapProtocol({ config, chain })

    const common = createCommonFromGethGenesis(pectra3Json, { chain: 'pectra3' })
    const privateKey = hexToBytes(
      '0xdc6457099f127cf0bac78de8b297df04951281909db4f58b43def7c7151e765d',
    )
    const peerHost = '127.0.0.1' // IP address of the devp2p server
    const peerPort = 30303 // devp2p server port
    const dpt = new DPT(privateKey, {
      // Disable discovery, only connect to peers manually
      shouldFindNeighbours: false,
      refreshInterval: 30000,
      endpoint: { address: peerHost, udpPort: peerPort, tcpPort: peerPort },
    })
    dpt.events.on('error', (err) => console.error(`DPT error: ${err}`))
    rlpx = new RLPx(privateKey, {
      dpt,
      maxPeers: 25,
      capabilities: [SNAP.snap, LES.les4],
      common,
    })
    rlpx.events.on('error', (err) => console.error(`RLPx error: ${err.stack ?? err}`))

    await dpt
      .addPeer({ address: peerHost, udpPort: peerPort, tcpPort: peerPort })
      .then((peer) => {
        rlpx.events.on('peer:added', (peer: Peer) => {
          // Send payload to the peer here
          const snap: Protocol = peer.getProtocols()[0] as any
          const reqId = BigInt(1)
          const root = hexToBytes(
            '0x04157502e6177a76ca4dbf7784e5ec1a926049db6a91e13efb70a095a72a45d9',
          )
          const paths = [[hexToBytes('0x')]]
          const bytes = BigInt(5000000)

          const payload = p.encode(
            p.messages.filter((message) => message.name === 'GetTrieNodes')[0],
            {
              reqId,
              root,
              paths,
              bytes,
            },
          )

          snap.sendMessage(SNAP.MESSAGE_CODES.GET_TRIE_NODES, payload)
          // snap.sendMessage(SNAP.MESSAGE_CODES.TRIE_NODES, [])
          // const requests: { headers: BlockHeader[]; bodies: any[] } = { headers: [], bodies: [] }
          // const clientId = peer.getHelloMessage().clientId
          // console.log(`Add peer: ${addr} ${clientId} (snap${snap.getVersion()}) (total: ${rlpx.getPeers().length})`,)

          // snap.events.once('TrieNodes', (status: devp2p.SNAP.) => {
          //   const msg = [
          //     Uint8Array.from([]),
          //     [
          //       bytesToInt(status['headNum']),
          //       Uint8Array.from([1]),
          //       Uint8Array.from([]),
          //       Uint8Array.from([1]),
          //     ],
          //   ]
          //   snap.sendMessage(devp2p.LES.MESSAGE_CODES.GET_BLOCK_HEADERS, msg)
          // })
        })
        rlpx.events.on('peer:removed', (peer, reasonCode, disconnectMessage) => {
          console.log('Disconnected from peer', reasonCode, disconnectMessage)
        })
        rlpx._connectToPeer(peer)
      })
      .catch((err) => {
        console.log(`error on connection to local node: ${err.stack ?? err}`)
        rlpx.destroy()
      })
  } catch (error) {
    console.log(error)
  }
  it.skipIf(false)(
    'connect',
    async () => {
      console.log('dbg200')
    },
    0,
  )

  it('network cleanup', async () => {
    try {
      rlpx.disconnect(STATIC_ID)
      assert.ok(true, 'network cleaned')
    } catch (e) {
      assert.fail('network not cleaned properly')
    }
  }, 60_000)
})
