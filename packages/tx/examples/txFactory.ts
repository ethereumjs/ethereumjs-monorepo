import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Capability, createTx } from '@ethereumjs/tx'

import type { EIP1559CompatibleTx } from '@ethereumjs/tx'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

const txData = { type: 2, maxFeePerGas: BigInt(20) } // Creates an EIP-1559 compatible transaction
const tx = createTx(txData, { common })

if (tx.supports(Capability.EIP1559FeeMarket)) {
  console.log(
    `The max fee per gas for this transaction is ${(tx as EIP1559CompatibleTx).maxFeePerGas}`,
  )
}
