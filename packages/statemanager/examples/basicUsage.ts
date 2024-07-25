import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const stateManager = new DefaultStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const account = new Account(BigInt(0), BigInt(1000))
  await stateManager.checkpoint()
  await stateManager.putAccount(address, account)
  await stateManager.commit()
  await stateManager.flush()

  // Account at address 0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b has balance 1000
  console.log(
    `Account at address ${address.toString()} has balance ${
      (await stateManager.getAccount(address))?.balance
    }`,
  )
}
void main()
