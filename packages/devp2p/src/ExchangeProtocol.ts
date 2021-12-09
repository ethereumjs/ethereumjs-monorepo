import { EventEmitter } from 'events'

export class ExchangeProtocol extends EventEmitter {
  _version: number

  constructor(version: number) {
    super()

    this._version = version
  }
}
