const { join } = require('path')

const BASE_PATH = join(__dirname, '..', 'packages')
const WHITELIST = [
  '@ethereumjs',
  '@noble',
  '@scure',
  '@types',
  'ethereum-cryptography',
  'ethereum-tests',
  'micro-bmark',
]

const directories = require('fs')
  .readdirSync(BASE_PATH, { withFileTypes: true })
  .filter((file) => file.isDirectory())
  .map((directory) => {
    try {
      return require(join(BASE_PATH, directory.name, 'package.json'))
    } catch {
      return undefined
    }
  })
  .filter(Boolean)

// Always include the root package.json too
directories.push(require('../package.json'))

const prod = new Set()
const devs = new Set()
for (const { dependencies, devDependencies } of directories) {
  if (dependencies) {
    for (const dependency of Object.keys(dependencies)) {
      if (WHITELIST.some((acceptable) => dependency.startsWith(acceptable))) {
        continue
      }

      prod.add(dependency)
    }
  }

  if (devDependencies) {
    for (const dependency of Object.keys(devDependencies)) {
      if (WHITELIST.some((acceptable) => dependency.startsWith(acceptable))) {
        continue
      }

      devs.add(dependency)
    }
  }
}

console.log({
  prod: [...prod].sort(),
  devs: [...devs].sort(),
})
