import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, equalsBytes, hexToBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  createBlockFromJSONRPCProvider,
  createBlockFromRPC,
  createBlockHeaderFromRPC,
} from '../src/index.ts'

import { goerliChainConfig } from '@ethereumjs/testdata'
import { alchemy14151203Data } from './testdata/alchemy14151203.ts'
import { infuraGoerliBlock10536893Data } from './testdata/infura-goerli-block-10536893.ts'
import { infura2000004withTransactionsData } from './testdata/infura2000004withTransactions.ts'
import { infura2000004withoutTransactionsData } from './testdata/infura2000004withoutTransactions.ts'
import { infura15571241Data } from './testdata/infura15571241.ts'
import { infura15571241withTransactionsData } from './testdata/infura15571241withTransactions.ts'
import { testdataFromRPCDifficultyAsIntegerData } from './testdata/testdata-from-rpc-difficulty-as-integer.ts'
import { testdataFromRPCGoerliLondonData } from './testdata/testdata-from-rpc-goerli-london.ts'
import { testdataFromRPCWithUnclesData } from './testdata/testdata-from-rpc-with-uncles.ts'
import { testdataFromRPCWithUnclesUncleBlockData } from './testdata/testdata-from-rpc-with-uncles_uncle-block-data.ts'
import { testdataFromRPCWithWithdrawalsData } from './testdata/testdata-from-rpc-with-withdrawals.ts'
import { testdataFromRPCData } from './testdata/testdata-from-rpc.ts'

import type { JSONRPCTx, LegacyTx } from '@ethereumjs/tx'
import type { JSONRPCBlock } from '../src/index.ts'

describe('[fromRPC]: block #2924874', () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })

  it('should create a block with transactions with valid signatures', () => {
    const block = createBlockFromRPC(testdataFromRPCData, [], { common })
    const allValid = block.transactions.every((tx) => tx.verifySignature())
    assert.strictEqual(allValid, true, 'all transaction signatures are valid')
  })

  it('should create a block header with the correct hash', () => {
    const block = createBlockHeaderFromRPC(testdataFromRPCData, { common })
    const hash = hexToBytes(testdataFromRPCData.hash)
    assert.isTrue(equalsBytes(block.hash(), hash))
  })
})

describe('[fromRPC]:', () => {
  it('Should create a block with JSON data that includes a transaction with value parameter as integer string', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const valueAsIntegerString = '1'
    const blockDataTransactionValueAsInteger = testdataFromRPCData
    ;(blockDataTransactionValueAsInteger.transactions[0] as JSONRPCTx).value = valueAsIntegerString
    const createBlockFromTransactionValueAsInteger = createBlockFromRPC(
      blockDataTransactionValueAsInteger as JSONRPCBlock,
      undefined,
      { common },
    )
    assert.strictEqual(
      createBlockFromTransactionValueAsInteger.transactions[0].value.toString(),
      valueAsIntegerString,
    )
  })

  it('Should create a block with JSON data that includes a transaction with defaults with gasPrice parameter as integer string', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const gasPriceAsIntegerString = '1'
    const blockDataTransactionGasPriceAsInteger = testdataFromRPCData
    ;(blockDataTransactionGasPriceAsInteger.transactions[0] as JSONRPCTx).gasPrice =
      gasPriceAsIntegerString
    const createBlockFromTransactionGasPriceAsInteger = createBlockFromRPC(
      blockDataTransactionGasPriceAsInteger as JSONRPCBlock,
      undefined,
      { common },
    )
    assert.strictEqual(
      (createBlockFromTransactionGasPriceAsInteger.transactions[0] as LegacyTx).gasPrice.toString(),
      gasPriceAsIntegerString,
    )
  })

  it('should create a block given JSON data that includes a difficulty parameter of type integer string', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const blockDifficultyAsInteger = createBlockFromRPC(
      testdataFromRPCDifficultyAsIntegerData as JSONRPCBlock,
      undefined,
      {
        common,
      },
    )
    assert.strictEqual(
      blockDifficultyAsInteger.header.difficulty.toString(),
      testdataFromRPCDifficultyAsIntegerData.difficulty,
    )
  })

  it('should create a block from london hardfork', () => {
    const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.London })
    const block = createBlockFromRPC(testdataFromRPCGoerliLondonData, [], { common })
    assert.strictEqual(
      `0x${block.header.baseFeePerGas?.toString(16)}`,
      testdataFromRPCGoerliLondonData.baseFeePerGas,
    )
    assert.strictEqual(bytesToHex(block.hash()), testdataFromRPCGoerliLondonData.hash)
  })

  it('should create a block with uncles', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul })
    const block = createBlockFromRPC(
      testdataFromRPCWithUnclesData,
      [testdataFromRPCWithUnclesUncleBlockData],
      {
        common,
      },
    )
    assert.isTrue(block.uncleHashIsValid())
  })

  it('should create a block with EIP-4896 withdrawals', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
    const block = createBlockFromRPC(testdataFromRPCWithWithdrawalsData, [], { common })
    assert.isTrue(await block.withdrawalsTrieIsValid())
  })

  it('should create a block header with the correct hash when EIP-4896 withdrawals are present', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
    const block = createBlockHeaderFromRPC(testdataFromRPCWithWithdrawalsData, { common })
    const hash = testdataFromRPCWithWithdrawalsData.hash
    assert.strictEqual(bytesToHex(block.hash()), hash)
  })
})

describe('[fromRPC] - Alchemy/Infura API block responses', () => {
  it('should create pre merge block from Alchemy API response to eth_getBlockByHash', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const block = createBlockFromRPC(alchemy14151203Data, [], { common })
    assert.strictEqual(bytesToHex(block.hash()), alchemy14151203Data.hash)
  })

  it('should create pre and post merge blocks from Infura API responses to eth_getBlockByHash and eth_getBlockByNumber', () => {
    const common = new Common({ chain: Mainnet })
    let block = createBlockFromRPC(infura2000004withoutTransactionsData, [], {
      common,
      setHardfork: true,
    })
    assert.strictEqual(
      bytesToHex(block.hash()),
      infura2000004withoutTransactionsData.hash,
      'created premerge block w/o txns',
    )
    block = createBlockFromRPC(infura2000004withTransactionsData, [], { common, setHardfork: true })
    assert.strictEqual(
      bytesToHex(block.hash()),
      infura2000004withTransactionsData.hash,
      'created premerge block with txns',
    )
    block = createBlockFromRPC(infura15571241Data, [], {
      common,
      setHardfork: true,
    })
    assert.strictEqual(
      bytesToHex(block.hash()),
      infura15571241Data.hash,
      'created post merge block without txns',
    )

    block = createBlockFromRPC(infura15571241withTransactionsData, [], {
      common,
      setHardfork: true,
    })
    assert.strictEqual(
      bytesToHex(block.hash()),
      infura15571241withTransactionsData.hash,
      'created post merge block with txns',
    )
  })

  it('should correctly parse a cancun block over rpc', () => {
    const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Cancun })
    const block = createBlockHeaderFromRPC(infuraGoerliBlock10536893Data, { common }) // cspell:disable-line
    const hash = hexToBytes(infuraGoerliBlock10536893Data.hash)
    assert.isTrue(equalsBytes(block.hash(), hash))
  })
})

describe('[fromJSONRPCProvider]', () => {
  it('should work', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const provider = 'https://my.json.rpc.provider.com:8545'

    const realFetch = fetch
    //@ts-expect-error -- Typescript doesn't like us to replace global values
    fetch = async (_url: string, req: any) => {
      const json = JSON.parse(req.body)
      if (json.params[0] === '0x1850b014065b23d804ecf71a8a4691d076ca87c2e6fb8fe81ee20a4d8e884c24') {
        const { infura15571241withTransactionsData: txData } = await import(
          `./testdata/infura15571241withTransactions.js` // cspell:disable-line
        )
        return {
          ok: true,
          status: 200,
          json: () => {
            return {
              result: txData,
            }
          },
        }
      } else {
        return {
          ok: true,
          status: 200,
          json: () => {
            return {
              result: null, // This is the value Infura returns if no transaction is found matching the provided hash
            }
          },
        }
      }
    }

    const blockHash = '0x1850b014065b23d804ecf71a8a4691d076ca87c2e6fb8fe81ee20a4d8e884c24'
    const block = await createBlockFromJSONRPCProvider(provider, blockHash, { common })
    assert.strictEqual(
      bytesToHex(block.hash()),
      blockHash,
      'assembled a block from blockdata from a provider',
    )
    try {
      await createBlockFromJSONRPCProvider(provider, bytesToHex(randomBytes(32)), {})
      assert.fail('should throw')
    } catch (err: any) {
      assert.isTrue(
        err.message.includes('No block data returned from provider'),
        'returned correct error message',
      )
    }
    //@ts-expect-error -- Typescript doesn't like us to replace global values
    fetch = realFetch
  })
})
