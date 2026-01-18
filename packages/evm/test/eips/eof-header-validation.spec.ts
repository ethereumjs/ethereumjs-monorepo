import path from 'path'
import { hexToBytes } from '@ethereumjs/util'
import * as dir from 'node-dir'
import { assert, describe, it } from 'vitest'

import { EOFContainerMode, validateEOF } from '../../src/eof/container.ts'
import { EOFValidationError } from '../../src/eof/errors.ts'
import { ContainerSectionType } from '../../src/eof/verify.ts'
import { createEVM } from '../../src/index.ts'

import { getCommon } from './eof-utils.ts'

// Rename this test dir to the location of EOF header tests
// To test, use `npx vitest run ./scripts/eof-header-validation.spec.ts
const testDir = path.resolve('../ethereum-tests/EOFTests')

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
      const testData = JSON.parse(content as string)
      const evm = await getEVM()
      for (const key in testData) {
        it(`Test ${key}`, () => {
          const input = testData[key as keyof typeof testData]
          for (const testKey in input.vectors) {
            const test = input.vectors[testKey]

            const code = hexToBytes(test.code)

            const expected = test.results.Osaka.result

            let containerSectionType: ContainerSectionType = ContainerSectionType.RuntimeCode
            let eofContainerMode: EOFContainerMode = EOFContainerMode.Default

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
              const expectedError = test.results.Osaka.exception
              try {
                validateEOF(code, evm, containerSectionType, eofContainerMode)
                assert.fail(`Should have failed because of: ${expectedError}`)
              } catch (e: unknown) {
                if (e instanceof EOFValidationError) {
                  if (process.env.EOF_VERBOSE_ERRORS !== undefined && e.code !== expectedError) {
                    // eslint-disable-next-line no-console
                    console.log(`[Mismatch] Expected: ${expectedError}, Got: ${e.code}`)
                  }
                } else {
                  throw e // Re-throw unexpected errors
                }
              }
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
