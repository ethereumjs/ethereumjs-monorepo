import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex, bytesToPrefixedHexString, randomBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { normalizeTxParams } from '../src/fromRpc.js'
import { TransactionFactory, TransactionType } from '../src/index.js'

import optimismTx from './json/optimismTx.json'
import rpcTx from './json/rpcTx.json'
import v0Tx from './json/v0tx.json'

const txTypes = [
  TransactionType.Legacy,
  TransactionType.AccessListEIP2930,
  TransactionType.FeeMarketEIP1559,
]

describe('[fromJsonRpcProvider]', () => {
  it('should work', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const provider = 'https://my.json.rpc.provider.com:8545'

    const realFetch = global.fetch
    //@ts-expect-error -- Typescript doesn't like us to replace global values
    global.fetch = async (_url: string, req: any) => {
      const json = JSON.parse(req.body)
      if (json.params[0] === '0xed1960aa7d0d7b567c946d94331dddb37a1c67f51f30bf51f256ea40db88cfb0') {
        const txData = await import(`./json/rpcTx.json`)
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

    const txHash = '0xed1960aa7d0d7b567c946d94331dddb37a1c67f51f30bf51f256ea40db88cfb0'
    const tx = await TransactionFactory.fromJsonRpcProvider(provider, txHash, { common })
    assert.equal(
      bytesToPrefixedHexString(tx.hash()),
      txHash,
      'generated correct tx from transaction RPC data'
    )
    try {
      await TransactionFactory.fromJsonRpcProvider(
        provider,
        bytesToPrefixedHexString(randomBytes(32)),
        {}
      )
      assert.fail('should throw')
    } catch (err: any) {
      assert.ok(
        err.message.includes('No data returned from provider'),
        'throws correct error when no tx returned'
      )
    }
    global.fetch = realFetch
  })
})

describe('[normalizeTxParams]', () => {
  it('should work', () => {
    const normedTx = normalizeTxParams(rpcTx)
    const tx = TransactionFactory.fromTxData(normedTx)
    assert.equal(normedTx.gasLimit, 21000n, 'correctly converted "gas" to "gasLimit"')
    assert.equal(
      bytesToHex(tx.hash()),
      rpcTx.hash.slice(2),
      'converted normed tx data to transaction objec'
    )
  })
})

describe('fromRPC: interpret v/r/s vals of 0x0 as undefined for Optimism system txs', () => {
  it('should work', async () => {
    for (const txType of txTypes) {
      ;(optimismTx as any).type = txType
      const tx = await TransactionFactory.fromRPC(optimismTx)
      assert.ok(tx.v === undefined)
      assert.ok(tx.s === undefined)
      assert.ok(tx.r === undefined)
    }
  })
})

// This test ensures that "normal" txs of non-legacy type are correctly decoded if the
// `v` value is 0. This is the case in ~50% of the EIP2930 and EIP1559 txs
// The `v` value is either 0 or 1 there.
describe('fromRPC: ensure `v="0x0"` is correctly decoded for signed txs', () => {
  it('should work', async () => {
    for (const txType of txTypes) {
      if (txType === TransactionType.Legacy) {
        // legacy tx cannot have v=0
        continue
      }
      ;(v0Tx as any).type = txType
      const tx = await TransactionFactory.fromRPC(v0Tx)
      assert.ok(tx.isSigned())
    }
  })
})
