import tape from 'tape'
import Common from '@ethereumjs/common'
import { Transaction, AccessListEIP2930Transaction, FeeMarketEIP1559Transaction } from '../src'
import { TxsJsonEntry } from './types'
import { BaseTransaction } from '../src/baseTransaction'
import { privateToPublic, BN, toBuffer } from 'ethereumjs-util'

tape('[BaseTransaction]', function (t) {
  // EIP-2930 is not enabled in Common by default (2021-03-06)
  const common = new Common({ chain: 'mainnet', hardfork: 'london' })

  const legacyFixtures: TxsJsonEntry[] = require('./json/txs.json')
  const legacyTxs: BaseTransaction<Transaction>[] = []
  legacyFixtures.slice(0, 4).forEach(function (tx: TxsJsonEntry) {
    legacyTxs.push(Transaction.fromTxData(tx.data, { common }))
  })

  const eip2930Fixtures = require('./json/eip2930txs.json')
  const eip2930Txs: BaseTransaction<AccessListEIP2930Transaction>[] = []
  eip2930Fixtures.forEach(function (tx: any) {
    eip2930Txs.push(AccessListEIP2930Transaction.fromTxData(tx.data, { common }))
  })

  const eip1559Fixtures = require('./json/eip1559txs.json')
  const eip1559Txs: BaseTransaction<FeeMarketEIP1559Transaction>[] = []
  eip1559Fixtures.forEach(function (tx: any) {
    eip1559Txs.push(FeeMarketEIP1559Transaction.fromTxData(tx.data, { common }))
  })

  const zero = Buffer.alloc(0)
  const txTypes = [
    {
      class: Transaction,
      name: 'Transaction',
      values: Array(6).fill(zero),
      txs: legacyTxs,
      fixtures: legacyFixtures,
    },
    {
      class: AccessListEIP2930Transaction,
      name: 'AccessListEIP2930Transaction',
      values: [Buffer.from([1])].concat(Array(7).fill(zero)),
      txs: eip2930Txs,
      fixtures: eip2930Fixtures,
    },
    {
      class: FeeMarketEIP1559Transaction,
      name: 'FeeMarketEIP1559Transaction',
      values: [Buffer.from([1])].concat(Array(8).fill(zero)),
      txs: eip1559Txs,
      fixtures: eip1559Fixtures,
    },
  ]

  t.test('Initialization', function (st) {
    for (const txType of txTypes) {
      let tx = txType.class.fromTxData({}, { common })
      st.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`
      )
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      const initCommon = new Common({
        chain: 'mainnet',
        hardfork: 'london',
      })
      tx = txType.class.fromTxData({}, { common: initCommon })
      st.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should initialize with correct HF provided`
      )

      initCommon.setHardfork('byzantium')
      st.equal(
        tx.common.hardfork(),
        'london',
        `${txType.name}: should stay on correct HF if outer common HF changes`
      )

      tx = txType.class.fromTxData({}, { common, freeze: false })
      tx = txType.class.fromTxData({}, { common, freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      // Perform the same test as above, but now using a different construction method. This also implies that passing on the
      // options object works as expected.
      tx = txType.class.fromTxData({}, { common, freeze: false })
      const rlpData = tx.serialize()

      tx = txType.class.fromSerializedTx(rlpData, { common })
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromSerializedTx(rlpData, { common, freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )

      tx = txType.class.fromValuesArray(txType.values as any, { common })
      st.ok(Object.isFrozen(tx), `${txType.name}: tx should be frozen by default`)

      tx = txType.class.fromValuesArray(txType.values as any, { common, freeze: false })
      st.ok(
        !Object.isFrozen(tx),
        `${txType.name}: tx should not be frozen when freeze deactivated in options`
      )
    }
    st.end()
  })

  t.test('serialize()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any) {
        st.ok(
          txType.class.fromSerializedTx(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`
        )
        st.ok(
          txType.class.fromSerializedTx(tx.serialize(), { common }),
          `${txType.name}: should do roundtrip serialize() -> fromSerializedTx()`
        )
      })
    }
    st.end()
  })

  t.test('raw()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any) {
        st.ok(
          txType.class.fromValuesArray(tx.raw(), { common }),
          `${txType.name}: should do roundtrip raw() -> fromValuesArray()`
        )
      })
    }
    st.end()
  })

  t.test('verifySignature()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any) {
        st.equals(tx.verifySignature(), true, `${txType.name}: signature should be valid`)
      })
    }
    st.end()
  })

  t.test('verifySignature() -> invalid', function (st) {
    for (const txType of txTypes) {
      txType.fixtures.slice(0, 4).forEach(function (txFixture: any) {
        // set `s` to zero
        txFixture.data.s = `0x` + '0'.repeat(16)
        const tx = txType.class.fromTxData(txFixture.data, { common })
        st.equals(tx.verifySignature(), false, `${txType.name}: signature should not be valid`)
        st.ok(
          (<string[]>tx.validate(true)).includes('Invalid Signature'),
          `${txType.name}: should return an error string about not verifying signatures`
        )
        st.notOk(tx.validate(), `${txType.name}: should not validate correctly`)
      })
    }
    st.end()
  })

  t.test('sign()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey) {
          st.ok(tx.sign(Buffer.from(privateKey, 'hex')), `${txType.name}: should sign tx`)
        }

        st.throws(
          () => tx.sign(Buffer.from('invalid')),
          `${txType.name}: should fail with invalid PK`
        )
      })
    }
    st.end()
  })

  t.test('getSenderAddress()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey, sendersAddress } = txType.fixtures[i]
        if (privateKey) {
          const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
          st.equals(
            signedTx.getSenderAddress().toString(),
            `0x${sendersAddress}`,
            `${txType.name}: should get sender's address after signing it`
          )
        }
      })
    }
    st.end()
  })

  t.test('getSenderPublicKey()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey) {
          const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
          const txPubKey = signedTx.getSenderPublicKey()
          const pubKeyFromPriv = privateToPublic(Buffer.from(privateKey, 'hex'))
          st.ok(
            txPubKey.equals(pubKeyFromPriv),
            `${txType.name}: should get sender's public key after signing it`
          )
        }
      })
    }
    st.end()
  })

  t.test('verifySignature()', function (st) {
    for (const txType of txTypes) {
      txType.txs.forEach(function (tx: any, i: number) {
        const { privateKey } = txType.fixtures[i]
        if (privateKey) {
          const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
          st.ok(signedTx.verifySignature(), `${txType.name}: should verify signing it`)
        }
      })
    }
    st.end()
  })

  t.test('initialization with defaults', function (st) {
    const bufferZero = toBuffer('0x')
    const tx = Transaction.fromTxData({
      nonce: '',
      gasLimit: '',
      gasPrice: '',
      to: '',
      value: '',
      data: '',
      v: '',
      r: '',
      s: '',
    })
    st.equal(tx.v, undefined)
    st.equal(tx.r, undefined)
    st.equal(tx.s, undefined)
    st.isEquivalent(tx.to, undefined)
    st.isEquivalent(tx.value, new BN(bufferZero))
    st.isEquivalent(tx.data, bufferZero)
    st.isEquivalent(tx.gasPrice, new BN(bufferZero))
    st.isEquivalent(tx.gasLimit, new BN(bufferZero))
    st.isEquivalent(tx.nonce, new BN(bufferZero))

    st.end()
  })
})
