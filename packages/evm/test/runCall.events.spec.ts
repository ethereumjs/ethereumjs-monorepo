import { Common, Hardfork, Mainnet, createCommonFromGethGenesis } from '@ethereumjs/common'
import { SIGNER_G, eip4844GethGenesis } from '@ethereumjs/testdata'
import {
  Address,
  bytesToBigInt,
  bytesToHex,
  createAddressFromString,
  createZeroAddress,
  hexToBytes,
  unpadBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVMError } from '../src/errors.ts'
import { defaultBlock } from '../src/evm.ts'
import { createEVM } from '../src/index.ts'

import type { EVMRunCallOpts } from '../src/types.ts'

describe('[EVM/runCall]: step events', () => {
  it('emits CALL as the last opcode when dynamic gas calculation goes out of gas', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Homestead })
    const evm = await createEVM({ common })
    const code = '0x61FFFF60FF60006000600060EE6000F100'

    const stepOpcodes: string[] = []
    evm.events.on('step', (e) => {
      stepOpcodes.push(e.opcode.name)
    })

    await evm.stateManager.putCode(address, hexToBytes(code))

    const result = await evm.runCall({
      caller,
      to: address,
      gasLimit: BigInt(200),
    })

    assert.strictEqual(result.execResult.exceptionError?.error, EVMError.errorMessages.OUT_OF_GAS)
    assert.strictEqual(stepOpcodes.at(-1), 'CALL')
  })

  it('emits SSTORE as the last opcode when dynamic gas handler throws STATIC_STATE_CHANGE', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const address = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const evm = await createEVM({ common })
    const code = '0x6001600055'

    const stepOpcodes: string[] = []
    evm.events.on('step', (e) => {
      stepOpcodes.push(e.opcode.name)
    })

    await evm.stateManager.putCode(address, hexToBytes(code))

    const result = await evm.runCall({
      caller,
      to: address,
      gasLimit: BigInt(100000),
      isStatic: true,
    })

    assert.strictEqual(
      result.execResult.exceptionError?.error,
      EVMError.errorMessages.STATIC_STATE_CHANGE,
    )
    assert.strictEqual(stepOpcodes.at(-1), 'SSTORE')
  })

  it('reports EVM memory expansion in step events, not internal buffers', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })
    const evm = await createEVM({ common })

    const contractCode = hexToBytes('0x600060405200')
    const contractAddress = createAddressFromString('0x000000000000000000000000636F6E7472616374')
    await evm.stateManager.putCode(contractAddress, contractCode)

    let verifyMemoryExpanded = false
    evm.events.on('step', (e) => {
      assert.isTrue(e.memory.length <= 96)
      if (e.memory.length > 0) {
        verifyMemoryExpanded = true
      }
    })
    await evm.runCall({
      gasLimit: BigInt(21000),
      to: contractAddress,
    })
    assert.isTrue(verifyMemoryExpanded)
  })

  it('step memory snapshots are not mutated by later MSTORE writes', async () => {
    const evm = await createEVM()
    const code = hexToBytes('0x6001600052600260005200')
    const mstoreMemories: Uint8Array[] = []

    evm.events.on('step', (e) => {
      if (e.opcode.name === 'MSTORE') {
        mstoreMemories.push(e.memory)
      }
    })

    await evm.runCode({ code })

    assert.strictEqual(mstoreMemories.length, 2)
    assert.strictEqual(bytesToHex(mstoreMemories[0]), '0x')
    assert.strictEqual(
      bytesToHex(mstoreMemories[1]),
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    )
  })
})

describe('[EVM/runCall]: options and Cancun opcodes', () => {
  it('rejects a negative call value', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
    const evm = await createEVM({ common })

    try {
      await evm.runCall({
        to: createZeroAddress(),
        value: BigInt(-10),
      })
      assert.fail('expected negative call value to throw')
    } catch (err: any) {
      assert.isTrue(err.message.includes('value field cannot be negative'))
    }
  })

  it('skipBalance preserves sender balance when set', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin })
    const evm = await createEVM({ common })

    const contractCode = hexToBytes('0x00')
    const contractAddress = createAddressFromString('0x000000000000000000000000636F6E7472616374')
    await evm.stateManager.putCode(contractAddress, contractCode)

    const sender = SIGNER_G.address

    const runCallArgs = {
      gasLimit: BigInt(21000),
      value: BigInt(6),
      from: sender,
      to: contractAddress,
      skipBalance: true,
    }

    for (const balance of [undefined, BigInt(5)]) {
      await evm.stateManager.modifyAccountFields(sender, { nonce: BigInt(0), balance })
      const res = await evm.runCall(runCallArgs)
      const senderBalance = (await evm.stateManager.getAccount(sender))!.balance
      assert.strictEqual(senderBalance, balance ?? BigInt(0))
      assert.strictEqual(res.execResult.exceptionError, undefined)
    }

    const res2 = await evm.runCall({ ...runCallArgs, skipBalance: false })
    assert.include(res2.execResult.exceptionError?.error, 'insufficient balance')
  })

  it('BLOBHASH reads blobVersionedHashes from run state', async () => {
    const common = createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'custom',
      hardfork: Hardfork.Cancun,
    })
    const evm = await createEVM({ common })

    const res = await evm.runCall({
      gasLimit: BigInt(0xffffffffff),
      data: hexToBytes('0x60004960005260206000F3'),
      blobVersionedHashes: ['0xab'],
    })
    assert.strictEqual(bytesToHex(unpadBytes(res.execResult.returnValue)), '0xab')

    const res2 = await evm.runCall({
      gasLimit: BigInt(0xffffffffff),
      data: hexToBytes('0x60014960005260206000F3'),
      blobVersionedHashes: ['0xab'],
    })
    assert.strictEqual(bytesToHex(unpadBytes(res2.execResult.returnValue)), '0x')
  })

  it('BLOBBASEFEE reads blob gas price from the block header', async () => {
    const common = createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'custom',
      hardfork: Hardfork.Cancun,
    })
    const evm = await createEVM({ common })

    const BLOBBASEFEE_OPCODE = 0x4a
    assert.strictEqual(evm.getActiveOpcodes().get(BLOBBASEFEE_OPCODE)!.name, 'BLOBBASEFEE')

    const block = defaultBlock()
    block.header.getBlobGasPrice = () => BigInt(119)

    const runCallArgs: EVMRunCallOpts = {
      gasLimit: BigInt(0xffffffffff),
      data: hexToBytes('0x4a60005260206000F3'),
      block,
    }
    const res = await evm.runCall(runCallArgs)
    assert.strictEqual(bytesToBigInt(unpadBytes(res.execResult.returnValue)), BigInt(119))
    assert.strictEqual(res.execResult.executionGasUsed, BigInt(6417))
  })
})
