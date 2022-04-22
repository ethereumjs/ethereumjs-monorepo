import { EventEmitter } from 'events'
import { BN } from 'ethereumjs-util'
import type { Multiaddr } from 'multiaddr'
import type { Block, BlockHeader } from '@ethereumjs/block'
import type Connection from '../../../node_modules/libp2p-interfaces/dist/src/connection/connection'
import type { MuxedStream } from '../../../node_modules/libp2p-interfaces/dist/src/stream-muxer/types'
import { Peer } from './net/peer'
import { Server } from './net/server'

/**
 * Types for the central event bus, emitted
 * by different components of the client.
 */
export enum Event {
  CHAIN_UPDATED = 'blockchain:chain:updated',
  CLIENT_SHUTDOWN = 'client:shutdown',
  SYNC_EXECUTION_VM_ERROR = 'sync:execution:vm:error',
  SYNC_FETCHED_BLOCKS = 'sync:fetcher:fetched_blocks',
  SYNC_FETCHED_HEADERS = 'sync:fetcher:fetched_headers',
  SYNC_FETCHED_SKELETON_BLOCKS = 'sync:fetcher:fetched_skeleton_blocks',
  SYNC_SYNCHRONIZED = 'sync:synchronized',
  SYNC_POS_TRANSITION = 'sync:pos:transition',
  SYNC_ERROR = 'sync:error',
  SYNC_FETCHER_ERROR = 'sync:fetcher:error',
  PEER_CONNECTED = 'peer:connected',
  PEER_DISCONNECTED = 'peer:disconnected',
  PEER_ERROR = 'peer:error',
  SERVER_LISTENING = 'server:listening',
  SERVER_ERROR = 'server:error',
  POOL_PEER_ADDED = 'pool:peer:added',
  POOL_PEER_REMOVED = 'pool:peer:removed',
  POOL_PEER_BANNED = 'pool:peer:banned',
  PROTOCOL_ERROR = 'protocol:error',
  PROTOCOL_MESSAGE = 'protocol:message',
}
export interface EventParams {
  [Event.CHAIN_UPDATED]: []
  [Event.CLIENT_SHUTDOWN]: []
  [Event.SYNC_EXECUTION_VM_ERROR]: [vmError: Error]
  [Event.SYNC_FETCHED_BLOCKS]: [blocks: Block[]]
  [Event.SYNC_FETCHED_HEADERS]: [headers: BlockHeader[]]
  [Event.SYNC_FETCHED_SKELETON_BLOCKS]: [blocks: Block[]]
  [Event.SYNC_SYNCHRONIZED]: [chainHeight: BN]
  [Event.SYNC_POS_TRANSITION]: []
  [Event.SYNC_ERROR]: [syncError: Error]
  [Event.SYNC_FETCHER_ERROR]: [fetchError: Error, task: any, peer: Peer | null | undefined]
  [Event.PEER_CONNECTED]: [connectedPeer: Peer]
  [Event.PEER_DISCONNECTED]: [disconnectedPeer: Peer]
  [Event.PEER_ERROR]: [error: Error, peerCausingError: Peer]
  [Event.SERVER_LISTENING]: [{ transport: string; url: string }]
  [Event.SERVER_ERROR]: [serverError: Error, serverCausingError: Server]
  [Event.POOL_PEER_ADDED]: [addedPeer: Peer]
  [Event.POOL_PEER_REMOVED]: [removedPeer: Peer]
  [Event.POOL_PEER_BANNED]: [bannedPeer: Peer]
  [Event.PROTOCOL_ERROR]: [boundProtocolError: Error, peerCausingError: Peer]
  [Event.PROTOCOL_MESSAGE]: [messageDetails: any, protocolName: string, sendingPeer: Peer]
}

export declare interface EventBus<T extends Event> {
  emit(event: T, ...args: EventParams[T]): boolean
  on(event: T, listener: (...args: EventParams[T]) => void): this
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class EventBus<T extends Event> extends EventEmitter {}
export type EventBusType = EventBus<Event.CHAIN_UPDATED> &
  EventBus<Event.CLIENT_SHUTDOWN> &
  EventBus<Event.SYNC_EXECUTION_VM_ERROR> &
  EventBus<Event.SYNC_FETCHED_BLOCKS> &
  EventBus<Event.SYNC_FETCHED_HEADERS> &
  EventBus<Event.SYNC_FETCHED_SKELETON_BLOCKS> &
  EventBus<Event.SYNC_SYNCHRONIZED> &
  EventBus<Event.SYNC_POS_TRANSITION> &
  EventBus<Event.SYNC_FETCHER_ERROR> &
  EventBus<Event.PEER_CONNECTED> &
  EventBus<Event.PEER_DISCONNECTED> &
  EventBus<Event.PEER_ERROR> &
  EventBus<Event.SERVER_LISTENING> &
  EventBus<Event.SERVER_ERROR> &
  EventBus<Event.SYNC_ERROR> &
  EventBus<Event.POOL_PEER_ADDED> &
  EventBus<Event.POOL_PEER_REMOVED> &
  EventBus<Event.POOL_PEER_BANNED> &
  EventBus<Event.PROTOCOL_ERROR> &
  EventBus<Event.PROTOCOL_MESSAGE>

/**
 * Like types
 */
export type Key = Buffer
export type KeyLike = string | Key

export type MultiaddrLike = string | string[] | Multiaddr | Multiaddr[]

/**
 * DNS
 */
export type DnsNetwork = string

/**
 * Libp2p aliases for convenience
 */
export type Libp2pConnection = Connection
export type Libp2pMuxedStream = MuxedStream
