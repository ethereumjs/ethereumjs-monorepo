import debugDefault from 'debug'
import { EventEmitter } from 'eventemitter3'

import { DISCONNECT_REASON, ProtocolType } from '../types.ts'
import { devp2pDebug } from '../util.ts'

import type { Debugger } from 'debug'
import type { Peer } from '../rlpx/peer.ts'
import type { ProtocolEvent, SendMethod } from '../types.ts'

type MessageCodes = { [key: number | string]: number | string }

export abstract class Protocol {
  public events: EventEmitter<ProtocolEvent>
  protected _version: number
  protected _peer: Peer
  protected _send: SendMethod
  protected _statusTimeoutId?: NodeJS.Timeout
  protected _messageCodes: MessageCodes
  private _debug: Debugger
  protected _verbose: boolean

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
    protocol: ProtocolType,
    version: number,
    messageCodes: MessageCodes,
  ) {
    this.events = new EventEmitter<ProtocolEvent>()
    this._peer = peer
    this._send = send
    this._version = version
    this._messageCodes = messageCodes
    this._statusTimeoutId =
      protocol !== ProtocolType.SNAP
        ? setTimeout(() => {
            this._peer.disconnect(DISCONNECT_REASON.TIMEOUT)
          }, 5000) // 5 sec * 1000
        : undefined

    this._debug = devp2pDebug.extend(protocol)
    this._verbose = debugDefault('verbose').enabled
    this.initMsgDebuggers(protocol)
  }

  private initMsgDebuggers(protocol: ProtocolType) {
    const MESSAGE_NAMES = Object.keys(this._messageCodes).filter(
      (key) => typeof key === 'string',
    ) as string[]
    for (const name of MESSAGE_NAMES) {
      this.msgDebuggers[name] = devp2pDebug.extend(protocol).extend(name)
    }

    // Remote Peer IP logger

    const ip = this._peer['_socket'].remoteAddress
    if (typeof ip === 'string') {
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
    const ip = this._peer['_socket'].remoteAddress
    if (typeof ip === 'string') {
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
    if (this.msgDebuggers[messageName] !== undefined) {
      this.msgDebuggers[messageName](msg)
    }

    const ip = this._peer['_socket'].remoteAddress
    if (typeof ip === 'string' && this.msgDebuggers[ip] !== undefined) {
      this.msgDebuggers[ip](msg)
    }
  }
  /**
   * Abstract method to handle incoming messages
   * @param code
   * @param data
   */
  abstract _handleMessage(code: number, data: Uint8Array): void
}
