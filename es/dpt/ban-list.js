import LRUCache from 'lru-cache'
import createDebugLogger from 'debug'
import { getKeys } from './kbucket'

const debug = createDebugLogger('devp2p:dpt:ban-list')

export default class BanList {
  constructor () {
    this._lru = new LRUCache({ max: 30000 }) // 10k should be enough (each peer obj can has 3 keys)
  }

  add (obj, maxAge) {
    for (let key of getKeys(obj)) {
      debug(`add ${key}, size: ${this._lru.length}`)
      this._lru.set(key, true, maxAge)
    }
  }

  has (obj) {
    return getKeys(obj).some((key) => this._lru.get(key))
  }
}
