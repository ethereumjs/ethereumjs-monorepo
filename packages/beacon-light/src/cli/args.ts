export type BeaconLightCliArgs = {
  network: string
  beaconUrl?: string
  checkpoint?: string
  once: boolean
  demo: boolean
  storePath?: string
}

const NETWORKS = new Set(['mainnet', 'sepolia', 'hoodi', 'holesky'])

export function parseBeaconLightArgs(argv: string[]): BeaconLightCliArgs {
  const args = argv.slice(2)
  let network = 'sepolia'
  let beaconUrl: string | undefined
  let checkpoint: string | undefined
  let once = false
  let demo = false
  let storePath: string | undefined

  for (let i = 0; i < args.length; i++) {
    const a = args[i]!
    if (a === '--help' || a === '-h') {
      throw new Error('HELP')
    }
    if (a === '--once') {
      once = true
      continue
    }
    if (a === '--demo') {
      demo = true
      continue
    }
    if (a === '--beacon-url') {
      beaconUrl = args[++i]
      continue
    }
    if (a === '--checkpoint') {
      checkpoint = args[++i]
      continue
    }
    if (a === '--store') {
      storePath = args[++i]
      continue
    }
    if (a.startsWith('-')) {
      throw new Error(`Unknown flag: ${a}`)
    }
    if (NETWORKS.has(a.toLowerCase())) {
      network = a.toLowerCase()
      continue
    }
    throw new Error(`Unexpected argument: ${a}`)
  }

  return { network, beaconUrl, checkpoint, once, demo, storePath }
}

export function printBeaconLightUsage(): string {
  return `Usage: beacon-light [network] [options]

Networks: mainnet, sepolia (default), hoodi, holesky

Options:
  --beacon-url <url>   Preferred Beacon REST endpoint
  --checkpoint <root>  Bootstrap block root (0x…)
  --store <path>       Persistence file (default ~/.ethy/networks/<net>/cl/light-client.json)
  --once               Bootstrap + one poll, print JSON summary, exit
  --demo               Offline synthetic ticker (no network)
  -h, --help           Show this help
`
}
