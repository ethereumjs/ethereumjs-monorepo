import { Common, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx, createTxFromRLP } from '@ethereumjs/tx'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet })
const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')

const tx = createFeeMarket1559Tx(
  {
    type: 2,
    nonce: 0n,
    gasLimit: 21_000n,
    maxFeePerGas: 20n,
    maxPriorityFeePerGas: 1n,
    to: '0xcccccccccccccccccccccccccccccccccccccccc',
  },
  { common },
).sign(privateKey)

const roundTrip = createTxFromRLP(tx.serialize(), { common })

console.log(`Type preserved: ${roundTrip.type === tx.type}`)
console.log(`Hash match: ${bytesToHex(roundTrip.hash()) === bytesToHex(tx.hash())}`)
