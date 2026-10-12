import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx, createFeeMarket1559TxFromRLP } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'
import { bench, describe } from 'vitest'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
const privateKey = hexToBytes('0x4646464646464646464646464646464646464646464646464646464646464646')

const signed = createFeeMarket1559Tx(
  {
    chainId: BigInt(1),
    nonce: 0,
    maxPriorityFeePerGas: BigInt(1),
    maxFeePerGas: BigInt(10),
    gasLimit: BigInt(21000),
    to: '0x0000000000000000000000000000000000000001',
    value: BigInt(1),
    data: new Uint8Array(0),
    accessList: [],
  },
  { common },
).sign(privateKey)
const serialized = signed.serialize()

describe('tx', () => {
  bench('tx type2 decode from RLP', () => {
    createFeeMarket1559TxFromRLP(serialized, { common })
  })

  bench('tx type2 recover sender', () => {
    signed.getSenderAddress()
  })
})
