// Adapted from - https://github.com/Inphi/eip4844-interop/blob/master/blob_tx_generator/blob.js
import { randomBytes } from 'crypto'
import { Address } from '@ethereumjs/util'
import { Client } from 'jayson/promise'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import {
  blobsToCommitments,
  commitmentsToVersionedHashes,
} from '@ethereumjs/tx/test/utils/blobHelpers'
import { loadTrustedSetup, freeTrustedSetup } from 'c-kzg'
const input = process.argv[2]
const expected_kzgs = process.argv[3]

const BYTES_PER_FIELD_ELEMENT = 32
const FIELD_ELEMENTS_PER_BLOB = 4096
const USEFUL_BYTES_PER_BLOB = 32 * FIELD_ELEMENTS_PER_BLOB
const MAX_BLOBS_PER_TX = 2
const MAX_USEFUL_BYTES_PER_TX = USEFUL_BYTES_PER_BLOB * MAX_BLOBS_PER_TX - 1
const BLOB_SIZE = BYTES_PER_FIELD_ELEMENT * FIELD_ELEMENTS_PER_BLOB

function get_padded(data: any, blobs_len: number) {
  let pdata = Buffer.alloc(blobs_len * USEFUL_BYTES_PER_BLOB)
  const datalen = Buffer.byteLength(data)
  pdata.fill(data, 0, datalen)
  // TODO: if data already fits in a pad, then ka-boom
  pdata[datalen] = 0x80
  return pdata
}

function get_blob(data: any) {
  let blob = Buffer.alloc(BLOB_SIZE, 'binary')
  for (let i = 0; i < FIELD_ELEMENTS_PER_BLOB; i++) {
    let chunk = Buffer.alloc(32, 'binary')
    chunk.fill(data.subarray(i * 31, (i + 1) * 31), 0, 31)
    blob.fill(chunk, i * 32, (i + 1) * 32)
  }

  return blob
}

// ref: https://github.com/asn-d6/blobbers/blob/packing_benchmarks/src/packer_naive.rs
function get_blobs(data: any) {
  data = Buffer.from(data, 'binary')
  const len = Buffer.byteLength(data)
  if (len === 0) {
    throw Error('invalid blob data')
  }
  if (len > MAX_USEFUL_BYTES_PER_TX) {
    throw Error('blob data is too large')
  }

  const blobs_len = Math.ceil(len / USEFUL_BYTES_PER_BLOB)

  const pdata = get_padded(data, blobs_len)

  let blobs: Buffer[] = []
  for (let i = 0; i < blobs_len; i++) {
    let chunk = pdata.subarray(i * USEFUL_BYTES_PER_BLOB, (i + 1) * USEFUL_BYTES_PER_BLOB)
    let blob = get_blob(chunk)
    blobs.push(blob)
  }

  return blobs
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function estimateGas(client: Client, tx: any) {
  const num = (await client.request('eth_blockNumber', [], 2.0)).result
  const res = await client.request('eth_estimateGas', [tx, num])
  console.log(res)
  return res.result
}

async function getNonce(client: Client, account: string) {
  const nonce = await client.request('eth_getTransactionCount', [account, 'latest'], 2.0)
  return nonce.result
}
async function run(data: any, expected_kzgs: any) {
  const client = Client.http({ port: 8947 })
  while (true) {
    const num = parseInt((await client.request('eth_blockNumber', [], 2.0)).result)
    if (num >= 1) {
      break
    }
    console.log(`waiting for eip4844 proc.... bn=${num}`)
    await sleep(1000)
  }

  loadTrustedSetup('../tx/src/kzg/trusted_setup.txt')
  const blobs = get_blobs(data)
  const commitments = blobsToCommitments(blobs)
  const hashes = commitmentsToVersionedHashes(commitments)
  freeTrustedSetup()

  const account = Address.fromPrivateKey(randomBytes(32))
  const txData = {
    from: '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b',
    to: account.toString(),
    data: '0x',
    chainId: '0x1',
    blobs: blobs,
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
  const nonce = await getNonce(client, '0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
  txData['nonce'] = BigInt(nonce) as any
  const blobTx = BlobEIP4844Transaction.fromTxData(txData).sign(
    Buffer.from('45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8', 'hex')
  )

  console.log(`sending to ${account.toString()} from ${blobTx.getSenderAddress().toString()}`)
  const serializedWrapper = blobTx.serializeNetworkWrapper()

  const res = await client.request(
    'eth_sendRawTransaction',
    ['0x' + serializedWrapper.toString('hex')],
    2.0
  )
  console.log(res)
  if (res.result.error) {
    return false
  }

  if (expected_kzgs === undefined) {
    return true
  }

  let blob_kzg = null
  try {
    let res = (
      await (await fetch('http://127.0.0.1:9596/eth/v1/beacon/headers', { method: 'get' })).json()
    ).data[0].header.message.slot
    const start = parseInt(res)
    for (let i = 0; i < 5; i++) {
      const res = (
        await (await fetch(`http://127.0.0.1:9596/eth/v2/beacon/blocks/${start + i}`)).json()
      ).data.message.body.blob_kzg_commitments
      if (res && res.length > 0) {
        blob_kzg = res[0]
      }
      while (true) {
        const current =
          (await (await fetch('http://127.0.0.1:9596/eth/v1/beacon/headers')).json()).data[0].header
            .message.slot - 1
        if (current > start + i) {
          break
        }
        console.log(`waiting for tx to be included in block.... bn=${current}`)
        await sleep(1000)
      }
    }
  } catch (error: any) {
    console.log(error)
    console.log(`Error retrieving blocks from ${error.config.url}: ${error.response.data}`)
    return false
  }

  if (blob_kzg !== expected_kzgs) {
    console.log(`Unexpected KZG value: expected ${expected_kzgs}, got ${blob_kzg}`)
    return false
  } else {
    console.log(`Found expected KZG value: ${blob_kzg}`)
  }

  return true
}

;(async () => {
  process.exit((await run(input, expected_kzgs)) ? 0 : 1)
})()
