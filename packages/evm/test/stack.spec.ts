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
    assert.throws(() => s.popBytes())
  })

  it('popN should throw for empty stack', () => {
    const s = new Stack()
    assert.deepEqual(s.popNBigInt(0), [])
    assert.deepEqual(s.popNBytes(0), [])
    assert.throws(() => s.popNBigInt(1))
    assert.throws(() => s.popNBytes(1))
  })

  it('should push/peek/pop item (BigInt)', () => {
    const s = new Stack()
    const v = BigInt(5)
    s.pushBigInt(v)
    assert.deepEqual(s.peekBigInt(), [v])
    assert.equal(s.popBigInt(), v)
  })

  it('should push/peek/pop item (Bytes)', () => {
    const s = new Stack()
    const v = new Uint8Array([5])
    s.pushBytes(v)
    assert.deepEqual(s.peekBytes(), [v])
    assert.deepEqual(s.popBytes(), v)
  })

  it('popN should return array for n = 1 (BigInt)', () => {
    const s = new Stack()
    const v = BigInt(5)
    s.pushBigInt(v)
    assert.deepEqual(s.popNBigInt(1), [v])
  })

  it('popN should return array for n = 1 (Bytes)', () => {
    const s = new Stack()
    const v = new Uint8Array([5])
    s.pushBytes(v)
    assert.deepEqual(s.popNBytes(1), [v])
  })

  it('popN should fail on underflow', () => {
    const s = new Stack()
    s.pushBigInt(BigInt(5))
    assert.throws(() => s.popNBigInt(2))
    assert.throws(() => s.popNBytes(2))
  })

  it('popN should return in correct order (BigInt)', () => {
    const s = new Stack()
    const v1 = BigInt(5)
    const v2 = BigInt(7)
    s.pushBigInt(v1)
    s.pushBigInt(v2)
    assert.deepEqual(s.popNBigInt(2), [v2, v1])
  })

  it('popN should return in correct order (Bytes)', () => {
    const s = new Stack()
    const v1 = new Uint8Array([5])
    const v2 = new Uint8Array([7])
    s.pushBytes(v1)
    s.pushBytes(v2)
    assert.deepEqual(s.popNBytes(2), [v2, v1])
  })

  it('should throw on overflow', () => {
    const s = new Stack()
    for (let i = 0; i < 1024; i++) {
      s.pushBigInt(BigInt(i))
    }
    assert.throws(() => s.pushBigInt(BigInt(1024)))
    assert.throws(() => s.pushBytes(new Uint8Array([7])))
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

  it('should work with mixed BigInt/Bytes usage', () => {
    const s = new Stack()
    const v1BigInt = BigInt(5)
    const v1Bytes = new Uint8Array([5])
    const v2BigInt = BigInt(7)
    const v2Bytes = new Uint8Array([7])
    s.pushBigInt(v1BigInt)
    s.pushBytes(v2Bytes)
    assert.deepEqual(s.peekBigInt(1), [v2BigInt])
    assert.deepEqual(s.peekBytes(1), [v2Bytes])
    assert.equal(s.popBigInt(), v2BigInt)
    assert.deepEqual(s.popBytes(), v1Bytes)
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
