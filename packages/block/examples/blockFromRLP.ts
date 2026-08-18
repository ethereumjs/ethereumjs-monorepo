import { createBlock, createBlockFromRLP } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet })

const block = createBlock(
  {
    header: {
      number: 1n,
      gasLimit: 30_000_000n,
    },
  },
  { common, skipConsensusFormatValidation: true },
)

const serialized = block.serialize()
const decoded = createBlockFromRLP(serialized, { common })

console.log(`Serialized ${serialized.length} bytes`)
console.log(`Round-trip hash match: ${bytesToHex(decoded.hash()) === bytesToHex(block.hash())}`)
