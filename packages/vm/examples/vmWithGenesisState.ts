import { Chain } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createAddressFromString } from '@ethereumjs/util'
import { createVM } from '@ethereumjs/vm'

const main = async () => {
  const genesisState = getGenesis(Chain.Mainnet)

  const vm = await createVM()
  await vm.stateManager.generateCanonicalGenesis!(genesisState)
  const accountAddress = '0x000d836201318ec6899a67540690382780743280'
  const account = await vm.stateManager.getAccount(createAddressFromString(accountAddress))

  if (account === undefined) {
    throw new Error('Account does not exist: failed to import genesis state')
  }

  console.log(
    `This balance for account ${accountAddress} in this chain's genesis state is ${Number(
      account?.balance,
    )}`,
  )
}
void main()
