/*
  This script injects the `resolutions.json` file created by
  the e2e-resolutions.js script into hardhat-core's `package.json`.
 */

const fs = require('fs')

const resolutions = require(`${process.cwd()}/resolutions.json`)

const corePackageJsonLocation = `${process.cwd()}/hardhat/packages/hardhat-core/package.json`
const corePackageJson = require(corePackageJsonLocation)

const newCorePackageJson = { ...corePackageJson, resolutions }

newCorePackageJson.resolutions['@types/bn.js'] = '5.1.0' // adds specific module that hardhat can't find by default
newCorePackageJson.resolutions['eth-sig-util'] = '3.0.1' // resolves provider eth_signTypedData_v4 error

fs.writeFileSync(corePackageJsonLocation, JSON.stringify(newCorePackageJson, null, 2))
