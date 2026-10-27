import { Common, Holesky, Hoodi, Mainnet, Sepolia } from '@ethereumjs/common'

import type { ChainConfig } from '@ethereumjs/common'

const NETWORKS: Record<string, ChainConfig> = {
  sepolia: Sepolia,
  mainnet: Mainnet,
  hoodi: Hoodi,
  holesky: Holesky,
}

export function resolveNetwork(name: string): { network: string; chainId: bigint } {
  const key = name.toLowerCase()
  const chain = NETWORKS[key]
  if (chain === undefined) {
    throw new Error(`Unknown network "${name}". Supported: ${Object.keys(NETWORKS).join(', ')}`)
  }
  const common = new Common({ chain })
  return { network: key, chainId: common.chainId() }
}
