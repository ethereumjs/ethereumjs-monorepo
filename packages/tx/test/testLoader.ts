import * as path from 'path'
import { bytesToHex } from '@ethereumjs/util'
import * as dir from 'node-dir'

import {
  legacyTestsFetchHint,
  legacyTestsSliceReady,
  legacyTestsTreeRoot,
} from './legacyTestsPaths.ts'

const falsePredicate = () => false

/**
 * Root of the pinned ethereum/tests sparse checkout (TransactionTests + optional BlockchainTests).
 */
export const DEFAULT_TESTS_PATH = legacyTestsTreeRoot()

function assertTransactionTestsReady(): void {
  if (!legacyTestsSliceReady('transaction')) {
    throw new Error(legacyTestsFetchHint('transaction'))
  }
}

/**
 * Returns the list of test files matching the given parameters from cached ethereum/tests TransactionTests
 * @param onFile a callback for each file
 * @param fileFilter a {@code RegExp} or array to specify filenames to operate on
 * @param skipPredicate a filtering function for test names
 * @param directory the directory inside the {@code tests/} directory to use
 * @param excludeDir a {@code RegExp} or array to specify directories to ignore
 * @returns the list of test files
 */
export async function getTests(
  onFile: Function,
  fileFilter: RegExp | string[] = /.json$/,
  skipPredicate: (...args: any[]) => boolean = falsePredicate,
  directory: string,
  excludeDir: RegExp | string[] = [],
): Promise<string[]> {
  assertTransactionTestsReady()
  const options = {
    match: fileFilter,
    excludeDir,
  }
  return new Promise((resolve, reject) => {
    const finishedCallback = (err: Error | undefined, files: string[]) => {
      if (err) {
        reject(err)
        return
      }
      resolve(files)
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
      const subDir = fileName.substr(directory.length + 1)
      const parsedFileName = path.parse(fileName).name
      content = content instanceof Uint8Array ? bytesToHex(content) : content
      const testsByName = JSON.parse(content)
      const testNames = Object.keys(testsByName)
      for (const testName of testNames) {
        if (skipPredicate(testName, testsByName[testName]) === false) {
          await onFile(parsedFileName, subDir, testName, testsByName[testName])
        }
      }
      next()
    }

    dir.readFiles(path.join(DEFAULT_TESTS_PATH, directory), options, fileCallback, finishedCallback)
  })
}
