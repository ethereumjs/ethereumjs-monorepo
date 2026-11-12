import { Common } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  accountToBinaryAccount,
  bytesToHex,
  createAccount,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'
import { privateToAddress } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { ETH_NEW_POOLED, ETH_TX } from '../src/txpool/gossip.ts'
import { createEthyTxPool } from '../src/txpool/pool.ts'

describe('[Ethy/txpool]: WP-08b broadcast', () => {
  it('funded signed tx returns hash and gossips 0x02 and 0x08 once', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const common = new Common({ chain, hardfork })
    const pk = hexToBytes('0x0101010101010101010101010101010101010101010101010101010101010101')
    const sender = createAddressFromString(bytesToHex(privateToAddress(pk)))
    const sm = createFlatStateManager({ common })
    const accountHash = keccak_256(sender.bytes)
    sm.putSnapBinaryAccountsBatch([
      {
        accountHash,
        binaryAccount: accountToBinaryAccount(
          createAccount({ balance: 10_000_000_000_000_000_000n, nonce: 0n }),
        ),
        address: sender,
      },
    ])
    const sent: Array<{ code: number; peerId: string; payload: Uint8Array }> = []
    const pool = createEthyTxPool({
      stateManager: sm,
      chain,
      hardfork,
      chainId: 11155111n,
      getEthPeerIds: () => ['peer-a'],
      sendEth: (peerId, code, payload) => {
        sent.push({ code, peerId, payload })
      },
    })
    const tx = createLegacyTx(
      {
        nonce: 0n,
        gasPrice: 1_000_000_000n,
        gasLimit: 21_000n,
        to: '0x3333333333333333333333333333333333333333',
        value: 1n,
      },
      { common },
    ).sign(pk)
    const rawHex = bytesToHex(tx.serialize())
    const out = await pool.submitRawTransactionHex(rawHex)
    assert.isString((out as { result: string }).result)
    const codes = sent.map((s) => s.code)
    assert.include(codes, ETH_TX)
    assert.include(codes, ETH_NEW_POOLED)
    assert.equal(sent.length, 2)
    const again = await pool.submitRawTransactionHex(rawHex)
    assert.equal((again as { result: string }).result, (out as { result: string }).result)
    assert.equal(sent.length, 2)
    const rootBal = (await sm.getAccount(sender))?.balance ?? 0n
    assert.equal(rootBal, 10_000_000_000_000_000_000n)
  })

  it('underfunded and wrong chain id fail with -32000', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const common = new Common({ chain, hardfork })
    const pk = hexToBytes('0x0202020202020202020202020202020202020202020202020202020202020202')
    const sm = createFlatStateManager({ common })
    const pool = createEthyTxPool({
      stateManager: sm,
      chain,
      hardfork,
      chainId: 11155111n,
      getEthPeerIds: () => [],
      sendEth: () => {},
    })
    const tx = createLegacyTx(
      {
        nonce: 0n,
        gasPrice: 1_000_000_000n,
        gasLimit: 21_000n,
        to: '0x3333333333333333333333333333333333333333',
        value: 1n,
      },
      { common },
    ).sign(pk)
    const poor = await pool.submitRawTransactionHex(bytesToHex(tx.serialize()))
    assert.equal((poor as { error: { code: number } }).error.code, -32000)
    const mainnetCommon = new Common({ chain: chainConfigForNetwork('mainnet'), hardfork })
    const wrong = createLegacyTx(
      {
        nonce: 0n,
        gasPrice: 1_000_000_000n,
        gasLimit: 21_000n,
        to: '0x3333333333333333333333333333333333333333',
        value: 0n,
      },
      { common: mainnetCommon },
    ).sign(pk)
    const bad = await pool.submitRawTransactionHex(bytesToHex(wrong.serialize()))
    assert.oneOf((bad as { error: { code: number } }).error.code, [-32000, -32602])
  })
})
