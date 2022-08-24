const { readFileSync, existsSync } = require('fs')
const { join } = require('path')

const COLORS = {
  RESET: '\x1b[0m',
  FG_RED: '\x1b[31m',
  FG_GREEN: '\x1b[32m',
  FG_YELLOW: '\x1b[33m',
  FG_BLUE: '\x1b[34m',
}

const LOGGER = {
  danger(message) {
    console.log(`${COLORS.FG_RED}%s${COLORS.RESET}`, message)
  },
  warning(message) {
    console.log(`${COLORS.FG_YELLOW}%s${COLORS.RESET}`, message)
  },
  info(message) {
    console.log(`${COLORS.FG_BLUE}%s${COLORS.RESET}`, message)
  },
  success(message) {
    console.log(`${COLORS.FG_GREEN}%s${COLORS.RESET}`, message)
  },
}

function countExternalDependencies({ dependency, directory }) {
  const paths = [
    `./node_modules/${dependency}/package.json`,
    `${directory}/node_modules/${dependency}/package.json`,
  ]

  for (const path of paths) {
    if (existsSync(path)) {
      const { dependencies, devDependencies } = JSON.parse(readFileSync(path).toString())

      return {
        dependencies: dependencies === undefined ? 0 : new Set(Object.keys(dependencies)).size,
        devDependencies:
          devDependencies === undefined ? 0 : new Set(Object.keys(devDependencies)).size,
      }
    }
  }

  throw new Error(`Failed to find 'package.json' for '${dependency}'`)
}

function logDependencies(type, map) {
  console.log(`>>> ${map.size} ${type}`)

  for (const [dependency, { dependencies, devDependencies }] of map.entries()) {
    if (dependencies >= 10) {
      LOGGER.danger(
        `${dependency} (${dependencies} dependencies, ${devDependencies} devDependencies)`
      )
    } else if (dependencies >= 5) {
      LOGGER.warning(
        `${dependency} (${dependencies} dependencies, ${devDependencies} devDependencies)`
      )
    } else if (dependencies >= 1) {
      LOGGER.info(
        `${dependency} (${dependencies} dependencies, ${devDependencies} devDependencies)`
      )
    } else {
      LOGGER.success(
        `${dependency} (${dependencies} dependencies, ${devDependencies} devDependencies)`
      )
    }
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
      return {
        directory: join(BASE_PATH, directory.name),
        ...require(join(BASE_PATH, directory.name, 'package.json'))
      }
    } catch {
      return undefined
    }
  })
  .filter(Boolean)

// Always include the root package.json too
directories.push(require('../package.json'))

let prod = new Map()
let devs = new Map()
for (const { directory, dependencies, devDependencies } of directories) {
  if (dependencies) {
    for (const dependency of Object.keys(dependencies)) {
      if (WHITELIST.some((acceptable) => dependency.startsWith(acceptable))) {
        continue
      }

      prod.set(dependency, countExternalDependencies({ dependency, directory }))
    }
  }

  if (devDependencies) {
    for (const dependency of Object.keys(devDependencies)) {
      if (WHITELIST.some((acceptable) => dependency.startsWith(acceptable))) {
        continue
      }

      devs.set(dependency, countExternalDependencies({ dependency, directory }))
    }
  }
}

logDependencies('dependencies', new Map([...prod.entries()].sort()))
logDependencies('devDependencies', new Map([...devs.entries()].sort()))
