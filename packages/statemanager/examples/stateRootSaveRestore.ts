import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const sm = new MerkleStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

  await sm.putAccount(address, new Account(0n, 1000n))
  const savedRoot = await sm.getStateRoot()
  console.log(`Saved state root: ${bytesToHex(savedRoot)}`)

  await sm.putAccount(address, new Account(0n, 9999n))
  console.log(`Mutated balance: ${(await sm.getAccount(address))?.balance}`)

  // Rewind while the same trie still holds the old nodes
  await sm.setStateRoot(savedRoot)
  console.log(`Restored balance: ${(await sm.getAccount(address))?.balance}`)
}

void main()
