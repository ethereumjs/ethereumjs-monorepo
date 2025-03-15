import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.ts'

const method = 'debug_verbosity'

const logLevels: { [key: number]: string } = {
  0: 'error',
  1: 'warn',
  2: 'info',
  3: 'debug',
}

describe(method, () => {
  it('works', async () => {
    const manager = createManager(await createClient({ opened: true, noPeers: true }))
    const rpc = getRPCClient(startRPC(manager.getMethods()))
    const client = manager['_client']

    let res

    // lowest level; e.g. only show errors
    const levelError = 0
    res = await rpc.request(method, [levelError])
    assert.equal(res.result, 'level: error', 'verbosity level successfully lowered')
    assert.equal(client.config.logger.level, logLevels[levelError])

    // highest level; e.g. be very verbose and show even debug logs
    const levelDebug = 3
    res = await rpc.request(method, [levelDebug])
    assert.equal(res.result, 'level: debug', 'verbosity level successfully increased')
    assert.equal(client.config.logger.level, logLevels[levelDebug])
  })
})
