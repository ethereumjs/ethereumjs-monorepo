import { platform } from 'os'
import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.js'

const method = 'web3_clientVersion'

describe(method, () => {
  it('call', async () => {
    const { rpc } = baseSetup()

    const res = await rpc.request(method, [])

    const { result } = res
    const { version } = require('../../../package.json')
    const expectedClientTitle = 'EthereumJS'
    const expectedPackageVersion = version
    const expectedPlatform = platform()
    const expectedNodeVersion = `node${process.version.substring(1)}`

    let msg = 'result string should not be empty'
    assert.notEqual(result.length, 0, msg)
    const [actualClientTitle, actualPackageVersion, actualPlatform, actualNodeVersion] =
      result.split('/')
    msg = 'client title should be correct'
    assert.equal(actualClientTitle, expectedClientTitle, msg)
    msg = 'package version should be correct'
    assert.equal(actualPackageVersion, expectedPackageVersion, msg)
    msg = 'platform should be correct'
    assert.equal(actualPlatform, expectedPlatform, msg)
    msg = 'Node.js version should be correct'
    assert.equal(actualNodeVersion, expectedNodeVersion, msg)
  })
})
