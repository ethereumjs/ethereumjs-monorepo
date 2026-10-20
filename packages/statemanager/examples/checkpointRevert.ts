import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const sm = new MerkleStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

  await sm.checkpoint()
  await sm.putAccount(address, new Account(0n, 1000n))
  await sm.revert()
  console.log(`After revert: ${(await sm.getAccount(address))?.balance ?? 'none'}`)

  await sm.checkpoint()
  await sm.putAccount(address, new Account(0n, 2000n))
  await sm.commit()
  await sm.flush()
  console.log(`After commit: ${(await sm.getAccount(address))?.balance}`)
}

void main()
