parentPort.postMessage({ type: 'LOG', event: 'Worker starting' })
import { Config } from '@ethereumjs/client/dist/esm/src/config.js'
import { RlpxServer } from '@ethereumjs/client/dist/esm/src/net/server/rlpxserver.js'
import { parentPort } from 'worker_threads'
let server = null

parentPort.on('message', async (data) => {
  parentPort.postMessage({ type: 'LOG', event: 'Worker received message', data })
  switch (data.type) {
    case 'INIT': {
      const { maxPeers, bootnodes, dnsNetworks, port, extIP } = data
      // Create a minimal config object with only the necessary data
      const config = new Config({
        maxPeers,
        port,
        extIP,
        events: {
          emit: (event, ...args) => {
            parentPort.postMessage({ type: 'EVENT', event, args })
          },
        },
      })
      server = new RlpxServer({ config, bootnodes, dnsNetworks })
      await server.start()
      await server.bootstrap()
      parentPort.postMessage({ type: 'INIT_COMPLETE' })
      break
    }
    case 'STOP': {
      if (server !== null) {
        parentPort.postMessage({ type: 'LOG', event: 'Worker stopping server...' })
        await server.stop()
        server = null
        parentPort.postMessage({ type: 'LOG', event: 'Worker server stopped' })
      }
      parentPort.postMessage({ type: 'STOP_COMPLETE' })
      break
    }
    case 'GET_NETWORK_INFO': {
      if (server !== null) {
        const info = server.getRlpxInfo()
        parentPort.postMessage({ type: 'NETWORK_INFO', info })
      }
      break
    }
    case 'ADD_PEER': {
      if (server !== null) {
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
      if (server !== null) {
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
if (server !== null) {
  server.config.events.on('PROTOCOL_MESSAGE', (message, protocol, peer) => {
    parentPort.postMessage({
      type: 'EVENT',
      event: 'PROTOCOL_MESSAGE',
      args: [message, protocol, peer],
    })
  })
  server.config.events.on('SERVER_ERROR', (error, _server) => {
    parentPort.postMessage({
      type: 'EVENT',
      event: 'SERVER_ERROR',
      args: [error, 'rlpx'],
    })
  })
}
