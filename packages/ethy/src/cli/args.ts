export type EthySyncMode = 'auto' | 'ethy' | 'snap'

export type EthyAiMemory = 'ephemeral' | 'off'

export interface EthyCliArgs {
  network: string
  demo: boolean
  headless: boolean
  fresh: boolean
  dataDir?: string
  listenPort?: number
  rpcEnabled: boolean
  rpcHost: string
  rpcPort?: number
  rpcPortExplicit: boolean
  syncMode: EthySyncMode
  /** `enode://` URLs for direct dial after P2P start. */
  connectEnodeUrls: string[]
  llmUrl?: string
  llmAllowRemote: boolean
  aiMemory: EthyAiMemory
  recordFixturePath?: string
}

export function parseEthyArgs(argv: string[]): EthyCliArgs {
  const args = argv.slice(2)
  let network = 'sepolia'
  let demo = false
  let headless = false
  let fresh = false
  let dataDir: string | undefined
  let listenPort: number | undefined
  let syncMode: EthySyncMode = 'auto'
  let rpcEnabled = true
  let rpcHost = '127.0.0.1'
  let rpcPort: number | undefined
  let rpcPortExplicit = false
  let rpcForced = false
  const connectEnodeUrls: string[] = []
  let llmUrl: string | undefined
  let llmAllowRemote = false
  let aiMemory: EthyAiMemory = 'ephemeral'
  let recordFixturePath: string | undefined

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--datadir' || a === '--data-dir') {
      const next = args[++i]
      if (next === undefined) throw new Error(`${a} requires a path`)
      dataDir = next
      continue
    }
    if (a === '--port') {
      const next = args[++i]
      if (next === undefined) throw new Error('--port requires a number')
      listenPort = Number.parseInt(next, 10)
      if (listenPort < 1 || listenPort > 65535) throw new Error('--port out of range')
      continue
    }
    if (a === '--connect' || a === '--bootnodes') {
      const next = args[++i]
      if (next === undefined) throw new Error(`${a} requires an enode URL`)
      if (!next.startsWith('enode://')) {
        throw new Error(`${a} requires enode://<id>@host:port (RLPx needs the node id)`)
      }
      connectEnodeUrls.push(next)
      continue
    }
    if (a === '--demo') {
      demo = true
      continue
    }
    if (a === '--no-rpc') {
      rpcEnabled = false
      continue
    }
    if (a === '--rpc') {
      rpcEnabled = true
      rpcForced = true
      continue
    }
    if (a === '--rpc-host') {
      const next = args[++i]
      if (next === undefined) throw new Error('--rpc-host requires a host')
      rpcHost = next
      continue
    }
    if (a === '--rpc-port') {
      const next = args[++i]
      if (next === undefined) throw new Error('--rpc-port requires a number')
      rpcPort = Number.parseInt(next, 10)
      if (rpcPort < 0 || rpcPort > 65535) throw new Error('--rpc-port out of range')
      rpcPortExplicit = true
      rpcForced = true
      continue
    }
    if (a === '--headless') {
      headless = true
      continue
    }
    if (a === '--fresh') {
      fresh = true
      continue
    }
    if (a === '--sync-mode') {
      const next = args[++i]
      if (next !== 'auto' && next !== 'ethy' && next !== 'snap') {
        throw new Error('--sync-mode must be auto, ethy, or snap')
      }
      syncMode = next
      continue
    }
    if (a === '--llm-url') {
      const next = args[++i]
      if (next === undefined) throw new Error('--llm-url requires a base URL')
      llmUrl = next
      continue
    }
    if (a === '--llm-allow-remote') {
      llmAllowRemote = true
      continue
    }
    if (a === '--ai-memory') {
      const next = args[++i]
      if (next !== 'ephemeral' && next !== 'off') {
        throw new Error('--ai-memory must be ephemeral or off')
      }
      aiMemory = next
      continue
    }
    if (a === '--no-ai-history') {
      aiMemory = 'off'
      continue
    }
    if (a === '--record-fixture') {
      const next = args[++i]
      if (next === undefined) throw new Error('--record-fixture requires a path')
      recordFixturePath = next
      continue
    }
    if (a === '--help' || a === '-h') {
      throw new Error('HELP')
    }
    if (a.startsWith('-')) {
      throw new Error(`Unknown flag: ${a}`)
    }
    network = a
  }

  if (demo && !rpcForced) {
    rpcEnabled = false
  }

  return {
    network,
    demo,
    headless,
    fresh,
    dataDir,
    listenPort,
    rpcEnabled,
    rpcHost,
    rpcPort,
    rpcPortExplicit,
    syncMode,
    connectEnodeUrls,
    llmUrl,
    llmAllowRemote,
    aiMemory,
    recordFixturePath,
  }
}

export function printEthyUsage(): string {
  return `ethy — EthereumJS execution-free state node (Amsterdam focus)

Usage:
  ethy [network] [--demo] [--headless] [--fresh] [--sync-mode auto|ethy|snap]
        [--no-rpc] [--rpc] [--rpc-host HOST] [--rpc-port N]
        [--datadir PATH] [--port N] [--connect enode://...]
        [--llm-url URL] [--llm-allow-remote] [--ai-memory ephemeral|off] [--no-ai-history]
        [--record-fixture PATH]

Networks: sepolia (default), mainnet, hoodi, holesky
`
}
