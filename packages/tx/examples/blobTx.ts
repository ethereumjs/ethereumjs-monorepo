import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'

const main = async () => {
  const kzg = await loadKZG()

  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Shanghai,
    eips: [4844],
    customCrypto: { kzg },
  })

  const txData = {
    data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x02625a00',
    maxPriorityFeePerGas: '0x01',
    maxFeePerGas: '0xff',
    maxFeePerDataGas: '0xfff',
    nonce: '0x00',
    to: '0xcccccccccccccccccccccccccccccccccccccccc',
    value: '0x0186a0',
    v: '0x01',
    r: '0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9',
    s: '0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64',
    chainId: '0x01',
    accessList: [],
    type: '0x05',
    blobsData: ['abcd'],
  }

  const tx = BlobEIP4844Transaction.fromTxData(txData, { common })

  console.log(bytesToHex(tx.hash())) //0x3c3e7c5e09c250d2200bcc3530f4a9088d7e3fb4ea3f4fccfd09f535a3539e84
}

main()
