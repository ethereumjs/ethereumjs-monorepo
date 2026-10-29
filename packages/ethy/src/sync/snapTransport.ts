import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'

export type SnapPeerRef = { id: string; caps: string[] }

export interface SnapTransport {
  snapPeers(): SnapPeerRef[]
  sendAccountRange(peerId: string, payload: Uint8Array): void
  onAccountRange(handler: (peerId: string, payload: Uint8Array) => void): () => void
  sendStorageRanges(peerId: string, payload: Uint8Array): void
  onStorageRanges(handler: (peerId: string, payload: Uint8Array) => void): () => void
  sendByteCodes(peerId: string, payload: Uint8Array): void
  onByteCodes(handler: (peerId: string, payload: Uint8Array) => void): () => void
}

function peerIdToWireBytes(peerId: string): Uint8Array {
  const id = peerId.startsWith('0x') ? peerId.slice(2) : peerId
  const bytes = new Uint8Array(id.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(id.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

export function createLiveSnapTransport(client: Devp2pWorkerClient): SnapTransport {
  const accountHandlers = new Set<(peerId: string, payload: Uint8Array) => void>()
  const storageHandlers = new Set<(peerId: string, payload: Uint8Array) => void>()
  const codeHandlers = new Set<(peerId: string, payload: Uint8Array) => void>()
  const onProtocol = (msg: {
    protocol: string
    peerId: string
    code: number
    payload: Uint8Array
  }) => {
    if (msg.protocol !== 'snap') return
    if (msg.code === 0x01) {
      for (const h of accountHandlers) h(msg.peerId, msg.payload)
    } else if (msg.code === 0x03) {
      for (const h of storageHandlers) h(msg.peerId, msg.payload)
    } else if (msg.code === 0x05) {
      for (const h of codeHandlers) h(msg.peerId, msg.payload)
    }
  }
  client.events.on('protocol', onProtocol)
  return {
    snapPeers: () => [],
    sendAccountRange(peerId, payload) {
      client.sendSnapMessage(peerIdToWireBytes(peerId), 0x00, payload)
    },
    onAccountRange(handler) {
      accountHandlers.add(handler)
      return () => accountHandlers.delete(handler)
    },
    sendStorageRanges(peerId, payload) {
      client.sendSnapMessage(peerIdToWireBytes(peerId), 0x02, payload)
    },
    onStorageRanges(handler) {
      storageHandlers.add(handler)
      return () => storageHandlers.delete(handler)
    },
    sendByteCodes(peerId, payload) {
      client.sendSnapMessage(peerIdToWireBytes(peerId), 0x04, payload)
    },
    onByteCodes(handler) {
      codeHandlers.add(handler)
      return () => codeHandlers.delete(handler)
    },
  }
}
