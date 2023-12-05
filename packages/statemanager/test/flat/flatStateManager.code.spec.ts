import { Account, Address, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { FlatStateManager } from '../../src/index.js'
import { createAccount } from '../util.js'

describe('StateManager -> Code', () => {
  it(`should set and get code`, async () => {
    const stateManager = new FlatStateManager()
    const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
    const code = hexToBytes(
      '0x73095e7baea6a6c7c4c2dfeb977efac326af552d873173095e7baea6a6c7c4c2dfeb977efac326af552d873157'
    )
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xb30fb32201fe0486606ad451e1a61e2ae1748343cd3d411ed992ffcc0774edd4',
    }
    const account = Account.fromAccountData(raw)
    await stateManager.putAccount(address, account)
    await stateManager.putContractCode(address, code)
    const codeRetrieved = await stateManager.getContractCode(address)
    assert.ok(equalsBytes(code, codeRetrieved))
  })

  it(`should not get code if is not contract`, async () => {
    const stateManager = new FlatStateManager()
    const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
    }
    const account = Account.fromAccountData(raw)
    await stateManager.putAccount(address, account)
    const code = await stateManager.getContractCode(address)
    assert.ok(equalsBytes(code, new Uint8Array(0)))
  })

  it(`should set empty code`, async () => {
    const stateManager = new FlatStateManager()
    const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
    const raw = {
      nonce: '0x0',
      balance: '0x03e7',
    }
    const account = Account.fromAccountData(raw)
    const code = new Uint8Array(0)
    await stateManager.putAccount(address, account)
    await stateManager.putContractCode(address, code)
    const codeRetrieved = await stateManager.getContractCode(address)
    assert.ok(equalsBytes(codeRetrieved, new Uint8Array(0)))
  })

  it(`should prefix codehashes by default`, async () => {
    const stateManager = new FlatStateManager()
    const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
    const code = hexToBytes('0x80')
    await stateManager.putContractCode(address, code)
    const codeRetrieved = await stateManager.getContractCode(address)
    assert.ok(equalsBytes(codeRetrieved, code))
  })

  it(`should not prefix codehashes if prefixCodeHashes = false`, async () => {
    const stateManager = new FlatStateManager({
      prefixCodeHashes: false,
    })
    const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
    const code = hexToBytes('0x80')
    try {
      await stateManager.putContractCode(address, code)
      assert.fail('should throw')
    } catch (e) {
      assert.ok(true, 'successfully threw')
    }
  })
})
