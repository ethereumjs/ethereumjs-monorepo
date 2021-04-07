import { EventEmitter } from 'events'
import multiaddr from 'multiaddr'
import type Connection from '../../../node_modules/libp2p-interfaces/dist/src/connection/connection'
import type { MuxedStream } from '../../../node_modules/libp2p-interfaces/dist/src/stream-muxer/types'

/**
 * Types for the central event bus, emitted
 * by different components of the client
 */
export enum Event {
  EXECUTION_ERROR = 'execution:error',
}
export interface EventParams {
  [Event.EXECUTION_ERROR]: (error: Error) => void
}
export declare interface EventBus {
  emit(event: Event.EXECUTION_ERROR, args: EventParams[Event.EXECUTION_ERROR]): boolean

  on(event: Event.EXECUTION_ERROR, listener: EventParams[Event.EXECUTION_ERROR]): this
}
export class EventBus extends EventEmitter {}

/**
 * Like types
 */
export type Key = Buffer
export type KeyLike = string | Key

export type MultiaddrLike = string | string[] | multiaddr | multiaddr[]

/**
 * DNS
 */
export type DnsNetwork = string

/**
 * Libp2p aliases for convenience
 */
export type Libp2pConnection = Connection
export type Libp2pMuxedStream = MuxedStream

/**
 * QHeap types.
 * @types/qheap does not exist, so we define a custom interface here.
 */
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
