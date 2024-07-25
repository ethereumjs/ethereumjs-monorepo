import { Chain, Common, Hardfork } from '@ethereumjs/common'

import { VM } from '../src/vm.js'

const main = async () => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, eips: [4844] })
  const vm = await VM.create({ common })
  console.log(`4844 is active in the VM - ${vm.common.isActivatedEIP(4844)}`)
}

void main()
