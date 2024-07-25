import { Account, Address, randomBytes } from '@ethereumjs/util'

import { SimpleStateManager } from '../src/index.js'

const main = async () => {
  const sm = new SimpleStateManager()
  const address = Address.fromPrivateKey(randomBytes(32))
  const account = new Account(0n, 0xfffffn)
  await sm.putAccount(address, account)
  console.log(await sm.getAccount(address))
}

main()
