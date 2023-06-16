import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  bytesToBigInt,
  bytesToHex,
  bytesToPrefixedHexString,
  equalsBytes,
  hexStringToBytes,
  intToBytes,
  toBytes,
  unpadBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { LegacyTransaction } from '../src/index.js'

import txFixturesEip155 from './json/ttTransactionTestEip155VitaliksTests.json'
import txFixtures from './json/txs.json'

import type { TransactionType, TxData, TypedTransaction } from '../src/index.js'

describe('[Transaction]', () => {
  const transactions: TypedTransaction[] = []

  it(`cannot input decimal or negative values`, () => {
    const values = ['gasPrice', 'gasLimit', 'nonce', 'value', 'v', 'r', 's']
    const cases = [
      10.1,
      '10.1',
      '0xaa.1',
      -10.1,
      -1,
      BigInt(-10),
      '-100',
      '-10.1',
      '-0xaa',
      Infinity,
      -Infinity,
      NaN,
      {},
      true,
      false,
      () => {},
      Number.MAX_SAFE_INTEGER + 1,
    ]
    for (const value of values) {
      const txData: any = {}
      for (const testCase of cases) {
        txData[value] = testCase
        assert.throws(() => {
          LegacyTransaction.fromTxData(txData)
        })
      }
    }
  })

  it('Initialization', () => {
    const nonEIP2930Common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    assert.ok(
      LegacyTransaction.fromTxData({}, { common: nonEIP2930Common }),
      'should initialize on a pre-Berlin Harfork (EIP-2930 not activated)'
    )

    const txData = txFixtures[3].raw.map(toBytes)
    txData[6] = intToBytes(45) // v with 0-parity and chain ID 5
    let tx = LegacyTransaction.fromValuesArray(txData)
    assert.ok(
      tx.common.chainId() === BigInt(5),
      'should initialize Common with chain ID (supported) derived from v value (v with 0-parity)'
    )

    txData[6] = intToBytes(46) // v with 1-parity and chain ID 5
    tx = LegacyTransaction.fromValuesArray(txData)
    assert.ok(
      tx.common.chainId() === BigInt(5),
      'should initialize Common with chain ID (supported) derived from v value (v with 1-parity)'
    )

    txData[6] = intToBytes(2033) // v with 0-parity and chain ID 999
    tx = LegacyTransaction.fromValuesArray(txData)
    assert.equal(
      tx.common.chainId(),
      BigInt(999),
      'should initialize Common with chain ID (unsupported) derived from v value (v with 0-parity)'
    )

    txData[6] = intToBytes(2034) // v with 1-parity and chain ID 999
    tx = LegacyTransaction.fromValuesArray(txData)
    assert.equal(
      tx.common.chainId(),
      BigInt(999),
      'should initialize Common with chain ID (unsupported) derived from v value (v with 1-parity)'
    )
  })

  it('Initialization -> decode with fromValuesArray()', () => {
    for (const tx of txFixtures.slice(0, 4)) {
      const txData = tx.raw.map(toBytes)
      const pt = LegacyTransaction.fromValuesArray(txData)

      assert.equal(bytesToPrefixedHexString(unpadBytes(toBytes(pt.nonce))), tx.raw[0])
      assert.equal(bytesToPrefixedHexString(toBytes(pt.gasPrice)), tx.raw[1])
      assert.equal(bytesToPrefixedHexString(toBytes(pt.gasLimit)), tx.raw[2])
      assert.equal(pt.to?.toString(), tx.raw[3])
      assert.equal(bytesToPrefixedHexString(unpadBytes(toBytes(pt.value))), tx.raw[4])
      assert.equal(bytesToPrefixedHexString(pt.data), tx.raw[5])
      assert.equal(bytesToPrefixedHexString(toBytes(pt.v)), tx.raw[6])
      assert.equal(bytesToPrefixedHexString(toBytes(pt.r)), tx.raw[7])
      assert.equal(bytesToPrefixedHexString(toBytes(pt.s)), tx.raw[8])

      transactions.push(pt)
    }
  })

  it('Initialization -> should accept lesser r values', () => {
    const tx = LegacyTransaction.fromTxData({ r: bytesToBigInt(toBytes('0x0005')) })
    assert.equal(tx.r!.toString(16), '5')
  })

  it('Initialization -> throws when creating a a transaction with incompatible chainid and v value', () => {
    let common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Petersburg })
    let tx = LegacyTransaction.fromTxData({}, { common })
    assert.equal(tx.common.chainId(), BigInt(5))
    const privKey = hexStringToBytes(txFixtures[0].privateKey)
    tx = tx.sign(privKey)
    const serialized = tx.serialize()
    common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    assert.throws(() => LegacyTransaction.fromSerializedTx(serialized, { common }))
  })

  it('Initialization -> throws if v is set to an EIP155-encoded value incompatible with the chain id', () => {
    assert.throws(() => {
      const common = new Common({ chain: 42, hardfork: Hardfork.Petersburg })
      LegacyTransaction.fromTxData({ v: BigInt(1) }, { common })
    })
  })

  it('validate() -> should validate with string option', () => {
    for (const tx of transactions) {
      assert.equal(typeof tx.validate(true)[0], 'string')
    }
  })

  it('getBaseFee() -> should return base fee', () => {
    const tx = LegacyTransaction.fromTxData({})
    assert.equal(tx.getBaseFee(), BigInt(53000))
  })

  it('getDataFee() -> should return data fee', () => {
    let tx = LegacyTransaction.fromTxData({})
    assert.equal(tx.getDataFee(), BigInt(0))

    tx = LegacyTransaction.fromValuesArray(txFixtures[3].raw.map(toBytes))
    assert.equal(tx.getDataFee(), BigInt(1716))

    tx = LegacyTransaction.fromValuesArray(txFixtures[3].raw.map(toBytes), { freeze: false })
    assert.equal(tx.getDataFee(), BigInt(1716))
  })

  it('getDataFee() -> should return correct data fee for istanbul', () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    let tx = LegacyTransaction.fromTxData({}, { common })
    assert.equal(tx.getDataFee(), BigInt(0))

    tx = LegacyTransaction.fromValuesArray(txFixtures[3].raw.map(toBytes), {
      common,
    })
    assert.equal(tx.getDataFee(), BigInt(1716))
  })

  it('getDataFee() -> should invalidate cached value on hardfork change', () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    const tx = LegacyTransaction.fromValuesArray(txFixtures[0].raw.map(toBytes), {
      common,
    })
    assert.equal(tx.getDataFee(), BigInt(656))
    tx.common.setHardfork(Hardfork.Istanbul)
    assert.equal(tx.getDataFee(), BigInt(240))
  })

  it('getUpfrontCost() -> should return upfront cost', () => {
    const tx = LegacyTransaction.fromTxData({
      gasPrice: 1000,
      gasLimit: 10000000,
      value: 42,
    })
    assert.equal(tx.getUpfrontCost(), BigInt(10000000042))
  })

  it('serialize()', () => {
    for (const [i, tx] of transactions.entries()) {
      const s1 = tx.serialize()
      const s2 = RLP.encode(txFixtures[i].raw)
      assert.ok(equalsBytes(s1, s2))
    }
  })

  it('serialize() -> should round trip decode a tx', () => {
    const tx = LegacyTransaction.fromTxData({ value: 5000 })
    const s1 = tx.serialize()

    const tx2 = LegacyTransaction.fromSerializedTx(s1)
    const s2 = tx2.serialize()

    assert.ok(equalsBytes(s1, s2))
  })

  it('hash() / getMessageToSign(true) / getMessageToSign(false)', () => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.TangerineWhistle,
    })

    let tx = LegacyTransaction.fromValuesArray(txFixtures[3].raw.slice(0, 6).map(toBytes), {
      common,
    })
    assert.throws(
      () => {
        tx.hash()
      },
      undefined,
      undefined,
      'should throw calling hash with unsigned tx'
    )
    tx = LegacyTransaction.fromValuesArray(txFixtures[3].raw.map(toBytes), {
      common,
    })
    assert.deepEqual(
      tx.hash(),
      hexStringToBytes('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa')
    )
    assert.deepEqual(
      tx.getMessageToSign(),
      hexStringToBytes('61e1ec33764304dddb55348e7883d4437426f44ab3ef65e6da1e025734c03ff0')
    )
    assert.equal(tx.getMessageToSign(false).length, 6)
    assert.deepEqual(
      tx.hash(),
      hexStringToBytes('375a8983c9fc56d7cfd118254a80a8d7403d590a6c9e105532b67aca1efb97aa')
    )
  })

  it('hash() -> with defined chainId', () => {
    const tx = LegacyTransaction.fromValuesArray(txFixtures[4].raw.map(toBytes))
    assert.equal(
      bytesToHex(tx.hash()),
      '0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4'
    )
    assert.equal(
      bytesToHex(tx.hash()),
      '0f09dc98ea85b7872f4409131a790b91e7540953992886fc268b7ba5c96820e4'
    )
    assert.equal(
      bytesToHex(tx.getMessageToSign()),
      'f97c73fdca079da7652dbc61a46cd5aeef804008e057be3e712c43eac389aaf0'
    )
  })

  it("getMessageToSign(), getSenderPublicKey() (implicit call) -> verify EIP155 signature based on Vitalik's tests", () => {
    for (const tx of txFixturesEip155) {
      const pt = LegacyTransaction.fromSerializedTx(toBytes(tx.rlp))
      assert.equal(bytesToHex(pt.getMessageToSign()), tx.hash)
      assert.equal(bytesToPrefixedHexString(pt.serialize()), tx.rlp)
      assert.equal(pt.getSenderAddress().toString(), '0x' + tx.sender)
    }
  })

  it('getMessageToSign(), sign(), getSenderPublicKey() (implicit call) -> verify EIP155 signature before and after signing', () => {
    // Inputs and expected results for this test are taken directly from the example in https://eips.ethereum.org/EIPS/eip-155
    const txRaw = [
      '0x09',
      '0x4a817c800',
      '0x5208',
      '0x3535353535353535353535353535353535353535',
      '0x0de0b6b3a7640000',
      '0x',
    ]
    const privateKey = hexStringToBytes(
      '4646464646464646464646464646464646464646464646464646464646464646'
    )
    const pt = LegacyTransaction.fromValuesArray(txRaw.map(toBytes))

    // Note that Vitalik's example has a very similar value denoted "signing data".
    // It's not the output of `serialize()`, but the pre-image of the hash returned by `tx.hash(false)`.
    // We don't have a getter for such a value in LegacyTransaction.
    assert.equal(
      bytesToHex(pt.serialize()),
      'ec098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a764000080808080'
    )
    const signedTx = pt.sign(privateKey)
    assert.equal(
      bytesToHex(signedTx.getMessageToSign()),
      'daf5a779ae972f972197303d7b574746c7ef83eadac0f2791ad23db92e4c8e53'
    )
    assert.equal(
      bytesToHex(signedTx.serialize()),
      'f86c098504a817c800825208943535353535353535353535353535353535353535880de0b6b3a76400008025a028ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276a067cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83'
    )
  })

  it('sign(), getSenderPublicKey() (implicit call) -> EIP155 hashing when singing', () => {
    const common = new Common({ chain: 1, hardfork: Hardfork.Petersburg })
    for (const txData of txFixtures.slice(0, 3)) {
      const tx = LegacyTransaction.fromValuesArray(txData.raw.slice(0, 6).map(toBytes), {
        common,
      })

      const privKey = hexStringToBytes(txData.privateKey)
      const txSigned = tx.sign(privKey)

      assert.equal(
        txSigned.getSenderAddress().toString(),
        '0x' + txData.sendersAddress,
        "computed sender address should equal the fixture's one"
      )
    }
  })

  it('sign(), serialize(): serialize correctly after being signed with EIP155 Signature for tx created on ropsten', () => {
    const txRaw = [
      '0x1',
      '0x02540be400',
      '0x5208',
      '0xd7250824390ec5c8b71d856b5de895e271170d9d',
      '0x0de0b6b3a7640000',
      '0x',
    ]
    const privateKey = hexStringToBytes(
      'DE3128752F183E8930D7F00A2AAA302DCB5E700B2CBA2D8CA5795660F07DEFD5'
    )
    const common = new Common({ chain: 3 })
    const tx = LegacyTransaction.fromValuesArray(txRaw.map(toBytes), { common })
    const signedTx = tx.sign(privateKey)
    assert.equal(
      bytesToHex(signedTx.serialize()),
      'f86c018502540be40082520894d7250824390ec5c8b71d856b5de895e271170d9d880de0b6b3a76400008029a0d3512c68099d184ccf54f44d9d6905bff303128574b663dcf10b4c726ddd8133a0628acc8f481dea593f13309dfc5f0340f83fdd40cf9fbe47f782668f6f3aec74'
    )
  })

  it('sign(), verifySignature(): should ignore any previous signature when decided if EIP155 should be used in a new one', () => {
    const txData: TxData[TransactionType.Legacy] = {
      data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
      gasLimit: '0x15f90',
      gasPrice: '0x1',
      nonce: '0x01',
      to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
      value: '0x0',
    }

    const privateKey = hexStringToBytes(
      '4646464646464646464646464646464646464646464646464646464646464646'
    )

    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.TangerineWhistle,
    })

    const fixtureTxSignedWithoutEIP155 = LegacyTransaction.fromTxData(txData, {
      common,
    }).sign(privateKey)

    let signedWithEIP155 = LegacyTransaction.fromTxData(<any>txData).sign(privateKey)

    assert.isTrue(signedWithEIP155.verifySignature())
    assert.notEqual(signedWithEIP155.v?.toString(16), '1c')
    assert.notEqual(signedWithEIP155.v?.toString(16), '1b')

    signedWithEIP155 = LegacyTransaction.fromTxData(
      <any>fixtureTxSignedWithoutEIP155.toJSON()
    ).sign(privateKey)

    assert.isTrue(signedWithEIP155.verifySignature())
    assert.notEqual(signedWithEIP155.v?.toString(16), '1c')
    assert.notEqual(signedWithEIP155.v?.toString(16), '1b')

    let signedWithoutEIP155 = LegacyTransaction.fromTxData(<any>txData, {
      common,
    }).sign(privateKey)

    assert.isTrue(signedWithoutEIP155.verifySignature())
    assert.isTrue(
      signedWithoutEIP155.v?.toString(16) === '1c' || signedWithoutEIP155.v?.toString(16) === '1b',
      "v shouldn't be EIP155 encoded"
    )

    signedWithoutEIP155 = LegacyTransaction.fromTxData(<any>txData, {
      common,
    }).sign(privateKey)

    assert.isTrue(signedWithoutEIP155.verifySignature())
    assert.isTrue(
      signedWithoutEIP155.v?.toString(16) === '1c' || signedWithoutEIP155.v?.toString(16) === '1b',
      "v shouldn't be EIP155 encoded"
    )
  })

  it('constructor: throw on legacy transactions which have v !== 27 and v !== 28 and v < 37', () => {
    function getTxData(v: number) {
      return {
        v,
      }
    }
    for (let n = 0; n < 27; n++) {
      assert.throws(() => LegacyTransaction.fromTxData(getTxData(n)))
    }
    assert.throws(() => LegacyTransaction.fromTxData(getTxData(29)))
    assert.throws(() => LegacyTransaction.fromTxData(getTxData(36)))

    assert.doesNotThrow(() => LegacyTransaction.fromTxData(getTxData(27)))
    assert.doesNotThrow(() => LegacyTransaction.fromTxData(getTxData(28)))
    assert.doesNotThrow(() => LegacyTransaction.fromTxData(getTxData(37)))
  })

  it('sign(), verifySignature(): sign tx with chainId specified in params', () => {
    const common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Petersburg })
    let tx = LegacyTransaction.fromTxData({}, { common })
    assert.equal(tx.common.chainId(), BigInt(5))

    const privKey = hexStringToBytes(txFixtures[0].privateKey)
    tx = tx.sign(privKey)

    const serialized = tx.serialize()

    const reTx = LegacyTransaction.fromSerializedTx(serialized, { common })
    assert.equal(reTx.verifySignature(), true)
    assert.equal(reTx.common.chainId(), BigInt(5))
  })

  it('freeze property propagates from unsigned tx to signed tx', () => {
    const tx = LegacyTransaction.fromTxData({}, { freeze: false })
    assert.notOk(Object.isFrozen(tx), 'tx object is not frozen')
    const privKey = hexStringToBytes(txFixtures[0].privateKey)
    const signedTxn = tx.sign(privKey)
    assert.notOk(Object.isFrozen(signedTxn), 'tx object is not frozen')
  })

  it('common propagates from the common of tx, not the common in TxOptions', () => {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London })
    const pkey = hexStringToBytes(txFixtures[0].privateKey)
    const txn = LegacyTransaction.fromTxData({}, { common, freeze: false })
    const newCommon = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.London, eips: [2537] })
    assert.notDeepEqual(newCommon, common, 'new common is different than original common')
    Object.defineProperty(txn, 'common', {
      get() {
        return newCommon
      },
    })
    const signedTxn = txn.sign(pkey)
    assert.ok(signedTxn.common.eips().includes(2537), 'signed tx common is taken from tx.common')
  })

  it('isSigned() -> returns correct values', () => {
    let tx = LegacyTransaction.fromTxData({})
    assert.notOk(tx.isSigned())

    const txData: TxData[TransactionType.Legacy] = {
      data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
      gasLimit: '0x15f90',
      gasPrice: '0x1',
      nonce: '0x01',
      to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
      value: '0x0',
    }
    const privateKey = hexStringToBytes(
      '4646464646464646464646464646464646464646464646464646464646464646'
    )
    tx = LegacyTransaction.fromTxData(txData)
    assert.notOk(tx.isSigned())
    tx = tx.sign(privateKey)
    assert.ok(tx.isSigned())

    tx = LegacyTransaction.fromTxData(txData)
    assert.notOk(tx.isSigned())
    const rawUnsigned = tx.serialize()
    tx = tx.sign(privateKey)
    const rawSigned = tx.serialize()
    assert.ok(tx.isSigned())

    tx = LegacyTransaction.fromSerializedTx(rawUnsigned)
    assert.notOk(tx.isSigned())
    tx = tx.sign(privateKey)
    assert.ok(tx.isSigned())
    tx = LegacyTransaction.fromSerializedTx(rawSigned)
    assert.ok(tx.isSigned())

    const signedValues = RLP.decode(Uint8Array.from(rawSigned)) as Uint8Array[]
    tx = LegacyTransaction.fromValuesArray(signedValues)
    assert.ok(tx.isSigned())
    tx = LegacyTransaction.fromValuesArray(signedValues.slice(0, 6))
    assert.notOk(tx.isSigned())
  })
})
