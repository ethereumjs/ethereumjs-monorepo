import { platform } from 'os'
import { assert, describe, it } from 'vitest'

import { baseSetup } from '../helpers.ts'

const method = 'web3_clientVersion'

describe(method, () => {
  it('call', async () => {
    const { rpc } = await baseSetup()

    const res = await rpc.request(method, [])

    const { result } = res
    const { version } = (await import('../../../package.json')).default
    const expectedClientTitle = 'EthereumJS'
    const expectedPackageVersion = version
    const expectedPlatform = platform()
    const expectedNodeVersion = `node${process.version.substring(1)}`

    assert.notEqual(result.length, 0, 'result string should not be empty')
    const [actualClientTitle, actualPackageVersion, actualPlatform, actualNodeVersion] =
      result.split('/')
    assert.strictEqual(actualClientTitle, expectedClientTitle, 'client title should be correct')
    assert.strictEqual(
      actualPackageVersion,
      expectedPackageVersion,
      'package version should be correct',
    )
    assert.strictEqual(actualPlatform, expectedPlatform, 'platform should be correct')
    assert.strictEqual(actualNodeVersion, expectedNodeVersion, 'Node.js version should be correct')
  })
})
