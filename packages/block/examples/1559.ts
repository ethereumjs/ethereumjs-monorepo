import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

const block = Block.fromBlockData(
  {
    header: {
      baseFeePerGas: BigInt(10),
      gasLimit: BigInt(100),
      gasUsed: BigInt(60),
    },
  },
  { common }
)

// Base fee will increase for next block since the
// gas used is greater than half the gas limit
console.log(Number(block.header.calcNextBaseFee())) // 11

// So for creating a block with a matching base fee in a certain
// chain context you can do:
const blockWithMatchingBaseFee = Block.fromBlockData(
  {
    header: {
      baseFeePerGas: block.header.calcNextBaseFee(),
      gasLimit: BigInt(100),
      gasUsed: BigInt(60),
    },
  },
  { common }
)

console.log(Number(blockWithMatchingBaseFee.header.baseFeePerGas)) // 11
