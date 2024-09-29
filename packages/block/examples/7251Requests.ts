import { createBlock, genRequestsRoot } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  type CLRequest,
  type CLRequestType,
  createConsolidationRequest,
  randomBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

const main = async () => {
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Prague,
  })

  const consolidationRequestData = {
    sourceAddress: randomBytes(20),
    sourcePubkey: randomBytes(48),
    targetPubkey: randomBytes(48),
  }
  const request = createConsolidationRequest(consolidationRequestData) as CLRequest<CLRequestType>
  const requests = [request]
  const requestsRoot = await genRequestsRoot(requests, keccak256)

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
    } consolidation request, requestTrieValid=${await block.requestsTrieIsValid()}`,
  )
}

void main()
