import { EventEmitter } from 'events'
import { Peer } from './rlpx/peer'

export class ExchangeProtocol extends EventEmitter {
  _version: number
  _peer: Peer

  constructor(version: number, peer: Peer) {
    super()

    this._version = version
    this._peer = peer
  }
}
