import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToPrefixedHexString, hexStringToBytes, randomBytes } from '@ethereumjs/util'
import { bytesToHex, equalsBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { blockFromRpc } from '../src/from-rpc'
import { blockHeaderFromRpc } from '../src/header-from-rpc'
import { Block } from '../src/index'

import * as alchemy14151203 from './testdata/alchemy14151203.json'
import * as infura15571241woTxs from './testdata/infura15571241.json'
import * as infura15571241wTxs from './testdata/infura15571241wtxns.json'
import * as infura2000004woTxs from './testdata/infura2000004wotxns.json'
import * as infura2000004wTxs from './testdata/infura2000004wtxs.json'
import * as blockDataDifficultyAsInteger from './testdata/testdata-from-rpc-difficulty-as-integer.json'
import * as testDataFromRpcGoerliLondon from './testdata/testdata-from-rpc-goerli-london.json'
import * as blockDataWithUncles from './testdata/testdata-from-rpc-with-uncles.json'
import * as uncleBlockData from './testdata/testdata-from-rpc-with-uncles_uncle-block-data.json'
import * as blockDataWithWithdrawals from './testdata/testdata-from-rpc-with-withdrawals.json'
import * as blockData from './testdata/testdata-from-rpc.json'

import type { Transaction } from '@ethereumjs/tx'

tape('[fromRPC]: block #2924874', function (t) {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

  t.test('should create a block with transactions with valid signatures', function (st) {
    const block = blockFromRpc(blockData, [], { common })
    const allValid = block.transactions.every((tx) => tx.verifySignature())
    st.equal(allValid, true, 'all transaction signatures are valid')
    st.end()
  })

  t.test('should create a block header with the correct hash', function (st) {
    const block = blockHeaderFromRpc(blockData, { common })
    const hash = hexStringToBytes(blockData.hash)
    st.ok(equalsBytes(block.hash(), hash))
    st.end()
  })
})

tape('[fromRPC]:', function (t) {
  t.test(
    'Should create a block with json data that includes a transaction with value parameter as integer string',
    function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
      const valueAsIntegerString = '1'
      const blockDataTransactionValueAsInteger = blockData
      blockDataTransactionValueAsInteger.transactions[0].value = valueAsIntegerString
      const blockFromTransactionValueAsInteger = blockFromRpc(
        blockDataTransactionValueAsInteger,
        undefined,
        { common }
      )
      st.equal(
        blockFromTransactionValueAsInteger.transactions[0].value.toString(),
        valueAsIntegerString
      )

      st.end()
    }
  )

  t.test(
    'Should create a block with json data that includes a transaction with defaults with gasPrice parameter as integer string',
    function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
      const gasPriceAsIntegerString = '1'
      const blockDataTransactionGasPriceAsInteger = blockData
      blockDataTransactionGasPriceAsInteger.transactions[0].gasPrice = gasPriceAsIntegerString
      const blockFromTransactionGasPriceAsInteger = blockFromRpc(
        blockDataTransactionGasPriceAsInteger,
        undefined,
        { common }
      )
      st.equal(
        (blockFromTransactionGasPriceAsInteger.transactions[0] as Transaction).gasPrice.toString(),
        gasPriceAsIntegerString
      )

      st.end()
    }
  )

  t.test(
    'should create a block given json data that includes a difficulty parameter of type integer string',
    function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
      const blockDifficultyAsInteger = blockFromRpc(blockDataDifficultyAsInteger, undefined, {
        common,
      })
      st.equal(
        blockDifficultyAsInteger.header.difficulty.toString(),
        blockDataDifficultyAsInteger.difficulty
      )
      st.end()
    }
  )

  t.test('should create a block from london hardfork', function (st) {
    const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.London })
    const block = blockFromRpc(testDataFromRpcGoerliLondon, [], { common })
    st.equal(
      `0x${block.header.baseFeePerGas?.toString(16)}`,
      testDataFromRpcGoerliLondon.baseFeePerGas
    )
    st.equal(bytesToPrefixedHexString(block.hash()), testDataFromRpcGoerliLondon.hash)
    st.end()
  })

  t.test('should create a block with uncles', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const block = blockFromRpc(blockDataWithUncles, [uncleBlockData], { common })
    st.ok(block.validateUnclesHash())
    st.end()
  })

  t.test('should create a block with EIP-4896 withdrawals', function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
    const block = blockFromRpc(blockDataWithWithdrawals, [], { common })
    st.ok(block.validateWithdrawalsTrie())
    st.end()
  })

  t.test(
    'should create a block header with the correct hash when EIP-4896 withdrawals are present',
    function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
      const block = blockHeaderFromRpc(blockDataWithWithdrawals, { common })
      const hash = blockDataWithWithdrawals.hash.slice(2)
      st.equal(bytesToHex(block.hash()), hash)
      st.end()
    }
  )
})

tape('[fromRPC] - Alchemy/Infura API block responses', (t) => {
  t.test('should create pre merge block from Alchemy API response to eth_getBlockByHash', (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const block = blockFromRpc(alchemy14151203, [], { common })
    st.equal(bytesToPrefixedHexString(block.hash()), alchemy14151203.hash)
    st.end()
  })

  t.test(
    'should create pre and post merge blocks from Infura API responses to eth_getBlockByHash and eth_getBlockByNumber',
    (st) => {
      const common = new Common({ chain: Chain.Mainnet })
      let block = blockFromRpc(infura2000004woTxs, [], { common, hardforkByBlockNumber: true })
      st.equal(
        bytesToPrefixedHexString(block.hash()),
        infura2000004woTxs.hash,
        'created premerge block w/o txns'
      )
      block = blockFromRpc(infura2000004wTxs, [], { common, hardforkByBlockNumber: true })
      st.equal(
        bytesToPrefixedHexString(block.hash()),
        infura2000004wTxs.hash,
        'created premerge block with txns'
      )
      block = blockFromRpc(infura15571241woTxs, [], {
        common,
        hardforkByTTD: 58750000000000000000000n,
      })
      st.equal(
        bytesToPrefixedHexString(block.hash()),
        infura15571241woTxs.hash,
        'created post merge block without txns'
      )

      block = blockFromRpc(infura15571241wTxs, [], {
        common,
        hardforkByTTD: 58750000000000000000000n,
      })
      st.equal(
        bytesToPrefixedHexString(block.hash()),
        infura15571241wTxs.hash,
        'created post merge block with txns'
      )

      st.end()
    }
  )
  t.end()
})

tape('[fromJsonRpcProvider]', async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
  const provider = 'https://my.json.rpc.provider.com:8545'

  const realFetch = global.fetch
  //@ts-expect-error -- Typescript doesn't like us to replace global values
  global.fetch = async (_url: string, req: any) => {
    const json = JSON.parse(req.body)
    if (json.params[0] === '0x1850b014065b23d804ecf71a8a4691d076ca87c2e6fb8fe81ee20a4d8e884c24') {
      const txData = await import(`./testdata/infura15571241wtxns.json`)
      return {
        json: () => {
          return {
            result: txData,
          }
        },
      }
    } else {
      return {
        json: () => {
          return {
            result: null, // This is the value Infura returns if no transaction is found matching the provided hash
          }
        },
      }
    }
  }

  const blockHash = '0x1850b014065b23d804ecf71a8a4691d076ca87c2e6fb8fe81ee20a4d8e884c24'
  const block = await Block.fromJsonRpcProvider(provider, blockHash, { common })
  t.equal(
    bytesToPrefixedHexString(block.hash()),
    blockHash,
    'assembled a block from blockdata from a provider'
  )
  try {
    await Block.fromJsonRpcProvider(provider, bytesToPrefixedHexString(randomBytes(32)), {})
    t.fail('should throw')
  } catch (err: any) {
    t.ok(
      err.message.includes('No block data returned from provider'),
      'returned correct error message'
    )
  }
  global.fetch = realFetch
  t.end()
})
