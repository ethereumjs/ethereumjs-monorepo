import { EventEmitter } from 'eventemitter3'

import { bytesToUnprefixedHex } from '@ethereumjs/util'

import type { MessagePort, Worker } from 'node:worker_threads'
import type { PeerInfo } from '../types.ts'
import type {
  ThreadedNetworkInitOptions,
  WorkerCommand,
  WorkerEthyLocalStatus,
  WorkerEvent,
  WorkerTelemetrySnapshot,
} from './protocol.ts'

export interface Devp2pWorkerClientEvents {
  ready: [{ udpPort: number; tcpPort: number }]
  protocol: [
    {
      protocol: 'eth' | 'snap' | 'ethy'
      peerId: string
      code: number
      payload: Uint8Array
    },
  ]
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

  sendEthyMessage(peerId: Uint8Array, code: number, rlpPayload: Uint8Array): void {
    const payload = copyForSend(rlpPayload)
    this._send({ type: 'sendEthyMessage', peerId, code, payload }, [payload.buffer as ArrayBuffer])
  }

  setEthyStatus(status: WorkerEthyLocalStatus): void {
    this._send({ type: 'setEthyStatus', status })
  }

  setEthyWitnessDir(dir: string | undefined): void {
    this._send({ type: 'setEthyWitnessDir', dir })
  }

  setSharedCodeDir(dir: string | undefined): void {
    this._send({ type: 'setSharedCodeDir', dir })
  }

  setEthyStorageDir(dir: string | undefined): void {
    this._send({ type: 'setEthyStorageDir', dir })
  }

  putEthyWitness(witness: {
    accountHash: Uint8Array
    anchorBlock: bigint
    anchorStateRoot: Uint8Array
    accountRlpOrEmpty: Uint8Array
    slots: Array<{ slotHash: Uint8Array; slotValOrEmpty: Uint8Array }>
    proofNodes: Uint8Array[]
  }): void {
    const accountHash = copyForSend(witness.accountHash)
    const anchorStateRoot = copyForSend(witness.anchorStateRoot)
    const accountRlpOrEmpty = copyForSend(witness.accountRlpOrEmpty)
    const slots = witness.slots.map((s) => ({
      slotHash: copyForSend(s.slotHash),
      slotValOrEmpty: copyForSend(s.slotValOrEmpty),
    }))
    const proofNodes = witness.proofNodes.map((p) => copyForSend(p))
    const transfer = [
      accountHash.buffer,
      anchorStateRoot.buffer,
      accountRlpOrEmpty.buffer,
      ...slots.flatMap((s) => [s.slotHash.buffer, s.slotValOrEmpty.buffer]),
      ...proofNodes.map((p) => p.buffer),
    ] as ArrayBuffer[]
    this._send(
      {
        type: 'putEthyWitness',
        witness: {
          accountHash,
          anchorBlock: witness.anchorBlock.toString(),
          anchorStateRoot,
          accountRlpOrEmpty,
          slots,
          proofNodes,
        },
      },
      transfer,
    )
  }

  putEthySubtreeRoots(
    anchorBlock: bigint,
    entries: Array<{ bucketIndex: number; subtreeRootHash: Uint8Array }>,
  ): void {
    const wire = entries.map((e) => ({
      bucketIndex: e.bucketIndex,
      subtreeRootHash: copyForSend(e.subtreeRootHash),
    }))
    const transfer = wire.map((e) => e.subtreeRootHash.buffer) as ArrayBuffer[]
    this._send(
      {
        type: 'putEthySubtreeRoots',
        anchorBlock: anchorBlock.toString(),
        entries: wire,
      },
      transfer,
    )
  }

  putSharedCode(codeHash: Uint8Array, code: Uint8Array): void {
    const hash = copyForSend(codeHash)
    const bytecode = copyForSend(code)
    this._send({ type: 'putSharedCode', codeHash: hash, code: bytecode }, [
      hash.buffer as ArrayBuffer,
      bytecode.buffer as ArrayBuffer,
    ])
  }

  putEthyStorageEntry(entry: {
    accountHash: Uint8Array
    storageRoot: Uint8Array
    chunkBlockNumber: bigint
    slotsSlab64B: Uint8Array
    complete: boolean
    proofNodes?: Uint8Array[]
  }): void {
    const accountHash = copyForSend(entry.accountHash)
    const storageRoot = copyForSend(entry.storageRoot)
    const slotsSlab64B = copyForSend(entry.slotsSlab64B)
    const proofNodes = entry.proofNodes?.map((p) => copyForSend(p)) ?? []
    const transfer = [
      accountHash.buffer,
      storageRoot.buffer,
      slotsSlab64B.buffer,
      ...proofNodes.map((p) => p.buffer),
    ] as ArrayBuffer[]
    this._send(
      {
        type: 'putEthyStorageEntry',
        entry: {
          accountHash,
          storageRoot,
          chunkBlockNumber: entry.chunkBlockNumber.toString(),
          slotsSlab64B,
          complete: entry.complete,
          proofNodes,
        },
      },
      transfer,
    )
  }

  setEthyPivotAccountsDir(dir: string | undefined): void {
    this._send({ type: 'setEthyPivotAccountsDir', dir })
  }

  putEthyAccountChunk(chunk: {
    bucketIndex: number
    originHash: Uint8Array
    lastHash: Uint8Array
    hasRight: number
    chunkStateRoot: Uint8Array
    chunkBlockNumber: bigint
    binaryAccountsSlab: Uint8Array
    proofNodes: Uint8Array[]
  }): void {
    const originHash = copyForSend(chunk.originHash)
    const lastHash = copyForSend(chunk.lastHash)
    const chunkStateRoot = copyForSend(chunk.chunkStateRoot)
    const binaryAccountsSlab = copyForSend(chunk.binaryAccountsSlab)
    const proofNodes = chunk.proofNodes.map((p) => copyForSend(p))
    const transfer = [
      originHash.buffer,
      lastHash.buffer,
      chunkStateRoot.buffer,
      binaryAccountsSlab.buffer,
      ...proofNodes.map((p) => p.buffer),
    ] as ArrayBuffer[]
    this._send(
      {
        type: 'putEthyAccountChunk',
        chunk: {
          bucketIndex: chunk.bucketIndex,
          originHash,
          lastHash,
          hasRight: chunk.hasRight,
          chunkStateRoot,
          chunkBlockNumber: chunk.chunkBlockNumber.toString(),
          binaryAccountsSlab,
          proofNodes,
        },
      },
      transfer,
    )
  }

  setBlockRange(earliest: Uint8Array, latest: Uint8Array, latestHash: Uint8Array): void {
    this._send({ type: 'setBlockRange', earliest, latest, latestHash })
  }

  /** Apply atomic network profile (capabilities, peer budgets, discovery mode). */
  setNetworkProfile(profile: import('../types.ts').NetworkProfile): void {
    this._send({ type: 'setNetworkProfile', profile })
  }

  /** When true, outbound ETH STATUS and BLOCK_RANGE_UPDATE use the rolling store window. */
  setAdvertiseBlockRange(enabled: boolean): void {
    this._send({ type: 'setAdvertiseBlockRange', enabled })
  }

  notePooledTx(hashHex: string, raw: Uint8Array): void {
    const copy = copyForSend(raw)
    this._send({ type: 'notePooledTx', hashHex, raw: copy }, [copy.buffer as ArrayBuffer])
  }

  dropPooledTx(hashHex: string): void {
    this._send({ type: 'dropPooledTx', hashHex })
  }

  /** Register a complete block bundle for rolling-window eth serving in the worker. */
  putServableBlock(block: {
    number: bigint
    hash: Uint8Array
    headerRlp: Uint8Array
    bodyRlp: Uint8Array
    receiptsEth69Rlp: Uint8Array
    balRlp?: Uint8Array
  }): void {
    const hash = copyForSend(block.hash)
    const headerRlp = copyForSend(block.headerRlp)
    const bodyRlp = copyForSend(block.bodyRlp)
    const receiptsEth69Rlp = copyForSend(block.receiptsEth69Rlp)
    const balRlp = block.balRlp !== undefined ? copyForSend(block.balRlp) : undefined
    const transfer = [
      hash.buffer,
      headerRlp.buffer,
      bodyRlp.buffer,
      receiptsEth69Rlp.buffer,
      ...(balRlp !== undefined ? [balRlp.buffer] : []),
    ] as ArrayBuffer[]
    this._send(
      {
        type: 'putServableBlock',
        block: {
          number: block.number.toString(),
          hash,
          headerRlp,
          bodyRlp,
          receiptsEth69Rlp,
          balRlp,
        },
      },
      transfer,
    )
  }

  /** @internal Test helper */
  peerIdHex(peerId: Uint8Array): string {
    return bytesToUnprefixedHex(peerId)
  }
}
