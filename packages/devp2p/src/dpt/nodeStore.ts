import { readFileSync, writeFileSync } from 'node:fs'

export type StoredNode = {
  id: string
  address: string
  udpPort: number
  tcpPort?: number | null
  lastPong?: number
  failCount: number
}

export interface NodeStore {
  get(id: string): StoredNode | undefined
  put(node: StoredNode): void
  remove(id: string): void
  list(): StoredNode[]
}

export class MemoryNodeStore implements NodeStore {
  private readonly _map = new Map<string, StoredNode>()

  get(id: string): StoredNode | undefined {
    return this._map.get(id)
  }

  put(node: StoredNode): void {
    this._map.set(node.id, node)
  }

  remove(id: string): void {
    this._map.delete(id)
  }

  list(): StoredNode[] {
    return [...this._map.values()]
  }
}

/** Optional persistence for lab daemons (JSON object keyed by node id). */
export class JSONNodeStore implements NodeStore {
  private readonly _path: string
  private readonly _memory = new MemoryNodeStore()

  constructor(path: string) {
    this._path = path
    try {
      const raw = readFileSync(path, 'utf8')
      const obj = JSON.parse(raw) as Record<string, StoredNode>
      for (const node of Object.values(obj)) {
        this._memory.put(node)
      }
    } catch {
      // fresh store
    }
  }

  get(id: string): StoredNode | undefined {
    return this._memory.get(id)
  }

  put(node: StoredNode): void {
    this._memory.put(node)
    this._flush()
  }

  remove(id: string): void {
    this._memory.remove(id)
    this._flush()
  }

  list(): StoredNode[] {
    return this._memory.list()
  }

  private _flush(): void {
    const obj: Record<string, StoredNode> = {}
    for (const node of this._memory.list()) {
      obj[node.id] = node
    }
    writeFileSync(this._path, JSON.stringify(obj, null, 0))
  }
}
