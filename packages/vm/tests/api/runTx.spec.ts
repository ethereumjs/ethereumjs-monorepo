import tape from 'tape'
import { Account, Address, BN, MAX_INTEGER } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import VM from '../../lib'
import { createAccount, getTransaction } from './utils'

const TRANSACTION_TYPES = [
  {
    type: 0,
    name: 'legacy tx',
  },
  {
    type: 1,
    name: 'EIP2930 tx',
  },
]
const common = new Common({ chain: 'mainnet', hardfork: 'berlin' })
common.setMaxListeners(100)

tape('runTx() -> successful API usage', async (t) => {
  t.test('simple run (unmodified options)', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, txType.type, true)

      const caller = tx.getSenderAddress()
      const acc = createAccount()

      await vm.stateManager.putAccount(caller, acc)

      const res = await vm.runTx({ tx })
      t.true(res.gasUsed.gt(new BN(0)), `should run ${txType.name} without errors`)
    }
    t.end()
  })

  t.test('disabled block gas limit validation (skipBlockGasLimitValidation: true)', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })

      const privateKey = Buffer.from(
        'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
        'hex'
      )
      const address = Address.fromPrivateKey(privateKey)
      const initialBalance = new BN(10).pow(new BN(18))

      const account = await vm.stateManager.getAccount(address)
      await vm.stateManager.putAccount(
        address,
        Account.fromAccountData({ ...account, balance: initialBalance })
      )

      const transferCost = 21000
      const unsignedTx = Transaction.fromTxData({
        to: address,
        gasLimit: transferCost,
        gasPrice: 1,
        nonce: 0,
      })
      const tx = unsignedTx.sign(privateKey)

      const block = Block.fromBlockData({
        header: { gasLimit: transferCost - 1 },
      })

      const result = await vm.runTx({
        tx,
        block,
        skipBlockGasLimitValidation: true,
      })

      t.equals(
        result.execResult.exceptionError,
        undefined,
        `should run ${txType.name} without errors`
      )
    }
    t.end()
  })
})

tape('runTx() -> API usage/data errors', (t) => {
  t.test('run without signature', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, 0, false)
      try {
        await vm.runTx({ tx })
      } catch (e) {
        t.ok(e.message.includes('not signed'), `should fail for ${txType.name}`)
      }
    }
    t.end()
  })

  t.test('run with insufficient funds', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, 0, true)
      try {
        await vm.runTx({ tx })
      } catch (e) {
        t.ok(e.message.toLowerCase().includes('enough funds'), `should fail for ${txType.name}`)
      }
    }
    t.end()
  })
})

tape('runTx() -> runtime behavior', async (t) => {
  t.test('storage cache', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const common = new Common({ chain: 'mainnet', hardfork: 'istanbul' })
      const vm = new VM({ common })
      const privateKey = Buffer.from(
        'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
        'hex'
      )
      /* Code which is deployed here: 
        PUSH1 01
        PUSH1 00
        SSTORE
        INVALID
      */
      const code = Buffer.from('6001600055FE', 'hex')
      const address = new Address(Buffer.from('00000000000000000000000000000000000000ff', 'hex'))
      await vm.stateManager.putContractCode(address, code)
      await vm.stateManager.putContractStorage(
        address,
        Buffer.from('00'.repeat(32), 'hex'),
        Buffer.from('00'.repeat(31) + '01', 'hex')
      )
      const tx = Transaction.fromTxData(
        {
          nonce: '0x00',
          gasPrice: 1,
          gasLimit: 100000,
          to: address,
        },
        { common }
      ).sign(privateKey)

      await vm.stateManager.putAccount(tx.getSenderAddress(), createAccount())

      await vm.runTx({ tx }) // this tx will fail, but we have to ensure that the cache is cleared

      t.equal(
        (<any>vm.stateManager)._originalStorageCache.size,
        0,
        `should clear storage cache after every ${txType.name}`
      )
    }
    t.end()
  })
})

tape('runTx() -> runtime errors', async (t) => {
  t.test('account balance overflows (call)', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, 0, true, '0x01')

      const caller = tx.getSenderAddress()
      const from = createAccount()
      await vm.stateManager.putAccount(caller, from)

      const to = createAccount(new BN(0), MAX_INTEGER)
      await vm.stateManager.putAccount(tx.to!, to)

      const res = await vm.runTx({ tx })

      t.equal(
        res.execResult!.exceptionError!.error,
        'value overflow',
        `result should have 'value overflow' error set (${txType.name})`
      )
      t.equal(
        (<any>vm.stateManager)._checkpointCount,
        0,
        `checkpoint count should be 0 (${txType.name})`
      )
    }
    t.end()
  })

  t.test('account balance overflows (create)', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, 0, true, '0x01', true)

      const caller = tx.getSenderAddress()
      const from = createAccount()
      await vm.stateManager.putAccount(caller, from)

      const contractAddress = new Address(
        Buffer.from('61de9dc6f6cff1df2809480882cfd3c2364b28f7', 'hex')
      )
      const to = createAccount(new BN(0), MAX_INTEGER)
      await vm.stateManager.putAccount(contractAddress, to)

      const res = await vm.runTx({ tx })

      t.equal(
        res.execResult!.exceptionError!.error,
        'value overflow',
        `result should have 'value overflow' error set (${txType.name})`
      )
      t.equal(
        (<any>vm.stateManager)._checkpointCount,
        0,
        `checkpoint count should be 0 (${txType.name})`
      )
    }
    t.end()
  })
})

// The following test tries to verify that running a tx
// would work, even when stateManager is not using a cache.
// It fails at the moment, and has been therefore commented.
// Please refer to https://github.com/ethereumjs/ethereumjs-monorepo/issues/353
/* tape('should behave the same when not using cache', async (t) => {
  const suite = setup()

  const tx = getTransaction(true)
  const acc = createAccount()
  const caller = tx.getSenderAddress()
  await suite.putAccount(caller, acc)
  await suite.cacheFlush()
  suite.vm.stateManager.cache.clear()

  shouldFail(t,
    suite.runTx({ tx }),
    (e) => t.equal(e.message, 'test', 'error should be equal to what the mock runCall returns')
  )

  t.end()
}) */
