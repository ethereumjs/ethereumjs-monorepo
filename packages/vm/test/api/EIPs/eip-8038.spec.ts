import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Account, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../../src/index.ts'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

// PUSH1 0x42 PUSH1 0x01 SSTORE STOP — cold SSTORE of slot 1
const sstoreCode = hexToBytes('0x604260015500')
const contract = createAddressFromString(`0x${'11'.repeat(20)}`)
const pushCost = 6n

async function getVM() {
  const vm = await createVM({ common })
  await vm.stateManager.putAccount(contract, new Account(1n, BigInt(1e18)))
  await vm.stateManager.putCode(contract, sstoreCode)
  return vm
}

function storageReads(vm: Awaited<ReturnType<typeof createVM>>) {
  const entry = vm.evm.blockLevelAccessList?.toJSON().find((a) => a.address === contract.toString())
  return entry?.storageReads ?? []
}

describe('EIP-8038 gas constants (Amsterdam, v8.1.0)', () => {
  it('uses the revised glamsterdam-devnet schedule', async () => {
    const vm = await getVM()
    const c = vm.common
    assert.strictEqual(c.param('coldsloadGas'), 2100n)
    assert.strictEqual(c.param('coldaccountaccessGas'), 3000n)
    assert.strictEqual(c.param('accountWriteGas'), 9000n)
    assert.strictEqual(c.param('callValueTransferGas'), 11300n)
    assert.strictEqual(c.param('refundStorageClearGas'), 11616n)
    assert.strictEqual(c.param('createGas'), 12000n)
    assert.strictEqual(c.param('create2Gas'), 12000n)
  })
})

function sstoreAccessGate(common: Awaited<ReturnType<typeof createVM>>['common']) {
  const coldAccess = common.param('coldsloadGas')
  const stipendPlus1 = common.param('sstoreSentryEIP2200Gas') + 1n
  return coldAccess > stipendPlus1 ? coldAccess : stipendPlus1
}

describe('EIP-8038 SSTORE access-before-read (Amsterdam)', () => {
  it('does not record a BAL storage read when gas cannot cover the access gate', async () => {
    const vm = await getVM()
    const gate = sstoreAccessGate(vm.common)
    const result = await vm.evm.runCall({
      caller: contract,
      to: contract,
      gasLimit: pushCost + gate - 1n,
    })
    assert.isDefined(result.execResult.exceptionError)
    assert.strictEqual(storageReads(vm).length, 0)
  })

  it('records a BAL storage read when the access gate is covered but the write is not', async () => {
    const vm = await getVM()
    const gate = sstoreAccessGate(vm.common)
    const result = await vm.evm.runCall({
      caller: contract,
      to: contract,
      gasLimit: pushCost + gate,
    })
    assert.isDefined(result.execResult.exceptionError)
    assert.isAbove(storageReads(vm).length, 0)
  })
})
