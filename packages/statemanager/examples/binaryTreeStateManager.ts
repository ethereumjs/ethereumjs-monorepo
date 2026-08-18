import { Common, Mainnet } from '@ethereumjs/common'
import { StatefulBinaryTreeStateManager } from '@ethereumjs/statemanager'
import { Account, createAddressFromString } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, eips: [7864] })
  const sm = new StatefulBinaryTreeStateManager({ common })
  const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')

  await sm.putAccount(address, new Account(1n, 1000n))
  const account = await sm.getAccount(address)
  console.log(`Binary tree SM balance: ${account?.balance}`)
}

void main()
