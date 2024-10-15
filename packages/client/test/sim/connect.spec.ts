import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { DPT, ETH, RLPx, SNAP } from '@ethereumjs/devp2p'
import { bytesToHex, hexToBytes, parseGethGenesisState, privateToAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import pectra3Json from './configs/pectra3.json'

// import {
//   createInlineClient,
//   filterKeywords,
//   filterOutWords,
//   runTxHelper,
//   setupEngineUpdateRelay,
//   startNetwork,
//   waitForELStart,
// } from './simutils.js'

import { Peer } from '@ethereumjs/devp2p'
const STATIC_ID = hexToBytes(
  '0x' + 'a9faec679fb6d5a68dc7f0301e4e13f35747f74d25e80edbc8768c24f43b128b',
)

let rlpx: RLPx

describe('simple mainnet test run', async () => {
  it.skipIf(false)(
    'connect',
    async () => {
      try {
        const common = createCommonFromGethGenesis(pectra3Json, { chain: 'pectra3' })
        // const customGenesisState = parseGethGenesisState(networkJSON)

        const privateKey = hexToBytes(
          '0xdc6457099f127cf0bac78de8b297df04951281909db4f58b43def7c7151e765d',
        )
        const peerHost = '127.0.0.1' // IP address of the devp2p server
        const peerPort = 30303 // devp2p server port
        const dpt = new DPT(privateKey, {
          // Disable discovery, only connect to peers manually
          shouldFindNeighbours: false,
        })
        rlpx = new RLPx(privateKey, {
          dpt,
          maxPeers: 25,
          capabilities: [ETH.eth65, ETH.eth64, SNAP.snap],
          listenPort: null,
          common,
        })

        await dpt
          .addPeer({ address: peerHost, udpPort: peerPort, tcpPort: peerPort })
          .then((peer) => {
            // return rlpx.connect({
            //   id: peer.id,
            //   address: peer.address,
            //   tcpPort: peer.tcpPort,
            //   udpPort: peer.tcpPort
            // })
            // console.log(peer)
            // console.log(bytesToHex(peer.id))
            console.log(rlpx)
            // const p = rlpx._peers.get(bytesToHex(peer.id).slice(2))
            // console.log(p)
            rlpx.events.on('peer:added', (peer: Peer) => {
              console.log('Connected to peer', peer)
              // Send payload to the peer here
              // const payload = Buffer.from([0x01, 0x02, 0x03]) // Example payload
              // peer.sendMessage(protocol, messageCode, payload)
            })

            rlpx.events.on('peer:removed', (peer, reasonCode, disconnectMessage) => {
              console.log('Disconnected from peer', reasonCode, disconnectMessage)
            })
          })
          .catch((err) => {
            console.log(`error on connection to local node: ${err.stack ?? err}`)
            rlpx.destroy()
          })
      } catch (error) {
        console.log(error)
      }
    },
    60_000,
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
