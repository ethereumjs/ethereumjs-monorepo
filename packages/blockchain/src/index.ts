import { BN, rlp } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'
import Ethash from '@ethereumjs/ethash'
import Common from '@ethereumjs/common'
import { callbackify } from './callbackify'
import DBManager from './dbManager'
import {
  bodyKey,
  bufBE8,
  hashToNumberKey,
  headBlockKey,
  headHeaderKey,
  headerKey,
  numberToHashKey,
  tdKey,
} from './util'

const Stoplight = require('flow-stoplight')
const level = require('level-mem')
const semaphore = require('semaphore')

// promisify a function: resolves this promise if callback is called
function promisify(func: Function) {
  return function () {
    return new Promise((resolve, reject) => {
      func(function (err: any, value: any) {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }
}

export interface BlockchainInterface {
  /**
   * Adds a block to the blockchain.
   *
   * @param block - The block to be added to the blockchain.
   * @param cb - The callback. It is given two parameters `err` and the saved `block`
   * @param isGenesis - True if block is the genesis block.
   */
  putBlock(block: Block, cb: any, isGenesis?: boolean): void

  /**
   * Deletes a block from the blockchain. All child blocks in the chain are deleted and any
   * encountered heads are set to the parent block.
   *
   * @param blockHash - The hash of the block to be deleted
   * @param cb - A callback.
   */
  delBlock(blockHash: Buffer, cb: any): void

  /**
   * Returns a block by its hash or number.
   */
  getBlock(blockTag: Buffer | number | BN, cb: (err: Error | null, block?: Block) => void): void

  /**
   * Iterates through blocks starting at the specified iterator head and calls the onBlock function
   * on each block.
   *
   * @param name - Name of the state root head
   * @param onBlock - Function called on each block with params (block, reorg, cb)
   * @param cb - A callback function
   */
  iterator(name: string, onBlock: any, cb: any): void

  /**
   * This method is only here for backwards compatibility. It can be removed once
   * [this PR](https://github.com/ethereumjs/ethereumjs-block/pull/72/files) gets merged, released,
   * and ethereumjs-block is updated here.
   *
   * The method should just call `cb` with `null` as first argument.
   */
  getDetails(_: string, cb: any): void
}

/**
 * This are the options that the Blockchain constructor can receive.
 */
export interface BlockchainOptions {
  /**
   * The chain id or name. Default: `"mainnet"`.
   */
  chain?: string | number

  /**
   * Hardfork for the blocks. If `undefined` or `null` is passed, it gets computed based on block
   * numbers.
   */
  hardfork?: string | null

  /**
   * An alternative way to specify the chain and hardfork is by passing a Common instance.
   */
  common?: Common

  /**
   * Database to store blocks and metadata. Should be a
   * [levelup](https://github.com/rvagg/node-levelup) instance.
   */
  db?: any

  /**
   * This the flag indicates if blocks and Proof-of-Work should be validated.
   * This option can't be used in conjunction with `validatePow` nor `validateBlocks`.
   *
   * @deprecated
   */
  validate?: boolean

  /**
   * This flags indicates if Proof-of-work should be validated. If `validate` is provided, this
   * option takes its value. If neither `validate` nor this option are provided, it defaults to
   * `true`.
   */
  validatePow?: boolean

  /**
   * This flags indicates if blocks should be validated. See Block#validate for details. If
   * `validate` is provided, this option takes its value. If neither `validate` nor this option are
   * provided, it defaults to `true`.
   */
  validateBlocks?: boolean
}

/**
 * This class stores and interacts with blocks.
 */
export default class Blockchain implements BlockchainInterface {
  /**
   * @hidden
   */
  _common: Common

  /**
   * @hidden
   */
  _genesis: any

  /**
   * @hidden
   */
  _headBlock: any

  /**
   * @hidden
   */
  _headHeader: any

  /**
   * @hidden
   */
  _heads: any

  /**
   * @hidden
   */
  _initDone: boolean

  /**
   * @hidden
   */
  _initLock: any

  /**
   * @hidden
   */
  _putSemaphore: any

  /**
   * @hidden
   */
  _staleHeadBlock: any

  /**
   * @hidden
   */
  _staleHeads: any

  db: any
  dbManager: DBManager
  ethash: any

  /**
   * This field is always `true`. It's here only for backwards compatibility.
   *
   * @deprecated
   */
  public readonly validate: boolean = true

  private readonly _validatePow: boolean
  private readonly _validateBlocks: boolean

  /**
   * Creates new Blockchain object
   *
   * @param opts - An object with the options that this constructor takes. See [[BlockchainOptions]].
   */
  constructor(opts: BlockchainOptions = {}) {
    if (opts.common) {
      if (opts.chain) {
        throw new Error('Instantiation with both opts.common and opts.chain parameter not allowed!')
      }
      this._common = opts.common
    } else {
      const chain = opts.chain ? opts.chain : 'mainnet'
      const hardfork = opts.hardfork ? opts.hardfork : null
      this._common = new Common(chain, hardfork)
    }

    if (opts.validate !== undefined) {
      if (opts.validatePow !== undefined || opts.validateBlocks !== undefined) {
        throw new Error(
          "opts.validate can't be used at the same time than opts.validatePow nor opts.validateBlocks",
        )
      }
    }

    // defaults

    if (opts.validate !== undefined) {
      this._validatePow = opts.validate
      this._validateBlocks = opts.validate
    } else {
      this._validatePow = opts.validatePow !== undefined ? opts.validatePow : true
      this._validateBlocks = opts.validateBlocks !== undefined ? opts.validateBlocks : true
    }

    this.db = opts.db ? opts.db : level()
    this.dbManager = new DBManager(this.db, this._common)
    this.ethash = this._validatePow ? new Ethash(this.db) : null
    this._heads = {}
    this._genesis = null
    this._headHeader = null
    this._headBlock = null
    this._initDone = false
    this._putSemaphore = semaphore(1)
    this._initLock = new Stoplight()
    this._init((err?: any) => {
      if (err) {
        throw err
      }
      this._initLock.go()
    })
  }

  /**
   * Returns an object with metadata about the Blockchain. It's defined for backwards compatibility.
   */
  get meta() {
    return {
      rawHead: this._headHeader,
      heads: this._heads,
      genesis: this._genesis,
    }
  }

  /**
   * Fetches the meta info about the blockchain from the db. Meta info contains
   * hashes of the headerchain head, blockchain head, genesis block and iterator
   * heads.
   *
   * @hidden
   */
  _init(cb: any): void {
    const self = this
    new Promise((resolve, reject) => {
      self._numberToHash(new BN(0), function (error: any, hash: any) {
        if (error) {
          reject(error)
        } else {
          resolve(hash)
        }
      })
    })
      .then(async function (hash) {
        await getHeads(hash)
        cb()
      })
      .catch(function (err) {
        self._setCanonicalGenesisBlock((err?: any) => {
          if (err) {
            return cb(err)
          }
          self._heads = {}
          self._headHeader = self._genesis
          self._headBlock = self._genesis
          cb()
        })
      })

    async function getHeads(genesisHash: any) {
      self._genesis = genesisHash
      // load verified iterator heads
      try {
        const heads = await self.dbManager.getHeads()
        Object.keys(heads).forEach((key) => {
          heads[key] = Buffer.from(heads[key])
        })
        self._heads = heads
      } catch (e) {
        self._heads = {}
      }

      // load headerchain head
      let hash
      try {
        hash = await self.dbManager.getHeadHeader()
        self._headHeader = hash
      } catch (e) {
        self._headHeader = genesisHash
      }

      // load blockchain head
      try {
        hash = await self.dbManager.getHeadBlock()
        self._headBlock = hash
      } catch (e) {
        self._headBlock = genesisHash
      }
    }
  }

  /**
   * Sets the default genesis block
   *
   * @hidden
   */
  _setCanonicalGenesisBlock(cb: any): void {
    const genesisBlock = new Block(undefined, { common: this._common })
    genesisBlock.setGenesisParams()
    this._putBlockOrHeader(genesisBlock, cb, true)
  }

  /**
   * Puts the genesis block in the database
   *
   * @param genesis - The genesis block to be added
   * @param cb - The callback. It is given two parameters `err` and the saved `block`
   */
  putGenesis(genesis: any, cb: any): void {
    this.putBlock(genesis, cb, true)
  }

  /**
   * Returns the specified iterator head.
   *
   * @param name - Optional name of the state root head (default: 'vm')
   * @param cb - The callback. It is given two parameters `err` and the returned `block`
   */
  getHead(name: any, cb?: any): void {
    // handle optional args
    if (typeof name === 'function') {
      cb = name
      name = 'vm'
    }

    // ensure init completed
    this._initLock.await(() => {
      // if the head is not found return the headHeader
      const hash = this._heads[name] || this._headBlock
      if (!hash) {
        return cb(new Error('No head found.'))
      }
      this.getBlock(hash, cb)
    })
  }

  /**
   * Returns the latest header in the canonical chain.
   *
   * @param cb - The callback. It is given two parameters `err` and the returned `header`
   */
  getLatestHeader(cb: any): void {
    // ensure init completed
    this._initLock.await(() => {
      this.getBlock(this._headHeader, (err?: any, block?: any) => {
        if (err) {
          return cb(err)
        }
        cb(null, block.header)
      })
    })
  }

  /**
   * Returns the latest full block in the canonical chain.
   *
   * @param cb - The callback. It is given two parameters `err` and the returned `block`
   */
  getLatestBlock(cb: any) {
    // ensure init completed
    this._initLock.await(() => {
      this.getBlock(this._headBlock, cb)
    })
  }

  /**
   * Adds many blocks to the blockchain.
   *
   * @param blocks - The blocks to be added to the blockchain
   * @param cb - The callback. It is given two parameters `err` and the last of the saved `blocks`
   */
  putBlocks(blocks: Array<any>, cb: any) {
    const self = this
    async function _putBlock(block: any): Promise<any> {
      return await new Promise((resolve, reject) => {
        self.putBlock(block, function (err: any, block: any) {
          resolve([err, block])
        })
      })
    }

    async function _putArray() {
      let retVal = []
      for (let i = 0; i < blocks.length; i++) {
        retVal = await _putBlock(blocks[i])
        if (retVal[0]) {
          // this is not undefined if there's an error
          break
        }
      }
      cb(retVal[0], retVal[1])
    }

    _putArray()
  }

  /**
   * Adds a block to the blockchain.
   *
   * @param block - The block to be added to the blockchain
   * @param cb - The callback. It is given two parameters `err` and the saved `block`
   */
  putBlock(block: object, cb: any, isGenesis?: boolean) {
    // make sure init has completed
    this._initLock.await(() => {
      // perform put with mutex dance
      this._lockUnlock((done: any) => {
        this._putBlockOrHeader(block, done, isGenesis)
      }, cb)
    })
  }

  /**
   * Adds many headers to the blockchain.
   *
   * @param headers - The headers to be added to the blockchain
   * @param cb - The callback. It is given two parameters `err` and the last of the saved `headers`
   */
  putHeaders(headers: Array<any>, cb: any) {
    const self = this
    async function _putHeader(block: any): Promise<any> {
      return await new Promise((resolve, reject) => {
        self.putHeader(block, function (err: any, block: any) {
          resolve([err, block])
        })
      })
    }

    async function _putArray() {
      let retVal = []
      for (let i = 0; i < headers.length; i++) {
        retVal = await _putHeader(headers[i])
        if (retVal[0]) {
          // this is not undefined if there's an error
          break
        }
      }
      cb(retVal[0], retVal[1])
    }

    _putArray()
  }

  /**
   * Adds a header to the blockchain.
   *
   * @param header - The header to be added to the blockchain
   * @param cb - The callback. It is given two parameters `err` and the saved `header`
   */
  putHeader(header: object, cb: any) {
    // make sure init has completed
    this._initLock.await(() => {
      // perform put with mutex dance
      this._lockUnlock((done: any) => {
        this._putBlockOrHeader(header, done)
      }, cb)
    })
  }

  /**
   * @hidden
   */
  _putBlockOrHeader(item: any, cb: any, isGenesis?: boolean) {
    const self = this
    const isHeader = item instanceof BlockHeader
    let block = isHeader ? new Block([item.raw, [], []], { common: item._common }) : item
    const header = block.header
    const hash = block.hash()
    const number = new BN(header.number)
    const td = new BN(header.difficulty)
    const currentTd: any = { header: null, block: null }
    const dbOps: any[] = []

    if (block.constructor !== Block) {
      block = new Block(block, { common: self._common })
    }

    if (block._common.chainId() !== self._common.chainId()) {
      return cb(new Error('Chain mismatch while trying to put block or header'))
    }

    async function validateBlock() {
      if (!self._validateBlocks) {
        return
      }

      if (!isGenesis && block.isGenesis()) {
        throw new Error('already have genesis set')
      }

      await block.validate(self)
      return
    }

    validateBlock()
      .then(promisify(verifyPOW))
      .then(promisify(getCurrentTd))
      .then(promisify(getBlockTd))
      .then(promisify(rebuildInfo))
      .then(function () {
        return new Promise((resolve, reject) => {
          self._batchDbOps(dbOps.concat(self._saveHeadOps()), function (err: any) {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
      })
      .then(function () {
        cb()
      })
      .catch(function (err: any) {
        cb(err)
      })

    function verifyPOW(next: any) {
      if (!self._validatePow) {
        return next()
      }

      self.ethash.verifyPOW(block, (valid: boolean) => {
        next(valid ? null : new Error('invalid POW'))
      })
    }

    function getCurrentTd(next: any) {
      if (isGenesis) {
        currentTd.header = new BN(0)
        currentTd.block = new BN(0)
        return next()
      }

      // set total difficulty in the current context scope.
      // tdArgument: argument to pass to _getTd
      // attribute: the attribute of currentTd to write the returned data to.
      function setTD(tdArgument: any, attribute: string) {
        return new Promise((resolve, reject) => {
          self._getTd(tdArgument, (err?: any, td?: any) => {
            currentTd[attribute] = td
            if (err) {
              reject(err)
            }
            resolve()
          })
        })
      }

      Promise.all([setTD(self._headHeader, 'header'), setTD(self._headBlock, 'block')])
        .then(function () {
          next()
        })
        .catch(function (err: any) {
          next(err)
        })
    }

    function getBlockTd(next: any) {
      if (isGenesis) {
        return next()
      }

      // calculate the total difficulty of the new block
      self._getTd(header.parentHash, number.subn(1), (err?: any, parentTd?: any) => {
        if (err) {
          return next(err)
        }
        td.iadd(parentTd)
        next()
      })
    }

    function rebuildInfo(next: any) {
      // save block and total difficulty to the database
      let key = tdKey(number, hash)
      let value = rlp.encode(td)
      dbOps.push({
        type: 'put',
        key: key,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: value,
      })
      self.dbManager._cache.td.set(key, value)

      // save header
      key = headerKey(number, hash)
      value = rlp.encode(header.raw)
      dbOps.push({
        type: 'put',
        key: key,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: value,
      })
      self.dbManager._cache.header.set(key, value)

      // store body if it exists
      if (isGenesis || block.transactions.length || block.uncleHeaders.length) {
        const body = block.serialize(false).slice(1)
        key = bodyKey(number, hash)
        value = rlp.encode(body)
        dbOps.push({
          type: 'put',
          key: key,
          keyEncoding: 'binary',
          valueEncoding: 'binary',
          value: value,
        })
        self.dbManager._cache.body.set(key, value)
      }

      // if total difficulty is higher than current, add it to canonical chain
      if (block.isGenesis() || td.gt(currentTd.header)) {
        self._headHeader = hash
        if (!isHeader) {
          self._headBlock = hash
        }
        if (block.isGenesis()) {
          self._genesis = hash
        }

        // delete higher number assignments and overwrite stale canonical chain
        Promise.all([
          new Promise((resolve, reject) => {
            self._deleteStaleAssignments(number.iaddn(1), hash, dbOps, function (
              error: any,
              value: any,
            ) {
              if (error) {
                reject(error)
              } else {
                resolve(value)
              }
            })
          }),
          new Promise((resolve, reject) => {
            self._rebuildCanonical(header, dbOps, function (error: any, value: any) {
              if (error) {
                reject(error)
              } else {
                resolve(value)
              }
            })
          }),
        ])
          .then(function (value) {
            next(undefined, value)
          })
          .catch(function (error) {
            next(error)
          })
      } else {
        if (td.gt(currentTd.block) && !isHeader) {
          self._headBlock = hash
        }
        // save hash to number lookup info even if rebuild not needed
        key = hashToNumberKey(hash)
        value = bufBE8(number)
        dbOps.push({
          type: 'put',
          key: key,
          keyEncoding: 'binary',
          valueEncoding: 'binary',
          value: value,
        })
        self.dbManager._cache.hashToNumber.set(key, value)
        next()
      }
    }
  }

  /**
   * Gets a block by its hash.
   *
   * @param blockTag - The block's hash or number
   * @param cb - The callback. It is given two parameters `err` and the found `block` (an instance of https://github.com/ethereumjs/ethereumjs-block) if any.
   */
  getBlock(blockTag: Buffer | number | BN, cb: any) {
    // ensure init completed
    this._initLock.await(() => {
      this._getBlock(blockTag, cb)
    })
  }

  /**
   * @hidden
   */
  _getBlock(blockTag: Buffer | number | BN, cb: any) {
    callbackify(this.dbManager.getBlock.bind(this.dbManager))(blockTag, cb)
  }

  /**
   * Looks up many blocks relative to blockId
   *
   * @param blockId - The block's hash or number
   * @param maxBlocks - Max number of blocks to return
   * @param skip - Number of blocks to skip apart
   * @param reverse - Fetch blocks in reverse
   * @param cb - The callback. It is given two parameters `err` and the found `blocks` if any.
   */
  getBlocks(blockId: Buffer | number, maxBlocks: number, skip: number, reverse: boolean, cb: any) {
    const self = this
    const blocks: any[] = []
    let i = -1

    function nextBlock(blockId: any) {
      self.getBlock(blockId, function (err?: any, block?: any) {
        i++

        if (err) {
          if (err.notFound) {
            return cb(null, blocks)
          } else {
            return cb(err)
          }
        }

        const nextBlockNumber = new BN(block.header.number).addn(reverse ? -1 : 1)

        if (i !== 0 && skip && i % (skip + 1) !== 0) {
          return nextBlock(nextBlockNumber)
        }

        blocks.push(block)

        if (blocks.length === maxBlocks) {
          return cb(null, blocks)
        }

        nextBlock(nextBlockNumber)
      })
    }

    nextBlock(blockId)
  }

  /**
   * This method used to return block details by its hash. It's only here for backwards compatibility.
   *
   * @deprecated
   */
  getDetails(_: string, cb: any) {
    cb(null, {})
  }

  /**
   * Given an ordered array, returns to the callback an array of hashes that are not in the blockchain yet.
   *
   * @param hashes - Ordered array of hashes
   * @param cb - The callback. It is given two parameters `err` and hashes found.
   */
  selectNeededHashes(hashes: Array<any>, cb: any) {
    const self = this
    async function _selectNeededHashes() {
      let max: number, mid: number, min: number

      max = hashes.length - 1
      mid = min = 0

      while (max >= min) {
        await new Promise((resolve, reject) => {
          self._hashToNumber(hashes[mid], (err?: any, number?: any) => {
            if (!err && number) {
              min = mid + 1
            } else {
              max = mid - 1
            }

            mid = Math.floor((min + max) / 2)
            resolve()
          })
        })
      }
      cb(null, hashes.slice(min))
    }
    _selectNeededHashes()
  }

  /**
   * @hidden
   */
  _saveHeadOps() {
    return [
      {
        type: 'put',
        key: 'heads',
        keyEncoding: 'binary',
        valueEncoding: 'json',
        value: this._heads,
      },
      {
        type: 'put',
        key: headHeaderKey,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: this._headHeader,
      },
      {
        type: 'put',
        key: headBlockKey,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: this._headBlock,
      },
    ]
  }

  /**
   * @hidden
   */
  _saveHeads(cb: any) {
    this._batchDbOps(this._saveHeadOps(), cb)
  }

  /**
   * Delete canonical number assignments for specified number and above
   *
   * @hidden
   */
  _deleteStaleAssignments(number: BN, headHash: Buffer, ops: any, cb: any) {
    const key = numberToHashKey(number)

    this._numberToHash(number, (err?: any, hash?: Buffer) => {
      if (err) {
        return cb()
      }
      ops.push({
        type: 'del',
        key: key,
        keyEncoding: 'binary',
      })
      this.dbManager._cache.numberToHash.del(key)

      // reset stale iterator heads to current canonical head
      Object.keys(this._heads).forEach((name) => {
        if (this._heads[name].equals(hash)) {
          this._heads[name] = headHash
        }
      })
      // reset stale headBlock to current canonical
      if (this._headBlock.equals(hash)) {
        this._headBlock = headHash
      }

      this._deleteStaleAssignments(number.addn(1), headHash, ops, cb)
    })
  }

  /**
   * Overwrites stale canonical number assignments.
   *
   * @hidden
   */
  _rebuildCanonical(header: any, ops: any, cb: any) {
    const self = this
    const hash = header.hash()
    const number = new BN(header.number)

    function saveLookups(hash: Buffer, number: BN) {
      let key = numberToHashKey(number)
      let value
      ops.push({
        type: 'put',
        key: key,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: hash,
      })
      self.dbManager._cache.numberToHash.set(key, hash)

      key = hashToNumberKey(hash)
      value = bufBE8(number)
      ops.push({
        type: 'put',
        key: key,
        keyEncoding: 'binary',
        valueEncoding: 'binary',
        value: value,
      })
      self.dbManager._cache.hashToNumber.set(key, value)
    }

    // handle genesis block
    if (number.cmpn(0) === 0) {
      saveLookups(hash, number)
      return cb()
    }

    self._numberToHash(number, (err?: any, staleHash?: Buffer | null) => {
      if (err) {
        staleHash = null
      }
      if (!staleHash || !hash.equals(staleHash)) {
        saveLookups(hash, number)

        // flag stale head for reset
        Object.keys(self._heads).forEach(function (name) {
          if (staleHash && self._heads[name].equals(staleHash)) {
            self._staleHeads = self._staleHeads || []
            self._staleHeads.push(name)
          }
        })
        // flag stale headBlock for reset
        if (staleHash && self._headBlock.equals(staleHash)) {
          self._staleHeadBlock = true
        }

        self._getHeader(header.parentHash, number.subn(1), (err?: any, header?: any) => {
          if (err) {
            delete self._staleHeads
            return cb(err)
          }
          self._rebuildCanonical(header, ops, cb)
        })
      } else {
        // set stale heads to last previously valid canonical block
        ;(self._staleHeads || []).forEach((name: string) => {
          self._heads[name] = hash
        })
        delete self._staleHeads
        // set stale headBlock to last previously valid canonical block
        if (self._staleHeadBlock) {
          self._headBlock = hash
          delete self._staleHeadBlock
        }
        cb()
      }
    })
  }

  /**
   * Deletes a block from the blockchain. All child blocks in the chain are deleted and any
   * encountered heads are set to the parent block.
   *
   * @param blockHash - The hash of the block to be deleted
   * @param cb - A callback.
   */
  delBlock(blockHash: Buffer, cb: any) {
    // make sure init has completed
    this._initLock.await(() => {
      // perform put with mutex dance
      this._lockUnlock((done: boolean) => {
        this._delBlock(blockHash, done)
      }, cb)
    })
  }

  /**
   * @hidden
   */
  _delBlock(blockHash: Buffer | Block, cb: any) {
    const self = this
    const dbOps: any[] = []
    let blockHeader = null
    let blockNumber: any = null
    let parentHash: any = null
    let inCanonical: any = null
    let hash: Buffer

    if (Buffer.isBuffer(blockHash)) {
      hash = blockHash
    } else {
      hash = blockHash.hash()
    }

    promisify(getHeader)()
      .then(promisify(checkCanonical))
      .then(promisify(buildDBops))
      .then(promisify(deleteStaleAssignments))
      .then(function () {
        return new Promise((resolve, reject) => {
          self._batchDbOps(dbOps, function (err: any) {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
      })
      .then(function () {
        cb()
      })
      .catch(function (err: any) {
        cb(err)
      })

    function getHeader(cb2: any) {
      self._getHeader(hash, (err?: any, header?: any) => {
        if (err) return cb2(err)
        blockHeader = header
        blockNumber = new BN(blockHeader.number)
        parentHash = blockHeader.parentHash
        cb2()
      })
    }

    // check if block is in the canonical chain
    function checkCanonical(cb2: any) {
      self._numberToHash(blockNumber, (err?: any, hash?: any) => {
        inCanonical = !err && hash.equals(hash)
        cb2()
      })
    }

    // delete the block, and if block is in the canonical chain, delete all
    // children as well
    function buildDBops(cb2: any) {
      self._delChild(hash, blockNumber, inCanonical ? parentHash : null, dbOps, cb2)
    }

    // delete all number to hash mappings for deleted block number and above
    function deleteStaleAssignments(cb2: any) {
      if (inCanonical) {
        self._deleteStaleAssignments(blockNumber, parentHash, dbOps, cb2)
      } else {
        cb2()
      }
    }
  }

  /**
   * @hidden
   */
  _delChild(hash: Buffer, number: BN, headHash: Buffer, ops: any, cb: any) {
    const self = this

    // delete header, body, hash to number mapping and td
    ops.push({
      type: 'del',
      key: headerKey(number, hash),
      keyEncoding: 'binary',
    })
    self.dbManager._cache.header.del(headerKey(number, hash))

    ops.push({
      type: 'del',
      key: bodyKey(number, hash),
      keyEncoding: 'binary',
    })
    self.dbManager._cache.body.del(bodyKey(number, hash))

    ops.push({
      type: 'del',
      key: hashToNumberKey(hash),
      keyEncoding: 'binary',
    })
    self.dbManager._cache.hashToNumber.del(hashToNumberKey(hash))

    ops.push({
      type: 'del',
      key: tdKey(number, hash),
      keyEncoding: 'binary',
    })
    self.dbManager._cache.td.del(tdKey(number, hash))

    if (!headHash) {
      return cb()
    }

    if (hash.equals(self._headHeader)) {
      self._headHeader = headHash
    }

    if (hash.equals(self._headBlock)) {
      self._headBlock = headHash
    }

    self._getCanonicalHeader(number.addn(1), (err?: any, childHeader?: any) => {
      if (err) {
        return cb()
      }
      self._delChild(childHeader.hash(), new BN(childHeader.number), headHash, ops, cb)
    })
  }

  /**
   * Iterates through blocks starting at the specified iterator head and calls the onBlock function
   * on each block. The current location of an iterator head can be retrieved using the `getHead()`
   * method.
   *
   * @param name - Name of the state root head
   * @param onBlock - Function called on each block with params (block, reorg, cb)
   * @param cb - A callback function
   */
  iterator(name: string, onBlock: any, cb: any): void {
    // ensure init completed
    this._initLock.await(() => {
      this._iterator(name, onBlock, cb)
    })
  }

  /**
   * @hidden
   */
  _iterator(name: string, func: any, cb: any) {
    const self = this
    const blockHash = self._heads[name] || self._genesis
    let blockNumber: any
    let lastBlock: any

    if (!blockHash) {
      return cb()
    }

    self._hashToNumber(blockHash, async (err?: any, number?: any) => {
      if (err) return cb(err)
      blockNumber = number.addn(1)
      let error = false
      while (blockNumber && !error) {
        await run().catch(function (err: any) {
          error = true
          cb(err)
        })
      }

      if (!error) {
        self._saveHeads(cb)
      }
    })

    async function run() {
      let block: any

      await promisify(getBlock)()
        .then(promisify(runFunc))
        .then(function () {
          blockNumber.iaddn(1)
        })
        .catch(function (error) {
          blockNumber = false
          if (error.type !== 'NotFoundError') {
            throw error
          }
        })

      function getBlock(cb3: any) {
        self.getBlock(blockNumber, function (err?: any, b?: any) {
          block = b
          if (block) {
            self._heads[name] = block.hash()
          }
          cb3(err)
        })
      }

      function runFunc(cb3: any) {
        const reorg = lastBlock ? lastBlock.hash().equals(block.header.parentHash) : false
        lastBlock = block
        func(block, reorg, cb3)
      }
    }
  }

  /**
   * Executes multiple db operations in a single batch call
   *
   * @hidden
   */
  _batchDbOps(dbOps: any, cb: any): void {
    callbackify(this.dbManager.batch.bind(this.dbManager))(dbOps, cb)
  }

  /**
   * Performs a block hash to block number lookup
   *
   * @hidden
   */
  _hashToNumber(hash: Buffer, cb: any): void {
    callbackify(this.dbManager.hashToNumber.bind(this.dbManager))(hash, cb)
  }

  /**
   * Performs a block number to block hash lookup
   *
   * @hidden
   */
  _numberToHash(number: BN, cb: any): void {
    callbackify(this.dbManager.numberToHash.bind(this.dbManager))(number, cb)
  }

  /**
   * Helper function to lookup a block by either hash only or a hash and number
   *
   * @hidden
   */
  _lookupByHashNumber(hash: Buffer, number: BN, cb: any, next: any): void {
    if (typeof number === 'function') {
      cb = number
      return this._hashToNumber(hash, (err?: any, number?: BN) => {
        if (err) {
          return next(err, hash, null, cb)
        }
        next(null, hash, number, cb)
      })
    }
    next(null, hash, number, cb)
  }

  /**
   * Gets a header by hash and number. Header can exist outside the canonical chain
   *
   * @hidden
   */
  _getHeader(hash: Buffer, number: any, cb?: any): void {
    this._lookupByHashNumber(
      hash,
      number,
      cb,
      (err: Error | undefined, hash: Buffer, number: BN, cb: any) => {
        if (err) {
          return cb(err)
        }
        callbackify(this.dbManager.getHeader.bind(this.dbManager))(hash, number, cb)
      },
    )
  }

  /**
   * Gets a header by number. Header must be in the canonical chain
   *
   * @hidden
   */
  _getCanonicalHeader(number: BN, cb: any): void {
    this._numberToHash(number, (err: Error | undefined, hash: Buffer) => {
      if (err) {
        return cb(err)
      }
      this._getHeader(hash, number, cb)
    })
  }

  /**
   * Gets total difficulty for a block specified by hash and number
   *
   * @hidden
   */
  _getTd(hash: any, number: any, cb?: any): void {
    this._lookupByHashNumber(
      hash,
      number,
      cb,
      (err: Error | undefined, hash: Buffer, number: BN, cb: any) => {
        if (err) {
          return cb(err)
        }
        callbackify(this.dbManager.getTd.bind(this.dbManager))(hash, number, cb)
      },
    )
  }

  /**
   * @hidden
   */
  _lockUnlock(fn: any, cb: any): void {
    const self = this
    this._putSemaphore.take(() => {
      fn(after)

      function after() {
        self._putSemaphore.leave()
        cb.apply(null, arguments)
      }
    })
  }
}
