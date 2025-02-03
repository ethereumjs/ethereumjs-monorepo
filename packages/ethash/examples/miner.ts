import { createBlock } from '@ethereumjs/block'
import { Ethash } from '@ethereumjs/ethash'
import { MapDB, bytesToHex } from '@ethereumjs/util'

import type { DBObject } from '@ethereumjs/util'

const block = createBlock(
  {
    header: {
      difficulty: BigInt(100),
      number: BigInt(1),
    },
  },
  { setHardfork: true, skipConsensusFormatValidation: true },
)

const cacheDB = new MapDB<number, DBObject>()

const e = new Ethash(cacheDB)
const miner = e.getMiner(block.header)
const solution = await miner.iterate(-1) // iterate until solution is found
console.log(bytesToHex(solution!.mixHash)) // 0x892177e7bbb1f31ade0610707c96c6bf86e1415b26073d17b2da2dbd2daefd1e
