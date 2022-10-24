import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { EVM } from '../src'

import { getEEI } from './utils'

tape('async events', async (t) => {
  t.plan(2)
  const caller = new Address(Buffer.from('00000000000000000000000000000000000000ee', 'hex'))
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Constantinople })
  const eei = await getEEI()
  const evm = await EVM.create({ common, eei })
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
    data: Buffer.from('600000', 'hex'),
  }
  await evm.runCall(runCallArgs)
})
