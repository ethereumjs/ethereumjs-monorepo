/*
  This script injects the `resolutions.json` file created by the e2e-resolutions.js script into each package json in the hardhat monorepo.
 */

  const fs = require("fs");
  
  let packageJson;
  let resolutions = require(`${process.cwd()}/resolutions.json`);
  packageJson = require(`${process.cwd()}/hardhat/package.json`);
  const newPackageJson = {...packageJson, resolutions: {...resolutions}}
  newPackageJson.resolutions["@types/bn.js"]= "5.1.0" // Adds specific module that Hardhat can't find by default
  newPackageJson.resolutions["eth-sig-util"]= "3.0.1"
  newPackageJson.resolutions[ "**/antlr4"]= "4.7.1"
  fs.writeFileSync(`${process.cwd()}/hardhat/package.json`, JSON.stringify(newPackageJson, null, 2));