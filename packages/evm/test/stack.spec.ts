import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address, bigIntToBytes, setLengthLeft } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils.js'
import { assert, describe, it } from 'vitest'

import { EVM } from '../src/index.js'
import { Stack } from '../src/stack.js'

import { createAccount } from './utils.js'

describe('Stack', () => {
  it('should be empty initially', () => {
    const s = new Stack()
    assert.equal(s._store.length, 0)
    assert.throws(() => s.pop())
  })

  it('popN should throw for empty stack', () => {
    const s = new Stack()
    assert.deepEqual(s.popN(0), [])
    assert.throws(() => s.popN(1))
  })

  it('should not push invalid type values', () => {
    const s = new Stack()
    assert.throws(() => s.push(<any>'str'))
    assert.throws(() => s.push(<any>5))
  })

  it('should push item', () => {
    const s = new Stack()
    s.push(BigInt(5))
    assert.equal(s.pop(), BigInt(5))
  })

  it('popN should return array for n = 1', () => {
    const s = new Stack()
    s.push(BigInt(5))
    assert.deepEqual(s.popN(1), [BigInt(5)])
  })

  it('popN should fail on underflow', () => {
    const s = new Stack()
    s.push(BigInt(5))
    assert.throws(() => s.popN(2))
  })

  it('popN should return in correct order', () => {
    const s = new Stack()
    s.push(BigInt(5))
    s.push(BigInt(7))
    assert.deepEqual(s.popN(2), [BigInt(7), BigInt(5)])
  })

  it('should throw on overflow', () => {
    const s = new Stack()
    for (let i = 0; i < 1024; i++) {
      s.push(BigInt(i))
    }
    assert.throws(() => s.push(BigInt(1024)))
  })

  it('overflow limit should be configurable', () => {
    const s = new Stack(1023)
    for (let i = 0; i < 1023; i++) {
      s.push(BigInt(i))
    }
    assert.throws(() => s.push(BigInt(1023)))
  })

  it('should swap top with itself', () => {
    const s = new Stack()
    s.push(BigInt(5))
    s.swap(0)
    assert.deepEqual(s.pop(), BigInt(5))
  })

  it('swap should throw on underflow', () => {
    const s = new Stack()
    s.push(BigInt(5))
    assert.throws(() => s.swap(1))
  })

  it('should swap', () => {
    const s = new Stack()
    s.push(BigInt(5))
    s.push(BigInt(7))
    s.swap(1)
    assert.deepEqual(s.pop(), BigInt(5))
  })

  it('dup should throw on underflow', () => {
    const s = new Stack()
    assert.throws(() => s.dup(1))
    s.push(BigInt(5))
    assert.throws(() => s.dup(2))
  })

  it('should dup', () => {
    const s = new Stack()
    s.push(BigInt(5))
    s.push(BigInt(7))
    s.dup(2)
    assert.deepEqual(s.pop(), BigInt(5))
  })

  it('should validate value overflow', () => {
    const s = new Stack()
    const max = BigInt(2) ** BigInt(256) - BigInt(1)
    s.push(max)
    assert.deepEqual(s.pop(), max)
    assert.throws(() => s.push(max + BigInt(1)))
  })

  it('stack items should not change if they are DUPed', async () => {
    const caller = new Address(hexToBytes('00000000000000000000000000000000000000ee'))
    const addr = new Address(hexToBytes('00000000000000000000000000000000000000ff'))
    const evm = await EVM.create({
      stateManager: new DefaultStateManager(),
    })
    const account = createAccount(BigInt(0), BigInt(0))
    const code = '60008080808060013382F15060005260206000F3'
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
})
