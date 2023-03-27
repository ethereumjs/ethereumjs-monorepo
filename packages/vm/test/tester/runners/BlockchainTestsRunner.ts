import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { ConsensusAlgorithm } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Trie } from '@ethereumjs/trie'
import { TransactionFactory } from '@ethereumjs/tx'
import { bytesToBigInt, isHexPrefixed, stripHexPrefix, toBytes } from '@ethereumjs/util'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'
import { Level } from 'level'
import { MemoryLevel } from 'memory-level'

import { setupPreConditions, verifyPostConditions } from '../../util'

import type { EthashConsensus } from '@ethereumjs/blockchain'
import type { Common } from '@ethereumjs/common'
import type * as tape from 'tape'

function formatBlockHeader(data: any) {
  const formatted: any = {}
  for (const [key, value] of Object.entries(data) as [string, string][]) {
    formatted[key] = isHexPrefixed(value) ? value : BigInt(value)
  }
  return formatted
}

export async function runBlockchainTest(options: any, testData: any, t: tape.Test) {
  // ensure that the test data is the right fork data
  if (testData.network !== options.forkConfigTestSuite) {
    t.comment(`skipping test: no data available for ${options.forkConfigTestSuite}`)
    return
  }

  // fix for BlockchainTests/GeneralStateTests/stRandom/*
  testData.lastblockhash = stripHexPrefix(testData.lastblockhash)

  let cacheDB = new Level('./.cachedb')
  let state = new Trie({ useKeyHashing: true })
  let stateManager = new DefaultStateManager({
    trie: state,
  })

  let common = options.common.copy() as Common
  common.setHardforkByBlockNumber(0)

  let validatePow = false
  // Only run with block validation when sealEngine present in test file
  // and being set to Ethash PoW validation
  if (testData.sealEngine === 'Ethash') {
    if (common.consensusAlgorithm() !== ConsensusAlgorithm.Ethash) {
      t.skip('SealEngine setting is not matching chain consensus type, skip test.')
    }
    validatePow = true
  }

  // create and add genesis block
  const header = formatBlockHeader(testData.genesisBlockHeader)
  const withdrawals = common.isActivatedEIP(4895) ? [] : undefined
  const blockData = { header, withdrawals }
  const genesisBlock = Block.fromBlockData(blockData, { common })

  if (typeof testData.genesisRLP === 'string') {
    const rlp = toBytes(testData.genesisRLP)
    t.deepEquals(genesisBlock.serialize(), rlp, 'correct genesis RLP')
  }

  let blockchain = await Blockchain.create({
    db: new MemoryLevel(),
    common,
    validateBlocks: true,
    validateConsensus: validatePow,
    genesisBlock,
  })

  if (validatePow) {
    ;(blockchain.consensus as EthashConsensus)._ethash!.cacheDB = cacheDB as any
  }

  let VM
  if (options.dist === true) {
    ;({ VM } = require('../../../dist'))
  } else {
    ;({ VM } = require('../../../src'))
  }

  const begin = Date.now()

  let vm = await VM.create({
    stateManager,
    blockchain,
    common,
    hardforkByBlockNumber: true,
  })

  // set up pre-state
  await setupPreConditions(vm.evm.eei, testData)

  t.deepEquals(vm.stateManager._trie.root(), genesisBlock.header.stateRoot, 'correct pre stateRoot')

  async function handleError(error: string | undefined, expectException: string | boolean) {
    if (expectException !== false) {
      t.pass(`Expected exception ${expectException}`)
    } else {
      t.fail(error)
    }
  }

  let currentBlock = BigInt(0)
  for (const raw of testData.blocks) {
    const paramFork = `expectException${options.forkConfigTestSuite}`
    // Two naming conventions in ethereum/tests to indicate "exception occurs on all HFs" semantics
    // Last checked: ethereumjs-testing v1.3.1 (2020-05-11)
    const paramAll1 = 'expectExceptionALL'
    const paramAll2 = 'expectException'
    const expectException = (raw[paramFork] ??
      raw[paramAll1] ??
      raw[paramAll2] ??
      raw.blockHeader === undefined) as string | boolean

    // Here we decode the rlp to extract the block number
    // The block library cannot be used, as this throws on certain EIP1559 blocks when trying to convert
    try {
      const blockRlp = hexToBytes((raw.rlp as string).slice(2))
      const decodedRLP: any = RLP.decode(Uint8Array.from(blockRlp))
      currentBlock = bytesToBigInt(decodedRLP[0][8])
    } catch (e: any) {
      await handleError(e, expectException)
      continue
    }

    try {
      const blockRlp = hexToBytes((raw.rlp as string).slice(2))
      // Update common HF
      let TD: bigint | undefined = undefined
      let timestamp: bigint | undefined = undefined
      try {
        const decoded: any = RLP.decode(blockRlp)
        const parentHash = decoded[0][0]
        TD = await blockchain.getTotalDifficulty(parentHash)
        timestamp = bytesToBigInt(decoded[0][11])
        // eslint-disable-next-line no-empty
      } catch (e) {}

      common.setHardforkByBlockNumber(currentBlock, TD, timestamp)

      // transactionSequence is provided when txs are expected to be rejected.
      // To run this field we try to import them on the current state.
      if (raw.transactionSequence !== undefined) {
        const parentBlock = await vm.blockchain.getIteratorHead()
        const blockBuilder = await vm.buildBlock({
          parentBlock,
          blockOpts: { calcDifficultyFromHeader: parentBlock.header },
        })

        for (const txData of raw.transactionSequence as Record<
          'exception' | 'rawBytes' | 'valid',
          string
        >[]) {
          const shouldFail = txData.valid === 'false'
          try {
            const txRLP = hexToBytes(txData.rawBytes.slice(2))
            const tx = TransactionFactory.fromSerializedData(txRLP, { common })
            await blockBuilder.addTransaction(tx)
            if (shouldFail) {
              t.fail('tx should fail, but did not fail')
            }
          } catch (e: any) {
            if (!shouldFail) {
              t.fail(`tx should not fail, but failed: ${e.message}`)
            } else {
              t.pass('tx successfully failed')
            }
          }
        }
        await blockBuilder.revert() // will only revert if checkpointed
      }

      const block = Block.fromRLPSerializedBlock(blockRlp, { common })
      await blockchain.putBlock(block)

      // This is a trick to avoid generating the canonical genesis
      // state. Generating the genesis state is not needed because
      // blockchain tests come with their own `pre` world state.
      // TODO: Add option to `runBlockchain` not to generate genesis state.
      vm._common.genesis().stateRoot = vm.stateManager._trie.root()
      try {
        await blockchain.iterator('vm', async (block: Block) => {
          const parentBlock = await blockchain!.getBlock(block.header.parentHash)
          const parentState = parentBlock.header.stateRoot
          // run block, update head if valid
          try {
            await vm.runBlock({ block, root: parentState, hardforkByTTD: TD })
            // set as new head block
          } catch (error: any) {
            // remove invalid block
            await blockchain!.delBlock(block.header.hash())
            throw error
          }
        })
      } catch (e: any) {
        // if the test fails, then block.header is the prev because
        // vm.runBlock has a check that prevents the actual postState from being
        // imported if it is not equal to the expected postState. it is useful
        // for debugging to skip this, so that verifyPostConditions will compare
        // testData.postState to the actual postState, rather than to the preState.
        if (options.debug !== true) {
          // make sure the state is set before checking post conditions
          const headBlock = await vm.blockchain.getIteratorHead()
          vm.stateManager._trie.root(headBlock.header.stateRoot)
        } else {
          await verifyPostConditions(state, testData.postState, t)
        }

        throw e
      }

      await cacheDB.close()

      if (expectException !== false) {
        t.fail(`expected exception but test did not throw an exception: ${expectException}`)
        return
      }
    } catch (error: any) {
      // caught an error, reduce block number
      currentBlock--
      await handleError(error, expectException)
    }
  }
  t.equal(
    bytesToHex((blockchain as any)._headHeaderHash),
    testData.lastblockhash,
    'correct last header block'
  )

  const end = Date.now()
  const timeSpent = `${(end - begin) / 1000} secs`
  t.comment(`Time: ${timeSpent}`)
  await cacheDB.close()

  // @ts-ignore Explicitly delete objects for memory optimization (early GC)
  common = blockchain = state = stateManager = vm = cacheDB = null // eslint-disable-line
}
