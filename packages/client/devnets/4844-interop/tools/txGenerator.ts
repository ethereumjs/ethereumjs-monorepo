// Adapted from - https://github.com/Inphi/eip4844-interop/blob/master/blob_tx_generator/blob.js
import { createCommonFromGethGenesis, Hardfork } from '@ethereumjs/common'
import { createTx, TransactionType, TxData } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  commitmentsToVersionedHashes,
  getBlobs,
  bytesToHex,
  hexToBytes,
  createAddressFromPrivateKey,
} from '@ethereumjs/util'

import { randomBytes } from '@ethereumjs/util'
import { Client } from 'jayson/promise/index.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
const kzg = new microEthKZG(trustedSetup)

// CLI Args
const clientPort = parseInt(process.argv[2]) // EL client port number
const input = process.argv[3] // text to generate blob from
const genesisJSON = require(process.argv[4]) // Genesis parameters
const pkey = hexToBytes(`0x${process.argv[5]}`) // private key of tx sender as unprefixed hex string (unprefixed in args)
const sender = createAddressFromPrivateKey(pkey)

async function getNonce(client: Client, account: string) {
  const nonce = await client.request('eth_getTransactionCount', [account, 'latest'], 2.0)
  return nonce.result
}

async function run(data: any) {
  const common = createCommonFromGethGenesis(genesisJSON, {
    chain: genesisJSON.ChainName ?? 'devnet',
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })

  const client = Client.http({ port: clientPort })

  const blobs = getBlobs(data)
  const commitments = blobsToCommitments(kzg, blobs)
  const hashes = commitmentsToVersionedHashes(commitments)

  const account = createAddressFromPrivateKey(randomBytes(32))
  const txData: TxData[TransactionType.BlobEIP4844] = {
    to: account.toString(),
    data: '0x',
    chainId: common.chainId(),
    blobs,
    kzgCommitments: commitments,
    blobVersionedHashes: hashes,
    maxFeePerBlobGas: undefined,
    maxPriorityFeePerGas: undefined,
    maxFeePerGas: undefined,
    nonce: undefined,
    gasLimit: undefined,
  }

  txData.maxFeePerGas = BigInt(1000000000)
  txData.maxPriorityFeePerGas = BigInt(100000000)
  txData.maxFeePerBlobGas = BigInt(1000)
  txData.gasLimit = BigInt(28000000)
  const nonce = await getNonce(client, sender.toString())
  txData.nonce = BigInt(nonce)
  const blobTx = createTx<TransactionType.BlobEIP4844>(txData, { common }).sign(pkey)

  const serializedWrapper = blobTx.serializeNetworkWrapper()

  const res = await client.request('eth_sendRawTransaction', [bytesToHex(serializedWrapper)], 2.0)

  if (res.result.error !== undefined) {
    console.log('error sending transaction')
    console.log(res.result.error)
    return false
  }
}
void run(input)
