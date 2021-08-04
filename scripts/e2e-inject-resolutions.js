/*
  This script sets hardhat-core's ethereumjs dependencies to the versions created from the e2e-resolutions.js script.
 */

const fs = require('fs')

const resolutions = require(`${process.cwd()}/resolutions.json`)

const corePackageJsonLocation = `${process.cwd()}/hardhat/packages/hardhat-core/package.json`
const corePackageJson = require(corePackageJsonLocation)

const newCorePackageJson = {
  ...corePackageJson,
  dependencies: {
    ...corePackageJson.dependencies,
    ...resolutions
  }
}

fs.writeFileSync(
  corePackageJsonLocation,
  JSON.stringify(newCorePackageJson, null, 2)
)

/*
  workaround: yarn is picking up @types/node 16.x
  that the ci is running on, so use resolutions to pin
  the hardhat version so types don't mismatch on build
*/
const rootPackageJsonLocation = `${process.cwd()}/hardhat/package.json`
const rootPackageJson = require(rootPackageJsonLocation)

const newRootPackageJson = { ...rootPackageJson, resolutions: { '@types/node': '^10.17.24' } }

fs.writeFileSync(
  rootPackageJsonLocation,
  JSON.stringify(newRootPackageJson, null, 2)
)