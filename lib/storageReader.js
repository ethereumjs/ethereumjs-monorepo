module.exports = StorageReader

function StorageReader (stateManager) {
  this._stateManager = stateManager
  this._storageCache = new Map()
}

const proto = StorageReader.prototype

proto.getContractStorage = function getContractStorage (address, key, cb) {
  const self = this
  const addressHex = address.toString('hex')
  const keyHex = key.toString('hex')

  self._stateManager.getContractStorage(address, key, function (err, current) {
    if (err) return cb(err)

    let map = null
    if (!self._storageCache.has(addressHex)) {
      map = new Map()
      self._storageCache.set(addressHex, map)
    } else {
      map = self._storageCache.get(addressHex)
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
