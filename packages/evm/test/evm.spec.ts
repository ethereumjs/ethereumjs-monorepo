import { assert, describe, it } from 'vitest'

import { createEVM, paramsEVM } from '../src/index.js'

// TODO: This whole file was missing for quite some time and now (July 2024)
// has been side introduced along another PR. We should add basic initialization
// tests for options and the like.
describe('initialization', () => {
  it('basic initialization', async () => {
    const evm = await createEVM()
    const msg = 'should use the correct parameter defaults'
    assert.isFalse(evm.allowUnlimitedContractSize, msg)
  })

  it('EVM parameter customization', async () => {
    let evm = await createEVM()
    assert.equal(evm.common.param('ecAddGas'), BigInt(150), 'should use default EVM parameters')

    const params = JSON.parse(JSON.stringify(paramsEVM))
    params['1679']['ecAddGas'] = 100 // 150
    evm = await createEVM({ params })
    assert.equal(evm.common.param('ecAddGas'), BigInt(100), 'should use custom parameters provided')
  })
})
