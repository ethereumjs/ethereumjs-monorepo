const { SecureTrie } = require('merkle-patricia-tree')
const { BN, Account, Address, toBuffer } = require('ethereumjs-util')
import { DefaultStateManager } from '../../../lib/state'
import tape from 'tape'

const genesisAccounts = [
  {
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0',
    balance: '10000000000000000000000',
  },
  {
    privateKey: '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e',
    balance: '10000000000000000000000',
  },
]

tape('hardhat test', async (t) => {
  // This is Hardhat Networks state manager initialization
  const trie = new SecureTrie()

  for (const acc of genesisAccounts) {
    const pk = toBuffer(acc.privateKey)
    const address = Address.fromPrivateKey(pk)
    const balance = new BN(acc.balance)
    const account = Account.fromAccountData({ balance })

    await trie.put(address.toBuffer(), account.serialize())
  }

  for (let i = 1; i <= 8; i++) {
    await trie.put(new BN(i).toArrayLike(Buffer, 'be', 20), new Account().serialize())
  }

  const addressA = Address.fromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
  const RECEIVER = Address.fromString('0x0dcd1bf9a1b36ce34237eeafef220932846bcd82') // Changing the receiver makes it work :s
  const COINBASE = Address.fromString('0xc014ba5ec014ba5ec014ba5ec014ba5ec014ba5e')

  const stateManager = new DefaultStateManager({ trie })

  // Sending transaction from A to A
  await stateManager.getAccount(addressA)
  await stateManager.checkpoint()

  await stateManager.checkpoint()

  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e018a021e187ef00e969f0000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getContractCode(addressA)
  await stateManager.getAccount(addressA)
  await stateManager.checkpoint()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e018a021e187ef00e969f0000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e018a021e187ef00e969f0000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getContractCode(addressA)
  await stateManager.getAccount(addressA)
  await stateManager.commit()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e018a021e19e030ef25ed8000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(COINBASE)
  await stateManager.putAccount(
    COINBASE,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84a808698cb8c528000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(addressA)
  await stateManager.getAccount(COINBASE)
  await stateManager.commit()
  await stateManager.getAccount(COINBASE)
  await stateManager.putAccount(
    COINBASE,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84c80881bc20632db1a8000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getStateRoot(true)
  await stateManager.commit()
  await stateManager.getAccount(addressA)
  await stateManager.getContractCode(addressA)
  await stateManager.getAccount(addressA)

  // Saving the state root after the tx
  const stateRootAfterTx = await stateManager.getStateRoot(false)

  // Sending transaction from A to RECEIVER
  await stateManager.getAccount(addressA)
  await stateManager.checkpoint()
  await stateManager.checkpoint()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e028a021e187e57430a4c8000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getContractCode(RECEIVER)
  await stateManager.getAccount(RECEIVER)
  await stateManager.checkpoint()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e028a021e187e57430a4c7fffa056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(RECEIVER)
  await stateManager.putAccount(
    RECEIVER,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf8448001a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getContractCode(RECEIVER)
  await stateManager.getAccount(RECEIVER)
  await stateManager.commit()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e028a021e19df9823999affffa056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(COINBASE)
  await stateManager.putAccount(
    COINBASE,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84c80881bc29efe676d0000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(COINBASE)
  await stateManager.getAccount(addressA)
  await stateManager.getAccount(RECEIVER)
  await stateManager.commit()
  await stateManager.getAccount(COINBASE)
  await stateManager.putAccount(
    COINBASE,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84c808837840c65b6350000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getStateRoot(true)
  await stateManager.commit()
  await stateManager.getAccount(addressA)
  await stateManager.getContractCode(RECEIVER)
  await stateManager.getAccount(RECEIVER)

  // Resetting the state root
  await stateManager.setStateRoot(stateRootAfterTx)

  // Resending the latest tx
  await stateManager.getAccount(addressA)
  await stateManager.checkpoint()
  await stateManager.checkpoint()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e028a021e187e57430a4c8000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getContractCode(RECEIVER)
  await stateManager.getAccount(RECEIVER)
  await stateManager.checkpoint()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e028a021e187e57430a4c7fffa056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(RECEIVER)
  await stateManager.putAccount(
    RECEIVER,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf8448001a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getContractCode(RECEIVER)
  await stateManager.getAccount(RECEIVER)
  await stateManager.commit()
  await stateManager.getAccount(addressA)
  await stateManager.putAccount(
    addressA,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84e028a021e19df9823999affffa056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(COINBASE)
  await stateManager.putAccount(
    COINBASE,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84a808698cb8c528000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getAccount(COINBASE)
  await stateManager.getAccount(addressA)
  await stateManager.getAccount(RECEIVER)
  await stateManager.commit()
  await stateManager.getAccount(COINBASE)
  await stateManager.putAccount(
    COINBASE,
    Account.fromRlpSerializedAccount(
      toBuffer(
        '0xf84c80881bc20632db1a8000a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
      )
    )
  )
  await stateManager.getStateRoot(true)
  await stateManager.commit()
  await stateManager.getAccount(addressA)
  await stateManager.getContractCode(RECEIVER)
  await stateManager.getAccount(RECEIVER)

  // Get the sate root and set it to itself
  const lastStateRoot = await stateManager.getStateRoot(false)

  // This is the setStateRoot that breaks
  await stateManager.setStateRoot(lastStateRoot)
  const account = await stateManager.getAccount(RECEIVER)

  t.equals(account.balance.toNumber(), 1, 'balance should be 1')
  t.end()
})
