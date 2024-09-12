import { createBlock, genRequestsTrieRoot } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  type CLRequest,
  type CLRequestType,
  bytesToBigInt,
  createDepositRequest,
  randomBytes,
} from '@ethereumjs/util'

const main = async () => {
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Prague,
  })

  const depositRequestData = {
    pubkey: randomBytes(48),
    withdrawalCredentials: randomBytes(32),
    amount: bytesToBigInt(randomBytes(8)),
    signature: randomBytes(96),
    index: bytesToBigInt(randomBytes(8)),
  }
  const request = createDepositRequest(depositRequestData) as CLRequest<CLRequestType>
  const requests = [request]
  const requestsRoot = await genRequestsTrieRoot(requests)

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
    } deposit request, requestTrieValid=${await block.requestsTrieIsValid()}`,
  )
}

void main()
