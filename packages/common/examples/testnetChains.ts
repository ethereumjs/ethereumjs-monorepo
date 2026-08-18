import { Common, Holesky, Hoodi, Mainnet, Sepolia } from '@ethereumjs/common'

for (const chain of [Mainnet, Sepolia, Holesky, Hoodi]) {
  const common = new Common({ chain })
  console.log(
    `${common.chainName()}: chainId=${common.chainId()} hardfork=${common.hardfork()} bootstrapNodes=${common.bootstrapNodes().length}`,
  )
}
