const fs = require('fs')
const path = require('path')
const levelup = require('levelup')
const leveldown = require('leveldown')

class DBManager {
  constructor (config) {
    this._config = config
    this._logger = config.logger

    this._initializeDatadir()

    // TODO: Store chain data in an appropriate sub folder (e.g. 'chaindata/ropsten/')
    this._blockchainDB = levelup(this._config.datadir, { db: leveldown })
  }

  blockchainDB () {
    return this._blockchainDB
  }

  // From: https://stackoverflow.com/a/40686853
  // replace if there is an easier solution
  _mkDirByPathSync (targetDir, {isRelativeToScript = false} = {}) {
    const sep = path.sep
    const initDir = path.isAbsolute(targetDir) ? sep : ''
    const baseDir = isRelativeToScript ? __dirname : '.'

    targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir)
      if (!fs.existsSync(curDir)) {
        fs.mkdirSync(curDir)
      }
      return curDir
    }, initDir)
  }

  _initializeDatadir () {
    if (!fs.existsSync(this._config.datadir)) {
      this._mkDirByPathSync(this._config.datadir)
    }
    this._logger.info(`Initialized data directory: ${this._config.datadir}`)
  }
}

module.exports = DBManager
