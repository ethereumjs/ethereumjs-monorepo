interface ProtocolConstructor {
  new (...args: any[]): any
}

export interface Capabilities {
  name: string
  version: number
  length: number
  constructor: ProtocolConstructor
}

export enum DISCONNECT_REASON {
  DISCONNECT_REQUESTED = 0x00,
  NETWORK_ERROR = 0x01,
  PROTOCOL_ERROR = 0x02,
  USELESS_PEER = 0x03,
  TOO_MANY_PEERS = 0x04,
  ALREADY_CONNECTED = 0x05,
  INCOMPATIBLE_VERSION = 0x06,
  INVALID_IDENTITY = 0x07,
  CLIENT_QUITTING = 0x08,
  UNEXPECTED_IDENTITY = 0x09,
  SAME_IDENTITY = 0x0a,
  TIMEOUT = 0x0b,
  SUBPROTOCOL_ERROR = 0x10,
}

export enum EthProtocol { // What does this represent?
  ETH = 'eth',
  LES = 'les',
  SNAP = 'snap',
}

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
  arbiter?: (obj1: object, obj2: object) => object
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
}

export type SendMethod = (code: number, data: Uint8Array) => any
