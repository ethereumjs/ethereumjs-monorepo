const networkParams = require('./networks')
const hardforkChanges = require('./hardforks')

/**
 * Common class to access network and hardfork parameters
 */
class Common {
  /**
   * @constructor
   * @param {String|Number} network String ('mainnet') or Number (1) network representation
   * @param {String} hardfork String identifier ('byzantium') for hardfork (optional)
   */
  constructor (network, hardfork) {
    this.setNetwork(network)
    this._hardfork = null
    if (hardfork !== undefined) {
      this.setHardfork(hardfork)
    }
  }

  /**
   * Sets the network
   * @param {String|Number} network String ('mainnet') or Number (1) network representation
   */
  setNetwork (network) {
    if (typeof (network) === 'number') {
      if (networkParams['names'][network]) {
        this._networkParams = networkParams[networkParams['names'][network]]
      } else {
        throw new Error(`Network with ID ${network} not supported`)
      }
    } else if (typeof (network) === 'string') {
      if (networkParams[network]) {
        this._networkParams = networkParams[network]
      } else {
        throw new Error(`Network with name ${network} not supported`)
      }
    } else {
      throw new Error('Wrong input format')
    }
  }

  /**
   * Sets the hardfork to get params for
   * @param {String} hardfork String identifier ('byzantium')
   */
  setHardfork (hardfork) {
    let changed = false
    for (let hfChanges of hardforkChanges) {
      if (hfChanges[0] === hardfork) {
        this._hardfork = hardfork
        changed = true
      }
    }
    if (!changed) {
      throw new Error(`Hardfork with name ${hardfork} not supported`)
    }
  }

  /**
   * Internal helper function to choose between hardfork set and hardfork provided as param
   * @param {String} hardfork Hardfork given to function as a parameter
   * @returns {String} Hardfork chosen to be used
   */
  _chooseHardfork (hardfork) {
    if (!hardfork) {
      if (!this._hardfork) {
        throw new Error('param() called with neither a hardfork set nor provided by param')
      } else {
        hardfork = this._hardfork
      }
    }
    return hardfork
  }

  /**
   * Internal helper function, returns the params for the given hardfork for the network set
   * @param {String} hardfork Hardfork name
   * @returns {Dictionary}
   */
  _getHardfork (hardfork) {
    let hfs = this.hardforks()
    for (let hf of hfs) {
      if (hf['name'] === hardfork) return hf
    }
    throw new Error(`Hardfork ${hardfork} not defined for network ${this.networkName()}`)
  }

  /**
   * Returns the parameter corresponding to a hardfork
   * @param {String} topic Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow', 'casper', 'sharding')
   * @param {String} name Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)
   * @param {String} hardfork Hardfork name, optional if hardfork set
   */
  param (topic, name, hardfork) {
    hardfork = this._chooseHardfork(hardfork)

    let value
    for (let hfChanges of hardforkChanges) {
      if (!hfChanges[1][topic]) {
        throw new Error(`Topic ${topic} not defined`)
      }
      if (hfChanges[1][topic][name] !== undefined) {
        value = hfChanges[1][topic][name].v
      }
      if (hfChanges[0] === hardfork) break
    }
    if (value === undefined) {
      throw new Error(`${topic} value for ${name} not found`)
    }
    return value
  }

  /**
   * Returns a parameter for the hardfork active on block number
   * @param {String} topic Parameter topic
   * @param {String} name Parameter name
   * @param {Number} blockNumber Block number
   */
  paramByBlock (topic, name, blockNumber) {
    let activeHfs = this.activeHardforks(blockNumber)
    let hardfork = activeHfs[activeHfs.length - 1]['name']
    return this.param(topic, name, hardfork)
  }

  /**
   * Checks if a hardfork is active for a given block number
   * @param {String} hardfork Hardfork name
   * @param {Number} blockNumber
   * @returns {Boolean}
   */
  hardforkIsActiveOnBlock (hardfork, blockNumber) {
    let hfBlock = this.hardforkBlock(hardfork)
    if (hfBlock !== null && blockNumber >= hfBlock) return true
    return false
  }

  /**
   * Checks if the hardfork provided is active on the chain
   * @param {String} hardfork
   * @returns {Boolean}
   */
  hardforkIsActiveOnChain (hardfork) {
    for (let hf of this.hardforks()) {
      if (hf['name'] === hardfork && hf['block'] !== null) return true
    }
    return false
  }

  /**
   * Returns the active hardfork switches for the current network
   * @param {Number} blockNumber up to block if provided, otherwise for the whole chain
   * @return {Array} Array with hardfork arrays
   */
  activeHardforks (blockNumber) {
    let activeHardforks = []
    let hfs = this.hardforks()
    for (let hf of hfs) {
      if (hf['block'] === null) continue
      if (blockNumber !== undefined && blockNumber < hf['block']) break

      activeHardforks.push(hf)
    }
    return activeHardforks
  }

  /**
   * Returns the hardfork change block for the given hardfork
   * @param {String} hardfork Hardfork name
   * @returns {Number} Block number
   */
  hardforkBlock (hardfork) {
    return this._getHardfork(hardfork)['block']
  }

  /**
   * True if block number provided is the hardfork change block of the current network
   * @param {String} hardfork Hardfork name
   * @param {Number} blockNumber Number of the block to check
   * @returns {Boolean}
   */
  isHardforkBlock (hardfork, blockNumber) {
    if (this.hardforkBlock(hardfork) === blockNumber) {
      return true
    } else {
      return false
    }
  }

  /**
   * Provide the consensus type for the hardfork set or provided as param
   * @param {String} hardfork Hardfork name, optional if hardfork set
   * @returns {String} Consensus type (e.g. 'pow', 'poa')
   */
  consensus (hardfork) {
    hardfork = this._chooseHardfork(hardfork)
    return this._getHardfork(hardfork)['consensus']
  }

  /**
   * Provide the finality type for the hardfork set or provided as param
   * @param {String} hardfork Hardfork name, optional if hardfork set
   * @returns {String} Finality type (e.g. 'pos', null of no finality)
   */
  finality (hardfork) {
    hardfork = this._chooseHardfork(hardfork)
    return this._getHardfork(hardfork)['finality']
  }

  /**
   * Returns the Genesis parameters of current network
   * @returns {Dictionary} Genesis dict
  */
  genesis () {
    return this._networkParams['genesis']
  }

  /**
   * Returns the hardforks for current network
   * @returns {Array} Array with arrays of hardforks
   */
  hardforks () {
    return this._networkParams['hardforks']
  }

  /**
   * Returns bootstrap nodes for the current network
   * @returns {Dictionary} Dict with bootstrap nodes
   */
  bootstrapNodes () {
    return this._networkParams['bootstrapNodes']
  }

  /**
   * Returns the hardfork set
   * @returns {String} Hardfork name
   */
  hardfork () {
    return this._hardfork
  }

  /**
   * Returns the Id of current network
   * @returns {Number} network Id
   */
  networkId () {
    return this._networkParams['networkId']
  }

  /**
   * Returns the name of current network
   * @returns {String} network name (lower case)
   */
  networkName () {
    return networkParams['names'][this.networkId()]
  }
}

module.exports = Common
