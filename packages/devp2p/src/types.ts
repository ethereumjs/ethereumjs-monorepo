import type { Socket } from 'net'
import type { Common } from '@ethereumjs/common'
import type { NestedUint8Array } from '@ethereumjs/rlp'
import type { DPT } from './dpt/index.ts'
import type { EthMessageCodes } from './protocol/eth.ts'
import type { Protocol } from './protocol/protocol.ts'
import type { SnapMessageCodes } from './protocol/snap.ts'
import type { Peer } from './rlpx/peer.ts'

export interface RLPxEvent {
  'peer:added': [peer: Peer]
  'peer:error': [peer: Peer, error: any]
  'peer:removed': [peer: Peer, reason: any, disconnectWe: boolean | null] // disconnectWe indicates whether the disconnection was initiated by us or not
  error: [error: Error]
  close: undefined
  listening: undefined
}

export interface PeerEvent {
  error: [error: Error]
  connect: undefined
  close: [reason: any, disconnectWe: boolean | null] // disconnectWe indicates whether the disconnection was initiated by us or not
}

export interface ProtocolEvent {
  message: [code: SnapMessageCodes | EthMessageCodes, payload: Uint8Array | NestedUint8Array]
  status: {
    chainId: Uint8Array | Uint8Array[]
    td: Uint8Array
    bestHash: Uint8Array
    genesisHash: Uint8Array
    forkId?: Uint8Array | Uint8Array[]
  }
}

export interface KBucketEvent {
  ping: [contacts: Contact[], contact: PeerInfo]
  updated: [incumbent: Contact, selection: Contact]
  added: [peer: PeerInfo]
  removed: [peer: PeerInfo]
}

export interface DPTEvent {
  listening: undefined
  close: undefined
  error: [error: Error]
  'peer:added': [peer: PeerInfo]
  'peer:new': [peer: PeerInfo]
  'peer:removed': [peer: PeerInfo]
}

export interface ServerEvent {
  listening: undefined
  close: undefined
  error: [error: Error]
  peers: any[]
}
interface ProtocolConstructor {
  new (...args: any[]): Protocol
}

export interface Capabilities {
  name: string
  version: number
  length: number
  constructor: ProtocolConstructor
}

export type DISCONNECT_REASON = (typeof DISCONNECT_REASON)[keyof typeof DISCONNECT_REASON]

export const DISCONNECT_REASON = {
  DISCONNECT_REQUESTED: 0x00,
  NETWORK_ERROR: 0x01,
  PROTOCOL_ERROR: 0x02,
  USELESS_PEER: 0x03,
  TOO_MANY_PEERS: 0x04,
  ALREADY_CONNECTED: 0x05,
  INCOMPATIBLE_VERSION: 0x06,
  INVALID_IDENTITY: 0x07,
  CLIENT_QUITTING: 0x08,
  UNEXPECTED_IDENTITY: 0x09,
  SAME_IDENTITY: 0x0a,
  TIMEOUT: 0x0b,
  SUBPROTOCOL_ERROR: 0x10,
} as const

// Create a reverse mapping: numeric value -> key name
export const DisconnectReasonNames: { [key in DISCONNECT_REASON]: string } = Object.entries(
  DISCONNECT_REASON,
).reduce(
  (acc, [key, value]) => {
    acc[value as DISCONNECT_REASON] = key
    return acc
  },
  {} as { [key in DISCONNECT_REASON]: string },
)

export type DNSOptions = {
  /**
   * ipv4 or ipv6 address of server to pass to native dns.setServers()
   * Sets the IP address of servers to be used when performing
   * DNS resolution.
   * @type {string}
   */
  dnsServerAddress?: string

  /**
   * Common instance to allow for crypto primitive (e.g. keccak) replacement
   */
  common?: Common
}

export interface DPTOptions {
  /**
   * Timeout for peer requests
   *
   * Default: 10s
   */
  timeout?: number

  /**
   * Network info to send a long a request
   *
   * Default: 0.0.0.0, no UDP or TCP port provided
   */
  endpoint?: PeerInfo

  /**
   * Function for socket creation
   *
   * Default: dgram-created socket
   */
  createSocket?: Function

  /**
   * Interval for peer table refresh
   *
   * Default: 60s
   */
  refreshInterval?: number

  /**
   * Toggles whether or not peers should be queried with 'findNeighbours'
   * to discover more peers
   *
   * Default: true
   */
  shouldFindNeighbours?: boolean

  /**
   * Send findNeighbour requests to and only answer with respective peers
   * being confirmed by calling the `confirmPeer()` method
   *
   * (allows for a more selective and noise reduced discovery)
   *
   * Note: Bootstrap nodes are confirmed by default.
   *
   * Default: false
   */
  onlyConfirmed?: boolean

  /**
   * Toggles whether or not peers should be discovered by querying EIP-1459 DNS lists
   *
   * Default: false
   */
  shouldGetDnsPeers?: boolean

  /**
   * Max number of candidate peers to retrieve from DNS records when
   * attempting to discover new nodes
   *
   * Default: 25
   */
  dnsRefreshQuantity?: number

  /**
   * EIP-1459 ENR tree urls to query for peer discovery
   *
   * Default: (network dependent)
   */
  dnsNetworks?: string[]

  /**
   * DNS server to query DNS TXT records from for peer discovery
   */
  dnsAddr?: string

  /**
   * Common instance to allow for crypto primitive (e.g. keccak) replacement
   */
  common?: Common
}

export interface DPTServerOptions {
  /**
   * Timeout for peer requests
   *
   * Default: 10s
   */
  timeout?: number

  /**
   * Network info to send a long a request
   *
   * Default: 0.0.0.0, no UDP or TCP port provided
   */
  endpoint?: PeerInfo

  /**
   * Function for socket creation
   *
   * Default: dgram-created socket
   */
  createSocket?: Function

  /**
   * Common instance to allow for crypto primitive (e.g. keccak) replacement
   */
  common?: Common
}

export type ProtocolType = (typeof ProtocolType)[keyof typeof ProtocolType]

export const ProtocolType = {
  ETH: 'eth',
  SNAP: 'snap',
} as const

export interface KBucketOptions {
  /**
   * An optional Uint8Array representing the local node id.
   * If not provided, a local node id will be created via `randomBytes(20)`.
   */
  localNodeId?: Uint8Array
  /**
   * The number of nodes that a k-bucket can contain before being full or split.
   * Defaults to 20.
   */
  numberOfNodesPerKBucket?: number
  /**
   * The number of nodes to ping when a bucket that should not be split becomes full.
   * KBucket will emit a `ping` event that contains `numberOfNodesToPing` nodes that have not been contacted the longest.
   * Defaults to 3.
   */
  numberOfNodesToPing?: number
  /**
   * An optional distance function that gets two id Uint8Arrays and return distance between them as a number.
   */
  distance?: (firstId: Uint8Array, secondId: Uint8Array) => number
  /**
   * An optional arbiter function that given two `contact` objects with the same `id`,
   * returns the desired object to be used for updating the k-bucket.
   * Defaults to vectorClock arbiter function.
   */
  arbiter?: (incumbent: Contact, candidate: Contact) => Contact
  /**
   * Optional satellite data to include
   * with the k-bucket. `metadata` property is guaranteed not be altered by,
   * it is provided as an explicit container for users of k-bucket to store
   * implementation-specific data.
   */
  metadata?: object
}

export interface PeerInfo {
  id?: Uint8Array
  address?: string
  udpPort?: number | null
  tcpPort?: number | null
  vectorClock?: number
}

export interface Contact extends PeerInfo {
  id: Uint8Array
  vectorClock: number
}

export interface PeerOptions {
  clientId: Uint8Array
  capabilities?: Capabilities[]
  common: Common
  port: number
  id: Uint8Array
  remoteClientIdFilter?: string[]
  remoteId: Uint8Array
  EIP8?: Uint8Array | boolean
  privateKey: Uint8Array
  socket: Socket
  timeout: number
}

export interface RLPxOptions {
  clientId?: Uint8Array
  /* Timeout (default: 10s) */
  timeout?: number
  dpt?: DPT | null
  /* Max peers (default: 10) */
  maxPeers?: number
  remoteClientIdFilter?: string[]
  capabilities: Capabilities[]
  common: Common
  listenPort?: number | null
}

export type SendMethod = (code: number, data: Uint8Array) => any
