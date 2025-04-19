import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { AccessList2930TxData } from '@ethereumjs/tx'
import { createAccessList2930Tx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })

const txData: AccessList2930TxData = {
  data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x02625a00',
  gasPrice: '0x01',
  nonce: '0x00',
  to: '0xcccccccccccccccccccccccccccccccccccccccc',
  value: '0x0186a0',
  v: '0x01',
  r: '0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9',
  s: '0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64',
  chainId: '0x01',
  accessList: [
    {
      address: '0x0000000000000000000000000000000000000101',
      storageKeys: [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x00000000000000000000000000000000000000000000000000000000000060a7',
      ],
    },
  ],
  type: '0x01',
}

const tx = createAccessList2930Tx(txData, { common })
console.log(bytesToHex(tx.hash())) // 0x9150cdebad74e88b038e6c6b964d99af705f9c0883d7f0bbc0f3e072358f5b1d
