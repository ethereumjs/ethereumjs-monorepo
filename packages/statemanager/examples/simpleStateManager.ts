import { SimpleStateManager } from '@ethereumjs/statemanager'
import { Account, createAddressFromPrivateKey, randomBytes } from '@ethereumjs/util'

const main = async () => {
  const sm = new SimpleStateManager()
  const address = createAddressFromPrivateKey(randomBytes(32))
  const account = new Account(0n, 0xfffffn)
  await sm.putAccount(address, account)
  const read = await sm.getAccount(address)
  console.log(`Account balance: ${read?.balance}`)
}

void main()
