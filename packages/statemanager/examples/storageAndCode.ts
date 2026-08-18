import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const sm = new MerkleStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const storageKey = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  )
  const code = hexToBytes('0x60016001600155') // PUSH1 1 PUSH1 1 PUSH1 1 SSTORE

  await sm.putAccount(address, new Account(0n, 0n))
  await sm.putCode(address, code)
  await sm.putStorage(address, storageKey, hexToBytes('0x01'))

  console.log(`Code length: ${(await sm.getCode(address)).length} bytes`)
  const slot = await sm.getStorage(address, storageKey)
  console.log(`Storage value: ${slot[0]}`)
}

void main()
