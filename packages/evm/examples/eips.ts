import { Chain, Common } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

const main = async () => {
  const common = new Common({ chain: Chain.Mainnet, eips: [3074] })
  const evm = await createEVM({ common })
  console.log(`EIP 3074 is active - ${evm.common.isActivatedEIP(3074)}`)
}

void main()
