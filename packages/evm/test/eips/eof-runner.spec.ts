import { Account, Address, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../../src/index.js'

import { getCommon } from './eof-utils.js'

async function getEVM() {
  const common = getCommon()
  const evm = createEVM({
    common,
  })
  return evm
}

// Note: currently 0xE3 (RETF) and 0xE4 (JUMPF) need to be added to the valid opcodes list, otherwise 1 test will fail

describe('EOF: should run a simple contract', async () => {
  it('should run without failing', async () => {
    const evm = await getEVM()
    const code = hexToBytes('0xef000101000402000100030400010000800001305000ef')

    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee')) // caller address
    const contractAddress = new Address(hexToBytes('0x00000000000000000000000000000000000000ff')) // contract address

    await evm.stateManager.putCode(contractAddress, code)
    await evm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111)))

    const runCallArgs = {
      caller,
      gasLimit: BigInt(0xffff),
      to: contractAddress,
    }

    const result = await evm.runCall(runCallArgs)

    // The code which is being ran should run ADDRESS POP STOP
    // This costs 4 gas
    assert.ok(result.execResult.executionGasUsed === BigInt(4))
  })
})
