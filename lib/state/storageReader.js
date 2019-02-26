module.exports = class StorageReader {
  constructor (stateManager) {
    this._stateManager = stateManager
    this._storageCache = new Map()
  }

  getContractStorage (address, key, cb) {
    const addressHex = address.toString('hex')
    const keyHex = key.toString('hex')

    this._stateManager.getContractStorage(address, key, (err, current) => {
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
