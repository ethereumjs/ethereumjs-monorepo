import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { DPT, ETH, LES, RLPx, SNAP } from '@ethereumjs/devp2p'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'
import { Peer } from '@ethereumjs/devp2p'

import pectra3Json from './configs/pectra3.json'
import { Protocol } from '../../src/net/protocol/protocol.js'

const STATIC_ID = hexToBytes(
  '0x' + 'a9faec679fb6d5a68dc7f0301e4e13f35747f74d25e80edbc8768c24f43b128b',
)
const _getTrieNodesRLP =
  '0xeb01a0aa3cd09df0b7c0efbd473200c6db3117b51b68af7a5523334db0208d05e1729ec4c180c180834c4b40'

let rlpx: RLPx
const getPeerAddr = (peer: Peer) => `${peer['_socket'].remoteAddress}:${peer['_socket'].remotePort}`

describe('simple mainnet test run', async () => {
  try {
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
          const addr = getPeerAddr(peer)
          console.log(peer.getProtocols())
          const snap = peer.getProtocols()[0]
          // snap.sendMessage(SNAP.MESSAGE_CODES.GET_TRIE_NODES, _getTrieNodesRLP)
          // snap.sendMessage(SNAP.MESSAGE_CODES.TRIE_NODES, [])
          // const requests: { headers: BlockHeader[]; bodies: any[] } = { headers: [], bodies: [] }
          // const clientId = peer.getHelloMessage().clientId
          // console.log(`Add peer: ${addr} ${clientId} (snap${snap.getVersion()}) (total: ${rlpx.getPeers().length})`,)
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

process.on('uncaughtException', (err, origin) => {
  console.log({ err, origin })
  process.exit()
})
