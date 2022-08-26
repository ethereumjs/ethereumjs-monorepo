/*
 * This script sets hardhat-core's ethereumjs dependencies
 * to the versions created from the e2e-resolutions.js script.
 */

const fs = require('fs')

const resolutions = require(`${process.cwd()}/resolutions.json`)

const corePackageJsonLocation = `${process.cwd()}/hardhat/packages/hardhat-core/package.json`
const corePackageJson = require(corePackageJsonLocation)

const newCorePackageJson = {
  ...corePackageJson,
  dependencies: {
    ...corePackageJson.dependencies,
    ...resolutions,
  },
}

fs.writeFileSync(corePackageJsonLocation, JSON.stringify(newCorePackageJson, null, 2))

/*
 * resolutions workaround notes:
 *
 * `@types/node`:
 * yarn is picking up @types/node v16.x that the ci is running on,
 * so pin the hardhat version to the ethereumjs version
 * so types match on build.
 *
 * `@types/bn.js`:
 * helped fix this error (this can be solved by issue #1200):
 * ```
 * The inferred type of 'rpcNewBlockTagObjectWithNumber' cannot be
 * named without a reference to 'ethereumjs-util/node_modules/@types/bn.js'.
 * This is likely not portable. A type annotation is necessary.
 * ```
 */
const rootPackageJsonLocation = `${process.cwd()}/hardhat/package.json`
const rootPackageJson = require(rootPackageJsonLocation)

const newRootPackageJson = {
  ...rootPackageJson,
  resolutions: {
    ...rootPackageJson.resolutions,
    '@types/node': '^10.17.24',
    '@types/bn.js': '^5.1.0',
  },
}

fs.writeFileSync(rootPackageJsonLocation, JSON.stringify(newRootPackageJson, null, 2))
