export type Key = Buffer
export type KeyLike = string | Key

export type Multiaddrs = string[]
export type MultiaddrsLike = string | Multiaddrs

export interface Bootnode {
  id?: string | null
  ip: string | null
  port: number
}
export type BootnodeLike = string | string[] | Bootnode | Bootnode[]

export type DnsNetwork = string

// QHeap types. @types/qheap does not exist, so we create a custom interface here.
type QHeapOptions = {
  comparBefore(a: any, b: any): boolean
  compar(a: any, b: any): number
  freeSpace: number
  size: number
}

export interface QHeap<T> {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (opts: QHeapOptions): QHeap<T>
  insert(item: T): void
  push(item: T): void
  enqueue(item: T): void
  remove(): T | undefined
  shift(): T | undefined
  dequeue(): T | undefined
  peek(): T | undefined
  length: number
  gc(opts: { minLength: number; maxLength: number }): void
}
