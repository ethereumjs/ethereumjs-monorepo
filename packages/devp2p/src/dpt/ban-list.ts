import { debug as createDebugLogger } from 'debug'
import * as LRUCache from 'lru-cache'

import { formatLogId } from '../util'
import type { PeerInfo } from './dpt'
import { KBucket } from './kbucket'

const debug = createDebugLogger('devp2p:dpt:ban-list')
const verbose = createDebugLogger('verbose').enabled

export class BanList {
  private lru: LRUCache<string, boolean>
  constructor() {
    this.lru = new LRUCache({ max: 30000 }) // 10k should be enough (each peer obj can has 3 keys)
  }

  add(obj: string | Buffer | PeerInfo, maxAge?: number) {
    for (const key of KBucket.getKeys(obj)) {
      this.lru.set(key, true, maxAge)
      debug(`Added peer ${formatLogId(key, verbose)}, size: ${this.lru.length}`)
    }
  }

  has(obj: string | Buffer | PeerInfo): boolean {
    return KBucket.getKeys(obj).some((key: string) => Boolean(this.lru.get(key)))
  }
}
