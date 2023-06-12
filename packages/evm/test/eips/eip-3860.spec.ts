import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Address, concatBytesNoTypeCheck, privateToAddress } from '@ethereumjs/util'
import { concatBytes, equalsBytes, hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { EVM } from '../../src'

const pkey = hexToBytes('20'.repeat(32))
const sender = new Address(privateToAddress(pkey))

tape('EIP 3860 tests', (t) => {
  t.test('code exceeds max initcode size', async (st) => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3860],
    })
    const evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })

    const buffer = new Uint8Array(1000000).fill(0x60)

    // setup the call arguments
    const runCallArgs = {
      sender, // call address
      gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
      // Simple test, PUSH <big number> PUSH 0 RETURN
      // It tries to deploy a contract too large, where the code is all zeros
      // (since memory which is not allocated/resized to yet is always defaulted to 0)
      data: concatBytesNoTypeCheck(
        hexToBytes(
          '0x7F6000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060005260206000F3'
        ),
        buffer
      ),
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
    const evm = await EVM.create({
      common: commonWith3860,
      stateManager: new DefaultStateManager(),
    })
    const evmWithout3860 = await EVM.create({
      common: commonWithout3860,
      stateManager: new DefaultStateManager(),
    })
    const contractFactory = Address.fromString('0xb94f5374fce5edbc8e2a8697c15331677e6ebf0b')
    const contractAccount = await evm.stateManager.getAccount(contractFactory)
    await evm.stateManager.putAccount(contractFactory, contractAccount!)
    await evmWithout3860.stateManager.putAccount(contractFactory, contractAccount!)
    const factoryCode = hexToBytes(
      '7f600a80600080396000f3000000000000000000000000000000000000000000006000526000355a8160006000f05a8203600a55806000556001600155505050'
    )

    await evm.stateManager.putContractCode(contractFactory, factoryCode)
    await evmWithout3860.stateManager.putContractCode(contractFactory, factoryCode)
    const data = hexToBytes('000000000000000000000000000000000000000000000000000000000000c000')
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
    const evm = await EVM.create({
      common: commonWith3860,
      stateManager: new DefaultStateManager(),
    })
    const evmWithout3860 = await EVM.create({
      common: commonWithout3860,
      stateManager: new DefaultStateManager(),
    })
    const contractFactory = Address.fromString('0xb94f5374fce5edbc8e2a8697c15331677e6ebf0b')
    const contractAccount = await evm.stateManager.getAccount(contractFactory)
    await evm.stateManager.putAccount(contractFactory, contractAccount!)
    await evmWithout3860.stateManager.putAccount(contractFactory, contractAccount!)
    const factoryCode = hexToBytes(
      '7f600a80600080396000f3000000000000000000000000000000000000000000006000526000355a60008260006000f55a8203600a55806000556001600155505050'
    )

    await evm.stateManager.putContractCode(contractFactory, factoryCode)
    await evmWithout3860.stateManager.putContractCode(contractFactory, factoryCode)
    const data = hexToBytes('000000000000000000000000000000000000000000000000000000000000c000')
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

  t.test('code exceeds max initcode size: allowUnlimitedInitCodeSize active', async (st) => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3860],
    })
    const evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),

      allowUnlimitedInitCodeSize: true,
    })

    const bytes = new Uint8Array(1000000).fill(0x60)

    // setup the call arguments
    const runCallArgs = {
      sender, // call address
      gasLimit: BigInt(0xffffffffff), // ensure we pass a lot of gas, so we do not run out of gas
      // Simple test, PUSH <big number> PUSH 0 RETURN
      // It tries to deploy a contract too large, where the code is all zeros
      // (since memory which is not allocated/resized to yet is always defaulted to 0)
      data: concatBytes(
        hexToBytes('00'.repeat(Number(common.param('vm', 'maxInitCodeSize')) + 1)),
        bytes
      ),
    }
    const result = await evm.runCall(runCallArgs)
    st.ok(
      result.execResult.exceptionError === undefined,
      'succesfully created a contract with data size > MAX_INITCODE_SIZE and allowUnlimitedInitCodeSize active'
    )
  })

  t.test('CREATE with MAX_INITCODE_SIZE+1, allowUnlimitedContractSize active', async (st) => {
    const commonWith3860 = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3860],
    })
    const caller = Address.fromString('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b')
    for (const code of ['F0', 'F5']) {
      const evm = await EVM.create({
        common: commonWith3860,
        stateManager: new DefaultStateManager(),

        allowUnlimitedInitCodeSize: true,
      })
      const evmDisabled = await EVM.create({
        common: commonWith3860,
        stateManager: new DefaultStateManager(),

        allowUnlimitedInitCodeSize: false,
      })
      const contractFactory = Address.fromString('0xb94f5374fce5edbc8e2a8697c15331677e6ebf0b')
      const contractAccount = await evm.stateManager.getAccount(contractFactory)
      await evm.stateManager.putAccount(contractFactory, contractAccount!)
      await evmDisabled.stateManager.putAccount(contractFactory, contractAccount!)
      // This factory code:
      // -> reads 32 bytes from the calldata (X)
      // Attempts to create a contract of X size
      // (the initcode of this contract is just zeros, so STOP opcode
      // It stores the topmost stack item of this CREATE(2) at slot 0
      // This is either the contract address if it was succesful, or 0 in case of error
      const factoryCode = hexToBytes('600060003560006000' + code + '600055')

      await evm.stateManager.putContractCode(contractFactory, factoryCode)
      await evmDisabled.stateManager.putContractCode(contractFactory, factoryCode)

      const runCallArgs = {
        from: caller,
        to: contractFactory,
        gasLimit: BigInt(0xfffffffff),
        data: hexToBytes('00'.repeat(30) + 'C001'),
      }

      const res = await evm.runCall(runCallArgs)
      await evmDisabled.runCall(runCallArgs)

      const key0 = hexToBytes('00'.repeat(32))
      const storageActive = await evm.stateManager.getContractStorage(contractFactory, key0)
      const storageInactive = await evmDisabled.stateManager.getContractStorage(
        contractFactory,
        key0
      )

      st.ok(
        !equalsBytes(storageActive, new Uint8Array()),
        'created contract with MAX_INITCODE_SIZE + 1 length, allowUnlimitedInitCodeSize=true'
      )
      st.ok(
        equalsBytes(storageInactive, new Uint8Array()),
        'did not create contract with MAX_INITCODE_SIZE + 1 length, allowUnlimitedInitCodeSize=false'
      )

      // gas check

      const runCallArgs2 = {
        from: caller,
        to: contractFactory,
        gasLimit: BigInt(0xfffffffff),
        data: hexToBytes('00'.repeat(30) + 'C000'),
      }

      // Test:
      // On the `allowUnlimitedInitCodeSize = true`, create contract with MAX_INITCODE_SIZE + 1
      // On `allowUnlimitedInitCodeSize = false`, create contract with MAX_INITCODE_SIZE
      // Verify that the gas cost on the prior one is higher than the first one
      const res2 = await evmDisabled.runCall(runCallArgs2)

      st.ok(
        res.execResult.executionGasUsed > res2.execResult.executionGasUsed,
        'charged initcode analysis gas cost on both allowUnlimitedCodeSize=true, allowUnlimitedInitCodeSize=false'
      )
    }
    st.end()
  })
})
