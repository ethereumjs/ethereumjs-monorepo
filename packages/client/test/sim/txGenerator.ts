// Adapted from - https://github.com/Inphi/eip4844-interop/blob/master/blob_tx_generator/blob.js
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import {
  Address,
  blobsToCommitments,
  bytesToPrefixedHexString,
  commitmentsToVersionedHashes,
  hexStringToBytes,
  initKZG,
  randomBytes,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { Client } from 'jayson/promise'
const clientPort = process.argv[2]
const input = process.argv[3]

const BYTES_PER_FIELD_ELEMENT = 32
const FIELD_ELEMENTS_PER_BLOB = 4096
const USEFUL_BYTES_PER_BLOB = 32 * FIELD_ELEMENTS_PER_BLOB
const MAX_BLOBS_PER_TX = 2
const MAX_USEFUL_BYTES_PER_TX = USEFUL_BYTES_PER_BLOB * MAX_BLOBS_PER_TX - 1
const BLOB_SIZE = BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB

initKZG(kzg, __dirname + '/../../src/trustedSetup/devnet4.txt')
const pkey = hexStringToBytes('45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8')
const sender = Address.fromPrivateKey(pkey)

function get_padded(data: any, blobs_len: number) {
  const pdata = new Uint8Array(blobs_len * USEFUL_BYTES_PER_BLOB)
  const datalen = (data as Uint8Array).byteLength
  pdata.fill(data, 0, datalen)
  // TODO: if data already fits in a pad, then ka-boom
  pdata[datalen] = 0x80
  return pdata
}

function get_blob(data: any) {
  const blob = new Uint8Array(BLOB_SIZE)
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i++) {
    const chunk = new Uint8Array(32)
    chunk.fill(data.subarray(i * 31, (i + 1) * 31), 0, 31)
    blob.fill(chunk as any, i * 32, (i + 1) * 32)
  }

  return blob
}

// ref: https://github.com/asn-d6/blobbers/blob/packing_benchmarks/src/packer_naive.rs
function get_blobs(data: any) {
  data = hexStringToBytes(data)
  const len = (data as Uint8Array).byteLength
  if (len === 0) {
    throw Error('invalid blob data')
  }
  if (len > MAX_USEFUL_BYTES_PER_TX) {
    throw Error('blob data is too large')
  }

  const blobs_len = Math.ceil(len / USEFUL_BYTES_PER_BLOB)

  const pdata = get_padded(data, blobs_len)

  const blobs: Uint8Array[] = []
  for (let i = 0; i < blobs_len; i++) {
    const chunk = pdata.subarray(i * USEFUL_BYTES_PER_BLOB, (i + 1) * USEFUL_BYTES_PER_BLOB)
    const blob = get_blob(chunk)
    blobs.push(blob)
  }

  return blobs
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function getNonce(client: Client, account: string) {
  const nonce = await client.request('eth_getTransactionCount', [account, 'latest'], 2.0)
  return nonce.result
}
async function run(data: any) {
  const client = Client.http({ port: parseInt(clientPort) })
  let done = false
  while (!done) {
    const num = parseInt((await client.request('eth_blockNumber', [], 2.0)).result)
    if (num >= 1) {
      done = true
      break
    }
    console.log(`waiting for eip4844 proc.... bn=${num}`)
    await sleep(1000)
  }

  const blobs = get_blobs(data)
  const commitments = blobsToCommitments(blobs)
  const hashes = commitmentsToVersionedHashes(commitments)

  const account = Address.fromPrivateKey(randomBytes(32))
  const txData = {
    from: sender.toString(),
    to: account.toString(),
    data: '0x',
    chainId: '0x1',
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
  const blobTx = BlobEIP4844Transaction.fromTxData(txData).sign(pkey)

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

  let blob_kzg = null
  try {
    const res = (
      await (await fetch('http://127.0.0.1:9596/eth/v1/beacon/headers', { method: 'get' })).json()
    ).data[0].header.message.slot
    const start = parseInt(res)
    for (let i = 0; i < 5; i++) {
      const res = (
        await (await fetch(`http://127.0.0.1:9596/eth/v2/beacon/blocks/${start + i}`)).json()
      ).data.message.body.blob_kzg_commitments
      if (res !== undefined && res.length > 0) {
        blob_kzg = res[0]
        break
      }
      let done = false
      while (!done) {
        const current =
          (await (await fetch('http://127.0.0.1:9596/eth/v1/beacon/headers')).json()).data[0].header
            .message.slot - 1
        if (current > start + i) {
          done = true
        }
        console.log(`waiting for tx to be included in block.... block number=${current}`)
        await sleep(1000)
      }
    }
  } catch (error: any) {
    console.log(error)
    console.log(`Error retrieving blocks from ${error.config.url}: ${error.response.data}`)
    return false
  }

  const expected_kzgs = bytesToPrefixedHexString(blobTx.kzgCommitments![0])
  if (blob_kzg !== bytesToPrefixedHexString(blobTx.kzgCommitments![0])) {
    console.log(`Unexpected KZG commitment: expected ${expected_kzgs}, got ${blob_kzg}`)
    return false
  } else {
    console.log(`Found expected KZG commitment: ${blob_kzg}`)
  }

  return true
}
void run(input)
