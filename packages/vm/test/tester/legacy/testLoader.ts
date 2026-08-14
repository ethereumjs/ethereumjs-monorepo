/**
 * This file is deprecated (helper for old test runner).
 *
 * The new runners in executionSpec*.test.ts will become the main
 * entry point for test running.
 *
 * If you discover functionality here which is still missing in the new runner,
 * please open a PR against executionSpecState.test.ts.
 *
 * PLEASE DO NOT COPY LARGER PARTS OF THE CODE TO THE NEW RUNNER BUT RE-IMPLEMENT
 * (USE COMMON SENSE).
 */
import * as fs from 'fs'
import * as path from 'path'

import { fileBelongsToShard, parseShard } from '../util/shard.ts'
import { DEFAULT_TESTS_PATH } from './config.ts'

const falsePredicate = () => false

function listTestFiles(
  directory: string,
  fileFilter: RegExp | string[] | undefined,
  excludeDir: RegExp | string[] | undefined,
): string[] {
  const nameMatches = (name: string) => {
    if (fileFilter instanceof RegExp) return fileFilter.test(name)
    if (Array.isArray(fileFilter)) return fileFilter.includes(name)
    return name.endsWith('.json')
  }
  const skipDir = (name: string) => {
    if (excludeDir instanceof RegExp) return excludeDir.test(name)
    if (Array.isArray(excludeDir)) return excludeDir.includes(name)
    return false
  }

  const out: string[] = []
  const walk = (current: string) => {
    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) {
        if (skipDir(entry.name) === false) walk(full)
        continue
      }
      if (entry.isFile() && nameMatches(entry.name)) out.push(full)
    }
  }
  walk(directory)
  return out.sort()
}

/**
 * Returns the list of test files matching the given parameters
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
  shardSpec?: string,
): Promise<string[]> {
  const shard = parseShard(shardSpec)
  const files = listTestFiles(directory, fileFilter, excludeDir).filter((fileName) => {
    if (shard === undefined) return true
    const rel = path.relative(directory, fileName)
    return fileBelongsToShard(rel, shard)
  })

  for (const fileName of files) {
    const content = fs.readFileSync(fileName, 'utf8')
    const subDir = path.relative(directory, fileName)
    const parsedFileName = path.parse(fileName).name
    const testsByName = JSON.parse(content)
    const testNames = Object.keys(testsByName)
    for (const testName of testNames) {
      if (!skipPredicate(testName, testsByName[testName])) {
        await onFile(parsedFileName, subDir, testName, testsByName[testName])
      }
    }
  }
  return files
}

function skipTest(testName: string, skipList = []) {
  return skipList
    .map((skipName) => new RegExp(`^${skipName}`).test(testName))
    .some((isMatch) => isMatch)
}

/**
 * Loads a single test specified in a file
 * @param file path to load a single test from
 * @param onFile callback function invoked with contents of specified file (or an error message)
 */
export function getTestFromSource(file: string, onFile: Function) {
  const stream = fs.createReadStream(file)
  let contents = ''
  let test: any = null

  stream
    .on('data', function (data: Uint8Array | string) {
      contents += data
    })
    .on('error', function (err: Error) {
      console.warn('♦︎ [WARN] Please check if submodule `ethereum-tests` is properly loaded.')
      onFile(err)
    })
    .on('end', function () {
      try {
        test = JSON.parse(contents)
      } catch (e: any) {
        onFile(e)
      }

      const testName = Object.keys(test)[0]
      const testData = test[testName]
      testData.testName = testName

      onFile(null, testData)
    })
}

/**
 * Get list of test files from supported CLI args
 * @param testType the test type (path segment)
 * @param onFile a callback for each file
 * @param args the CLI args
 * @returns the list of test files
 */
export async function getTestsFromArgs(testType: string, onFile: Function, args: any = {}) {
  let fileFilter, excludeDir, skipFn

  skipFn = (name: string) => {
    return skipTest(name, args.skipTests)
  }
  if (new RegExp(`BlockchainTests`).test(testType)) {
    const forkFilter = new RegExp(`${args.forkConfig}$`)
    skipFn = (name: string, test: any) => {
      return forkFilter.test(test.network) === false || skipTest(name, args.skipTests)
    }
  }
  if (new RegExp(`GeneralStateTests`).test(testType)) {
    const forkFilter = new RegExp(`${args.forkConfig}$`)
    skipFn = (name: string, test: any) => {
      return (
        Object.keys(test['post'])
          .map((key) => forkFilter.test(key))
          .every((e) => !e) || skipTest(name, args.skipTests)
      )
    }
  }
  if (testType === 'VMTests') {
    skipFn = (name: string) => {
      return skipTest(name, args.skipVM)
    }
  }
  if (args.singleSource !== undefined) {
    return getTestFromSource(args.singleSource, onFile)
  }
  if (args.file !== undefined) {
    fileFilter = new RegExp(args.file)
  }
  if (args.excludeDir !== undefined) {
    excludeDir = new RegExp(args.excludeDir)
  }
  if (args.test !== undefined) {
    skipFn = (testName: string) => {
      return testName !== args.test
    }
  }

  return getTests(onFile, fileFilter, skipFn, args.directory, excludeDir, args.shard)
}

/**
 * Returns a single file from the ethereum-tests git submodule
 * @param file
 */
export function getSingleFile(file: string) {
  // TODO: Evaluate if we can get rid of the require, either by switching to async imports or to the createRequire module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(path.join(DEFAULT_TESTS_PATH, file))
}
