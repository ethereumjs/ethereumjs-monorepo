import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { createTx } from '@ethereumjs/tx'
const common = new Common({ chain: Mainnet })

const block = createBlock(
  {
    header: {
      baseFeePerGas: BigInt(10),
      gasLimit: BigInt(100),
      gasUsed: BigInt(60),
    },
  },
  { common },
)

// Base fee will increase for next block since the
// gas used is greater than half the gas limit
console.log(Number(block.header.calcNextBaseFee())) // 11

// So for creating a block with a matching base fee in a certain
// chain context you can do:
const blockWithMatchingBaseFee = createBlock(
  {
    header: {
      baseFeePerGas: block.header.calcNextBaseFee(),
      gasLimit: BigInt(100),
      gasUsed: BigInt(60),
    },
  },
  { common },
)

console.log(Number(blockWithMatchingBaseFee.header.baseFeePerGas)) // 11

// successful validation does not throw error
await blockWithMatchingBaseFee.validateData()

// failed validation throws error
const tx = createTx(
  { type: 2, maxFeePerGas: BigInt(20) },
  { common: new Common({ chain: Mainnet }) },
)
blockWithMatchingBaseFee.transactions.push(tx)
console.log(blockWithMatchingBaseFee.getTransactionsValidationErrors()) // invalid transaction added to block
try {
  await blockWithMatchingBaseFee.validateData()
} catch (err) {
  console.log(err) // block validation fails
}
