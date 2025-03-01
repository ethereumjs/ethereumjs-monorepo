import {
  cliqueEpochTransitionSigners,
  cliqueIsEpochTransition,
  cliqueSigner,
  cliqueVerifySignature,
} from '@ethereumjs/block'
import { ConsensusAlgorithm } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  Address,
  BIGINT_0,
  BIGINT_1,
  BIGINT_2,
  EthereumJSErrorWithoutCode,
  TypeOutput,
  bigIntToBytes,
  bytesToBigInt,
  equalsBytes,
  hexToBytes,
  toType,
} from '@ethereumjs/util'
import debugDefault from 'debug'

import type { Blockchain } from '../index.js'
import type { Consensus, ConsensusOptions } from '../types.js'
import type { Block, BlockHeader } from '@ethereumjs/block'
import type { CliqueConfig } from '@ethereumjs/common'

const debug = debugDefault('blockchain:clique')

// Magic nonce number to vote on adding a new signer
export const CLIQUE_NONCE_AUTH = hexToBytes('0xffffffffffffffff')
// Magic nonce number to vote on removing a signer.
export const CLIQUE_NONCE_DROP = new Uint8Array(8)

const CLIQUE_SIGNERS_KEY = 'CliqueSigners'
const CLIQUE_VOTES_KEY = 'CliqueVotes'
const CLIQUE_BLOCK_SIGNERS_SNAPSHOT_KEY = 'CliqueBlockSignersSnapshot'

// Block difficulty for in-turn signatures
export const CLIQUE_DIFF_INTURN = BIGINT_2
// Block difficulty for out-of-turn signatures
export const CLIQUE_DIFF_NOTURN = BIGINT_1

// Clique Signer State
type CliqueSignerState = [blockNumber: bigint, signers: Address[]]
type CliqueLatestSignerStates = CliqueSignerState[]

// Clique Vote
type CliqueVote = [
  blockNumber: bigint,
  vote: [signer: Address, beneficiary: Address, cliqueNonce: Uint8Array],
]
type CliqueLatestVotes = CliqueVote[]

// Clique Block Signer
type CliqueBlockSigner = [blockNumber: bigint, signer: Address]
type CliqueLatestBlockSigners = CliqueBlockSigner[]

/**
 * This class encapsulates Clique-related consensus functionality when used with the Blockchain class.
 * Note: reorgs which happen between epoch transitions, which change the internal voting state over the reorg
 * will result in failure and is currently not supported.
 * The hotfix for this could be: re-load the latest epoch block (this has the clique state in the extraData of the header)
 * Now replay all blocks on top of it. This should validate the chain up to the new/reorged tip which previously threw.
 */
export class CliqueConsensus implements Consensus {
  blockchain: Blockchain | undefined
  algorithm: ConsensusAlgorithm

  /**
   * Keep signer history data (signer states and votes)
   * for all block numbers >= HEAD_BLOCK - CLIQUE_SIGNER_HISTORY_BLOCK_LIMIT
   *
   * This defines a limit for reorgs on PoA clique chains.
   */
  private CLIQUE_SIGNER_HISTORY_BLOCK_LIMIT = 200

  /**
   * List with the latest signer states checkpointed on blocks where
   * a change (added new or removed a signer) occurred.
   *
   * Format:
   * [ [BLOCK_NUMBER_1, [SIGNER1, SIGNER 2,]], [BLOCK_NUMBER2, [SIGNER1, SIGNER3]], ...]
   *
   * The top element from the array represents the list of current signers.
   * On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.
   *
   * Always keep at least one item on the stack.
   */
  public _cliqueLatestSignerStates: CliqueLatestSignerStates = []

  /**
   * List with the latest signer votes.
   *
   * Format:
   * [ [BLOCK_NUMBER_1, [SIGNER, BENEFICIARY, AUTH]], [BLOCK_NUMBER_1, [SIGNER, BENEFICIARY, AUTH]] ]
   * where AUTH = CLIQUE_NONCE_AUTH | CLIQUE_NONCE_DROP
   *
   * For votes all elements here must be taken into account with a
   * block number >= LAST_EPOCH_BLOCK
   * (nevertheless keep entries with blocks before EPOCH_BLOCK in case a reorg happens
   * during an epoch change)
   *
   * On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.
   */
  public _cliqueLatestVotes: CliqueLatestVotes = []

  /**
   * List of signers for the last consecutive {@link Blockchain.cliqueSignerLimit} blocks.
   * Kept as a snapshot for quickly checking for "recently signed" error.
   * Format: [ [BLOCK_NUMBER, SIGNER_ADDRESS], ...]
   *
   * On reorgs elements from the array are removed until BLOCK_NUMBER > REORG_BLOCK.
   */
  public _cliqueLatestBlockSigners: CliqueLatestBlockSigners = []

  DEBUG: boolean // Guard for debug logs
  constructor() {
    // Skip DEBUG calls unless 'ethjs' included in environmental DEBUG variables
    // Additional window check is to prevent vite browser bundling (and potentially other) to break
    this.DEBUG =
      typeof window === 'undefined' ? (process?.env?.DEBUG?.includes('ethjs') ?? false) : false

    this.algorithm = ConsensusAlgorithm.Clique
  }

  /**
   *
   * @param param dictionary containing a {@link Blockchain} object
   *
   * Note: this method must be called before consensus checks are used or type errors will occur
   */
  async setup({ blockchain }: ConsensusOptions): Promise<void> {
    this.blockchain = blockchain
    this._cliqueLatestSignerStates = await this.getCliqueLatestSignerStates()
    this._cliqueLatestSignerStates.sort((a, b) => (a[0] > b[0] ? 1 : -1))
    this._cliqueLatestVotes = await this.getCliqueLatestVotes()
    this._cliqueLatestBlockSigners = await this.getCliqueLatestBlockSigners()
  }

  async genesisInit(genesisBlock: Block): Promise<void> {
    await this.cliqueSaveGenesisSigners(genesisBlock)
  }

  async validateConsensus(block: Block): Promise<void> {
    if (!this.blockchain) {
      throw EthereumJSErrorWithoutCode('blockchain not provided')
    }

    const { header } = block
    const valid = cliqueVerifySignature(header, this.cliqueActiveSigners(header.number))
    if (!valid) {
      throw EthereumJSErrorWithoutCode('invalid PoA block signature (clique)')
    }
    if (this.cliqueCheckRecentlySigned(header)) {
      throw EthereumJSErrorWithoutCode('recently signed')
    }

    // validate checkpoint signers towards active signers on epoch transition blocks
    if (cliqueIsEpochTransition(header)) {
      // note: keep votes on epoch transition blocks in case of reorgs.
      // only active (non-stale) votes will counted (if vote.blockNumber >= lastEpochBlockNumber

      const checkpointSigners = cliqueEpochTransitionSigners(header)
      const activeSigners = this.cliqueActiveSigners(header.number)
      for (const [i, cSigner] of checkpointSigners.entries()) {
        if (activeSigners[i]?.equals(cSigner) !== true) {
          throw EthereumJSErrorWithoutCode(
            `checkpoint signer not found in active signers list at index ${i}: ${cSigner}`,
          )
        }
      }
    }
  }

  async validateDifficulty(header: BlockHeader): Promise<void> {
    if (!this.blockchain) {
      throw EthereumJSErrorWithoutCode('blockchain not provided')
    }

    if (header.difficulty !== CLIQUE_DIFF_INTURN && header.difficulty !== CLIQUE_DIFF_NOTURN) {
      const msg = `difficulty for clique block must be INTURN (2) or NOTURN (1), received: ${header.difficulty}`
      throw EthereumJSErrorWithoutCode(`${msg} ${header.errorStr()}`)
    }

    const signers = this.cliqueActiveSigners(header.number)
    if (signers.length === 0) {
      // abort if signers are unavailable
      const msg = 'no signers available'
      throw EthereumJSErrorWithoutCode(`${msg} ${header.errorStr()}`)
    }
    const signerIndex = signers.findIndex((address: Address) =>
      address.equals(cliqueSigner(header)),
    )
    const inTurn = header.number % BigInt(signers.length) === BigInt(signerIndex)
    if (
      (inTurn && header.difficulty === CLIQUE_DIFF_INTURN) ||
      (!inTurn && header.difficulty === CLIQUE_DIFF_NOTURN)
    ) {
      return
    }
    throw EthereumJSErrorWithoutCode(`'invalid clique difficulty ${header.errorStr()}`)
  }

  async newBlock(block: Block, commonAncestor: BlockHeader | undefined): Promise<void> {
    // Clique: update signer votes and state
    const { header } = block
    const commonAncestorNumber = commonAncestor?.number
    if (commonAncestorNumber !== undefined) {
      await this._cliqueDeleteSnapshots(commonAncestorNumber + BIGINT_1)
      for (let number = commonAncestorNumber + BigInt(1); number <= header.number; number++) {
        const canonicalHeader = await this.blockchain!.getCanonicalHeader(number)
        await this._cliqueBuildSnapshots(canonicalHeader)
      }
    }
  }

  /**
   * Save genesis signers to db
   * @param genesisBlock genesis block
   * @hidden
   */
  private async cliqueSaveGenesisSigners(genesisBlock: Block) {
    const genesisSignerState: CliqueSignerState = [
      BIGINT_0,
      cliqueEpochTransitionSigners(genesisBlock.header),
    ]
    await this.cliqueUpdateSignerStates(genesisSignerState)
    this.DEBUG && debug(`[Block 0] Genesis block -> update signer states`)
    await this.cliqueUpdateVotes()
  }

  /**
   * Save signer state to db
   * @param signerState
   * @hidden
   */
  private async cliqueUpdateSignerStates(signerState?: CliqueSignerState) {
    if (signerState) {
      const blockNumber = signerState[0]
      const known = this._cliqueLatestSignerStates.find((value) => {
        if (value[0] === blockNumber) {
          return true
        }
      })
      if (known !== undefined) {
        return
      }
      this._cliqueLatestSignerStates.push(signerState)
      this._cliqueLatestSignerStates.sort((a, b) => (a[0] > b[0] ? 1 : -1))
    }

    // trim to CLIQUE_SIGNER_HISTORY_BLOCK_LIMIT
    const limit = this.CLIQUE_SIGNER_HISTORY_BLOCK_LIMIT
    const blockSigners = this._cliqueLatestBlockSigners
    const lastBlockNumber = blockSigners[blockSigners.length - 1]?.[0]
    if (lastBlockNumber) {
      const blockLimit = lastBlockNumber - BigInt(limit)
      const states = this._cliqueLatestSignerStates
      const lastItem = states[states.length - 1]
      this._cliqueLatestSignerStates = states.filter((state) => state[0] >= blockLimit)
      if (this._cliqueLatestSignerStates.length === 0) {
        // always keep at least one item on the stack
        this._cliqueLatestSignerStates.push(lastItem)
      }
    }

    // save to db
    const formatted = this._cliqueLatestSignerStates.map((state) => [
      bigIntToBytes(state[0]),
      state[1].map((a) => a.toBytes()),
    ])
    await this.blockchain!.db.put(CLIQUE_SIGNERS_KEY, RLP.encode(formatted))
    // Output active signers for debugging purposes
    if (signerState !== undefined) {
      let i = 0
      try {
        for (const signer of this.cliqueActiveSigners(signerState[0])) {
          this.DEBUG && debug(`Clique signer [${i}]: ${signer} (block: ${signerState[0]})`)
          i++
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }

  /**
   * Update clique votes and save to db
   * @param header BlockHeader
   * @hidden
   */
  private async cliqueUpdateVotes(header?: BlockHeader) {
    // Block contains a vote on a new signer
    if (header && !header.coinbase.isZero()) {
      const signer = cliqueSigner(header)
      const beneficiary = header.coinbase
      const nonce = header.nonce
      const latestVote: CliqueVote = [header.number, [signer, beneficiary, nonce]]

      // Do two rounds here, one to execute on a potential previously reached consensus
      // on the newly touched beneficiary, one with the added new vote
      for (let round = 1; round <= 2; round++) {
        // See if there is a new majority consensus to update the signer list
        const lastEpochBlockNumber =
          header.number -
          (header.number %
            BigInt((this.blockchain!.common.consensusConfig() as CliqueConfig).epoch))
        const limit = this.cliqueSignerLimit(header.number)
        let activeSigners = [...this.cliqueActiveSigners(header.number)]
        let consensus = false

        // AUTH vote analysis
        let votes = this._cliqueLatestVotes.filter((vote) => {
          return (
            vote[0] >= BigInt(lastEpochBlockNumber) &&
            !vote[1][0].equals(signer) &&
            vote[1][1].equals(beneficiary) &&
            equalsBytes(vote[1][2], CLIQUE_NONCE_AUTH)
          )
        })
        const beneficiaryVotesAUTH: Address[] = []
        for (const vote of votes) {
          const num = beneficiaryVotesAUTH.filter((voteCMP) => {
            return voteCMP.equals(vote[1][0])
          }).length
          if (num === 0) {
            beneficiaryVotesAUTH.push(vote[1][0])
          }
        }
        let numBeneficiaryVotesAUTH = beneficiaryVotesAUTH.length
        if (round === 2 && equalsBytes(nonce, CLIQUE_NONCE_AUTH)) {
          numBeneficiaryVotesAUTH += 1
        }
        // Majority consensus
        if (numBeneficiaryVotesAUTH >= limit) {
          consensus = true
          // Authorize new signer
          activeSigners.push(beneficiary)
          activeSigners.sort((a, b) => {
            // Sort by array size
            const result =
              toType(a.toString(), TypeOutput.BigInt) < toType(b.toString(), TypeOutput.BigInt)
            if (result) {
              return -1
            } else {
              return 1
            }
          })
          // Discard votes for added signer
          this._cliqueLatestVotes = this._cliqueLatestVotes.filter(
            (vote) => !vote[1][1].equals(beneficiary),
          )
          this.DEBUG &&
            debug(`[Block ${header.number}] Clique majority consensus (AUTH ${beneficiary})`)
        }
        // DROP vote
        votes = this._cliqueLatestVotes.filter((vote) => {
          return (
            vote[0] >= BigInt(lastEpochBlockNumber) &&
            !vote[1][0].equals(signer) &&
            vote[1][1].equals(beneficiary) &&
            equalsBytes(vote[1][2], CLIQUE_NONCE_DROP)
          )
        })
        const beneficiaryVotesDROP: Address[] = []
        for (const vote of votes) {
          const num = beneficiaryVotesDROP.filter((voteCMP) => {
            return voteCMP.equals(vote[1][0])
          }).length
          if (num === 0) {
            beneficiaryVotesDROP.push(vote[1][0])
          }
        }
        let numBeneficiaryVotesDROP = beneficiaryVotesDROP.length

        if (round === 2 && equalsBytes(nonce, CLIQUE_NONCE_DROP)) {
          numBeneficiaryVotesDROP += 1
        }
        // Majority consensus
        if (numBeneficiaryVotesDROP >= limit) {
          consensus = true
          // Drop signer
          activeSigners = activeSigners.filter((signer) => !signer.equals(beneficiary))
          this._cliqueLatestVotes = this._cliqueLatestVotes.filter(
            // Discard votes from removed signer and for removed signer
            (vote) => !vote[1][0].equals(beneficiary) && !vote[1][1].equals(beneficiary),
          )
          this.DEBUG &&
            debug(`[Block ${header.number}] Clique majority consensus (DROP ${beneficiary})`)
        }
        if (round === 1) {
          // Always add the latest vote to the history no matter if already voted
          // the same vote or not
          this._cliqueLatestVotes.push(latestVote)
          this.DEBUG &&
            debug(
              `[Block ${header.number}] New clique vote: ${signer} -> ${beneficiary} ${
                equalsBytes(nonce, CLIQUE_NONCE_AUTH) ? 'AUTH' : 'DROP'
              }`,
            )
        }
        if (consensus) {
          if (round === 1) {
            this.DEBUG &&
              debug(
                `[Block ${header.number}] Clique majority consensus on existing votes -> update signer states`,
              )
          } else {
            this.DEBUG &&
              debug(
                `[Block ${header.number}] Clique majority consensus on new vote -> update signer states`,
              )
          }
          const newSignerState: CliqueSignerState = [header.number, activeSigners]
          await this.cliqueUpdateSignerStates(newSignerState)
          return
        }
      }
    }

    // trim to lastEpochBlockNumber - CLIQUE_SIGNER_HISTORY_BLOCK_LIMIT
    const limit = this.CLIQUE_SIGNER_HISTORY_BLOCK_LIMIT
    const blockSigners = this._cliqueLatestBlockSigners
    const lastBlockNumber = blockSigners[blockSigners.length - 1]?.[0]
    if (lastBlockNumber) {
      const lastEpochBlockNumber =
        lastBlockNumber -
        (lastBlockNumber %
          BigInt((this.blockchain!.common.consensusConfig() as CliqueConfig).epoch))
      const blockLimit = lastEpochBlockNumber - BigInt(limit)
      this._cliqueLatestVotes = this._cliqueLatestVotes.filter((state) => state[0] >= blockLimit)
    }

    // save votes to db
    const formatted = this._cliqueLatestVotes.map((v) => [
      bigIntToBytes(v[0]),
      [v[1][0].toBytes(), v[1][1].toBytes(), v[1][2]],
    ])
    await this.blockchain!.db.put(CLIQUE_VOTES_KEY, RLP.encode(formatted))
  }

  /**
   * Returns a list with the current block signers
   */
  cliqueActiveSigners(blockNum: bigint): Address[] {
    const signers = this._cliqueLatestSignerStates
    if (signers.length === 0) {
      return []
    }
    for (let i = signers.length - 1; i >= 0; i--) {
      if (signers[i][0] < blockNum) {
        return signers[i][1]
      }
    }
    throw EthereumJSErrorWithoutCode(`Could not load signers for block ${blockNum}`)
  }

  /**
   * Number of consecutive blocks out of which a signer may only sign one.
   * Defined as `Math.floor(SIGNER_COUNT / 2) + 1` to enforce majority consensus.
   * signer count -> signer limit:
   *   1 -> 1, 2 -> 2, 3 -> 2, 4 -> 2, 5 -> 3, ...
   * @hidden
   */
  private cliqueSignerLimit(blockNum: bigint) {
    return Math.floor(this.cliqueActiveSigners(blockNum).length / 2) + 1
  }

  /**
   * Checks if signer was recently signed.
   * Returns true if signed too recently: more than once per {@link CliqueConsensus.cliqueSignerLimit} consecutive blocks.
   * @param header BlockHeader
   * @hidden
   */
  private cliqueCheckRecentlySigned(header: BlockHeader): boolean {
    if (header.isGenesis() || header.number === BigInt(1)) {
      // skip genesis, first block
      return false
    }
    const limit = this.cliqueSignerLimit(header.number)
    // construct recent block signers list with this block
    let signers = this._cliqueLatestBlockSigners
    signers = signers.slice(signers.length < limit ? 0 : 1)
    if (signers.length > 0 && signers[signers.length - 1][0] !== header.number - BigInt(1)) {
      // if the last signed block is not one minus the head we are trying to compare
      // we do not have a complete picture of the state to verify if too recently signed
      return false
    }
    signers.push([header.number, cliqueSigner(header)])
    const seen = signers.filter((s) => s[1].equals(cliqueSigner(header))).length
    return seen > 1
  }

  /**
   * Remove clique snapshots with blockNumber higher than input.
   * @param blockNumber - the block number from which we start deleting
   * @hidden
   */
  private async _cliqueDeleteSnapshots(blockNumber: bigint) {
    // remove blockNumber from clique snapshots
    // (latest signer states, latest votes, latest block signers)
    this._cliqueLatestSignerStates = this._cliqueLatestSignerStates.filter(
      (s) => s[0] <= blockNumber,
    )
    await this.cliqueUpdateSignerStates()

    this._cliqueLatestVotes = this._cliqueLatestVotes.filter((v) => v[0] <= blockNumber)
    await this.cliqueUpdateVotes()

    this._cliqueLatestBlockSigners = this._cliqueLatestBlockSigners.filter(
      (s) => s[0] <= blockNumber,
    )
    await this.cliqueUpdateLatestBlockSigners()
  }

  /**
   * Update snapshot of latest clique block signers.
   * Used for checking for 'recently signed' error.
   * Length trimmed to {@link Blockchain.cliqueSignerLimit}.
   * @param header BlockHeader
   * @hidden
   */
  private async cliqueUpdateLatestBlockSigners(header?: BlockHeader) {
    if (header) {
      if (header.isGenesis()) {
        return
      }
      // add this block's signer
      const signer: CliqueBlockSigner = [header.number, cliqueSigner(header)]
      this._cliqueLatestBlockSigners.push(signer)

      // trim length to `this.cliqueSignerLimit()`
      const length = this._cliqueLatestBlockSigners.length
      const limit = this.cliqueSignerLimit(header.number)
      if (length > limit) {
        this._cliqueLatestBlockSigners = this._cliqueLatestBlockSigners.slice(
          length - limit,
          length,
        )
      }
    }

    // save to db
    const formatted = this._cliqueLatestBlockSigners.map((b) => [
      bigIntToBytes(b[0]),
      b[1].toBytes(),
    ])
    await this.blockchain!.db.put(CLIQUE_BLOCK_SIGNERS_SNAPSHOT_KEY, RLP.encode(formatted))
  }

  /**
   * Fetches clique signers.
   * @hidden
   */
  private async getCliqueLatestSignerStates(): Promise<CliqueLatestSignerStates> {
    const signerStates = await this.blockchain!.db.get(CLIQUE_SIGNERS_KEY)
    if (signerStates === undefined) return []
    const states = RLP.decode(signerStates as Uint8Array) as [Uint8Array, Uint8Array[]]
    return states.map((state) => {
      const blockNum = bytesToBigInt(state[0] as Uint8Array)
      const addresses = (<any>state[1]).map((bytes: Uint8Array) => new Address(bytes))
      return [blockNum, addresses]
    }) as CliqueLatestSignerStates
  }

  /**
   * Fetches clique votes.
   * @hidden
   */
  private async getCliqueLatestVotes(): Promise<CliqueLatestVotes> {
    const signerVotes = await this.blockchain!.db.get(CLIQUE_VOTES_KEY)
    if (signerVotes === undefined) return []
    const votes = RLP.decode(signerVotes as Uint8Array) as [
      Uint8Array,
      [Uint8Array, Uint8Array, Uint8Array],
    ]
    return votes.map((vote) => {
      const blockNum = bytesToBigInt(vote[0] as Uint8Array)
      const signer = new Address((vote[1] as any)[0])
      const beneficiary = new Address((vote[1] as any)[1])
      const nonce = (vote[1] as any)[2]
      return [blockNum, [signer, beneficiary, nonce]]
    }) as CliqueLatestVotes
  }

  /**
   * Fetches snapshot of clique signers.
   * @hidden
   */
  private async getCliqueLatestBlockSigners(): Promise<CliqueLatestBlockSigners> {
    const blockSigners = await this.blockchain!.db.get(CLIQUE_BLOCK_SIGNERS_SNAPSHOT_KEY)
    if (blockSigners === undefined) return []
    const signers = RLP.decode(blockSigners as Uint8Array) as [Uint8Array, Uint8Array][]
    return signers.map((s) => {
      const blockNum = bytesToBigInt(s[0] as Uint8Array)
      const signer = new Address(s[1])
      return [blockNum, signer]
    }) as CliqueLatestBlockSigners
  }

  /**
   * Build clique snapshots.
   * @param header - the new block header
   * @hidden
   */
  private async _cliqueBuildSnapshots(header: BlockHeader) {
    if (!cliqueIsEpochTransition(header)) {
      await this.cliqueUpdateVotes(header)
    }
    await this.cliqueUpdateLatestBlockSigners(header)
  }

  /**
   * Helper to determine if a signer is in or out of turn for the next block.
   * @param signer The signer address
   */
  async cliqueSignerInTurn(signer: Address, blockNum: bigint): Promise<boolean> {
    const signers = this.cliqueActiveSigners(blockNum)
    const signerIndex = signers.findIndex((address) => address.equals(signer))
    if (signerIndex === -1) {
      throw EthereumJSErrorWithoutCode('Signer not found')
    }
    const { number } = await this.blockchain!.getCanonicalHeadHeader()
    //eslint-disable-next-line
    return (number + BigInt(1)) % BigInt(signers.length) === BigInt(signerIndex)
  }
}
