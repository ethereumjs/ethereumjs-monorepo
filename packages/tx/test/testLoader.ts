const fs = require('fs')
const dir = require('node-dir')
const path = require('path')

const falsePredicate = () => false
// Load tests from git submodule
const defaultTestsPath = path.resolve('../ethereum-tests')
/**
 * Returns the list of test files matching the given parameters
 * @param testType the test type (path segment)
 * @param onFile a callback for each file
 * @param fileFilter a {@code RegExp} or array to specify filenames to operate on
 * @param skipPredicate a filtering function for test names
 * @param testDir the directory inside the {@code tests/} directory to use
 * @param excludeDir a {@code RegExp} or array to specify directories to ignore
 * @param testsPath the path to the {@code tests/} directory
 * @return The list of test files
 */
const getTests = (exports.getTests = (
  testType: string,
  onFile: Function,
  fileFilter: RegExp | string[] = /.json$/,
  skipPredicate: Function = falsePredicate,
  testDir: string = '',
  excludeDir: RegExp | string[] = [],
  testsPath: string = defaultTestsPath
): Promise<string[]> => {
  const directory = path.join(testsPath, testType, testDir)
  const options = {
    match: fileFilter,
    excludeDir: excludeDir,
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
      content: string,
      fileName: string,
      next: Function
    ) => {
      if (err) {
        reject(err)
        return
      }

      const parsedFileName = path.parse(fileName).name
      const testsByName = JSON.parse(content)
      const testNames = Object.keys(testsByName)
      for (const testName of testNames) {
        if (!skipPredicate(testName, testsByName[testName])) {
          await onFile(parsedFileName, testName, testsByName[testName])
        }
      }

      next()
    }

    dir.readFiles(directory, options, fileCallback, finishedCallback)
  })
})

function skipTest(testName: string, skipList = []) {
  return skipList
    .map((skipName) => new RegExp(`^${skipName}`).test(testName))
    .some((isMatch) => isMatch)
}

/**
 * Loads a single test specified in a file
 * @method getTestFromSource
 * @param file or path to load a single test from
 * @param Callback function which is invoked, and passed the contents of the specified file (or an error message)
 */
const getTestFromSource = (exports.getTestFromSource = function (file: string, onFile: Function) {
  const stream = fs.createReadStream(file)
  let contents = ''
  let test: any = null

  stream
    .on('data', function (data: string) {
      contents += data
    })
    .on('error', function (err: Error) {
      // eslint-disable-next-line no-console
      console.warn('♦︎ [WARN] Please check if submodule `ethereum-tests` is properly loaded.')
      onFile(err)
    })
    .on('end', function () {
      try {
        test = JSON.parse(contents)
      } catch (e) {
        onFile(e)
      }

      const testName = Object.keys(test)[0]
      const testData = test[testName]
      testData.testName = testName

      onFile(null, testData)
    })
})

exports.getTestsFromArgs = function (testType: string, onFile: Function, args: any = {}) {
  let testsPath, testDir, fileFilter, excludeDir, skipFn

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

  if (args.singleSource) {
    return getTestFromSource(args.singleSource, onFile)
  }

  if (args.dir) {
    testDir = args.dir
  }

  if (args.file) {
    fileFilter = new RegExp(args.file)
  }

  if (args.excludeDir) {
    excludeDir = new RegExp(args.excludeDir)
  }

  if (args.test) {
    skipFn = (testName: string) => {
      return testName !== args.test
    }
  }

  if (args.testsPath) {
    testsPath = args.testsPath
  }

  return getTests(testType, onFile, fileFilter, skipFn, testDir, excludeDir, testsPath)
}

exports.getSingleFile = (file: string) => {
  return require(path.join(defaultTestsPath, file))
}
