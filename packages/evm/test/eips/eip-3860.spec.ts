import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address, privateToAddress } from '@ethereumjs/util'
import * as tape from 'tape'

import { EVM } from '../../src'
import { getEEI } from '../utils'

const pkey = Buffer.from('20'.repeat(32), 'hex')
const sender = new Address(privateToAddress(pkey))

tape('EIP 3860 tests', (t) => {
  t.test('code exceeds max initcode size', async (st) => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3860],
    })
    const eei = await getEEI()
    const evm = await EVM.create({ common, eei })

    const buffer = Buffer.allocUnsafe(1000000).fill(0x60)

    // setup the call arguments
    const runCallArgs = {
      sender, // call address
      gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
      // Simple test, PUSH <big number> PUSH 0 RETURN
      // It tries to deploy a contract too large, where the code is all zeros
      // (since memory which is not allocated/resized to yet is always defaulted to 0)
      data: Buffer.concat([
        Buffer.from(
          '0x7F6000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060005260206000F3',
          'hex'
        ),
        buffer,
      ]),
    }
    const result = await evm.runCall(runCallArgs)
    st.ok(
      (result.execResult.exceptionError?.error as string) === 'initcode exceeds max initcode size',
      'initcode exceeds max size'
    )
  })

  t.test('ensure EIP-3860 gas is applied on CREATE calls', async (st) => {
    // Transaction/Contract data taken from https://github.com/ethereum/tests/pull/990
    const commonWith3860 = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3860],
    })
    const commonWithout3860 = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [],
    })
    const caller = Address.fromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
    const eei = await getEEI()
    const evm = await EVM.create({ common: commonWith3860, eei })
    const evmWithout3860 = await EVM.create({ common: commonWithout3860, eei: eei.copy() })
    const contractFactory = Address.fromString('0xb94f5374fce5edbc8e2a8697c15331677e6ebf0b')
    const contractAccount = await evm.eei.getAccount(contractFactory)
    await evm.eei.putAccount(contractFactory, contractAccount)
    await evmWithout3860.eei.putAccount(contractFactory, contractAccount)
    const factoryCode = Buffer.from(
      '7f600a80600080396000f3000000000000000000000000000000000000000000006000526000355a8160006000f05a8203600a55806000556001600155505050',
      'hex'
    )

    await evm.eei.putContractCode(contractFactory, factoryCode)
    await evmWithout3860.eei.putContractCode(contractFactory, factoryCode)
    const data = Buffer.from(
      '000000000000000000000000000000000000000000000000000000000000c000',
      'hex'
    )
    const runCallArgs = {
      from: caller,
      to: contractFactory,
      data,
      gasLimit: BigInt(0xfffffffff),
    }
    const res = await evm.runCall(runCallArgs)
    const res2 = await evmWithout3860.runCall(runCallArgs)
    st.ok(
      res.execResult.executionGasUsed > res2.execResult.executionGasUsed,
      'execution gas used is higher with EIP 3860 active'
    )
    st.end()
  })

  t.test('ensure EIP-3860 gas is applied on CREATE2 calls', async (st) => {
    // Transaction/Contract data taken from https://github.com/ethereum/tests/pull/990
    const commonWith3860 = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3860],
    })
    const commonWithout3860 = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [],
    })
    const caller = Address.fromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
    const eei = await getEEI()
    const evm = await EVM.create({ common: commonWith3860, eei })
    const evmWithout3860 = await EVM.create({ common: commonWithout3860, eei: eei.copy() })
    const contractFactory = Address.fromString('0xb94f5374fce5edbc8e2a8697c15331677e6ebf0b')
    const contractAccount = await evm.eei.getAccount(contractFactory)
    await evm.eei.putAccount(contractFactory, contractAccount)
    await evmWithout3860.eei.putAccount(contractFactory, contractAccount)
    const factoryCode = Buffer.from(
      '7f600a80600080396000f3000000000000000000000000000000000000000000006000526000355a60008260006000f55a8203600a55806000556001600155505050',
      'hex'
    )

    await evm.eei.putContractCode(contractFactory, factoryCode)
    await evmWithout3860.eei.putContractCode(contractFactory, factoryCode)
    const data = Buffer.from(
      '000000000000000000000000000000000000000000000000000000000000c000',
      'hex'
    )
    const runCallArgs = {
      from: caller,
      to: contractFactory,
      data,
      gasLimit: BigInt(0xfffffffff),
    }
    const res = await evm.runCall(runCallArgs)
    const res2 = await evmWithout3860.runCall(runCallArgs)
    st.ok(
      res.execResult.executionGasUsed > res2.execResult.executionGasUsed,
      'execution gas used is higher with EIP 3860 active'
    )
    st.end()
  })
})
