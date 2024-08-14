import { Chain } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createAddressFromString } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'

const main = async () => {
  const genesisState = getGenesis(Chain.Mainnet)

  const vm = await VM.create()
  await vm.stateManager.generateCanonicalGenesis!(genesisState)
  const account = await vm.stateManager.getAccount(
    createAddressFromString('0x000d836201318ec6899a67540690382780743280'),
  )

  if (account === undefined) {
    throw new Error('Account does not exist: failed to import genesis state')
  }

  console.log(
    `This balance for account 0x000d836201318ec6899a67540690382780743280 in this chain's genesis state is ${Number(
      account?.balance,
    )}`,
  )
}
void main()
