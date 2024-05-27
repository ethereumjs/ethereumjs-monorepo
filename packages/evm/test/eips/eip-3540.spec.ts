import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { validateEOF } from '../../src/eof.js'
import { EVM } from '../../src/index.js'

// Source: https://github.com/ipsilon/execution-spec-tests/releases/tag/eof-20240515
import { default as invalidTestData } from './eip3540_eof_v1/code_validation/legacy_initcode_invalid_eof_v1_contract.json'
import { default as validTestData } from './eip3540_eof_v1/code_validation/legacy_initcode_valid_eof_v1_contract.json'
import { default as example } from './eip3540_eof_v1/eof_example/eof_example.json'
import { default as customFields } from './eip3540_eof_v1/eof_example/eof_example_custom_fields.json'
import { default as parameters } from './eip3540_eof_v1/eof_example/eof_example_parameters.json'
import { getCommon } from './eof-utils.js'

async function getEVM() {
  const common = getCommon()
  const evm = EVM.create({
    common,
  })
  return evm
}

// Note: currently 0xE3 (RETF) and 0xE4 (JUMPF) need to be added to the valid opcodes list, otherwise 1 test will fail

describe('EIP 3540 tests', async () => {
  const evm = await getEVM()
  for (const inputs of [validTestData, invalidTestData, customFields, parameters, example]) {
    for (const key in inputs) {
      it(`Container validation tests ${key}`, () => {
        //@ts-ignore
        const input = inputs[key]
        for (const testKey in input.vectors) {
          const test = input.vectors[testKey]
          const code = hexToBytes(test.code)

          const expected = test.results.Prague.result
          const _exception = test.results.Prague.exception

          if (expected === true) {
            validateEOF(code, evm)
          } else {
            assert.throws(() => {
              // TODO verify that the correct error is thrown
              validateEOF(code, evm)
            })
          }
        }
      })
    }
  }
})
