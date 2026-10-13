import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Account, Address, bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVMError } from '../src/errors.ts'
import { createEVM } from '../src/index.ts'

describe('[EVM/runCall]: cross-fork gas', () => {
  it('Byzantium rejects Constantinople SHL opcode', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const contractAddress = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const evmByzantium = await createEVM({
      common: new Common({ chain: Mainnet, hardfork: Hardfork.Byzantium }),
    })
    const evmConstantinople = await createEVM({
      common: new Common({ chain: Mainnet, hardfork: Hardfork.Constantinople }),
    })
    const code = '0x600160011B00'

    await evmByzantium.stateManager.putCode(contractAddress, hexToBytes(code))
    await evmConstantinople.stateManager.putCode(contractAddress, hexToBytes(code))

    const runCallArgs = {
      caller,
      gasLimit: BigInt(0xffffffffff),
      to: contractAddress,
    }

    const byzantiumResult = await evmByzantium.runCall(runCallArgs)
    const constantinopleResult = await evmConstantinople.runCall(runCallArgs)

    assert.strictEqual(byzantiumResult.execResult.exceptionError?.error, 'invalid opcode')
    assert.isUndefined(constantinopleResult.execResult.exceptionError)
  })

  it('Istanbul applies sstoreCleanRefundEIP2200 correctly', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
    const evm = await createEVM({ common })
    const code = '0x61000260005561000160005500'

    await evm.stateManager.putCode(address, hexToBytes(code))
    await evm.stateManager.putStorage(
      address,
      new Uint8Array(32),
      hexToBytes(`0x${'00'.repeat(31)}01`),
    )

    const result = await evm.runCall({
      caller,
      to: address,
      gasLimit: BigInt(0xffffffffff),
    })

    assert.strictEqual(result.execResult.executionGasUsed, BigInt(5812))
    assert.strictEqual(result.execResult.gasRefund, BigInt(4200))
  })

  it('Chainstart charges 20006 gas for first SSTORE', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })
    const evm = await createEVM({ common })
    const code = '0x600160015500'

    await evm.stateManager.putCode(address, hexToBytes(code))

    const result = await evm.runCall({
      caller,
      to: address,
      gasLimit: BigInt(0xffffffffff),
    })

    assert.strictEqual(result.execResult.executionGasUsed, BigInt(20006))
    assert.strictEqual(result.execResult.gasRefund, BigInt(0))
  })

  it('Homestead charges callNewAccount when calling a missing account', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Homestead })
    const evm = await createEVM({ common })
    const code = '0x6000600060006000600060DD61FFFF5A03F100'

    await evm.stateManager.putCode(address, hexToBytes(code))

    const result = await evm.runCall({
      caller,
      to: address,
      gasLimit: BigInt(0xffffffffff),
    })

    assert.strictEqual(result.execResult.executionGasUsed, BigInt(25066))
    assert.strictEqual(result.execResult.gasRefund, BigInt(0))
  })

  it('Homestead CALLCODE goes out of gas when gas argument exceeds remaining gas', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Homestead })
    const evm = await createEVM({ common })
    const code = '0x61FFFF60FF60006000600060EE6000F200'

    await evm.stateManager.putCode(address, hexToBytes(code))

    const runCallArgs = {
      caller,
      to: address,
      gasLimit: BigInt(200),
    }

    const result = await evm.runCall(runCallArgs)

    assert.strictEqual(runCallArgs.gasLimit, result.execResult.executionGasUsed)
    assert.strictEqual(result.execResult.gasRefund, BigInt(0))
    assert.strictEqual(result.execResult.exceptionError?.error, EVMError.errorMessages.OUT_OF_GAS)
  })

  it('TangerineWhistle SELFDESTRUCT pays for creating the beneficiary account', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.TangerineWhistle })
    const evm = await createEVM({ common })
    const code = '0x60FEFF'

    await evm.stateManager.putCode(address, hexToBytes(code))

    const result = await evm.runCall({
      caller,
      to: address,
      gasLimit: BigInt(0xffffffffff),
    })

    assert.strictEqual(result.execResult.executionGasUsed, BigInt(30003))
    assert.strictEqual(result.execResult.gasRefund, BigInt(24000))
  })

  it('pre-Byzantium SSTORE charges reset and set costs per call value', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })
    const evm = await createEVM({ common })
    const code = '0x3460005500'

    await evm.stateManager.putAccount(caller, new Account())
    await evm.stateManager.putCode(address, hexToBytes(code))

    const account = await evm.stateManager.getAccount(caller)
    account!.balance = BigInt(100)
    await evm.stateManager.putAccount(caller, account!)

    const data = [
      { value: 0, gas: 5005, refund: 0 },
      { value: 1, gas: 20005, refund: 0 },
      { value: 2, gas: 5005, refund: 0 },
      { value: 0, gas: 5005, refund: 15000 },
    ]

    for (const callData of data) {
      const result = await evm.runCall({
        caller,
        to: address,
        gasLimit: BigInt(0xffffffffff),
        value: BigInt(callData.value),
      })
      assert.strictEqual(result.execResult.executionGasUsed, BigInt(callData.gas))
      assert.strictEqual(result.execResult.gasRefund, BigInt(callData.refund))
    }
  })
})

describe('[EVM/runCall]: CALL and CALLCODE stipend', () => {
  it('does not add the 2300 stipend to the outer frame gas pool', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
    const evm = await createEVM({ common })

    for (const [opcode, gas, expectedOutput] of [
      ['f1', 36600, '0x'],
      ['f2', 11600, '0x'],
      ['f1', 36600 + 7 * 3, '0x01'],
      ['f2', 11600 + 7 * 3, '0x01'],
    ]) {
      const callCodeAddress = createAddressFromString('0x000000000000000000000000000000000000aaaa')
      const callCode = hexToBytes(`0x6000600060006000600161AACC611a90${opcode}`)

      const gasLimit = gas.toString(16).padStart(4, '0')

      const callerAddress = createAddressFromString('0x000000000000000000000000000000000000aaab')
      const callerCode = hexToBytes(`0x60008080808061AAAA61${gasLimit}f1600055`)

      await evm.stateManager.putAccount(callCodeAddress, new Account())
      await evm.stateManager.putCode(callCodeAddress, callCode)

      await evm.stateManager.putAccount(callerAddress, new Account(undefined, BigInt(1)))
      await evm.stateManager.putCode(callerAddress, callerCode)

      await evm.runCall({
        to: callerAddress,
        gasLimit: 0xfffffffn,
      })

      const callResult = bytesToHex(
        await evm.stateManager.getStorage(callerAddress, new Uint8Array(32)),
      )
      assert.strictEqual(callResult, expectedOutput)
    }
  })
})
