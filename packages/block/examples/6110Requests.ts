import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import {
  bytesToBigInt,
  DepositRequest,
  randomBytes,
  type CLRequest,
  type CLRequestType,
} from '@ethereumjs/util'

const main = async () => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Prague,
  })

  const depositRequestData = {
    pubkey: randomBytes(48),
    withdrawalCredentials: randomBytes(32),
    amount: bytesToBigInt(randomBytes(8)),
    signature: randomBytes(96),
    index: bytesToBigInt(randomBytes(8)),
  }
  const request = DepositRequest.fromRequestData(depositRequestData) as CLRequest<CLRequestType>
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
    } deposit request, requestTrieValid=${await block.requestsTrieIsValid()}`,
  )
}

main()
