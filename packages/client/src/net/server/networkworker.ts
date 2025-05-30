import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'
import type { Config } from '../../config.ts'
import { Event } from '../../types.ts'
import type { MultiaddrLike } from '../../types.ts'
import type { Peer } from '../peer/peer.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class NetworkWorker {
  private worker: Worker
  private messageHandler?: (message: any, protocol: string, peer: Peer) => Promise<void>
  private config: Config
  public discovery: boolean = true
  public dpt: { getPeers: () => any[] } = { getPeers: () => [] }

  constructor(config: Config) {
    this.config = config
    this.worker = new Worker(`${__dirname}/networkworker.js`, {
      workerData: { __dirname },
      stdout: true,
      stderr: true,
    })

    // Pipe worker stdout/stderr to main process
    //@ts-ignore
    this.worker.stdout.pipe(process.stdout)
    // @ts-ignore
    this.worker.stderr.pipe(process.stderr)

    // Set up message handling from worker
    this.worker.on(
      'message',
      (data: {
        type:
          | 'PROTOCOL_MESSAGE'
          | 'INIT_COMPLETE'
          | 'STOP_COMPLETE'
          | 'NETWORK_INFO'
          | 'PEER_ADDED'
          | 'PEER_ADD_ERROR'
          | 'EVENT'
          | 'SERVER_ERROR'
        message?: any
        protocol?: string
        peerId?: string
        info?: any
        peerInfo?: any
        error?: string
        event?: string
        args?: any[]
      }) => {
        console.log('got message', data)
        if (
          data.type === 'EVENT' &&
          data.event === 'PROTOCOL_MESSAGE' &&
          Array.isArray(data.args) &&
          data.args.length === 3
        ) {
          // Forward events from worker to main thread
          this.config.events.emit(Event.PROTOCOL_MESSAGE, data.args[0], data.args[1], data.args[2])
        } else if (
          data.type === 'PROTOCOL_MESSAGE' &&
          typeof data.message !== 'undefined' &&
          typeof data.protocol === 'string' &&
          data.protocol.length > 0 &&
          typeof data.peerId === 'string' &&
          data.peerId.length > 0
        ) {
          const peer = { id: data.peerId } as Peer
          if (this.messageHandler) {
            void this.messageHandler(data.message, data.protocol, peer)
          }
        }
      },
    )
  }

  async start(config: Config, bootnodes: MultiaddrLike, dnsNetworks: string[]) {
    console.log('starting worker', bootnodes, dnsNetworks)
    this.worker.postMessage({
      type: 'INIT',
      maxPeers: this.config.maxPeers,
      bootnodes,
      dnsNetworks,
      port: config.port,
      extIP: config.extIP,
    })
  }

  async stop() {
    this.worker.postMessage({ type: 'STOP' })
  }

  registerHandler(handler: (message: any, protocol: string, peer: Peer) => Promise<void>) {
    this.messageHandler = handler
  }

  sendToPeer(protocol: string, peerId: string, messageName: string, args: any) {
    this.worker.postMessage({
      type: 'SEND_MESSAGE',
      protocol,
      peerId,
      messageName,
      args,
    })
  }

  async getNetworkInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for network info'))
      }, 5000)

      const handler = (data: any) => {
        if (data.type === 'NETWORK_INFO') {
          clearTimeout(timeout)
          this.worker.removeListener('message', handler)
          resolve(data.info)
        }
      }
      this.worker.on('message', handler)
      this.worker.postMessage({ type: 'GET_NETWORK_INFO' })
    })
  }

  async addPeer(peer: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timeout waiting for peer add response'))
      }, 5000)

      const handler = (data: any) => {
        if (data.type === 'PEER_ADDED') {
          clearTimeout(timeout)
          this.worker.removeListener('message', handler)
          resolve(data.peerInfo)
        } else if (data.type === 'PEER_ADD_ERROR') {
          clearTimeout(timeout)
          this.worker.removeListener('message', handler)
          reject(new Error(data.error))
        }
      }
      this.worker.on('message', handler)
      this.worker.postMessage({ type: 'ADD_PEER', peer })
    })
  }

  ban(peerId: string, maxAge: number) {
    this.worker.postMessage({
      type: 'BAN_PEER',
      peerId,
      maxAge,
    })
  }
}
