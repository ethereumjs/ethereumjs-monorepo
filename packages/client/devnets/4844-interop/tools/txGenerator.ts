// Adapted from - https://github.com/Inphi/eip4844-interop/blob/master/blob_tx_generator/blob.js
import { Common, Hardfork } from '@ethereumjs/common'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import {
  Address,
  initKZG,
  blobsToCommitments,
  commitmentsToVersionedHashes,
  getBlobs,
  bytesToPrefixedHexString,
  hexStringToBytes,
} from '@ethereumjs/util'

import * as kzg from 'c-kzg'
import { randomBytes } from '@ethereumjs/util'
import { Client } from 'jayson/promise'

// CLI Args
const clientPort = parseInt(process.argv[2]) // EL client port number
const input = process.argv[3] // text to generate blob from
const genesisJson = require(process.argv[4]) // Genesis parameters
const pkey = hexStringToBytes(process.argv[5]) // private key of tx sender as unprefixed hex string

initKZG(kzg, __dirname + '/../../../src/trustedSetups/devnet6.txt')

const sender = Address.fromPrivateKey(pkey)
const common = Common.fromGethGenesis(genesisJson, {
  chain: genesisJson.ChainName ?? 'devnet',
  hardfork: Hardfork.Cancun,
})
async function getNonce(client: Client, account: string) {
  const nonce = await client.request('eth_getTransactionCount', [account, 'latest'], 2.0)
  return nonce.result
}

async function run(data: any) {
  const client = Client.http({ port: clientPort })

  const blobs = getBlobs(data)
  const commitments = blobsToCommitments(blobs)
  const hashes = commitmentsToVersionedHashes(commitments)

  const account = Address.fromPrivateKey(randomBytes(32))
  const txData = {
    from: sender.toString(),
    to: account.toString(),
    data: '0x',
    chainId: common.chainId(),
    blobs,
    kzgCommitments: commitments,
    versionedHashes: hashes,
    gas: undefined,
    maxFeePerDataGas: undefined,
    maxPriorityFeePerGas: undefined,
    maxFeePerGas: undefined,
    nonce: undefined,
    gasLimit: undefined,
  }

  txData['maxFeePerGas'] = BigInt(1000000000) as any
  txData['maxPriorityFeePerGas'] = BigInt(100000000) as any
  txData['maxFeePerDataGas'] = BigInt(1000) as any
  txData['gasLimit'] = BigInt(28000000) as any
  const nonce = await getNonce(client, sender.toString())
  txData['nonce'] = BigInt(nonce) as any
  const blobTx = BlobEIP4844Transaction.fromTxData(txData, { common }).sign(pkey)

  const serializedWrapper = blobTx.serializeNetworkWrapper()

  const res = await client.request(
    'eth_sendRawTransaction',
    [bytesToPrefixedHexString(serializedWrapper)],
    2.0
  )

  if (res.result.error !== undefined) {
    console.log('error sending transaction')
    console.log(res.result.error)
    return false
  }
}
void run(input)
