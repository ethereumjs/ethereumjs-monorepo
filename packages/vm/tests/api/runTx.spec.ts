import tape from 'tape'
import { Account, Address, BN, MAX_INTEGER } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import VM from '../../lib'
import { DefaultStateManager } from '../../lib/state'
import runTx from '../../lib/runTx'
import { createAccount } from './utils'

function setup(vm?: any) {
  if (!vm) {
    const stateManager = new DefaultStateManager({})
    const common = new Common({ chain: 'mainnet' })
    vm = {
      _common: common,
      stateManager,
      emit: (e: any, val: any, cb: Function) => {
        cb()
      },
      _emit: () => new Promise((resolve) => resolve()),
    }
  }

  return {
    vm,
    runTx: runTx.bind(vm),
    putAccount: vm.stateManager.putAccount.bind(vm.stateManager),
  }
}

tape('runTx', (t) => {
  const suite = setup()

  t.test('should fail to run without signature', async (st) => {
    const tx = getTransaction(false)
    shouldFail(st, suite.runTx({ tx }), (e: Error) =>
      st.ok(e.message.includes('not signed'), 'should fail with appropriate error')
    )
    st.end()
  })

  t.test('should fail without sufficient funds', async (st) => {
    const tx = getTransaction(true)
    shouldFail(st, suite.runTx({ tx }), (e: Error) => {
      st.ok(e.message.toLowerCase().includes('enough funds'), 'error should include "enough funds"')
    })
    st.end()
  })
})

tape('should run simple tx without errors', async (t) => {
  const vm = new VM()
  const suite = setup(vm)

  const tx = getTransaction(true)
  const caller = tx.getSenderAddress()
  const acc = createAccount()

  await suite.putAccount(caller, acc)

  const res = await suite.runTx({ tx })
  t.true(res.gasUsed.gt(new BN(0)), 'should have used some gas')

  t.end()
})

tape('should fail when account balance overflows (call)', async (t) => {
  const vm = new VM()
  const suite = setup(vm)

  const tx = getTransaction(true, '0x01')

  const caller = tx.getSenderAddress()
  const from = createAccount()
  await suite.putAccount(caller, from)

  const to = createAccount(new BN(0), MAX_INTEGER)
  await suite.putAccount(tx.to, to)

  const res = await suite.runTx({ tx })

  t.equal(res.execResult!.exceptionError!.error, 'value overflow')
  t.equal((<any>vm.stateManager)._checkpointCount, 0)
  t.end()
})

tape('should fail when account balance overflows (create)', async (t) => {
  const vm = new VM()
  const suite = setup(vm)

  const tx = getTransaction(true, '0x01', true)

  const caller = tx.getSenderAddress()
  const from = createAccount()
  await suite.putAccount(caller, from)

  const contractAddress = new Address(
    Buffer.from('61de9dc6f6cff1df2809480882cfd3c2364b28f7', 'hex')
  )
  const to = createAccount(new BN(0), MAX_INTEGER)
  await suite.putAccount(contractAddress, to)

  const res = await suite.runTx({ tx })

  t.equal(res.execResult!.exceptionError!.error, 'value overflow')
  t.equal((<any>vm.stateManager)._checkpointCount, 0)
  t.end()
})

tape('should clear storage cache after every transaction', async (t) => {
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

  t.equal((<any>vm.stateManager)._originalStorageCache.size, 0, 'storage cache should be cleared')
  t.end()
})

tape('should be possible to disable the block gas limit validation', async (t) => {
  const vm = new VM()

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

  t.equals(result.execResult.exceptionError, undefined)

  t.end()
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

function shouldFail(st: tape.Test, p: any, onErr: Function) {
  p.then(() => st.fail('runTx didnt return any errors')).catch(onErr)
}

function getTransaction(sign = false, value = '0x00', createContract = false) {
  let to: string | undefined = '0x0000000000000000000000000000000000000000'
  let data = '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'

  if (createContract) {
    to = undefined
    data =
      '0x6080604052348015600f57600080fd5b50603e80601d6000396000f3fe6080604052600080fdfea265627a7a723158204aed884a44fd1747efccba1447a2aa2d9a4b06dd6021c4a3bbb993021e0a909e64736f6c634300050f0032'
  }

  const txParams = {
    nonce: 0,
    gasPrice: 100,
    gasLimit: 90000,
    to,
    value,
    data,
  }

  const tx = Transaction.fromTxData(txParams)

  if (sign) {
    const privateKey = Buffer.from(
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
      'hex'
    )
    return tx.sign(privateKey)
  }

  return tx
}
