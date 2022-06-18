import ms = require('ms')
import { debug as createDebugLogger, Debugger } from 'debug'
import { EventEmitter } from 'events'
import { devp2pDebug } from '../util'
import { Peer, DISCONNECT_REASONS } from '../rlpx/peer'

export enum EthProtocol {
  ETH = 'eth',
  LES = 'les',
}

type MessageCodes = { [key: number | string]: number | string }

export type SendMethod = (code: number, data: Buffer) => any

export class Protocol extends EventEmitter {
  _version: number
  _peer: Peer
  _send: SendMethod
  _statusTimeoutId: NodeJS.Timeout
  _messageCodes: MessageCodes
  _debug: Debugger
  _verbose: boolean

  /**
   * Will be set to the first successfully connected peer to allow for
   * debugging with the `devp2p:FIRST_PEER` debugger
   */
  _firstPeer = ''

  // Message debuggers (e.g. { 'GET_BLOCK_HEADERS': [debug Object], ...})
  protected msgDebuggers: { [key: string]: (debug: string) => void } = {}

  constructor(
    peer: Peer,
    send: SendMethod,
    protocol: EthProtocol,
    version: number,
    messageCodes: MessageCodes
  ) {
    super()

    this._peer = peer
    this._send = send
    this._version = version
    this._messageCodes = messageCodes
    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, ms('5s'))

    this._debug = devp2pDebug.extend(protocol)
    this._verbose = createDebugLogger('verbose').enabled
    this.initMsgDebuggers(protocol)
  }

  private initMsgDebuggers(protocol: EthProtocol) {
    const MESSAGE_NAMES = Object.values(this._messageCodes).filter(
      (value) => typeof value === 'string'
    ) as string[]
    for (const name of MESSAGE_NAMES) {
      this.msgDebuggers[name] = devp2pDebug.extend(protocol).extend(name)
    }

    // Remote Peer IP logger
    const ip = this._peer._socket.remoteAddress
    if (ip) {
      this.msgDebuggers[ip] = devp2pDebug.extend(ip)
    }
  }

  /**
   * Called once on the peer where a first successful `STATUS`
   * msg exchange could be achieved.
   *
   * Can be used together with the `devp2p:FIRST_PEER` debugger.
   */
  _addFirstPeerDebugger() {
    const ip = this._peer._socket.remoteAddress
    if (ip) {
      this.msgDebuggers[ip] = devp2pDebug.extend('FIRST_PEER')
      this._peer._addFirstPeerDebugger()
      this._firstPeer = ip
    }
  }

  /**
   * Debug message both on the generic as well as the
   * per-message debug logger
   * @param messageName Capitalized message name (e.g. `GET_BLOCK_HEADERS`)
   * @param msg Message text to debug
   */
  protected debug(messageName: string, msg: string) {
    this._debug(msg)
    if (this.msgDebuggers[messageName]) {
      this.msgDebuggers[messageName](msg)
    }
    const ip = this._peer._socket.remoteAddress
    if (ip && this.msgDebuggers[ip]) {
      this.msgDebuggers[ip](msg)
    }
  }
}
