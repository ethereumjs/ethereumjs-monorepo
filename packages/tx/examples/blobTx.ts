import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { BlobEIP4844TxData } from '@ethereumjs/tx'
import { createBlob4844Tx } from '@ethereumjs/tx'
import { bytesToHex, getBlobs, randomBytes } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  // EIP-4844 only
  const common4844 = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  // EIP-4844 and EIP-7594
  const common4844and7594 = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Osaka,
    customCrypto: { kzg },
  })
  const setups = [
    {
      title: 'Blob transaction (EIP-4844 only)',
      common: common4844,
      proofAmountComment: 'one proof per blob',
    },
    {
      title: 'Blob transaction (EIP-4844 + EIP-7594)',
      common: common4844and7594,
      proofAmountComment: '128 cells per blob + one proof per cell -> NUM_BLOBS * 128 proofs',
    },
  ]

  for (const setup of setups) {
    console.log(`\n${setup.title}:`)
    console.log('---------------------------------------')

    const blobsData = ['blob 1', 'blob 2', 'blob 3']
    console.log(`Blobs (Data) : "${blobsData.join('", "')}"`)
    // Final format, filled with a lot of 0s, added marker
    const blobs = getBlobs(blobsData)

    console.log('Generating tx...')

    const txData: BlobEIP4844TxData = {
      data: '0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      gasLimit: 16_000_000n,
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
      blobs,
    }

    const tx = createBlob4844Tx(txData, { common: setup.common })

    console.log(`Tx hash               : ${bytesToHex(tx.hash())}`)
    console.log(`Num blobs             : ${tx.numBlobs()}`)
    console.log(`Blob versioned hashes : ${tx.blobVersionedHashes.join(', ')}`)
    console.log(`KZG commitments       : ${tx.kzgCommitments!.join(', ')}`)
    console.log(`First KZG (cell) proof: ${tx.kzgProofs![0]}`)
    console.log(`Num KZG (cell) proofs : ${tx.kzgProofs!.length} (${setup.proofAmountComment})`)
  }

  // To send a transaction via RPC, you can something like this:
  // const rawTx = tx.sign(privateKeyBytes).serializeNetworkWrapper()
  // myRPCClient.request('eth_sendRawTransaction', [rawTx]) // submits a transaction via RPC
  //
  // Also see ./sendRawSepoliaTx.ts example
}

void main()
