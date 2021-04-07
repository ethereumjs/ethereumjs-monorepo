import { Block, BlockHeader } from '@ethereumjs/block'
import { EventEmitter } from 'events'
import multiaddr from 'multiaddr'
import type Connection from '../../../node_modules/libp2p-interfaces/dist/src/connection/connection'
import type { MuxedStream } from '../../../node_modules/libp2p-interfaces/dist/src/stream-muxer/types'

/**
 * Types for the central event bus, emitted
 * by different components of the client
 */
export enum Event {
  SYNC_EXECUTION_VM_ERROR = 'sync:execution:vm:error',
  SYNC_FETCHER_FETCHED = 'sync:fetcher:fetched',
}
export interface EventParams {
  [Event.SYNC_EXECUTION_VM_ERROR]: (error: Error) => void
  [Event.SYNC_FETCHER_FETCHED]: (result: Block[] | BlockHeader[]) => void
}
export declare interface EventBus {
  emit(
    event: Event.SYNC_EXECUTION_VM_ERROR,
    args: EventParams[Event.SYNC_EXECUTION_VM_ERROR]
  ): boolean
  emit(event: Event.SYNC_FETCHER_FETCHED, args: EventParams[Event.SYNC_FETCHER_FETCHED]): boolean

  on(
    event: Event.SYNC_EXECUTION_VM_ERROR,
    listener: EventParams[Event.SYNC_EXECUTION_VM_ERROR]
  ): this
  on(event: Event.SYNC_FETCHER_FETCHED, listener: EventParams[Event.SYNC_FETCHER_FETCHED]): this
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
