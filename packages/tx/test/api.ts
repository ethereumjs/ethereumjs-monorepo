import tape from 'tape'
import { Buffer } from 'buffer'
import {
  BN,
  rlp,
  zeros,
  privateToPublic,
  toBuffer,
  bufferToHex,
  unpadBuffer,
} from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { Transaction, TxData } from '../src'
import { TxsJsonEntry, VitaliksTestsDataEntry } from './types'

const txFixtures: TxsJsonEntry[] = require('./json/txs.json')
const txFixturesEip155: VitaliksTestsDataEntry[] = require('./json/ttTransactionTestEip155VitaliksTests.json')

tape('[Transaction]: Basic functions', function (t) {
  const transactions: Transaction[] = []

  t.test('should initialize correctly', function (st) {
    let tx = Transaction.fromTxData({})
    st.equal(tx.common.hardfork(), 'istanbul', 'should initialize with correct default HF')
    st.ok(Object.isFrozen(tx), 'tx should be frozen by default')

    const common = new Common({ chain: 'mainnet', hardfork: 'spuriousDragon' })
    tx = Transaction.fromTxData({}, { common })
    st.equal(tx.common.hardfork(), 'spuriousDragon', 'should initialize with correct HF provided')

    common.setHardfork('byzantium')
    st.equal(
      tx.common.hardfork(),
      'spuriousDragon',
      'should stay on correct HF if outer common HF changes'
    )

    tx = Transaction.fromTxData({}, { freeze: false })
    st.ok(!Object.isFrozen(tx), 'tx should not be frozen when freeze deactivated in options')

    // Perform the same test as above, but now using a different construction method. This also implies that passing on the
    // options object works as expected.
    const rlpData = tx.serialize()

    const zero = Buffer.alloc(0)
    const valuesArray = [zero, zero, zero, zero, zero, zero]

    tx = Transaction.fromRlpSerializedTx(rlpData)
    st.ok(Object.isFrozen(tx), 'tx should be frozen by default')

    tx = Transaction.fromRlpSerializedTx(rlpData, { freeze: false })
    st.ok(!Object.isFrozen(tx), 'tx should not be frozen when freeze deactivated in options')

    tx = Transaction.fromValuesArray(valuesArray)
    st.ok(Object.isFrozen(tx), 'tx should be frozen by default')

    tx = Transaction.fromValuesArray(valuesArray, { freeze: false })
    st.ok(!Object.isFrozen(tx), 'tx should not be frozen when freeze deactivated in options')

    st.end()
  })

  t.test('should decode transactions', function (st) {
    txFixtures.slice(0, 4).forEach(function (tx: any) {
      const txData = tx.raw.map(toBuffer)
      const pt = Transaction.fromValuesArray(txData)

      st.equal(bufferToHex(unpadBuffer(toBuffer(pt.nonce))), tx.raw[0])
      st.equal(bufferToHex(toBuffer(pt.gasPrice)), tx.raw[1])
      st.equal(bufferToHex(toBuffer(pt.gasLimit)), tx.raw[2])
      st.equal(pt.to?.toString(), tx.raw[3])
      st.equal(bufferToHex(unpadBuffer(toBuffer(pt.value))), tx.raw[4])
      st.equal('0x' + pt.data.toString('hex'), tx.raw[5])
      st.equal(bufferToHex(toBuffer(pt.v)), tx.raw[6])
      st.equal(bufferToHex(toBuffer(pt.r)), tx.raw[7])
      st.equal(bufferToHex(toBuffer(pt.s)), tx.raw[8])

      transactions.push(pt)
    })
    st.end()
  })

  t.test('should serialize', function (st) {
    transactions.forEach(function (tx, i) {
      const s1 = tx.serialize()
      const s2 = rlp.encode(txFixtures[i].raw)
      st.ok(s1.equals(s2))
    })
    st.end()
  })

  t.test('should hash', function (st) {
    const common = new Common({
      chain: 'mainnet',
      hardfork: 'tangerineWhistle',
    })
    const tx = Transaction.fromValuesArray(txFixtures[3].raw.map(toBuffer), {
      common,
    })
    st.deepEqual(
      tx.hash(),
      Buffer.from('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa', 'hex')
    )
    st.deepEqual(
      tx.getMessageToSign(),
      Buffer.from('61e1ec33764304dddb55348e7883d4437426f44ab3ef65e6da1e025734c03ff0', 'hex')
    )
    st.deepEqual(
      tx.hash(),
      Buffer.from('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa', 'hex')
    )
    st.end()
  })

  t.test('should hash with defined chainId', function (st) {
    const tx = Transaction.fromValuesArray(txFixtures[4].raw.map(toBuffer))
    st.equal(
      tx.hash().toString('hex'),
      '0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4'
    )
    st.equal(
      tx.hash().toString('hex'),
      '0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4'
    )
    st.equal(
      tx.getMessageToSign().toString('hex'),
      'f97c73fdca079da7652dbc61a46cd5aeef804008e057be3e712c43eac389aaf0'
    )
    st.end()
  })

  t.test('should verify Signatures', function (st) {
    transactions.forEach(function (tx) {
      st.equals(tx.verifySignature(), true)
    })
    st.end()
  })

  t.test('should not verify invalid signatures', function (st) {
    const txs: Transaction[] = []

    txFixtures.slice(0, 4).forEach(function (txFixture: any) {
      const txData = txFixture.raw.map(toBuffer)
      // set `s` to zero
      txData[8] = zeros(32)
      const tx = Transaction.fromValuesArray(txData)
      txs.push(tx)
    })

    txs.forEach(function (tx) {
      st.equals(tx.verifySignature(), false)

      st.ok(
        tx.validate(true).includes('Invalid Signature'),
        'should give a string about not verifying signatures'
      )

      st.notOk(tx.validate(), 'should validate correctly')
    })

    st.end()
  })

  t.test('should sign tx', function (st) {
    transactions.forEach(function (tx, i) {
      const { privateKey } = txFixtures[i]
      if (privateKey) {
        st.ok(tx.sign(Buffer.from(privateKey, 'hex')))
      }
    })
    st.end()
  })

  t.test("should get sender's address after signing it", function (st) {
    transactions.forEach(function (tx, i) {
      const { privateKey, sendersAddress } = txFixtures[i]
      if (privateKey) {
        const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
        st.equals(signedTx.getSenderAddress().toString(), '0x' + sendersAddress)
      }
    })
    st.end()
  })

  t.test("should get sender's public key after signing it", function (st) {
    transactions.forEach(function (tx, i) {
      const { privateKey } = txFixtures[i]
      if (privateKey) {
        const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
        const txPubKey = signedTx.getSenderPublicKey()
        const pubKeyFromPriv = privateToPublic(Buffer.from(privateKey, 'hex'))
        st.ok(txPubKey.equals(pubKeyFromPriv))
      }
    })
    st.end()
  })

  t.test('should verify signing it', function (st) {
    transactions.forEach(function (tx, i) {
      const { privateKey } = txFixtures[i]
      if (privateKey) {
        const signedTx = tx.sign(Buffer.from(privateKey, 'hex'))
        st.ok(signedTx.verifySignature())
      }
    })
    st.end()
  })

  t.test('should validate with string option', function (st) {
    transactions.forEach(function (tx) {
      st.ok(typeof tx.validate(true)[0] === 'string')
    })
    st.end()
  })

  t.test('should round trip decode a tx', function (st) {
    const tx = Transaction.fromTxData({ value: 5000 })
    const s1 = tx.serialize()

    const s1Rlp = toBuffer('0x' + s1.toString('hex'))
    const tx2 = Transaction.fromRlpSerializedTx(s1Rlp)
    const s2 = tx2.serialize()

    st.ok(s1.equals(s2))
    st.end()
  })

  t.test('should accept lesser r values', function (st) {
    const tx = Transaction.fromTxData({ r: new BN(toBuffer('0x0005')) })
    st.equals(tx.r!.toString('hex'), '5')
    st.end()
  })

  t.test('should return data fee', function (st) {
    let tx = Transaction.fromTxData({})
    st.equals(tx.getDataFee().toNumber(), 0)

    tx = Transaction.fromValuesArray(txFixtures[3].raw.map(toBuffer))
    st.equals(tx.getDataFee().toNumber(), 1716)

    st.end()
  })

  t.test('should return base fee', function (st) {
    const tx = Transaction.fromTxData({})
    st.equals(tx.getBaseFee().toNumber(), 53000)
    st.end()
  })

  t.test('should return upfront cost', function (st) {
    const tx = Transaction.fromTxData({
      gasPrice: 1000,
      gasLimit: 10000000,
      value: 42,
    })
    st.equals(tx.getUpfrontCost().toNumber(), 10000000042)
    st.end()
  })

  t.test("Verify EIP155 Signature based on Vitalik's tests", function (st) {
    txFixturesEip155.forEach(function (tx) {
      const pt = Transaction.fromRlpSerializedTx(toBuffer(tx.rlp))
      st.equal(pt.getMessageToSign().toString('hex'), tx.hash)
      st.equal('0x' + pt.serialize().toString('hex'), tx.rlp)
      st.equal(pt.getSenderAddress().toString(), '0x' + tx.sender)
    })
    st.end()
  })

  t.test('Verify EIP155 Signature before and after signing with private key', function (st) {
    // Inputs and expected results for this test are taken directly from the example in https://eips.ethereum.org/EIPS/eip-155
    const txRaw = [
      '0x09',
      '0x4a817c800',
      '0x5208',
      '0x3535353535353535353535353535353535353535',
      '0x0de0b6b3a7640000',
      '0x',
    ]
    const privateKey = Buffer.from(
      '4646464646464646464646464646464646464646464646464646464646464646',
      'hex'
    )
    const pt = Transaction.fromValuesArray(txRaw.map(toBuffer))

    // Note that Vitalik's example has a very similar value denoted "signing data".
    // It's not the output of `serialize()`, but the pre-image of the hash returned by `tx.hash(false)`.
    // We don't have a getter for such a value in Transaction.
    st.equal(
      pt.serialize().toString('hex'),
      'ec098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a764000080808080'
    )
    const signedTx = pt.sign(privateKey)
    st.equal(
      signedTx.getMessageToSign().toString('hex'),
      'daf5a779ae972f972197303d7b574746c7ef83eadac0f2791ad23db92e4c8e53'
    )
    st.equal(
      signedTx.serialize().toString('hex'),
      'f86c098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a028ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276a067cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83'
    )
    st.end()
  })

  t.test(
    'Serialize correctly after being signed with EIP155 Signature for tx created on ropsten',
    function (st) {
      const txRaw = [
        '0x1',
        '0x02540be400',
        '0x5208',
        '0xd7250824390ec5c8b71d856b5de895e271170d9d',
        '0x0de0b6b3a7640000',
        '0x',
      ]
      const privateKey = Buffer.from(
        'DE3128752F183E8930D7F00A2AAA302DCB5E700B2CBA2D8CA5795660F07DEFD5',
        'hex'
      )
      const common = new Common({ chain: 3 })
      const tx = Transaction.fromValuesArray(txRaw.map(toBuffer), { common })
      const signedTx = tx.sign(privateKey)
      st.equal(
        signedTx.serialize().toString('hex'),
        'f86c018502540be40082520894d7250824390ec5c8b71d856b5de895e271170d9d880de0b6b3a76400008029a0d3512c68099d184ccf54f44d9d6905bff303128574b663dcf10b4c726ddd8133a0628acc8f481dea593f13309dfc5f0340f83fdd40cf9fbe47f782668f6f3aec74'
      )

      st.end()
    }
  )

  t.test('sign tx with chainId specified in params', function (st) {
    const common = new Common({ chain: 42, hardfork: 'petersburg' })
    let tx = Transaction.fromTxData({}, { common })
    st.equal(tx.getChainId(), 42)

    const privKey = Buffer.from(txFixtures[0].privateKey, 'hex')
    tx = tx.sign(privKey)

    const serialized = tx.serialize()

    const reTx = Transaction.fromRlpSerializedTx(serialized, { common })
    st.equal(reTx.verifySignature(), true)
    st.equal(reTx.getChainId(), 42)

    st.end()
  })

  t.test('returns correct values for isSigned', function (st) {
    let tx = Transaction.fromTxData({})
    st.notOk(tx.isSigned())

    const txData: TxData = {
      data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
      gasLimit: '0x15f90',
      gasPrice: '0x1',
      nonce: '0x01',
      to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
      value: '0x0',
    }
    const privateKey = Buffer.from(
      '4646464646464646464646464646464646464646464646464646464646464646',
      'hex'
    )
    tx = Transaction.fromTxData(txData)
    st.notOk(tx.isSigned())
    tx = tx.sign(privateKey)
    st.ok(tx.isSigned())

    tx = new Transaction(txData)
    st.notOk(tx.isSigned())
    const rawUnsigned = tx.serialize()
    tx = tx.sign(privateKey)
    const rawSigned = tx.serialize()
    st.ok(tx.isSigned())

    tx = Transaction.fromRlpSerializedTx(rawUnsigned)
    st.notOk(tx.isSigned())
    tx = tx.sign(privateKey)
    st.ok(tx.isSigned())
    tx = Transaction.fromRlpSerializedTx(rawSigned)
    st.ok(tx.isSigned())
    st.end()
  })

  t.test(
    'throws when creating a a transaction with incompatible chainid and v value',
    function (st) {
      const common = new Common({ chain: 42, hardfork: 'petersburg' })
      let tx = Transaction.fromTxData({}, { common })
      st.equal(tx.getChainId(), 42)
      const privKey = Buffer.from(txFixtures[0].privateKey, 'hex')
      tx = tx.sign(privKey)
      const serialized = tx.serialize()
      st.throws(() => Transaction.fromRlpSerializedTx(serialized))
      st.end()
    }
  )

  t.test(
    'Throws if v is set to an EIP155-encoded value incompatible with the chain id',
    function (st) {
      st.throws(() => {
        const common = new Common({ chain: 42, hardfork: 'petersburg' })
        Transaction.fromTxData({ v: new BN(1) }, { common })
      })
      st.end()
    }
  )

  t.test('EIP155 hashing when singing', function (st) {
    const common = new Common({ chain: 1, hardfork: 'petersburg' })
    txFixtures.slice(0, 3).forEach(function (txData) {
      let tx = Transaction.fromValuesArray(txData.raw.slice(0, 6).map(toBuffer), { common })

      const privKey = Buffer.from(txData.privateKey, 'hex')
      tx = tx.sign(privKey)

      st.equal(
        tx.getSenderAddress().toString(),
        '0x' + txData.sendersAddress,
        "computed sender address should equal the fixture's one"
      )
    })

    st.end()
  })

  t.test(
    'Should ignore any previous signature when decided if EIP155 should be used in a new one',
    function (st) {
      const txData: TxData = {
        data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
        gasLimit: '0x15f90',
        gasPrice: '0x1',
        nonce: '0x01',
        to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
        value: '0x0',
      }

      const privateKey = Buffer.from(
        '4646464646464646464646464646464646464646464646464646464646464646',
        'hex'
      )

      const fixtureTxSignedWithEIP155 = Transaction.fromTxData(txData).sign(privateKey)

      const common = new Common({
        chain: 'mainnet',
        hardfork: 'tangerineWhistle',
      })

      const fixtureTxSignedWithoutEIP155 = Transaction.fromTxData(txData, {
        common,
      }).sign(privateKey)

      let signedWithEIP155 = Transaction.fromTxData(fixtureTxSignedWithEIP155.toJSON()).sign(
        privateKey
      )

      st.true(signedWithEIP155.verifySignature())
      st.notEqual(signedWithEIP155.v?.toString('hex'), '1c')
      st.notEqual(signedWithEIP155.v?.toString('hex'), '1b')

      signedWithEIP155 = Transaction.fromTxData(fixtureTxSignedWithoutEIP155.toJSON()).sign(
        privateKey
      )

      st.true(signedWithEIP155.verifySignature())
      st.notEqual(signedWithEIP155.v?.toString('hex'), '1c')
      st.notEqual(signedWithEIP155.v?.toString('hex'), '1b')

      let signedWithoutEIP155 = Transaction.fromTxData(fixtureTxSignedWithEIP155.toJSON(), {
        common,
      }).sign(privateKey)

      st.true(signedWithoutEIP155.verifySignature())
      st.true(
        signedWithoutEIP155.v?.toString('hex') == '1c' ||
          signedWithoutEIP155.v?.toString('hex') == '1b',
        "v shouldn't be EIP155 encoded"
      )

      signedWithoutEIP155 = Transaction.fromTxData(fixtureTxSignedWithoutEIP155.toJSON(), {
        common,
      }).sign(privateKey)

      st.true(signedWithoutEIP155.verifySignature())
      st.true(
        signedWithoutEIP155.v?.toString('hex') == '1c' ||
          signedWithoutEIP155.v?.toString('hex') == '1b',
        "v shouldn' be EIP155 encoded"
      )

      st.end()
    }
  )

  t.test('should return correct data fee for istanbul', function (st) {
    const common = new Common({ chain: 'mainnet', hardfork: 'istanbul' })
    let tx = Transaction.fromTxData({}, { common })
    st.equals(tx.getDataFee().toNumber(), 0)

    tx = Transaction.fromValuesArray(txFixtures[3].raw.map(toBuffer), {
      common,
    })
    st.equals(tx.getDataFee().toNumber(), 1716)

    st.end()
  })
})
