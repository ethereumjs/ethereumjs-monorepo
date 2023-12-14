import { createSuite } from './suite'
import { LevelDB } from './engines/level'
import { Account, Address, MapDB } from '@ethereumjs/util'
// @ts-ignore - package has no types...
import { run, mark, logMem } from 'micro-bmark'
import { DefaultStateManager, FlatStateManager } from '@ethereumjs/statemanager'
import { keys } from './keys'

const flatStateManager = new FlatStateManager()
const defaultStateManager = new DefaultStateManager({
  codeCacheOpts: { deactivate: true },
  accountCacheOpts: { deactivate: true },
  storageCacheOpts: { deactivate: true },
})

run(async () => {
  for (const samples of [100, 500, 1000, 5000]) {
    await mark(`FSM putting Checkpointing: ${samples} iterations`, samples, async (i: number) => {
      flatStateManager.checkpoint()
      await flatStateManager.putAccount(new Address(keys[i].slice(0, 20)), new Account())
      await flatStateManager.commit()
    })
  }
  for (const samples of [100, 500, 1000, 5000]) {
    await mark(`DSM putting Checkpointing: ${samples} iterations`, samples, async (i: number) => {
      defaultStateManager.checkpoint()
      await defaultStateManager.putAccount(new Address(keys[i].slice(0, 20)), new Account())
      await defaultStateManager.commit()
    })
  }

  for (const samples of [100, 500, 1000, 5000]) {
    await mark(`FSM getting Checkpointing: ${samples} iterations`, samples, async (i: number) => {
      flatStateManager.checkpoint()
      await flatStateManager.getAccount(new Address(keys[i].slice(0, 20)))
      await flatStateManager.commit()
    })
  }
  for (const samples of [100, 500, 1000, 5000]) {
    await mark(`DSM getting Checkpointing: ${samples} iterations`, samples, async (i: number) => {
      defaultStateManager.checkpoint()
      await defaultStateManager.getAccount(new Address(keys[i].slice(0, 20)))
      await defaultStateManager.commit()
    })
  }
  logMem()
})

// createSuite(new MapDB())
// createSuite(new LevelDB())
