import { EventEmitter } from 'eventemitter3'

import { bytesToUnprefixedHex } from '@ethereumjs/util'

import type { MessagePort, Worker } from 'node:worker_threads'
import type { PeerInfo } from '../types.ts'
import type {
  ThreadedNetworkInitOptions,
  WorkerCommand,
  WorkerEvent,
  WorkerTelemetrySnapshot,
} from './protocol.ts'

export interface Devp2pWorkerClientEvents {
  ready: [{ udpPort: number; tcpPort: number }]
  protocol: [{ protocol: 'eth' | 'snap'; peerId: string; code: number; payload: Uint8Array }]
  telemetry: [WorkerTelemetrySnapshot]
  error: [Error]
  stopped: []
}

type Transport = MessagePort | Worker

function copyForSend(bytes: Uint8Array): Uint8Array {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy
}

/**
 * Main-thread handle for a {@link Devp2pWorkerHost} running in a worker or in-process port.
 */
const WORKER_TERMINATE_MS = 400

export class Devp2pWorkerClient {
  public readonly events = new EventEmitter<Devp2pWorkerClientEvents>()
  private readonly _transport: Transport
  private _started = false
  private _stopped = false

  constructor(transport: Transport) {
    this._transport = transport
    transport.on('message', (message: WorkerEvent) => this._onEvent(message))
  }

  private _send(cmd: WorkerCommand, transfer?: ArrayBuffer[]): void {
    if (transfer !== undefined && transfer.length > 0) {
      this._transport.postMessage(cmd, transfer)
    } else {
      this._transport.postMessage(cmd)
    }
  }

  private _shutdownTransport(): void {
    if ('terminate' in this._transport && typeof this._transport.terminate === 'function') {
      this._transport.terminate()
    } else if ('close' in this._transport && typeof this._transport.close === 'function') {
      this._transport.close()
    }
  }

  private _onEvent(event: WorkerEvent): void {
    switch (event.type) {
      case 'ready':
        this.events.emit('ready', { udpPort: event.udpPort, tcpPort: event.tcpPort })
        break
      case 'protocol':
        this.events.emit('protocol', {
          protocol: event.protocol,
          peerId: event.peerId,
          code: event.code,
          payload: event.payload,
        })
        break
      case 'telemetry':
        this.events.emit('telemetry', event.snapshot)
        break
      case 'error':
        this.events.emit('error', new Error(event.message))
        break
      case 'stopped':
        this.events.emit('stopped')
        break
    }
  }

  /** Initialize host state (must run before {@link start}). */
  init(options: ThreadedNetworkInitOptions): void {
    this._initOptions = options
  }

  private _initOptions: ThreadedNetworkInitOptions | null = null

  /** Bind listeners and begin telemetry. */
  async start(): Promise<void> {
    if (this._started) return
    if (this._initOptions === null) {
      throw new Error('Devp2pWorkerClient.init() required before start()')
    }
    this._started = true
    this._send({ type: 'boot', options: this._initOptions })
  }

  stop(): void {
    if (this._stopped) return
    this._stopped = true
    try {
      this._send({ type: 'stop' })
    } catch {
      // Port may already be closed.
    }

    if ('terminate' in this._transport && typeof this._transport.terminate === 'function') {
      const worker = this._transport
      const term = worker.terminate()
      void Promise.race([
        term,
        new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, WORKER_TERMINATE_MS)
          timer.unref()
        }),
      ]).catch(() => {})
      return
    }

    this._shutdownTransport()
  }

  connectPeer(peer: PeerInfo): void {
    this._send({ type: 'connectPeer', peer })
  }

  disconnectPeer(peerId: Uint8Array, reason?: number): void {
    this._send({ type: 'disconnectPeer', peerId, reason })
  }

  sendEthMessage(peerId: Uint8Array, code: number, rlpPayload: Uint8Array): void {
    const payload = copyForSend(rlpPayload)
    this._send({ type: 'sendEthMessage', peerId, code, payload }, [payload.buffer as ArrayBuffer])
  }

  sendSnapMessage(peerId: Uint8Array, code: number, rlpPayload: Uint8Array): void {
    const payload = copyForSend(rlpPayload)
    this._send({ type: 'sendSnapMessage', peerId, code, payload }, [payload.buffer as ArrayBuffer])
  }

  setBlockRange(earliest: Uint8Array, latest: Uint8Array, latestHash: Uint8Array): void {
    this._send({ type: 'setBlockRange', earliest, latest, latestHash })
  }

  /** @internal Test helper */
  peerIdHex(peerId: Uint8Array): string {
    return bytesToUnprefixedHex(peerId)
  }
}
