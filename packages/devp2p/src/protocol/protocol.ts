import ms from 'ms'
import { debug as createDebugLogger, Debugger } from 'debug'
import { EventEmitter } from 'events'
import { Peer, DISCONNECT_REASONS } from '../rlpx/peer'

type MessageCodes = { [key: number | string]: number | string }

export class Protocol extends EventEmitter {
  _peer: Peer
  _statusTimeoutId: NodeJS.Timeout
  _messageCodes: MessageCodes
  _debug: Debugger
  _verbose: boolean

  /**
   * Will be set to the first successfully connected peer to allow for
   * debugging with the `devp2p:FIRST_PEER` debugger
   */
  _firstPeer: string

  // Message debuggers (e.g. { 'GET_BLOCK_HEADERS': [debug Object], ...})
  protected msgDebuggers: { [key: string]: (debug: string) => void } = {}

  constructor(peer: Peer, _messageCodes: MessageCodes, debugBaseName: string) {
    super()

    this._firstPeer = ''
    this._peer = peer
    this._messageCodes = _messageCodes
    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, ms('5s'))

    this._debug = createDebugLogger(debugBaseName)
    this._verbose = createDebugLogger('verbose').enabled
    this.initMsgDebuggers(debugBaseName)
  }

  private initMsgDebuggers(debugBaseName: string) {
    const MESSAGE_NAMES = Object.values(this._messageCodes).filter(
      (value) => typeof value === 'string'
    ) as string[]
    for (const name of MESSAGE_NAMES) {
      this.msgDebuggers[name] = createDebugLogger(`${debugBaseName}:${name}`)
    }

    // Remote Peer IP logger
    const ip = this._peer._socket.remoteAddress
    if (ip) {
      this.msgDebuggers[ip] = createDebugLogger(`devp2p:${ip}`)
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
      this.msgDebuggers[ip] = createDebugLogger(`devp2p:FIRST_PEER`)
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
