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

describe('EIP-8038 SSTORE access-before-read (Amsterdam)', () => {
  it('does not record a BAL storage read when gas covers the stipend but not cold access', async () => {
    const vm = await getVM()
    const stipendPlus1 = vm.common.param('sstoreSentryEIP2200Gas') + 1n
    const result = await vm.evm.runCall({
      caller: contract,
      to: contract,
      gasLimit: pushCost + stipendPlus1,
    })
    assert.isDefined(result.execResult.exceptionError)
    assert.strictEqual(storageReads(vm).length, 0)
  })

  it('records a BAL storage read when cold access is covered but the write is not', async () => {
    const vm = await getVM()
    const coldAccess = vm.common.param('coldsloadGas')
    const result = await vm.evm.runCall({
      caller: contract,
      to: contract,
      gasLimit: pushCost + coldAccess,
    })
    assert.isDefined(result.execResult.exceptionError)
    assert.isAbove(storageReads(vm).length, 0)
  })
})
