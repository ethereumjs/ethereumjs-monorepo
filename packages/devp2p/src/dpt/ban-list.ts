import { debug as createDebugLogger } from 'debug'

import { formatLogId } from '../util.js'

import { KBucket } from './kbucket.js'

import type { PeerInfo } from './dpt.js'
import type LRUCache from 'lru-cache'

const LRU = require('lru-cache')

const debug = createDebugLogger('devp2p:dpt:ban-list')
const verbose = createDebugLogger('verbose').enabled

export class BanList {
  private lru: LRUCache<string, boolean>
  constructor() {
    this.lru = new LRU({ max: 10000 })
  }

  add(obj: string | Uint8Array | PeerInfo, maxAge?: number) {
    for (const key of KBucket.getKeys(obj)) {
      this.lru.set(key, true, { ttl: maxAge })
      debug(`Added peer ${formatLogId(key, verbose)}, size: ${this.lru.size}`)
    }
  }

  has(obj: string | Uint8Array | PeerInfo): boolean {
    return KBucket.getKeys(obj).some((key: string) => Boolean(this.lru.get(key)))
  }
}
