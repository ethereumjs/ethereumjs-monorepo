import ms from 'ms'
import { EventEmitter } from 'events'
import { Peer, DISCONNECT_REASONS } from './rlpx/peer'

export class ExchangeProtocol extends EventEmitter {
  _version: number
  _peer: Peer
  _statusTimeoutId: NodeJS.Timeout

  constructor(version: number, peer: Peer) {
    super()

    this._version = version
    this._peer = peer
    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, ms('5s'))
  }
}
