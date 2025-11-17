import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Address, createAddressFromBigInt, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../src/index.ts'

describe('async events', () => {
  it('should work', async () => {
    const caller = new Address(hexToBytes('0x00000000000000000000000000000000000000ee'))
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Constantinople })
    const evm = await createEVM({
      common,
    })
    const targ = createAddressFromBigInt(BigInt(123456))
    await evm.stateManager.putCode(targ, hexToBytes('0x6001'))
    let didTimeOut = false
    evm.events.on('step', async (event, next) => {
      const startTime = Date.now()
      setTimeout(() => {
        assert.isTrue(Date.now() > startTime + 999, 'evm paused on step function for one second')
        didTimeOut = true
        next?.()
      }, 1000)
    })
    const runCallArgs = {
      caller, // call address
      gasLimit: BigInt(0xffffffffff),
      data: hexToBytes('0x600000'),
      to: targ,
    }
    await evm.runCall(runCallArgs)
    assert.isTrue(didTimeOut)
  })
})
