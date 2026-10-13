import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createVM } from '@ethereumjs/vm'

const main = async () => {
  const commonCancun = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
  const vm = await createVM({ common: commonCancun })
  console.log(`EIP-4844 active on Cancun: ${vm.common.isActivatedEIP(4844)}`)

  const common7702 = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
  const vm7702 = await createVM({ common: common7702 })
  console.log(`EIP-7702 active in isolation on Cancun: ${vm7702.common.isActivatedEIP(7702)}`)
}

void main()
