import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, describe, it } from 'vitest'

import {
  createAccessList2930Tx,
  createBlob4844Tx,
  createEOACode7702Tx,
  createFeeMarket1559Tx,
  createLegacyTx,
  paramsTx,
} from '../src/index.ts'

import type { EOACode7702AuthorizationListItem, PrefixedHexString } from '@ethereumjs/util'
import type { AccessList } from '../src/index.ts'

// Tests for the `TransactionCache` behavior (see issue #3932): values should
// only be cached on frozen txs (a non-frozen tx can still change, so cached
// values could go stale), and cached JSON objects should themselves be frozen
// so they cannot be mutated behind the cache's back.

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.London,
  params: paramsTx,
})

const common7702 = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })

const common4844 = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Cancun,
  params: paramsTx,
  customCrypto: { kzg: new microEthKZG(trustedSetup) },
})

const pKey = hexToBytes('0x4646464646464646464646464646464646464646464646464646464646464646')

const to: PrefixedHexString = `0x${'11'.repeat(20)}`

const accessList: AccessList = [
  {
    address: `0x${'aa'.repeat(20)}`,
    storageKeys: [`0x${'01'.repeat(32)}`],
  },
]

const ones32: PrefixedHexString = `0x${'01'.repeat(32)}`
const authorizationListItem: EOACode7702AuthorizationListItem = {
  chainId: '0x',
  address: `0x${'20'.repeat(20)}`,
  nonce: '0x1',
  yParity: '0x1',
  r: ones32,
  s: ones32,
}

describe('TransactionCache', () => {
  describe('hash / senderPubKey / dataFee', () => {
    it('should cache on a frozen tx and return the cached value on repeated calls', () => {
      const tx = createLegacyTx({ data: '0x010200' }, { common }).sign(pKey)
      assert.isTrue(Object.isFrozen(tx))

      assert.isUndefined(tx.cache.hash)
      const hash1 = tx.hash()
      assert.strictEqual(tx.cache.hash, hash1, 'hash should be cached')
      assert.strictEqual(tx.hash(), hash1, 'repeated call should return the cached object')

      assert.isUndefined(tx.cache.senderPubKey)
      const pubKey1 = tx.getSenderPublicKey()
      assert.strictEqual(tx.cache.senderPubKey, pubKey1, 'senderPubKey should be cached')
      assert.strictEqual(
        tx.getSenderPublicKey(),
        pubKey1,
        'repeated call should return the cached object',
      )

      // Note: use strictEqual (not isUndefined) here so the type of
      // `tx.cache.dataFee` is not narrowed to `undefined` for the property
      // access below (which getDataGas() populates but the compiler can't see).
      assert.strictEqual(tx.cache.dataFee, undefined)
      const dataFee1 = tx.getDataGas()
      assert.strictEqual(tx.cache.dataFee?.value, dataFee1, 'dataFee should be cached')
      assert.strictEqual(tx.getDataGas(), dataFee1)
    })

    it('should not cache on a non-frozen tx', () => {
      const tx = createLegacyTx({ data: '0x010200' }, { common, freeze: false }).sign(pKey)
      assert.isFalse(Object.isFrozen(tx))

      const hash1 = tx.hash()
      const hash2 = tx.hash()
      assert.isUndefined(tx.cache.hash, 'hash should not be cached')
      assert.notStrictEqual(hash1, hash2, 'each call should compute a fresh object')
      assert.deepEqual(hash1, hash2)

      tx.getSenderPublicKey()
      assert.isUndefined(tx.cache.senderPubKey, 'senderPubKey should not be cached')

      tx.getDataGas()
      assert.isUndefined(tx.cache.dataFee, 'dataFee should not be cached')
    })

    it('should recompute values on a non-frozen tx when the tx data changes', () => {
      // This is the reason non-frozen txs must not cache: their contents can
      // still change, which would turn a cached value stale.
      const tx = createLegacyTx({ data: '0x00' }, { common, freeze: false })

      const zeroByteCost = tx.common.param('txDataZeroGas')
      const nonZeroByteCost = tx.common.param('txDataNonZeroGas')
      assert.strictEqual(tx.getDataGas(), zeroByteCost)

      tx.data[0] = 0x01
      assert.strictEqual(
        tx.getDataGas(),
        nonZeroByteCost,
        'dataFee should be recomputed after the data changed',
      )
    })
  })

  describe('accessListJSON', () => {
    // All four tx types whose toJSON() includes the access list
    const txTypes = [
      {
        name: 'AccessList2930Tx',
        create: (freeze: boolean) => createAccessList2930Tx({ accessList }, { common, freeze }),
      },
      {
        name: 'FeeMarket1559Tx',
        create: (freeze: boolean) => createFeeMarket1559Tx({ accessList }, { common, freeze }),
      },
      {
        name: 'Blob4844Tx',
        create: (freeze: boolean) =>
          createBlob4844Tx(
            { accessList, to, blobVersionedHashes: [`0x01${'00'.repeat(31)}`] },
            { common: common4844, freeze },
          ),
      },
      {
        name: 'EOACode7702Tx',
        create: (freeze: boolean) =>
          createEOACode7702Tx(
            { accessList, authorizationList: [authorizationListItem], to },
            { common: common7702, freeze },
          ),
      },
    ]

    for (const txType of txTypes) {
      it(`${txType.name}: should cache and freeze the JSON on a frozen tx`, () => {
        const tx = txType.create(true)

        assert.isUndefined(tx.cache.accessListJSON)
        const json1 = tx.toJSON().accessList!
        assert.deepEqual(json1, accessList)
        assert.strictEqual(tx.cache.accessListJSON, json1, 'accessListJSON should be cached')

        const json2 = tx.toJSON().accessList!
        assert.strictEqual(json2, json1, 'repeated call should return the cached object')

        assert.isTrue(Object.isFrozen(json1), 'the cached list should be frozen')
        assert.isTrue(Object.isFrozen(json1[0]), 'the cached list items should be frozen')
        assert.isTrue(
          Object.isFrozen(json1[0].storageKeys),
          'the cached storage keys should be frozen',
        )
        assert.throws(() => {
          json1[0].storageKeys.push(ones32)
        })
      })

      it(`${txType.name}: should return a fresh mutable copy on a non-frozen tx`, () => {
        const tx = txType.create(false)

        const json1 = tx.toJSON().accessList!
        const json2 = tx.toJSON().accessList!
        assert.isUndefined(tx.cache.accessListJSON, 'accessListJSON should not be cached')
        assert.notStrictEqual(json1, json2, 'each call should compute a fresh object')
        assert.deepEqual(json1, json2)

        assert.isFalse(Object.isFrozen(json1))
        json1[0].storageKeys.push(ones32)
        assert.deepEqual(
          tx.toJSON().accessList,
          accessList,
          'mutating a returned copy should not affect subsequent calls',
        )
      })
    }
  })

  describe('authorityListJSON', () => {
    it('EOACode7702Tx: should cache and freeze the JSON on a frozen tx', () => {
      const tx = createEOACode7702Tx(
        { authorizationList: [authorizationListItem], to },
        { common: common7702 },
      )

      assert.isUndefined(tx.cache.authorityListJSON)
      const json1 = tx.toJSON().authorizationList!
      assert.strictEqual(tx.cache.authorityListJSON, json1, 'authorityListJSON should be cached')

      const json2 = tx.toJSON().authorizationList!
      assert.strictEqual(json2, json1, 'repeated call should return the cached object')

      assert.isTrue(Object.isFrozen(json1), 'the cached list should be frozen')
      assert.isTrue(Object.isFrozen(json1[0]), 'the cached list items should be frozen')
      assert.throws(() => {
        json1.push(authorizationListItem)
      })
    })

    it('EOACode7702Tx: should return a fresh mutable copy on a non-frozen tx', () => {
      const tx = createEOACode7702Tx(
        { authorizationList: [authorizationListItem], to },
        { common: common7702, freeze: false },
      )

      const json1 = tx.toJSON().authorizationList!
      const json2 = tx.toJSON().authorizationList!
      assert.isUndefined(tx.cache.authorityListJSON, 'authorityListJSON should not be cached')
      assert.notStrictEqual(json1, json2, 'each call should compute a fresh object')
      assert.deepEqual(json1, json2)

      assert.isFalse(Object.isFrozen(json1))
      const original = tx.toJSON().authorizationList!
      json1.push(authorizationListItem)
      json2[0].nonce = '0x999'
      assert.deepEqual(
        tx.toJSON().authorizationList,
        original,
        'mutating a returned copy should not affect subsequent calls',
      )
    })
  })
})
