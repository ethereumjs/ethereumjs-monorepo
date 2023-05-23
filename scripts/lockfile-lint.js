const { ValidateHost, ValidateScheme, ParseLockfile } = require('lockfile-lint-api')

// path to the lockfile
const lockfilePath = './package-lock.json'
const options = {
  lockfilePath: lockfilePath,
}

const parser = new ParseLockfile(options)
const lockfile = parser.parseSync()

const hostValidator = new ValidateHost({ packages: lockfile.object })
const schemeValidator = new ValidateScheme({ packages: lockfile.object })

let result

result = hostValidator.validate(['npm'], { emptyHostname: true })
if (result.type === 'error') {
  if (
    result.errors.length > 1 &&
    result.errors[0].package.includes(
      'd040533e57e4f25f9a7cc4715e219658ad454b5-5643f3998a3c2fbe779f17c25e28e82ee5f96e60'
    ) === false
  ) {
    console.log(result)
    process.exit(1)
  }
}

result = schemeValidator.validate(['file:', 'npm:', 'https:'])
if (result.type === 'error') {
  if (
    result.errors.length > 1 &&
    result.errors[0].package.includes(
      'd040533e57e4f25f9a7cc4715e219658ad454b5-5643f3998a3c2fbe779f17c25e28e82ee5f96e60'
    ) === false
  ) {
    console.log(result)
    process.exit(1)
  }
}

console.log(result)
