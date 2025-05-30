import { RlpxServer } from '@ethereumjs/client/dist/esm/src/net/server/rlpxserver.js'
import { parentPort } from 'worker_threads'

console.log('Worker starting...')

let server = null

parentPort.on('message', async (data) => {
  console.log('Worker received message:', data)
  switch (data.type) {
    case 'INIT': {
      console.log('Worker initializing server...')
      const { maxPeers, bootnodes, dnsNetworks } = data
      // Create a minimal config object with only the necessary data
      const config = {
        maxPeers,
        events: {
          emit: (event, ...args) => {
            parentPort.postMessage({ type: 'EVENT', event, args })
          },
        },
      }
      server = new RlpxServer({ config, bootnodes, dnsNetworks })
      await server.start()
      await server.bootstrap()
      console.log('Worker server started')
      parentPort.postMessage({ type: 'INIT_COMPLETE' })
      break
    }
    case 'STOP': {
      if (server) {
        console.log('Worker stopping server...')
        await server.stop()
        server = null
        console.log('Worker server stopped')
      }
      parentPort.postMessage({ type: 'STOP_COMPLETE' })
      break
    }
    case 'GET_NETWORK_INFO': {
      if (server) {
        const info = server.getRlpxInfo()
        parentPort.postMessage({ type: 'NETWORK_INFO', info })
      }
      break
    }
    case 'ADD_PEER': {
      if (server) {
        try {
          const peerInfo = await server.dpt.addPeer(data.peer)
          parentPort.postMessage({ type: 'PEER_ADDED', peerInfo })
        } catch (error) {
          parentPort.postMessage({ type: 'PEER_ADD_ERROR', error: error.message })
        }
      }
      break
    }
    case 'BAN_PEER': {
      if (server) {
        try {
          await server.ban(data.peerId, data.maxAge)
          parentPort.postMessage({ type: 'PEER_BANNED', peerId: data.peerId })
        } catch (error) {
          parentPort.postMessage({ type: 'PEER_BAN_ERROR', error: error.message })
        }
      }
      break
    }
  }
})

// Forward protocol messages to main thread
if (server) {
  server.config.events.on('PROTOCOL_MESSAGE', (message, protocol, peer) => {
    console.log('Worker forwarding protocol message:', { message, protocol, peer })
    parentPort.postMessage({
      type: 'EVENT',
      event: 'PROTOCOL_MESSAGE',
      args: [message, protocol, peer],
    })
  })
}
