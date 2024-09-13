import { Common, Mainnet } from '@ethereumjs/common'
import { createVM } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, eips: [7702] })
  const vm = await createVM({ common })
  console.log(`EIP 7702 is active in the VM - ${vm.common.isActivatedEIP(7702)}`)
}
void main()
