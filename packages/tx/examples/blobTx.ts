import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { BlobEIP4844TxData } from '@ethereumjs/tx'
import { createBlob4844Tx } from '@ethereumjs/tx'
import { bytesToHex, randomBytes } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  const txData: BlobEIP4844TxData = {
    data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    gasLimit: '0x02625a00',
    maxPriorityFeePerGas: '0x01',
    maxFeePerGas: '0xff',
    maxFeePerBlobGas: '0xfff',
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

  const tx = createBlob4844Tx(txData, { common })

  console.log(bytesToHex(tx.hash())) //0x3c3e7c5e09c250d2200bcc3530f4a9088d7e3fb4ea3f4fccfd09f535a3539e84

  // To send a transaction via RPC, you can something like this:
  // const rawTx = tx.sign(privateKeyBytes).serializeNetworkWrapper()
  // myRPCClient.request('eth_sendRawTransaction', [rawTx]) // submits a transaction via RPC
}

void main()
