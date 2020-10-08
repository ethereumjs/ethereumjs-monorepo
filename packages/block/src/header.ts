import Common from '@ethereumjs/common'
import {
  Address,
  BN,
  zeros,
  KECCAK256_RLP_ARRAY,
  KECCAK256_RLP,
  rlp,
  toBuffer,
  unpadBuffer,
  rlphash,
} from 'ethereumjs-util'
import { HeaderData, JsonHeader, Blockchain, BlockOptions } from './types'
import { Block } from './block'
import { toBN, bnToHex } from './util'

/**
 * An object that represents the block header.
 */
export class BlockHeader {
  public readonly parentHash: Buffer
  public readonly uncleHash: Buffer
  public readonly coinbase: Address
  public readonly stateRoot: Buffer
  public readonly transactionsTrie: Buffer
  public readonly receiptTrie: Buffer
  public readonly bloom: Buffer
  public readonly difficulty: BN
  public readonly number: BN
  public readonly gasLimit: BN
  public readonly gasUsed: BN
  public readonly timestamp: BN
  public readonly extraData: Buffer
  public readonly mixHash: Buffer
  public readonly nonce: Buffer

  public readonly _common: Common

  public static fromHeaderData(headerData: HeaderData = {}, opts: BlockOptions = {}) {
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
      parentHash ? toBuffer(parentHash) : zeros(32),
      uncleHash ? toBuffer(uncleHash) : KECCAK256_RLP_ARRAY,
      coinbase ? new Address(toBuffer(coinbase)) : Address.zero(),
      stateRoot ? toBuffer(stateRoot) : zeros(32),
      transactionsTrie ? toBuffer(transactionsTrie) : KECCAK256_RLP,
      receiptTrie ? toBuffer(receiptTrie) : KECCAK256_RLP,
      bloom ? toBuffer(bloom) : zeros(256),
      difficulty ? toBN(difficulty) : new BN(0),
      number ? toBN(number) : new BN(0),
      gasLimit ? toBN(gasLimit) : new BN(Buffer.from('ffffffffffffff', 'hex')),
      gasUsed ? toBN(gasUsed) : new BN(0),
      timestamp ? toBN(timestamp) : new BN(0),
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
      toBuffer(parentHash),
      toBuffer(uncleHash),
      new Address(toBuffer(coinbase)),
      toBuffer(stateRoot),
      toBuffer(transactionsTrie),
      toBuffer(receiptTrie),
      toBuffer(bloom),
      toBN(difficulty),
      toBN(number),
      toBN(gasLimit),
      toBN(gasUsed),
      toBN(timestamp),
      toBuffer(extraData),
      toBuffer(mixHash),
      toBuffer(nonce),
      opts,
    )
  }

  /**
   * This constructor takes the values, validates them, assigns them and freezes the object.
   * Use the public static factory methods to assist in creating a Header object from
   * varying data types.
   * For a default empty header, use `BlockHeader.fromHeaderData()`.
   */
  constructor(
    parentHash: Buffer,
    uncleHash: Buffer,
    coinbase: Address,
    stateRoot: Buffer,
    transactionsTrie: Buffer,
    receiptTrie: Buffer,
    bloom: Buffer,
    difficulty: BN,
    number: BN,
    gasLimit: BN,
    gasUsed: BN,
    timestamp: BN,
    extraData: Buffer,
    mixHash: Buffer,
    nonce: Buffer,
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
      this._common.setHardforkByBlockNumber(this.number.toNumber())
    }

    if (options.initWithGenesisHeader) {
      if (this._common.hardfork() !== 'chainstart') {
        throw new Error(
          'Genesis parameters can only be set with a Common instance set to chainstart',
        )
      }
      this.timestamp = toBN(this._common.genesis().timestamp || this.timestamp)
      this.gasLimit = toBN(this._common.genesis().gasLimit || this.gasLimit)
      this.difficulty = toBN(this._common.genesis().difficulty || this.difficulty)
      this.extraData = toBuffer(this._common.genesis().extraData || this.extraData)
      this.nonce = toBuffer(this._common.genesis().nonce || this.nonce)
      this.stateRoot = toBuffer(this._common.genesis().stateRoot || this.stateRoot)
      this.number = new BN(0)
    }

    this._validateBufferLengths()
    this._checkDAOExtraData()

    Object.freeze(this)
  }

  /**
   * Validates correct buffer lengths, throws if invalid.
   */
  _validateBufferLengths() {
    if (this.parentHash.length !== 32) {
      throw new Error('parentHash must be 32 bytes')
    }
    if (this.stateRoot.length !== 32) {
      throw new Error('stateRoot must be 32 bytes')
    }
    if (this.transactionsTrie.length !== 32) {
      throw new Error('transactionsTrie must be 32 bytes')
    }
    if (this.receiptTrie.length !== 32) {
      throw new Error('receiptTrie must be 32 bytes')
    }
    if (this.mixHash.length !== 32) {
      throw new Error('mixHash must be 32 bytes')
    }
    if (this.extraData.length > 32) {
      throw new Error('extraData cannot exceed 32 bytes')
    }
    if (this.nonce.length !== 8) {
      throw new Error('nonce must be 8 bytes')
    }
  }

  /**
   * Returns the canonical difficulty for this block.
   *
   * @param parentBlock - the parent `Block` of this header
   */
  canonicalDifficulty(parentBlock: Block): BN {
    const hardfork = this._getHardfork()
    const blockTs = this.timestamp
    const { timestamp: parentTs, difficulty: parentDif } = parentBlock.header
    const minimumDifficulty = new BN(
      this._common.paramByHardfork('pow', 'minimumDifficulty', hardfork),
    )
    const offset = parentDif.div(
      new BN(this._common.paramByHardfork('pow', 'difficultyBoundDivisor', hardfork)),
    )
    let num = this.number.clone()

    // We use a ! here as TS cannot follow this hardfork-dependent logic, but it always gets assigned
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

    const exp = num.divn(100000).isubn(2)
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
    return this.canonicalDifficulty(parentBlock).eq(this.difficulty)
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
      throw new Error('invalid difficulty')
    }

    if (!this.validateGasLimit(parentBlock)) {
      throw new Error('invalid gas limit')
    }

    if (!this.number.sub(parentBlock.header.number).eqn(1)) {
      throw new Error('invalid height')
    }

    if (this.timestamp.cmp(parentBlock.header.timestamp) <= 0) {
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
    return rlphash(this.raw())
  }

  /**
   * Returns a Buffer Array of the raw Buffers in this header, in order
   */
  raw(): Buffer[] {
    return [
      this.parentHash,
      this.uncleHash,
      this.coinbase.buf,
      this.stateRoot,
      this.transactionsTrie,
      this.receiptTrie,
      this.bloom,
      unpadBuffer(toBuffer(this.difficulty)), // we unpadBuffer, because toBuffer(new BN(0)) == <Buffer 00>
      unpadBuffer(toBuffer(this.number)),
      unpadBuffer(toBuffer(this.gasLimit)),
      unpadBuffer(toBuffer(this.gasUsed)),
      unpadBuffer(toBuffer(this.timestamp)),
      this.extraData,
      this.mixHash,
      this.nonce,
    ]
  }

  /**
   * Checks if the block header is a genesis header.
   */
  isGenesis(): boolean {
    return this.number.isZero()
  }

  /**
   * Returns the rlp encoding of the block header.
   */
  serialize(): Buffer {
    return rlp.encode(this.raw())
  }

  /**
   * Returns the block header in JSON format.
   */
  toJSON(): JsonHeader {
    return {
      parentHash: '0x' + this.parentHash.toString('hex'),
      uncleHash: '0x' + this.uncleHash.toString('hex'),
      coinbase: this.coinbase.toString(),
      stateRoot: '0x' + this.stateRoot.toString('hex'),
      transactionsTrie: '0x' + this.transactionsTrie.toString('hex'),
      receiptTrie: '0x' + this.receiptTrie.toString('hex'),
      bloom: '0x' + this.bloom.toString('hex'),
      difficulty: bnToHex(this.difficulty),
      number: bnToHex(this.number),
      gasLimit: bnToHex(this.gasLimit),
      gasUsed: bnToHex(this.gasUsed),
      timestamp: bnToHex(this.timestamp),
      extraData: '0x' + this.extraData.toString('hex'),
      mixHash: '0x' + this.mixHash.toString('hex'),
      nonce: '0x' + this.nonce.toString('hex'),
    }
  }

  private _getHardfork(): string {
    const commonHardFork = this._common.hardfork()

    return commonHardFork !== null
      ? commonHardFork
      : this._common.activeHardfork(this.number.toNumber())
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
      const blockNumber = this.number
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
