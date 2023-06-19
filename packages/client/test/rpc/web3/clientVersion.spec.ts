import { platform } from 'os'
import { assert, describe, it } from 'vitest'

import { baseRequest, baseSetup, params } from '../helpers'

const method = 'web3_clientVersion'

describe(method, () => {
  it('call', async () => {
    const { server } = baseSetup()

    const req = params(method, [])
    const expectRes = (res: any) => {
      const { result } = res.body
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
    }
    await baseRequest(server, req, 200, expectRes)
  })
})
