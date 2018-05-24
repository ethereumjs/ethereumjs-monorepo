const fs = require('fs')
const path = require('path')
const levelup = require('levelup')
const leveldown = require('leveldown')
const Blockchain = require('ethereumjs-blockchain')
const ethUtil = require('ethereumjs-util')

class ChainManager {
  constructor (config, nm) {
    var self = this
    this._config = config
    this._logger = config.logger
    this._nm = nm

    this._initializeDatadir()

    // TODO: Store chain data in an appropriate sub folder (e.g. 'chaindata/ropsten/')
    this._blockchainDB = levelup(this._config.datadir, { db: leveldown })

    this._blockchain = new Blockchain({
      db: this._blockchainDB,
      validate: false
    })

    this._blockchain.getLatestHeader(function (err, header) {
      if (err) {
        self._logger.error('Error on retrieving latest chain header')
      }
      let chainInfo = self._getChainInfo(header)
      self._logger.info(`Initialized blockchain (current height: ${chainInfo.height})`)
      self._logger.info(`Best known block: ${chainInfo.rawHead}, TD: ${chainInfo.difficulty}`)
      self._nm.startNetworking(
        chainInfo, (peer, headers) => {
        }, (peer, blocks) => {
          self._saveNewBlocks(peer, blocks)
        }
      )
    })
  }

  _getChainInfo (header) {
    return {
      'height': ethUtil.bufferToInt(header.number),
      'difficulty': ethUtil.bufferToInt(header.difficulty),
      'rawHead': header.stateRoot.toString('hex')
    }
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
        }
        self._blockchain.getLatestHeader(function (err2, header) {
          if (err2) {
            self._logger.error('Error on retrieving latest chain header')
          }
          let chainInfo = self._getChainInfo(header)
          if (!err) {
            self._logger.info(`Imported ${blocks.length} new blocks | height: ${chainInfo.height}`)
          }
          self._nm.getBlockHeaders(peer, chainInfo)
        })
      })
    }
  }
}

module.exports = ChainManager
