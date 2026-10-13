import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Mainnet } from '@ethereumjs/common'

const main = async () => {
  const common = new Common({ chain: Mainnet })
  await createBlockchain({ common, hardforkByHeadBlockNumber: true })
  console.log(`Hardfork at genesis head: ${common.hardfork()}`)
}

void main()
