import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import {
  bytesToBigInt,
  randomBytes,
  WithdrawalRequest,
  type CLRequest,
  type CLRequestType,
} from '@ethereumjs/util'

const main = async () => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Prague,
  })

  const withdrawalRequestData = {
    sourceAddress: randomBytes(20),
    validatorPubkey: randomBytes(48),
    amount: bytesToBigInt(randomBytes(8)),
  }
  const request = WithdrawalRequest.fromRequestData(
    withdrawalRequestData,
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
    } withdrawal request, requestTrieValid=${await block.requestsTrieIsValid()}`,
  )
}

main()
