import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import {
  bytesToBigInt,
  ConsolidationRequest,
  randomBytes,
  type CLRequest,
  type CLRequestType,
} from '@ethereumjs/util'

const main = async () => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Prague,
  })

  const consolidationRequestData = {
    sourceAddress: randomBytes(20),
    sourcePubkey: randomBytes(48),
    targetPubkey: randomBytes(48),
  }
  const request = ConsolidationRequest.fromRequestData(
    consolidationRequestData,
  ) as CLRequest<CLRequestType>
  const requests = [request]
  const requestsRoot = await Block.genRequestsTrieRoot(requests)

  const block = Block.fromBlockData(
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

main()
