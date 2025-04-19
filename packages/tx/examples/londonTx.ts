import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { FeeMarketEIP1559TxData } from '@ethereumjs/tx'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

const txData: FeeMarketEIP1559TxData = {
  data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x02625a00',
  maxPriorityFeePerGas: '0x01',
  maxFeePerGas: '0xff',
  nonce: '0x00',
  to: '0xcccccccccccccccccccccccccccccccccccccccc',
  value: '0x0186a0',
  v: '0x01',
  r: '0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9',
  s: '0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64',
  chainId: '0x01',
  accessList: [],
  type: '0x02',
}

const tx = createFeeMarket1559Tx(txData, { common })
console.log(bytesToHex(tx.hash())) // 0x6f9ef69ccb1de1aea64e511efd6542541008ced321887937c95b03779358ec8a
