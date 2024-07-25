import { Chain, Common } from '@ethereumjs/common'
import { VM } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Chain.Mainnet, eips: [3074] })
  const vm = await VM.create({ common })
  console.log(`EIP 3074 is active in the VM - ${vm.common.isActivatedEIP(3074)}`)
}
void main()
