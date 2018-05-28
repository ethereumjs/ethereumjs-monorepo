const chainParams = require('./chains')
const hardforkChanges = require('./hardforks')

/**
 * Common class to access chain and hardfork parameters
 */
class Common {
  /**
   * @constructor
   * @param {String|Number} chain String ('mainnet') or Number (1) chain representation
   * @param {String} hardfork String identifier ('byzantium') for hardfork (optional)
   * @param {Array} supportedHardforks Limit parameter returns to the given hardforks (optional)
   */
  constructor (chain, hardfork, supportedHardforks) {
    this.setChain(chain)
    this._hardfork = null
    this._supportedHardforks = supportedHardforks === undefined ? [] : supportedHardforks
    if (hardfork) {
      this.setHardfork(hardfork)
    }
  }

  /**
   * Sets the chain
   * @param {String|Number} chain String ('mainnet') or Number (1) chain representation
   */
  setChain (chain) {
    if (typeof (chain) === 'number') {
      if (chainParams['names'][chain]) {
        this._chainParams = chainParams[chainParams['names'][chain]]
      } else {
        throw new Error(`Chain with ID ${chain} not supported`)
      }
    } else if (typeof (chain) === 'string') {
      if (chainParams[chain]) {
        this._chainParams = chainParams[chain]
      } else {
        throw new Error(`Chain with name ${chain} not supported`)
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
    if (!this._isSupportedHardfork(hardfork)) {
      throw new Error(`Hardfork ${hardfork} not set as supported in supportedHardforks`)
    }
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
  _chooseHardfork (hardfork, onlySupported) {
    onlySupported = onlySupported === undefined ? true : onlySupported
    if (!hardfork) {
      if (!this._hardfork) {
        throw new Error('Method called with neither a hardfork set nor provided by param')
      } else {
        hardfork = this._hardfork
      }
    } else if (!this._isSupportedHardfork(hardfork)) {
      throw new Error(`Hardfork ${hardfork} not set as supported in supportedHardforks`)
    }
    return hardfork
  }

  /**
   * Internal helper function, returns the params for the given hardfork for the chain set
   * @param {String} hardfork Hardfork name
   * @returns {Dictionary}
   */
  _getHardfork (hardfork) {
    let hfs = this.hardforks()
    for (let hf of hfs) {
      if (hf['name'] === hardfork) return hf
    }
    throw new Error(`Hardfork ${hardfork} not defined for chain ${this.chainName()}`)
  }

  /**
   * Internal helper function to check if a hardfork is set to be supported by the library
   * @param {String} hardfork Hardfork name
   * @returns {Boolean} True if hardfork is supported
   */
  _isSupportedHardfork (hardfork) {
    if (this._supportedHardforks.length > 0) {
      for (let supportedHf of this._supportedHardforks) {
        if (hardfork === supportedHf) return true
      }
    } else {
      return true
    }
    return false
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
   * Checks if set or provided hardfork is active on block number
   * @param {String} hardfork Hardfork name or null (for HF set)
   * @param {Number} blockNumber
   * @param {Array} opts
   * @param {Array.Boolean} opts.onlySupported optional, only allow supported HFs (default: false)
   * @returns {Boolean}
   */
  hardforkIsActiveOnBlock (hardfork, blockNumber, opts) {
    opts = opts !== undefined ? opts : []
    let onlySupported = opts.onlySupported === undefined ? false : opts.onlySupported
    hardfork = this._chooseHardfork(hardfork, onlySupported)
    let hfBlock = this.hardforkBlock(hardfork)
    if (hfBlock !== null && blockNumber >= hfBlock) return true
    return false
  }

  /**
   * Alias to hardforkIsActiveOnBlock when hardfork is set
   * @param {Number} blockNumber
   * @param {Array} opts
   * @param {Array.Boolean} opts.onlySupported optional, only allow supported HFs (default: false)
   * @returns {Boolean}
   */
  activeOnBlock (blockNumber, opts) {
    return this.hardforkIsActiveOnBlock(null, blockNumber, opts)
  }

  /**
   * Sequence based check if given or set HF1 is greater than or equal HF2
   * @param {String} hardfork1 Hardfork name or null (if set)
   * @param {String} hardfork2 Hardfork name
   * @param {Array} opts
   * @param {Array.Boolean} opts.onlyActive optional, only active HFs (default: false)
   * @param {Array.Boolean} opts.onlySupported optional, only allow supported HFs (default: false)
   * @returns {Boolean}
   */
  hardforkGteHardfork (hardfork1, hardfork2, opts) {
    opts = opts !== undefined ? opts : []
    let onlyActive = opts.onlyActive === undefined ? false : opts.onlyActive
    hardfork1 = this._chooseHardfork(hardfork1, opts.onlySupported)

    let hardforks
    if (onlyActive) {
      hardforks = this.activeHardforks(null, opts)
    } else {
      hardforks = this.hardforks()
    }

    let posHf1, posHf2
    let index = 0
    for (let hf of hardforks) {
      if (hf['name'] === hardfork1) posHf1 = index
      if (hf['name'] === hardfork2) posHf2 = index
      index += 1
    }
    return posHf1 >= posHf2
  }

  /**
   * Alias to hardforkGteHardfork when hardfork is set
   * @param {String} hardfork Hardfork name
   * @param {Array} opts
   * @param {Array.Boolean} opts.onlyActive optional, only active HFs (default: false)
   * @param {Array.Boolean} opts.onlySupported optional, only allow supported HFs (default: false)
   * @returns {Boolean}
   */
  gteHardfork (hardfork, opts) {
    return this.hardforkGteHardfork(null, hardfork, opts)
  }

  /**
   * Checks if given or set hardfork is active on the chain
   * @param {String} hardfork Hardfork name, optional if HF set
   * @param {Array} opts
   * @param {Array.Boolean} opts.onlySupported optional, only allow supported HFs (default: false)
   * @returns {Boolean}
   */
  hardforkIsActiveOnChain (hardfork, opts) {
    opts = opts !== undefined ? opts : []
    let onlySupported = opts.onlySupported === undefined ? false : opts.onlySupported
    hardfork = this._chooseHardfork(hardfork, onlySupported)
    for (let hf of this.hardforks()) {
      if (hf['name'] === hardfork && hf['block'] !== null) return true
    }
    return false
  }

  /**
   * Returns the active hardfork switches for the current chain
   * @param {Number} blockNumber up to block if provided, otherwise for the whole chain
   * @param {Array} opts
   * @param {Array.Boolean} opts.onlySupported optional, limit results to supported HFs (default: false)
   * @return {Array} Array with hardfork arrays
   */
  activeHardforks (blockNumber, opts) {
    opts = opts !== undefined ? opts : []
    let activeHardforks = []
    let hfs = this.hardforks()
    for (let hf of hfs) {
      if (hf['block'] === null) continue
      if ((blockNumber !== undefined && blockNumber !== null) && blockNumber < hf['block']) break
      if (opts.onlySupported && !this._isSupportedHardfork(hf['name'])) continue

      activeHardforks.push(hf)
    }
    return activeHardforks
  }

  /**
   * Returns the latest active hardfork name for chain or block or throws if unavailable
   * @param {Number} blockNumber up to block if provided, otherwise for the whole chain
   * @param {Array} opts
   * @param {Array.Boolean} opts.onlySupported optional, limit results to supported HFs (default: false)
   * @return {String} Hardfork name
   */
  activeHardfork (blockNumber, opts) {
    let activeHardforks = this.activeHardforks(blockNumber, opts)
    if (activeHardforks.length > 0) {
      return activeHardforks[activeHardforks.length - 1]['name']
    } else {
      throw new Error(`No (supported) active hardfork found`)
    }
  }

  /**
   * Returns the hardfork change block for hardfork provided or set
   * @param {String} hardfork Hardfork name, optional if HF set
   * @returns {Number} Block number
   */
  hardforkBlock (hardfork) {
    hardfork = this._chooseHardfork(hardfork, false)
    return this._getHardfork(hardfork)['block']
  }

  /**
   * True if block number provided is the hardfork (given or set) change block of the current chain
   * @param {Number} blockNumber Number of the block to check
   * @param {String} hardfork Hardfork name, optional if HF set
   * @returns {Boolean}
   */
  isHardforkBlock (blockNumber, hardfork) {
    hardfork = this._chooseHardfork(hardfork, false)
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
   * Returns the Genesis parameters of current chain
   * @returns {Dictionary} Genesis dict
  */
  genesis () {
    return this._chainParams['genesis']
  }

  /**
   * Returns the hardforks for current chain
   * @returns {Array} Array with arrays of hardforks
   */
  hardforks () {
    return this._chainParams['hardforks']
  }

  /**
   * Returns bootstrap nodes for the current chain
   * @returns {Dictionary} Dict with bootstrap nodes
   */
  bootstrapNodes () {
    return this._chainParams['bootstrapNodes']
  }

  /**
   * Returns the hardfork set
   * @returns {String} Hardfork name
   */
  hardfork () {
    return this._hardfork
  }

  /**
   * Returns the Id of current chain
   * @returns {Number} chain Id
   */
  chainId () {
    return this._chainParams['chainId']
  }

  /**
   * Returns the name of current chain
   * @returns {String} chain name (lower case)
   */
  chainName () {
    return chainParams['names'][this.chainId()]
  }

  /**
   * Returns the Id of current network
   * @returns {Number} network Id
   */
  networkId () {
    return this._chainParams['networkId']
  }
}

module.exports = Common
