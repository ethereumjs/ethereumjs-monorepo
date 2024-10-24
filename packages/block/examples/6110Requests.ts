import { createBlock, genRequestsRoot } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  type CLRequest,
  CLRequestType,
  bytesToHex,
  createCLRequest,
  randomBytes,
} from '@ethereumjs/util'
import { sha256 } from 'ethereum-cryptography/sha256.js'

const main = async () => {
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Prague,
  })

  const depositRequestData = {
    pubkey: randomBytes(48),
    withdrawalCredentials: randomBytes(32),
    amount: randomBytes(8),
    signature: randomBytes(96),
    index: randomBytes(8),
  }
  // flatten request bytes as per EIP-7685
  const depositRequestBytes = new Uint8Array(
    Object.values(depositRequestData)
      .map((arr) => Array.from(arr)) // Convert Uint8Arrays to regular arrays
      .reduce((acc, curr) => acc.concat(curr), []), // Concatenate arrays
  )
  const request = createCLRequest(
    new Uint8Array([CLRequestType.Deposit, ...depositRequestBytes]),
  ) as CLRequest<CLRequestType.Deposit>
  const requests = [request]
  const requestsRoot = genRequestsRoot(requests, sha256)

  const block = createBlock(
    {
      header: { requestsHash: requestsRoot },
    },
    { common },
  )
  console.log(`Instantiated block ${block}, requestsHash=${bytesToHex(block.header.requestsHash!)}`)
}

void main()
