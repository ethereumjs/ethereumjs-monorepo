import { Common, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

const main = async () => {
  const common = new Common({ chain: Mainnet, eips: [7702] })
  const evm = await createEVM({ common })
  console.log(`EIP 7702 is active - ${evm.common.isActivatedEIP(7702)}`)
}

void main()
