const fs = require('fs')
const dir = require('node-dir')
const path = require('path')

const falsePredicate = () => false
// package.json -> always take the package root, remove filename, go to submodule
const defaultTestsPath = path.join(path.dirname(require.resolve("ethereumjs-testing/package.json")), 'tests')

/**
 * Returns the list of test files matching the given parameters
 * @param {string} testType the test type (path segment)
 * @param {Function} onFile a callback for each file
 * @param {RegExp|Array<string>} fileFilter a {@code RegExp} or array to specify filenames to operate on
 * @param {Function<boolean>} skipPredicate a filtering function for test names
 * @param {string} testDir the directory inside the {@code tests/} directory to use
 * @param {RegExp|Array<string>} excludeDir a {@code RegExp} or array to specify directories to ignore
 * @param {string} testsPath the path to the {@code tests/} directory
 * @return {Promise<Array<string>>} the list of test files
 */
const getTests = exports.getTests = (
  testType,
  onFile,
  fileFilter = /.json$/,
  skipPredicate = falsePredicate,
  testDir = '',
  excludeDir = '',
  testsPath = defaultTestsPath
) => {
  const directory = path.join(testsPath, testType, testDir)
  const options = {
    match: fileFilter,
    excludeDir: excludeDir
  }

  return new Promise((resolve, reject) => {
    const finishedCallback = (err, files) => {
      if (err) {
        reject(err)
        return
      }

      resolve(files)
    }

    const fileCallback = async (err, content, fileName, next) => {
      if (err) {
        reject(err)
        return
      }

      const parsedFileName = path.parse(fileName).name
      const testsByName = JSON.parse(content)
      const testNames = Object.keys(testsByName)
      for (const testName of testNames) {
        if (!skipPredicate(testName)) {
          await onFile(parsedFileName, testName, testsByName[testName])
        }
      }

      next()
    }

    dir.readFiles(directory, options, fileCallback, finishedCallback)
  })
}

function skipTest (testName, skipList = []) {
  return skipList.map((skipName) => (new RegExp(`^${skipName}`)).test(testName)).some(isMatch => isMatch)
}

/**
 * Loads a single test specified in a file
 * @method getTestFromSource
 * @param {String} file or path to load a single test from
 * @param {Function} Callback function which is invoked, and passed the contents of the specified file (or an error message)
 */
const getTestFromSource = exports.getTestFromSource = function (file, onFile) {
  let stream = fs.createReadStream(file)
  let contents = ''
  let test = null

  stream.on('data', function (data) {
    contents += data
  }).on('error', function (err) {
    onFile(err)
  }).on('end', function () {
    try {
      test = JSON.parse(contents)
    } catch (e) {
      onFile(e)
    }

    let testName = Object.keys(test)[0]
    let testData = test[testName]
    testData.testName = testName

    onFile(null, testData)
  })
}

exports.getTestsFromArgs = function (testType, onFile, args = {}) {
  let testsPath, testDir, fileFilter, excludeDir, skipFn

  skipFn = (name) => {
    return skipTest(name, args.skipTests)
  }

  if (testType === 'BlockchainTests') {
    const forkFilter = new RegExp(`${args.forkConfig}$`)
    skipFn = (name) => {
      return ((forkFilter.test(name) === false) || skipTest(name, args.skipTests))
    }
  }

  if (testType === 'VMTests') {
    skipFn = (name) => {
      return skipTest(name, args.skipVM)
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
    skipFn = (testName) => {
      return testName !== args.test
    }
  }

  if (args.testsPath) {
    testsPath = args.testsPath
  }

  return getTests(testType, onFile, fileFilter, skipFn, testDir, excludeDir, testsPath)
}

exports.getSingleFile = (file) => {
  return require(path.join(defaultTestsPath, file))
}