import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx, getCalldataFloorGas } from '@ethereumjs/tx'
import { createZeroAddress } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const data = new Uint8Array(10).fill(1)
const tx = createLegacyTx(
  {
    to: createZeroAddress(),
    data,
    gasLimit: 21_000n,
    gasPrice: 10n,
  },
  { common },
)

console.log(`Calldata floor gas (EIP-7976): ${getCalldataFloorGas(tx)}`)
console.log(`Validation errors: ${tx.getValidationErrors().join(', ') || 'none'}`)
