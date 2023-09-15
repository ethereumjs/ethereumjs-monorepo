import { Account, Address, bigIntToBytes, hexToBytes, setLengthLeft } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVM } from '../src/index.js'
import { Stack } from '../src/stack.js'

import { createAccount } from './utils.js'

describe('Stack', () => {
  it('should be empty initially', () => {
    const s = new Stack()
    assert.equal(s.length, 0)
    assert.throws(() => s.popBigInt())
  })

  it('popN should throw for empty stack', () => {
    const s = new Stack()
    assert.deepEqual(s.popNBigInt(0), [])
    assert.throws(() => s.popNBigInt(1))
  })

  it('should push item', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    assert.equal(s.popBigInt(), BigInt(5))
  })

  it('popN should return array for n = 1', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    assert.deepEqual(s.popNBigInt(1), [BigInt(5)])
  })

  it('popN should fail on underflow', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    assert.throws(() => s.popNBigInt(2))
  })

  it('popN should return in correct order', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    s.pushBigInt(BigInt(7))
    assert.deepEqual(s.popNBigInt(2), [BigInt(7), BigInt(5)])
  })

  it('should throw on overflow', () => {
    const s = new Stack()
    for (let i = 0; i < 1024; i++) {
      s.pushBigInt(BigInt(i))
    }
    assert.throws(() => s.pushBigInt(BigInt(1024)))
  })

  it('overflow limit should be configurable', () => {
    const s = new Stack(1023)
    for (let i = 0; i < 1023; i++) {
      s.pushBigInt(BigInt(i))
    }
    assert.throws(() => s.pushBigInt(BigInt(1023)))
  })

  it('should swap top with itself', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    s.swap(0)
    assert.deepEqual(s.popBigInt(), BigInt(5))
  })

  it('swap should throw on underflow', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    assert.throws(() => s.swap(1))
  })

  it('should swap', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    s.pushBigInt(BigInt(7))
    s.swap(1)
    assert.deepEqual(s.popBigInt(), BigInt(5))
  })

  it('dup should throw on underflow', () => {
    const s = new Stack()
    assert.throws(() => s.dup(1))
    s.pushBigInt(BigInt(5))
    assert.throws(() => s.dup(2))
  })

  it('should dup', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    s.pushBigInt(BigInt(7))
    s.dup(2)
    assert.deepEqual(s.popBigInt(), BigInt(5))
  })

  it('stack items should not change if they are DUPed', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const addr = new Address(hexToBytes('0x00000000000000000000000000000000000000ff'))
    const evm = new EVM()
    const account = createAccount(BigInt(0), BigInt(0))
    const code = '0x60008080808060013382F15060005260206000F3'
    const expectedReturnValue = setLengthLeft(bigIntToBytes(BigInt(0)), 32)
    /*
      code:             remarks: (top of the stack is at the zero index)
          PUSH1 0x00
          DUP1
          DUP1
          DUP1
          DUP1
          PUSH1 0x01
          CALLER
          DUP3
          CALL          stack: [0, CALLER, 1, 0, 0, 0, 0, 0]
          POP           pop the call result (1)
          PUSH1 0x00
          MSTORE        we now expect that the stack (prior to MSTORE) is [0, 0]
          PUSH1 0x20
          PUSH1 0x00
          RETURN        stack: [0, 0x20] (we thus return the stack item which was originally pushed as 0, and then DUPed)
    */
    await evm.stateManager.putAccount(addr, account)
    await evm.stateManager.putContractCode(addr, hexToBytes(code))
    await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11)))
    const runCallArgs = {
      caller,
      gasLimit: BigInt(0xffffffffff),
      to: addr,
      value: BigInt(1),
    }
    try {
      const res = await evm.runCall(runCallArgs)
      const executionReturnValue = res.execResult.returnValue
      assert.deepEqual(executionReturnValue, expectedReturnValue)
    } catch (e: any) {
      assert.fail(e.message)
    }
  })

  it('stack should report actual stack correctly', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(4))
    s.pushBigInt(BigInt(6))
    s.pushBigInt(BigInt(8))
    s.popBigInt()
    const reportedStack = s.getStack()
    assert.deepEqual(reportedStack, [BigInt(4), BigInt(6)])
  })
})
