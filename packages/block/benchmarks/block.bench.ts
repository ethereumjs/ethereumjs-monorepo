import { createBlockFromRLP } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { preLondonTestDataBlocks1RLP } from '@ethereumjs/testdata'
import { hexToBytes } from '@ethereumjs/util'
import { bench, describe } from 'vitest'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
const rlp = hexToBytes(preLondonTestDataBlocks1RLP.blockRLP)
const decodedBlock = createBlockFromRLP(rlp, { common })

describe('block', () => {
  bench('block decode from RLP', () => {
    createBlockFromRLP(rlp, { common })
  })

  bench('block encode to RLP', () => {
    decodedBlock.serialize()
  })
})
