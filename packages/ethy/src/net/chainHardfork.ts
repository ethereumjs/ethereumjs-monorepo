import { Common, Holesky, Hoodi, Mainnet, Sepolia } from '@ethereumjs/common'

import type { ChainConfig } from '@ethereumjs/common'

const CHAINS: Record<string, ChainConfig> = {
  mainnet: Mainnet,
  sepolia: Sepolia,
  hoodi: Hoodi,
  holesky: Holesky,
}

export function chainConfigForNetwork(network: string): ChainConfig {
  const chain = CHAINS[network.toLowerCase()]
  if (chain === undefined) {
    throw new Error(`Unsupported network for P2P: ${network}`)
  }
  return chain
}

/** Active EL hardfork at the current wall-clock second (timestamp forks). */
export function activeHardfork(chain: ChainConfig): string {
  const common = new Common({ chain })
  const now = BigInt(Math.floor(Date.now() / 1000))
  return common.getHardforkBy({ timestamp: now })
}
