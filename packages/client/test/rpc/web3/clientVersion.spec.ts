import { platform } from 'os'
import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.js'

const method = 'web3_clientVersion'

describe(method, () => {
  it('call', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])

    const { result } = res
    const { version } = await import('../../../package.json')
    const expectedClientTitle = 'EthereumJS'
    const expectedPackageVersion = version
    const expectedPlatform = platform()
    const expectedNodeVersion = `node${process.version.substring(1)}`

    assert.notEqual(result.length, 0, 'result string should not be empty')
    const [actualClientTitle, actualPackageVersion, actualPlatform, actualNodeVersion] =
      result.split('/')
    assert.equal(actualClientTitle, expectedClientTitle, 'client title should be correct')
    assert.equal(actualPackageVersion, expectedPackageVersion, 'package version should be correct')
    assert.equal(actualPlatform, expectedPlatform, 'platform should be correct')
    assert.equal(actualNodeVersion, expectedNodeVersion, 'Node.js version should be correct')
  })
})
