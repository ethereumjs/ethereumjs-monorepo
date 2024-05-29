import { hexToBytes } from '@ethereumjs/util'
import * as dir from 'node-dir'
import path from 'path'
import { assert, describe, it } from 'vitest'

import { validateEOF } from '../../src/eof/container.js'
import { EVM } from '../../src/index.js'

import { getCommon } from './eof-utils.js'

const testDir = path.resolve('./test/eips/eoftests')

async function getEVM() {
  const common = getCommon()
  const evm = EVM.create({
    common,
  })
  return evm
}

await new Promise<void>((resolve, reject) => {
  const finishedCallback = (err: Error | undefined) => {
    if (err) {
      reject(err)
      return
    }
    resolve()
  }
  const fileCallback = async (
    err: Error | undefined,
    content: string | Uint8Array,
    fileName: string,
    next: Function
  ) => {
    if (err) {
      reject(err)
      return
    }
    const name = path.parse(fileName).name
    describe(`EOF Header validation tests - ${name}`, async () => {
      const testData = JSON.parse(<string>content)
      const evm = await getEVM()
      for (const key in testData) {
        it(`Test ${key}`, () => {
          //@ts-ignore
          const input = testData[key]
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
    })

    next()
  }
  dir.readFiles(
    testDir,
    {
      match: /.json$/,
    },
    fileCallback,
    finishedCallback
  )
})
