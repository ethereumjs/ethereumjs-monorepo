import StateManager from './stateManager'

export default class StorageReader {
  _stateManager: StateManager
  _storageCache: Map<string, any>

  constructor (stateManager: StateManager) {
    this._stateManager = stateManager
    this._storageCache = new Map()
  }

  getContractStorage (address: Buffer, key: Buffer, cb: any): void {
    const addressHex = address.toString('hex')
    const keyHex = key.toString('hex')

    this._stateManager.getContractStorage(address, key, (err: Error, current: any) => {
      if (err) return cb(err)

      let map = null
      if (!this._storageCache.has(addressHex)) {
        map = new Map()
        this._storageCache.set(addressHex, map)
      } else {
        map = this._storageCache.get(addressHex)
      }

      let original = null

      if (map.has(keyHex)) {
        original = map.get(keyHex)
      } else {
        map.set(keyHex, current)
        original = current
      }

      cb(null, {
        original,
        current
      })
    })
  }
}
