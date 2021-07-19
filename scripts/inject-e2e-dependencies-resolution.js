/*
  This script injects the `resolutions.json` file created by the e2e-resolutions.js script into each package json in the hardhat monorepo.
 */

  const fs = require("fs");
  
  let packageJson;
  let resolutions = require(`${process.cwd()}/resolutions.json`);

  packageJson = require(`${process.cwd()}/hardhat/package.json`);
  const newPackageJson = {...packageJson, resolutions: {...resolutions}}
  newPackageJson.resolutions["@types/bn.js"]= "4.11.6"
  fs.writeFileSync(`${process.cwd()}/hardhat/package.json`, JSON.stringify(newPackageJson, null, 2));