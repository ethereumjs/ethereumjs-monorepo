import tape from 'tape'
import { Account, Address, BN, MAX_INTEGER } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Transaction, TransactionFactory, FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import VM from '../../src'
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
  {
    type: 2,
    name: 'EIP1559 tx',
  },
]
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
common.setMaxListeners(100)

tape('runTx() -> successful API parameter usage', async (t) => {
  async function simpleRun(vm: VM, msg: string) {
    for (const txType of TRANSACTION_TYPES) {
      const tx = getTransaction(vm._common, txType.type, true)

      const caller = tx.getSenderAddress()
      const acc = createAccount()
      await vm.stateManager.putAccount(caller, acc)

      const res = await vm.runTx({ tx })
      t.true(res.gasUsed.gt(new BN(0)), `${msg} (${txType.name})`)
    }
  }

  t.test('simple run (unmodified options)', async (t) => {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    let vm = new VM({ common })
    await simpleRun(vm, 'mainnet (PoW), london HF, default SM - should run without errors')

    common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })
    vm = new VM({ common })
    await simpleRun(vm, 'rinkeby (PoA), london HF, default SM - should run without errors')

    t.end()
  })

  t.test('should use passed in blockGasUsed to generate tx receipt', async (t) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const vm = new VM({ common })

    const tx = getTransaction(vm._common, 0, true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const blockGasUsed = new BN(1000)
    const res = await vm.runTx({ tx, blockGasUsed })
    t.ok(
      new BN(res.receipt.gasUsed).eq(blockGasUsed.add(res.gasUsed)),
      'receipt.gasUsed should equal block gas used + tx gas used'
    )
    t.end()
  })

  t.test('Legacy Transaction with HF set to pre-Berlin', async (t) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const vm = new VM({ common })

    const tx = getTransaction(vm._common, 0, true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const res = await vm.runTx({ tx })
    t.true(
      res.gasUsed.gt(new BN(0)),
      `mainnet (PoW), istanbul HF, default SM - should run without errors (${TRANSACTION_TYPES[0].name})`
    )

    t.end()
  })

  t.test(
    'custom block (block option), disabled block gas limit validation (skipBlockGasLimitValidation: true)',
    async (t) => {
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
        const unsignedTx = TransactionFactory.fromTxData(
          {
            to: address,
            gasLimit: transferCost,
            gasPrice: 100,
            nonce: 0,
            type: txType.type,
            maxPriorityFeePerGas: 50,
            maxFeePerGas: 50,
          },
          { common }
        )
        const tx = unsignedTx.sign(privateKey)

        const coinbase = Buffer.from('00000000000000000000000000000000000000ff', 'hex')
        const block = Block.fromBlockData(
          {
            header: {
              gasLimit: transferCost - 1,
              coinbase,
              baseFeePerGas: 7,
            },
          },
          { common }
        )

        const result = await vm.runTx({
          tx,
          block,
          skipBlockGasLimitValidation: true,
        })

        const coinbaseAccount = await vm.stateManager.getAccount(new Address(coinbase))

        // calculate expected coinbase balance
        const baseFee = block.header.baseFeePerGas!
        const inclusionFeePerGas =
          tx instanceof FeeMarketEIP1559Transaction
            ? BN.min(tx.maxPriorityFeePerGas, tx.maxFeePerGas.sub(baseFee))
            : tx.gasPrice.sub(baseFee)
        const expectedCoinbaseBalance = common.isActivatedEIP(1559)
          ? result.gasUsed.mul(inclusionFeePerGas)
          : result.amountSpent

        t.ok(
          coinbaseAccount.balance.eq(expectedCoinbaseBalance),
          `should use custom block (${txType.name})`
        )

        t.equals(
          result.execResult.exceptionError,
          undefined,
          `should run ${txType.name} without errors`
        )
      }
      t.end()
    }
  )
})

tape('runTx() -> API parameter usage/data errors', (t) => {
  t.test('Typed Transaction with HF set to pre-Berlin', async (t) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const vm = new VM({ common })

    const tx = getTransaction(
      new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin }),
      1,
      true
    )

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    try {
      await vm.runTx({ tx })
      // TODO uncomment:
      // t.fail('should throw error')
    } catch (e) {
      t.ok(
        e.message.includes('(EIP-2718) not activated'),
        `should fail for ${TRANSACTION_TYPES[1].name}`
      )
    }

    t.end()
  })

  t.test('simple run (reportAccessList option)', async (t) => {
    const vm = new VM({ common })

    const tx = getTransaction(vm._common, 0, true)

    const caller = tx.getSenderAddress()
    const acc = createAccount()
    await vm.stateManager.putAccount(caller, acc)

    const res = await vm.runTx({ tx, reportAccessList: true })
    t.true(
      res.gasUsed.gt(new BN(0)),
      `mainnet (PoW), istanbul HF, default SM - should run without errors (${TRANSACTION_TYPES[0].name})`
    )
    t.deepEqual(res.accessList, [])
    t.end()
  })

  t.test('run without signature', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, txType.type, false)
      try {
        await vm.runTx({ tx })
        t.fail('should throw error')
      } catch (e) {
        t.ok(e.message.includes('not signed'), `should fail for ${txType.name}`)
      }
    }
    t.end()
  })

  t.test('run with insufficient funds', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, txType.type, true)
      try {
        await vm.runTx({ tx })
      } catch (e) {
        t.ok(e.message.toLowerCase().includes('enough funds'), `should fail for ${txType.name}`)
      }
    }

    // EIP-1559
    // Fail if signer.balance < gas_limit * max_fee_per_gas
    const vm = new VM({ common })
    let tx = getTransaction(vm._common, 2, true) as FeeMarketEIP1559Transaction
    const address = tx.getSenderAddress()
    tx = Object.create(tx)
    const maxCost = tx.gasLimit.mul(tx.maxFeePerGas)
    await vm.stateManager.putAccount(address, createAccount(new BN(0), maxCost.subn(1)))
    try {
      await vm.runTx({ tx })
      t.fail('should throw error')
    } catch (e) {
      t.ok(e.message.toLowerCase().includes('max cost'), `should fail if max cost exceeds balance`)
    }
    // set sufficient balance
    await vm.stateManager.putAccount(address, createAccount(new BN(0), maxCost))
    const res = await vm.runTx({ tx })
    t.ok(res, 'should pass if balance is sufficient')

    t.end()
  })

  t.test("run with maxBaseFee less than block's baseFee", async (t) => {
    // EIP-1559
    // Fail if transaction.maxFeePerGas < block.baseFeePerGas
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, txType.type, true)
      const block = Block.fromBlockData({ header: { baseFeePerGas: 100000 } }, { common })
      try {
        await vm.runTx({ tx, block })
        t.fail('should fail')
      } catch (e) {
        t.ok(
          e.message.includes("is less than the block's baseFeePerGas"),
          'should fail with appropriate error'
        )
      }
    }
    t.end()
  })
})

tape('runTx() -> runtime behavior', async (t) => {
  t.test('storage cache', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin })
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
      const txParams: any = {
        nonce: '0x00',
        gasPrice: 1,
        gasLimit: 100000,
        to: address,
      }
      if (txType.type === 1) {
        txParams['chainId'] = common.chainIdBN()
        txParams['accessList'] = []
        txParams['type'] = txType.type
      }
      const tx = TransactionFactory.fromTxData(txParams, { common }).sign(privateKey)

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
      const tx = getTransaction(vm._common, txType.type, true, '0x01')

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
      const tx = getTransaction(vm._common, txType.type, true, '0x01', true)

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

// TODO: complete on result values and add more usage scenario test cases
tape('runTx() -> API return values', async (t) => {
  t.test('simple run, common return values', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, txType.type, true)

      const caller = tx.getSenderAddress()
      const acc = createAccount()
      await vm.stateManager.putAccount(caller, acc)

      const res = await vm.runTx({ tx })
      t.true(res.execResult.gasUsed.eqn(0), `execution result -> gasUsed -> 0 (${txType.name})`)
      t.equal(
        res.execResult.exceptionError,
        undefined,
        `execution result -> exception error -> undefined (${txType.name})`
      )
      t.deepEqual(
        res.execResult.returnValue,
        Buffer.from([]),
        `execution result -> return value -> empty Buffer (${txType.name})`
      )
      t.true(
        res.execResult.gasRefund!.eqn(0),
        `execution result -> gasRefund -> 0 (${txType.name})`
      )
    }
    t.end()
  })

  t.test('simple run, runTx default return values', async (t) => {
    for (const txType of TRANSACTION_TYPES) {
      const vm = new VM({ common })
      const tx = getTransaction(vm._common, txType.type, true)

      const caller = tx.getSenderAddress()
      const acc = createAccount()
      await vm.stateManager.putAccount(caller, acc)

      const res = await vm.runTx({ tx })

      t.deepEqual(
        res.gasUsed,
        tx.getBaseFee(),
        `runTx result -> gasUsed -> tx.getBaseFee() (${txType.name})`
      )
      if (tx instanceof FeeMarketEIP1559Transaction) {
        const baseFee = new BN(7)
        const inclusionFeePerGas = BN.min(tx.maxPriorityFeePerGas, tx.maxFeePerGas.sub(baseFee))
        const gasPrice = inclusionFeePerGas.add(baseFee)
        t.deepEqual(
          res.amountSpent,
          res.gasUsed.mul(gasPrice),
          `runTx result -> amountSpent -> gasUsed * gasPrice (${txType.name})`
        )
      } else {
        t.deepEqual(
          res.amountSpent,
          res.gasUsed.mul((<Transaction>tx).gasPrice),
          `runTx result -> amountSpent -> gasUsed * gasPrice (${txType.name})`
        )
      }

      t.deepEqual(
        res.bloom.bitvector,
        Buffer.from('00'.repeat(256), 'hex'),
        `runTx result -> bloom.bitvector -> should be empty (${txType.name})`
      )
      t.deepEqual(
        res.receipt.gasUsed,
        res.gasUsed.toArrayLike(Buffer),
        `runTx result -> receipt.gasUsed -> result.gasUsed as Buffer (${txType.name})`
      )
      t.deepEqual(
        res.receipt.bitvector,
        res.bloom.bitvector,
        `runTx result -> receipt.bitvector -> result.bloom.bitvector (${txType.name})`
      )
      t.deepEqual(
        res.receipt.logs,
        [],
        `runTx result -> receipt.logs -> empty array (${txType.name})`
      )
    }
    t.end()
  })
})
