import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Capability, createTxFromTxData } from '@ethereumjs/tx'

import type { EIP1559CompatibleTx } from '@ethereumjs/tx'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

const txData = { type: 2, maxFeePerGas: BigInt(20) } // Creates an EIP-1559 compatible transac
const tx = createTxFromTxData(txData, { common })

if (tx.supports(Capability.EIP1559FeeMarket)) {
  console.log(
    `The max fee per gas for this transaction is ${(tx as EIP1559CompatibleTx).maxFeePerGas}`,
  )
}
