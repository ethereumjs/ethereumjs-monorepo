import * as tape from 'tape'
import { platform } from 'os'
import { baseSetup, params, baseRequest } from '../helpers'

const method = 'web3_clientVersion'

tape(`${method}: call`, async (t) => {
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
    t.notEqual(result.length, 0, msg)
    const [actualClientTitle, actualPackageVersion, actualPlatform, actualNodeVersion] =
      result.split('/')
    msg = 'client title should be correct'
    t.equal(actualClientTitle, expectedClientTitle, msg)
    msg = 'package version should be correct'
    t.equal(actualPackageVersion, expectedPackageVersion, msg)
    msg = 'platform should be correct'
    t.equal(actualPlatform, expectedPlatform, msg)
    msg = 'Node.js version should be correct'
    t.equal(actualNodeVersion, expectedNodeVersion, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
