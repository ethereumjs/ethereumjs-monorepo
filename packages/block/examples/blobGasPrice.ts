import { createBlockHeader } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
const header = createBlockHeader({ excessBlobGas: 1_000_000n }, { common })

console.log(`Blob gas price at excessBlobGas=1_000_000: ${header.getBlobGasPrice()}`)
