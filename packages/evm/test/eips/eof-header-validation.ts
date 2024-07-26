import { hexToBytes } from '@ethereumjs/util'
import * as dir from 'node-dir'
import path from 'path'
import { assert, describe, it } from 'vitest'

import { EOFContainerMode, validateEOF } from '../../src/eof/container.js'
import { ContainerSectionType } from '../../src/eof/verify.js'
import { createEVM } from '../../src/index.js'

import { getCommon } from './eof-utils.js'

// Rename this test dir to the location of EOF header tests
// To test, use `npx vitest run ./scripts/eof-header-validation.spec.ts
const testDir = path.resolve('../ethereum-tests/EOFStuff/fixtures/eof_tests')

async function getEVM() {
  const common = getCommon()
  const evm = createEVM({
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
    next: Function,
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

            let containerSectionType = ContainerSectionType.RuntimeCode
            let eofContainerMode = EOFContainerMode.Default

            if (test.containerKind !== undefined) {
              if (test.containerKind === 'INITCODE') {
                containerSectionType = ContainerSectionType.InitCode
                eofContainerMode = EOFContainerMode.Initmode
              } else {
                throw new Error('unknown container kind: ' + test.containerKind)
              }
            }

            if (expected === true) {
              validateEOF(code, evm, containerSectionType, eofContainerMode)
            } else {
              assert.throws(() => {
                // TODO verify that the correct error is thrown
                validateEOF(code, evm, containerSectionType, eofContainerMode)
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
    finishedCallback,
  )
})
