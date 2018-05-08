const fs = require('fs')
const path = require('path')
const levelup = require('levelup')
const Blockchain = require('ethereumjs-blockchain')

class ChainManager {
  constructor (config, nm) {
    var self = this
    this._config = config
    this._logger = config.logger
    this._nm = nm

    this._initializeDatadir()

    // TODO: Store chain data in an appropriate sub folder (e.g. 'chaindata/ropsten/')
    this._blockchainDB = levelup(this._config.datadir)

    // TODO: not sure if blockDB and detailsDB can/should be the same DB instance
    this._blockchain = new Blockchain({
      blockDb: this._blockchainDB,
      detailsDb: this._blockchainDB,
      validate: false
    })

    self._blockchain._initLock.await(function () {
      var meta = self._blockchain.meta
      self._logger.info(`Initialized blockchain (current height: ${meta.height})`)
      self._logger.info(`Best known block: ${meta.rawHead}, TD: ${meta.td}`)
      self._nm.startNetworking(
        self._blockchain.meta, (peer, headers) => {
        }, (peer, blocks) => {
          self._saveNewBlocks(peer, blocks)
        }
      )
    })
  }

  // From: https://stackoverflow.com/a/40686853
  // replace if there is an easier solution
  _mkDirByPathSync (targetDir, {isRelativeToScript = false} = {}) {
    const sep = path.sep
    const initDir = path.isAbsolute(targetDir) ? sep : ''
    const baseDir = isRelativeToScript ? __dirname : '.'

    targetDir.split(sep).reduce((parentDir, childDir) => {
      const curDir = path.resolve(baseDir, parentDir, childDir)
      try {
        fs.mkdirSync(curDir)
      } catch (err) {
        if (err.code !== 'EEXIST') {
          throw err
        }
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

  _saveNewBlocks (peer, blocks) {
    var self = this
    if (blocks.length > 0) {
      this._blockchain.putBlocks(blocks, function (err, result) {
        if (err) {
          self._logger.error('Error on storing blocks in DB')
        } else {
          self._logger.info(`Imported ${blocks.length} new blocks | height: ${self._blockchain.meta.height}`)
        }
        self._nm.getBlockHeaders(peer, self._blockchain.meta)
      })
    }
  }
}

module.exports = ChainManager
