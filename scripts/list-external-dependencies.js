const { readFileSync } = require('fs')
const { join } = require('path')

function countExternalDependencies(dependency) {
  try {
    const { dependencies, devDependencies } = JSON.parse(readFileSync(`./node_modules/${dependency}/package.json`).toString())

    return {
      dependencies: dependencies === undefined ? 0 : new Set(Object.keys(dependencies)).size,
      devDependencies: devDependencies === undefined ? 0 : new Set(Object.keys(devDependencies)).size,
    }
  } catch {
    return {
      dependencies: 0,
      devDependencies: 0,
    }
  }
}

function logDependencies(type, set) {
  console.log(`>>> ${set.length} ${type}`)

  for (const { dependency, dependencies, devDependencies } of set) {
    console.log(`${dependency} (${dependencies} dependencies, ${devDependencies} devDependencies)`)
  }
}

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

let prod = new Set()
let devs = new Set()
for (const { dependencies, devDependencies } of directories) {
  if (dependencies) {
    for (const dependency of Object.keys(dependencies)) {
      if (WHITELIST.some((acceptable) => dependency.startsWith(acceptable))) {
        continue
      }

      prod.add({ dependency, ...countExternalDependencies(dependency) })
    }
  }

  if (devDependencies) {
    for (const dependency of Object.keys(devDependencies)) {
      if (WHITELIST.some((acceptable) => dependency.startsWith(acceptable))) {
        continue
      }

      devs.add({ dependency, ...countExternalDependencies(dependency) })
    }
  }
}

logDependencies("dependencies", [...prod].sort())
logDependencies("devDependencies", [...devs].sort())
