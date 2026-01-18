import { type PrefixedHexString, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { default as testData } from '../../../ethereum-tests/EOFTests/EIP5450/validInvalid.json' with {
  type: 'json',
}
import { validateEOF } from '../../src/eof/container.ts'
import { EOFValidationError } from '../../src/eof/errors.ts'
import { createEVM } from '../../src/index.ts'

import { getCommon } from './eof-utils.ts'

async function getEVM() {
  const common = getCommon()
  const evm = createEVM({
    common,
  })
  return evm
}

describe('EIP 5450 tests', async () => {
  const evm = await getEVM()
  for (const key in testData.validInvalid.vectors) {
    it(`Container validation tests ${key}`, () => {
      const input = testData.validInvalid.vectors[key as keyof typeof testData.validInvalid.vectors]
      const code = hexToBytes(input.code as PrefixedHexString)

      const expected = input.results.Osaka.result

      if (expected === true) {
        validateEOF(code, evm)
      } else {
        const expectedError = (input.results.Osaka as { exception: string }).exception
        try {
          validateEOF(code, evm)
          assert.fail(`Should have failed because of: ${expectedError}`)
        } catch (e: unknown) {
          if (e instanceof EOFValidationError) {
            if (process.env.EOF_VERBOSE_ERRORS !== undefined && e.code !== expectedError) {
              // eslint-disable-next-line no-console
              console.log(`[Mismatch] Expected: ${expectedError}, Got: ${e.code}`)
            }
          } else {
            throw e
          }
        }
      }
    })
  }
})
