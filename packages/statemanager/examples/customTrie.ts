import { Common, Mainnet } from '@ethereumjs/common'
import { MerklePatriciaTrie } from '@ethereumjs/mpt'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet })
  const trie = new MerklePatriciaTrie({ useKeyHashing: true, common })
  const sm = new MerkleStateManager({ trie, common })
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

  await sm.putAccount(address, new Account(0n, 42n))
  console.log(`Balance via custom trie: ${(await sm.getAccount(address))?.balance}`)
}

void main()
