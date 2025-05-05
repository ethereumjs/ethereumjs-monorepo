import type { MethodConfig } from '../util/rpc.ts'

export const RPCNamespace = {
  Eth: 'eth', // untrusted
  Engine: 'engine', // trusted
} as const

export type RPCNamespace = (typeof RPCNamespace)[keyof typeof RPCNamespace]

export const RPCTransport = {
  Ws: 'ws',
  Http: 'http',
} as const

export type RPCTransport = (typeof RPCTransport)[keyof typeof RPCTransport]

export class RpcConfig {
  public static readonly DEFAULT_RPC_ADDR = '0.0.0.0'
  public static readonly DEFAULT_ENGINE_ADDR = '0.0.0.0'
  public static readonly DEFAULT_WS_ADDR = '0.0.0.0'
  public static readonly DEFAULT_WS_ENGINE_ADDR = '0.0.0.0'
  public static readonly DEFAULT_RPC_PORT = 8545
  public static readonly DEFAULT_ENGINE_PORT = 8551
  public static readonly DEFAULT_WS_PORT = 0
  public static readonly DEFAULT_WS_ENGINE_PORT = 8552
  public static readonly DEFAULT_RPC_DEBUG = 'eth'
  public static readonly DEFAULT_RPC_DEBUG_VERBOSE = 'false'
  public static readonly DEFAULT_HELP_RPC = false
  public static readonly DEFAULT_RPC_ENGINE_AUTH = false
  public static readonly DEFAULT_CORS = ''
  // public static readonly RPC_ETH_MAXPAYLOAD_DEFAULT
  // public static readonly RPC_ENGINE_MAXPAYLOAD_DEFAULT

  public readonly type: RPCNamespace
  public readonly transport: RPCTransport
  public readonly methodConfig: MethodConfig
  public readonly address: string
  public readonly port: number
  public readonly debug: string
  public readonly debugVerbose: string
  public readonly jwtSecret: Uint8Array<ArrayBufferLike> | undefined
  public readonly engineAuth: boolean
  public readonly cors: string

  constructor(options: {
    type: RPCNamespace
    transport: RPCTransport
    methodConfig: MethodConfig
    address?: string
    port?: number
    jwtSecret: Uint8Array<ArrayBufferLike> | undefined
    engineAuth?: boolean
    cors?: string
    debug?: string
    debugVerbose?: string
  }) {
    this.type = options.type
    this.transport = options.transport
    this.methodConfig = options.methodConfig
    this.address = options.address ?? this.getDefaultAddress(this.type, this.transport)
    this.port = options.port ?? this.getDefaultPort(this.type, this.transport)
    this.debug = options.debug ?? RpcConfig.DEFAULT_RPC_DEBUG
    this.debugVerbose = options.debugVerbose ?? RpcConfig.DEFAULT_RPC_DEBUG_VERBOSE
    this.cors = options.cors ?? RpcConfig.DEFAULT_CORS
    this.engineAuth = options.engineAuth ?? RpcConfig.DEFAULT_RPC_ENGINE_AUTH
    this.jwtSecret = options.jwtSecret
  }

  getDefaultAddress(type: RPCNamespace, transport: RPCTransport): string {
    if (type === 'eth') {
      return transport === 'http' ? RpcConfig.DEFAULT_RPC_ADDR : RpcConfig.DEFAULT_WS_ADDR
    } else {
      return transport === 'http' ? RpcConfig.DEFAULT_ENGINE_ADDR : RpcConfig.DEFAULT_WS_ENGINE_ADDR
    }
  }

  getDefaultPort(type: RPCNamespace, transport: RPCTransport): number {
    if (type === 'eth') {
      return transport === 'http' ? RpcConfig.DEFAULT_RPC_PORT : RpcConfig.DEFAULT_WS_PORT
    } else {
      return transport === 'http' ? RpcConfig.DEFAULT_ENGINE_PORT : RpcConfig.DEFAULT_WS_ENGINE_PORT
    }
  }
}
