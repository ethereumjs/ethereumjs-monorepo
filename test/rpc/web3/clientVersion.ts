import tape from 'tape'
import { platform } from 'os'
import { baseSetup, params, baseRequest } from '../helpers'

const method = 'web3_clientVersion'

tape(`${method}: call`, (t) => {
  const server = baseSetup()

  const req = params(method, [])
  const expectRes = (res: any) => {
    const { result } = res.body
    const { version } = require('../../../package.json')
    const expectedClientTitle = 'EthereumJS'
    const expectedPackageVersion = version
    const expectedPlatform = platform()
    const expectedNodeVersion = `node${process.version.substring(1)}`

    let msg = 'result string should not be empty'
    if (result.length === 0) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }

    const [
      actualClientTitle,
      actualPackageVersion,
      actualPlatform,
      actualNodeVersion,
    ] = result.split('/')

    msg = 'client title should be correct'
    if (actualClientTitle !== expectedClientTitle) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
    msg = 'package version should be correct'
    if (actualPackageVersion !== expectedPackageVersion) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
    msg = 'platform should be correct'
    if (actualPlatform !== expectedPlatform) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
    msg = 'Node.js version should be correct'
    if (actualNodeVersion !== expectedNodeVersion) {
      throw new Error(msg)
    } else {
      t.pass(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
