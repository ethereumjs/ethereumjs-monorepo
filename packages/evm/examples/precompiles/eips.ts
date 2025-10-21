import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
  const evm = await createEVM({ common })
  console.log(
    `EIP 7702 is active in isolation on top of the Cancun HF - ${evm.common.isActivatedEIP(7702)}`,
  )
}

void main()
