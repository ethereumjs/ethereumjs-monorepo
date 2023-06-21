import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Account, Address, privateToAddress } from '@ethereumjs/util'
import { equalsBytes, hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

const pkey = hexToBytes('20'.repeat(32))

const GWEI = BigInt(1000000000)
const sender = new Address(privateToAddress(pkey))

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
  eips: [6780],
})

/*
  PUSH 1
  PUSH 1
  SSTORE
  PUSH 1 
  SELFDESTRUCT
  This payload stores 1 in slot 1 of the contract, and then selfdestructs to address 0x00..01
*/
const payload = hexToBytes('60016001556001FF')

async function getVM(common: Common) {
  const vm = await VM.create({ common })
  const account = (await vm.stateManager.getAccount(sender)) ?? new Account()
  const balance = GWEI * BigInt(21000) * BigInt(10000000)
  account.balance = balance
  await vm.stateManager.putAccount(sender, account)

  return vm
}

describe('EIP 6780 tests', () => {
  it('should destroy contract if selfdestructed in same tx as it was created', async () => {
    const vm = await getVM(common)

    const value = 1
    const tx = LegacyTransaction.fromTxData({
      value,
      gasLimit: 1000000,
      gasPrice: 10,
      data: payload,
    }).sign(pkey)

    const result = await vm.runTx({ tx })
    const createdAddress = result.createdAddress!

    const contract = (await vm.stateManager.getAccount(createdAddress)) ?? new Account()
    assert.equal(contract.balance, BigInt(0), 'value sent')
    assert.equal(contract.nonce, BigInt(0), 'contract nonce 0')

    const exists = (await vm.evm.stateManager.getAccount(createdAddress)) !== undefined

    // Account does not exist...
    assert.ok(!exists, 'account does not exist, so storage is cleared')
    assert.equal(
      (await vm.stateManager.getAccount(Address.fromString('0x' + '00'.repeat(19) + '01')))!
        .balance,
      BigInt(value),
      'balance sent to target'
    )
  })

  it('should not destroy contract if selfdestructed in a tx after creating the contract', async () => {
    const vm = await getVM(common)

    const target = Address.fromString('0x' + 'ff'.repeat(20))

    await vm.stateManager.putContractCode(target, payload)
    const targetContract = await vm.stateManager.getAccount(target)
    targetContract!.nonce = BigInt(1)
    await vm.stateManager.putAccount(target, targetContract)

    const value = 1
    const tx = LegacyTransaction.fromTxData({
      value,
      gasLimit: 1000000,
      gasPrice: 10,
      to: target,
    }).sign(pkey)

    await vm.runTx({ tx })

    const contract = (await vm.stateManager.getAccount(target)) ?? new Account()
    assert.equal(contract.balance, BigInt(0), 'value sent')
    assert.equal(contract.nonce, BigInt(1), 'nonce 1')

    const key = hexToBytes('00'.repeat(31) + '01')
    const storage = await vm.stateManager.getContractStorage(target, key)

    assert.ok(equalsBytes(storage, hexToBytes('01')), 'storage not cleared')
    assert.equal(
      (await vm.stateManager.getAccount(Address.fromString('0x' + '00'.repeat(19) + '01')))!
        .balance,
      BigInt(value),
      'balance sent to target'
    )
  })
})
