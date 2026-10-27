export interface EthyCliArgs {
  network: string
  demo: boolean
  headless: boolean
}

export function parseEthyArgs(argv: string[]): EthyCliArgs {
  const args = argv.slice(2)
  let network = 'sepolia'
  let demo = false
  let headless = false

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--demo') {
      demo = true
      continue
    }
    if (a === '--headless') {
      headless = true
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

  return { network, demo, headless }
}

export function printEthyUsage(): string {
  return `ethy — EthereumJS execution-free state node (Amsterdam focus)

Usage:
  ethy [network] [--demo] [--headless]

Networks: sepolia (default), mainnet, hoodi, holesky
`
}
