import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

import { createVM } from '../src/index.ts'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai, eips: [4844] })
  const vm = await createVM({ common })
  console.log(`4844 is active in the VM - ${vm.common.isActivatedEIP(4844)}`)
}

void main()
