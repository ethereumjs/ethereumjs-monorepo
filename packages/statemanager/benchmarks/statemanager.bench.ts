import { SimpleStateManager } from '@ethereumjs/statemanager'
import { createAddressFromString, hexToBytes } from '@ethereumjs/util'
import { bench, describe } from 'vitest'

const address = createAddressFromString('0x' + '11'.repeat(20))
const slot = new Uint8Array(32)

async function warmedManager(): Promise<SimpleStateManager> {
  const sm = new SimpleStateManager()
  await sm.putStorage(address, slot, hexToBytes('0x63'))
  return sm
}

describe('statemanager', () => {
  bench('statemanager warm getStorage', async () => {
    const sm = await warmedManager()
    await sm.getStorage(address, slot)
  })

  bench('statemanager putStorage', async () => {
    const sm = await warmedManager()
    await sm.putStorage(address, slot, hexToBytes('0x64'))
  })

  bench('statemanager checkpoint revert', async () => {
    const sm = await warmedManager()
    await sm.checkpoint()
    await sm.putStorage(address, slot, hexToBytes('0x65'))
    await sm.revert()
  })
})
