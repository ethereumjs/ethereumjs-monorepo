import { createBlock, genRequestsRoot } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  type CLRequest,
  type CLRequestType,
  bytesToBigInt,
  createWithdrawalRequest,
  randomBytes,
} from '@ethereumjs/util'
import { sha256 } from 'ethereum-cryptography/keccak.js'

const main = async () => {
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Prague,
  })

  const withdrawalRequestData = {
    sourceAddress: randomBytes(20),
    validatorPubkey: randomBytes(48),
    amount: bytesToBigInt(randomBytes(8)),
  }
  const request = createWithdrawalRequest(withdrawalRequestData) as CLRequest<CLRequestType>
  const requests = [request]
  const requestsRoot = genRequestsRoot(requests, sha256)

  const block = createBlock(
    {
      requests,
      header: { requestsRoot },
    },
    { common },
  )
  console.log(
    `Instantiated block with ${
      block.requests?.length
    } withdrawal request, requestTrieValid=${await block.requestsTrieIsValid()}`,
  )
}

void main()
