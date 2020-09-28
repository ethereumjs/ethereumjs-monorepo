import Common from '@ethereumjs/common'
import {
  BN,
  zeros,
  KECCAK256_RLP_ARRAY,
  KECCAK256_RLP,
  rlp,
  toBuffer,
  unpadBuffer,
  bufferToInt,
  rlphash,
} from 'ethereumjs-util'
import { Blockchain, HeaderData, BlockOptions } from './types'
import { Buffer } from 'buffer'
import { Block } from './block'
import { checkBufferLength } from './util'

/**
 * An object that represents the block header
 */
export class BlockHeader {
  public readonly parentHash: Buffer
  public readonly uncleHash: Buffer
  public readonly coinbase: Buffer
  public readonly stateRoot: Buffer
  public readonly transactionsTrie: Buffer
  public readonly receiptTrie: Buffer
  public readonly bloom: Buffer
  public readonly difficulty: Buffer
  public readonly number: Buffer
  public readonly gasLimit: Buffer
  public readonly gasUsed: Buffer
  public readonly timestamp: Buffer
  public readonly extraData: Buffer
  public readonly mixHash: Buffer
  public readonly nonce: Buffer

  public readonly _common: Common

  public static fromHeaderData(headerData: HeaderData, opts: BlockOptions = {}) {
    const {
      parentHash,
      uncleHash,
      coinbase,
      stateRoot,
      transactionsTrie,
      receiptTrie,
      bloom,
      difficulty,
      number,
      gasLimit,
      gasUsed,
      timestamp,
      extraData,
      mixHash,
      nonce,
    } = headerData

    return new BlockHeader(
      parentHash ? checkBufferLength(toBuffer(parentHash), 32) : zeros(32),
      uncleHash ? toBuffer(uncleHash) : KECCAK256_RLP_ARRAY,
      coinbase ? checkBufferLength(toBuffer(coinbase), 20) : zeros(20),
      stateRoot ? checkBufferLength(toBuffer(stateRoot), 32) : zeros(32),
      transactionsTrie ? checkBufferLength(toBuffer(transactionsTrie), 32) : KECCAK256_RLP,
      receiptTrie ? checkBufferLength(toBuffer(receiptTrie), 32) : KECCAK256_RLP,
      bloom ? toBuffer(bloom) : zeros(256),
      difficulty ? toBuffer(difficulty) : Buffer.from([]),
      number ? toBuffer(number) : Buffer.from([]),
      gasLimit ? toBuffer(gasLimit) : Buffer.from('ffffffffffffff', 'hex'),
      gasUsed ? toBuffer(gasUsed) : Buffer.from([]),
      timestamp ? toBuffer(timestamp) : Buffer.from([]),
      extraData ? toBuffer(extraData) : Buffer.from([]),
      mixHash ? toBuffer(mixHash) : zeros(32),
      nonce ? toBuffer(nonce) : zeros(8),
      opts,
    )
  }

  public static fromRLPSerializedHeader(serialized: Buffer, opts: BlockOptions) {
    const values = rlp.decode(serialized)

    if (!Array.isArray(values)) {
      throw new Error('Invalid serialized header input. Must be array')
    }

    return BlockHeader.fromValuesArray(values, opts)
  }

  public static fromValuesArray(values: Buffer[], opts: BlockOptions) {
    if (values.length > 15) {
      throw new Error('invalid header. More values than expected were received')
    }

    const [
      parentHash,
      uncleHash,
      coinbase,
      stateRoot,
      transactionsTrie,
      receiptTrie,
      bloom,
      difficulty,
      number,
      gasLimit,
      gasUsed,
      timestamp,
      extraData,
      mixHash,
      nonce,
    ] = values
    return new BlockHeader(
      parentHash,
      uncleHash,
      coinbase,
      stateRoot,
      transactionsTrie,
      receiptTrie,
      bloom,
      difficulty,
      number,
      gasLimit,
      gasUsed,
      timestamp,
      extraData,
      mixHash,
      nonce,
      opts,
    )
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   * Use the public static factory methods to assist in creating a Header object from
   * varying data types.
   */
  constructor(
    parentHash: Buffer,
    uncleHash: Buffer,
    coinbase: Buffer,
    stateRoot: Buffer,
    transactionsTrie: Buffer,
    receiptTrie: Buffer,
    bloom: Buffer,
    difficulty: Buffer,
    number: Buffer,
    gasLimit: Buffer,
    gasUsed: Buffer,
    timestamp: Buffer,
    extraData: Buffer,
    mixHash: Buffer,
    nonce: Buffer,
    //data: Buffer | PrefixedHexString | BufferLike[] | HeaderData = {},
    options: BlockOptions = {},
  ) {
    if (options.common) {
      this._common = options.common
    } else {
      const DEFAULT_CHAIN = 'mainnet'
      if (options.initWithGenesisHeader) {
        this._common = new Common({ chain: DEFAULT_CHAIN, hardfork: 'chainstart' })
      } else {
        // This initializes on the Common default hardfork
        this._common = new Common({ chain: DEFAULT_CHAIN })
      }
    }

    this.parentHash = parentHash
    this.uncleHash = uncleHash
    this.coinbase = coinbase
    this.stateRoot = stateRoot
    this.transactionsTrie = transactionsTrie
    this.receiptTrie = receiptTrie
    this.bloom = bloom
    this.difficulty = difficulty
    this.number = number
    this.gasLimit = gasLimit
    this.gasUsed = gasUsed
    this.timestamp = timestamp
    this.extraData = extraData
    this.mixHash = mixHash
    this.nonce = nonce

    if (options.hardforkByBlockNumber) {
      this._common.setHardforkByBlockNumber(bufferToInt(this.number))
    }
    if (options.initWithGenesisHeader) {
      if (this._common.hardfork() !== 'chainstart') {
        throw new Error(
          'Genesis parameters can only be set with a Common instance set to chainstart',
        )
      }
      this.timestamp = toBuffer(this._common.genesis().timestamp || this.timestamp)
      this.gasLimit = toBuffer(this._common.genesis().gasLimit || this.gasLimit)
      this.difficulty = toBuffer(this._common.genesis().difficulty || this.difficulty)
      this.extraData = toBuffer(this._common.genesis().extraData || this.extraData)
      this.nonce = toBuffer(this._common.genesis().nonce || this.nonce)
      this.stateRoot = toBuffer(this._common.genesis().stateRoot || this.stateRoot)
      this.number = toBuffer(0)
    }

    // Unpad all fields which should be interpreted as numbers
    this.timestamp = unpadBuffer(this.timestamp)
    this.difficulty = unpadBuffer(this.difficulty)
    this.gasLimit = unpadBuffer(this.gasLimit)
    this.number = unpadBuffer(this.number)
    this.timestamp = unpadBuffer(this.timestamp)

    this._checkDAOExtraData()

    Object.freeze(this)
  }

  /**
   * Returns the canonical difficulty for this block.
   *
   * @param parentBlock - the parent `Block` of this header
   */
  canonicalDifficulty(parentBlock: Block): BN {
    const hardfork = this._getHardfork()
    const blockTs = new BN(this.timestamp)
    const parentTs = new BN(parentBlock.header.timestamp)
    const parentDif = new BN(parentBlock.header.difficulty)
    const minimumDifficulty = new BN(
      this._common.paramByHardfork('pow', 'minimumDifficulty', hardfork),
    )
    const offset = parentDif.div(
      new BN(this._common.paramByHardfork('pow', 'difficultyBoundDivisor', hardfork)),
    )
    let num = new BN(this.number)

    // We use a ! here as TS can follow this hardforks-dependent logic, but it always gets assigned
    let dif!: BN

    if (this._common.hardforkGteHardfork(hardfork, 'byzantium')) {
      // max((2 if len(parent.uncles) else 1) - ((timestamp - parent.timestamp) // 9), -99) (EIP100)
      const uncleAddend = parentBlock.header.uncleHash.equals(KECCAK256_RLP_ARRAY) ? 1 : 2
      let a = blockTs.sub(parentTs).idivn(9).ineg().iaddn(uncleAddend)
      const cutoff = new BN(-99)
      // MAX(cutoff, a)
      if (cutoff.cmp(a) === 1) {
        a = cutoff
      }
      dif = parentDif.add(offset.mul(a))
    }

    if (this._common.hardforkGteHardfork(hardfork, 'muirGlacier')) {
      // Istanbul/Berlin difficulty bomb delay (EIP2384)
      num.isubn(9000000)
      if (num.ltn(0)) {
        num = new BN(0)
      }
    } else if (this._common.hardforkGteHardfork(hardfork, 'constantinople')) {
      // Constantinople difficulty bomb delay (EIP1234)
      num.isubn(5000000)
      if (num.ltn(0)) {
        num = new BN(0)
      }
    } else if (this._common.hardforkGteHardfork(hardfork, 'byzantium')) {
      // Byzantium difficulty bomb delay (EIP649)
      num.isubn(3000000)
      if (num.ltn(0)) {
        num = new BN(0)
      }
    } else if (this._common.hardforkGteHardfork(hardfork, 'homestead')) {
      // 1 - (block_timestamp - parent_timestamp) // 10
      let a = blockTs.sub(parentTs).idivn(10).ineg().iaddn(1)
      const cutoff = new BN(-99)
      // MAX(cutoff, a)
      if (cutoff.cmp(a) === 1) {
        a = cutoff
      }
      dif = parentDif.add(offset.mul(a))
    } else {
      // pre-homestead
      if (
        parentTs
          .addn(this._common.paramByHardfork('pow', 'durationLimit', hardfork))
          .cmp(blockTs) === 1
      ) {
        dif = offset.add(parentDif)
      } else {
        dif = parentDif.sub(offset)
      }
    }

    const exp = num.idivn(100000).isubn(2)
    if (!exp.isNeg()) {
      dif.iadd(new BN(2).pow(exp))
    }

    if (dif.cmp(minimumDifficulty) === -1) {
      dif = minimumDifficulty
    }

    return dif
  }

  /**
   * Checks that the block's `difficulty` matches the canonical difficulty.
   *
   * @param parentBlock - this block's parent
   */
  validateDifficulty(parentBlock: Block): boolean {
    const dif = this.canonicalDifficulty(parentBlock)
    return dif.cmp(new BN(this.difficulty)) === 0
  }

  /**
   * Validates the gasLimit.
   *
   * @param parentBlock - this block's parent
   */
  validateGasLimit(parentBlock: Block): boolean {
    const pGasLimit = new BN(parentBlock.header.gasLimit)
    const gasLimit = new BN(this.gasLimit)
    const hardfork = this._getHardfork()

    const a = pGasLimit.div(
      new BN(this._common.paramByHardfork('gasConfig', 'gasLimitBoundDivisor', hardfork)),
    )
    const maxGasLimit = pGasLimit.add(a)
    const minGasLimit = pGasLimit.sub(a)

    return (
      gasLimit.lt(maxGasLimit) &&
      gasLimit.gt(minGasLimit) &&
      gasLimit.gte(this._common.paramByHardfork('gasConfig', 'minGasLimit', hardfork))
    )
  }

  /**
   * Validates the entire block header, throwing if invalid.
   *
   * @param blockchain - the blockchain that this block is validating against
   * @param height - If this is an uncle header, this is the height of the block that is including it
   */
  async validate(blockchain: Blockchain, height?: BN): Promise<void> {
    if (this.isGenesis()) {
      return
    }

    const parentBlock = await this._getBlockByHash(blockchain, this.parentHash)

    if (parentBlock === undefined) {
      throw new Error('could not find parent block')
    }

    const number = new BN(this.number)
    if (number.cmp(new BN(parentBlock.header.number).iaddn(1)) !== 0) {
      throw new Error('invalid number')
    }

    if (height !== undefined && BN.isBN(height)) {
      const dif = height.sub(new BN(parentBlock.header.number))
      if (!(dif.cmpn(8) === -1 && dif.cmpn(1) === 1)) {
        throw new Error('uncle block has a parent that is too old or too young')
      }
    }

    if (!this.validateDifficulty(parentBlock)) {
      throw new Error('invalid Difficulty')
    }

    if (!this.validateGasLimit(parentBlock)) {
      throw new Error('invalid gas limit')
    }

    if (bufferToInt(this.number) - bufferToInt(parentBlock.header.number) !== 1) {
      throw new Error('invalid height')
    }

    if (bufferToInt(this.timestamp) <= bufferToInt(parentBlock.header.timestamp)) {
      throw new Error('invalid timestamp')
    }

    const hardfork = this._getHardfork()
    if (this.extraData.length > this._common.paramByHardfork('vm', 'maxExtraDataSize', hardfork)) {
      throw new Error('invalid amount of extra data')
    }
  }

  /**
   * Returns the hash of the block header.
   */
  hash(): Buffer {
    const values: Buffer[] = this.raw()
    return rlphash(values)
  }

  /**
   * Returns a Buffer Array of the raw Buffers in this header, in order
   */
  raw(): Buffer[] {
    return [
      this.parentHash,
      this.uncleHash,
      this.coinbase,
      this.stateRoot,
      this.transactionsTrie,
      this.receiptTrie,
      this.bloom,
      this.difficulty,
      this.number,
      this.gasLimit,
      this.gasUsed,
      this.timestamp,
      this.extraData,
      this.mixHash,
      this.nonce,
    ]
  }

  /**
   * Checks if the block header is a genesis header.
   */
  isGenesis(): boolean {
    return this.number.equals(zeros(0))
  }

  /**
   * Returns the rlp encoding of the block header
   */
  serialize(): Buffer {
    // Note: This never gets executed, defineProperties overwrites it.
    return Buffer.from([])
  }

  /**
   * Returns the block header in JSON format
   */
  toJSON(_labels: boolean = false): { [key: string]: string } | string[] {
    // Note: This never gets executed, defineProperties overwrites it.
    /*return Object.create({
      parentHash: this.parentHash,
      uncleHash: this.uncleHash,
      coinbase: this.coinbase,
      stateRoot: this.stateRoot,
      transactionsTrie: this.transactionsTrie,
      receiptTrie: this.receiptTrie,
      bloom: this.bloom,
      difficulty: this.difficulty,
      number: this.number,
      gasLimit: this.gasLimit,
      gasUsed: this.gasUsed,
      timestamp: this.timestamp,
      extraData: this.extraData,
      mixHash: this.mixHash,
      nonce: this.nonce,
    })*/
    return {} //TODO: FIXME
  }

  private _getHardfork(): string {
    const commonHardFork = this._common.hardfork()

    return commonHardFork !== null
      ? commonHardFork
      : this._common.activeHardfork(bufferToInt(this.number))
  }

  private async _getBlockByHash(blockchain: Blockchain, hash: Buffer): Promise<Block | undefined> {
    try {
      return blockchain.getBlock(hash)
    } catch (e) {
      return undefined
    }
  }

  /**
   * Force extra data be DAO_ExtraData for DAO_ForceExtraDataRange blocks after DAO
   * activation block (see: https://blog.slock.it/hard-fork-specification-24b889e70703)
   */
  private _checkDAOExtraData() {
    const DAO_ExtraData = Buffer.from('64616f2d686172642d666f726b', 'hex')
    const DAO_ForceExtraDataRange = 9

    if (this._common.hardforkIsActiveOnChain('dao')) {
      // verify the extraData field.
      const blockNumber = new BN(this.number)
      const DAOActivationBlock = new BN(this._common.hardforkBlock('dao'))
      if (blockNumber.gte(DAOActivationBlock)) {
        const drift = blockNumber.sub(DAOActivationBlock)
        if (drift.lten(DAO_ForceExtraDataRange)) {
          if (!this.extraData.equals(DAO_ExtraData)) {
            throw new Error("extraData should be 'dao-hard-fork'")
          }
        }
      }
    }
  }
}
