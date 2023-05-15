import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Address } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { EVM } from '../src'
tape('async events', async (t) => {
  t.plan(2)
  const caller = new Address(hexToBytes('00000000000000000000000000000000000000ee'))
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Constantinople })
  const evm = await EVM.create({
    common,
    stateManager: new DefaultStateManager(),
  })
  evm.events.on('step', async (event, next) => {
    const startTime = Date.now()
    setTimeout(() => {
      t.ok(Date.now() > startTime + 999, 'evm paused on step function for one second')
      next?.()
    }, 1000)
  })
  const runCallArgs = {
    caller, // call address
    gasLimit: BigInt(0xffffffffff),
    data: hexToBytes('600000'),
  }
  await evm.runCall(runCallArgs)
})
