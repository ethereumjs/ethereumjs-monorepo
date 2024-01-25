import { Block } from '@ethereumjs/block'
import { Ethash } from '@ethereumjs/ethash'
import { DBObject, MapDB, bytesToHex } from '@ethereumjs/util'

const block = Block.fromBlockData(
  {
    header: {
      difficulty: BigInt(100),
      number: BigInt(1),
    },
  },
  { setHardfork: true, skipConsensusFormatValidation: true }
)

const cacheDB = new MapDB<number, DBObject>()

const e = new Ethash(cacheDB)
const miner = e.getMiner(block.header)
const solution = await miner.iterate(-1) // iterate until solution is found
console.log(bytesToHex(solution!.mixHash))
