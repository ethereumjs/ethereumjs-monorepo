import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'

export type SnapPeerRef = { id: string; caps: string[] }

export interface SnapTransport {
  snapPeers(): SnapPeerRef[]
  sendAccountRange(peerId: string, payload: Uint8Array): void
  onAccountRange(handler: (peerId: string, payload: Uint8Array) => void): () => void
}

export function createLiveSnapTransport(client: Devp2pWorkerClient): SnapTransport {
  const handlers = new Set<(peerId: string, payload: Uint8Array) => void>()
  const onProtocol = (msg: {
    protocol: string
    peerId: string
    code: number
    payload: Uint8Array
  }) => {
    if (msg.protocol !== 'snap' || msg.code !== 0x01) return
    for (const h of handlers) h(msg.peerId, msg.payload)
  }
  client.events.on('protocol', onProtocol)
  return {
    snapPeers: () => [],
    sendAccountRange(peerId, payload) {
      const id = peerId.startsWith('0x') ? peerId.slice(2) : peerId
      const bytes = new Uint8Array(id.length / 2)
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16)
      }
      client.sendSnapMessage(bytes, 0x00, payload)
    },
    onAccountRange(handler) {
      handlers.add(handler)
      return () => handlers.delete(handler)
    },
  }
}
