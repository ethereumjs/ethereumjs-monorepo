import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { default as testData } from '../../../ethereum-tests/EOFTests/EIP4200/validInvalid.json'
import { validateEOF } from '../../src/eof/container.js'
import { createEVM } from '../../src/index.js'

import { getCommon } from './eof-utils.js'

async function getEVM() {
  const common = getCommon()
  const evm = createEVM({
    common,
  })
  return evm
}

describe('EIP 4200 tests', async () => {
  const evm = await getEVM()
  for (const key in testData.validInvalid.vectors) {
    it(`Container validation tests ${key}`, () => {
      //@ts-ignore
      const input = testData.validInvalid.vectors[key]
      const code = hexToBytes(input.code)

      const expected = input.results.Prague.result
      const _exception = input.results.Prague.exception

      if (expected === true) {
        validateEOF(code, evm)
      } else {
        //console.log(input.code)
        assert.throws(() => {
          // TODO verify that the correct error is thrown
          validateEOF(code, evm)
        })
      }
    })
  }
})
