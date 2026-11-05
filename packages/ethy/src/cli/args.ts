export interface EthyCliArgs {
  network: string
  demo: boolean
  headless: boolean
  fresh: boolean
  dataDir?: string
  listenPort?: number
  /** `enode://` URLs for direct dial after P2P start. */
  connectEnodeUrls: string[]
}

export function parseEthyArgs(argv: string[]): EthyCliArgs {
  const args = argv.slice(2)
  let network = 'sepolia'
  let demo = false
  let headless = false
  let fresh = false
  let dataDir: string | undefined
  let listenPort: number | undefined
  const connectEnodeUrls: string[] = []

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
    if (a === '--headless') {
      headless = true
      continue
    }
    if (a === '--fresh') {
      fresh = true
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

  return { network, demo, headless, fresh, dataDir, listenPort, connectEnodeUrls }
}

export function printEthyUsage(): string {
  return `ethy — EthereumJS execution-free state node (Amsterdam focus)

Usage:
  ethy [network] [--demo] [--headless] [--fresh] [--datadir PATH] [--port N] [--connect enode://...]

Networks: sepolia (default), mainnet, hoodi, holesky
`
}
