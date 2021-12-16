import ms from 'ms'
import { EventEmitter } from 'events'
import { Peer, DISCONNECT_REASONS } from './rlpx/peer'

export class Protocol extends EventEmitter {
  _peer: Peer
  _statusTimeoutId: NodeJS.Timeout

  constructor(peer: Peer) {
    super()

    this._peer = peer
    this._statusTimeoutId = setTimeout(() => {
      this._peer.disconnect(DISCONNECT_REASONS.TIMEOUT)
    }, ms('5s'))
  }
}
