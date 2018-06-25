const ethUtil = require('ethereumjs-util')

class ChainManager {
  constructor (config, nm, bc) {
    var self = this
    this._config = config
    this._logger = config.logger
    this._nm = nm

    this._blockchain = bc

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
