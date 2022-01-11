import tape from 'tape'
import RLP from 'rlp'
import {
  Account,
  BN,
  isValidPrivate,
  isValidPublic,
  importPublic,
  publicToAddress,
  privateToAddress,
  privateToPublic,
  generateAddress,
  generateAddress2,
  toBuffer,
  isValidChecksumAddress,
  isValidAddress,
  toChecksumAddress,
} from '../src'
const eip1014Testdata = require('./testdata/eip1014Examples.json')

tape('Account', function (t) {
  t.test('empty constructor', function (st) {
    const account = new Account()
    st.ok(account.nonce.isZero(), 'should have zero nonce')
    st.ok(account.balance.isZero(), 'should have zero balance')
    st.equal(
      account.stateRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have stateRoot equal to KECCAK256_RLP'
    )
    st.equal(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have codeHash equal to KECCAK256_NULL'
    )
    st.end()
  })

  t.test('from Array data', function (st) {
    const raw = [
      '0x02', // nonce
      '0x0384', // balance
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421', // stateRoot
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470', // codeHash
    ]
    const account = Account.fromValuesArray(raw.map(toBuffer))
    st.ok(account.nonce.eqn(2), 'should have correct nonce')
    st.ok(account.balance.eqn(900), 'should have correct balance')
    st.equal(
      account.stateRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct stateRoot'
    )
    st.equal(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
    st.end()
  })

  t.test('from Object data', function (st) {
    const raw = {
      nonce: '0x02',
      balance: '0x0384',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    const account = Account.fromAccountData(raw)
    st.ok(account.nonce.eqn(2), 'should have correct nonce')
    st.ok(account.balance.eqn(900), 'should have correct balance')
    st.equal(
      account.stateRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct stateRoot'
    )
    st.equal(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
    st.end()
  })

  t.test('from RLP data', function (st) {
    const accountRlp = Buffer.from(
      'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'hex'
    )
    const account = Account.fromRlpSerializedAccount(accountRlp)
    st.ok(account.nonce.eqn(2), 'should have correct nonce')
    st.ok(account.balance.eqn(900), 'should have correct balance')
    st.equal(
      account.stateRoot.toString('hex'),
      '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct stateRoot'
    )
    st.equal(
      account.codeHash.toString('hex'),
      'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
    st.end()
  })

  t.test('serialize', function (st) {
    const raw = {
      nonce: '0x01',
      balance: '0x42',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    const account = Account.fromAccountData(raw)
    const accountRlp = Buffer.from(
      RLP.encode([raw.nonce, raw.balance, raw.stateRoot, raw.codeHash])
    )
    st.ok(account.serialize().equals(accountRlp), 'should serialize correctly')
    st.end()
  })

  t.test('isContract', function (st) {
    const accountRlp = Buffer.from(
      'f84602820384a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a0c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'hex'
    )
    let account = Account.fromRlpSerializedAccount(accountRlp)
    st.notOk(account.isContract(), 'should return false for a non-contract account')

    const raw = {
      nonce: '0x01',
      balance: '0x0042',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xc5d2461236f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    }
    account = Account.fromAccountData(raw)
    st.ok(account.isContract(), 'should return true for a contract account')
    st.end()
  })

  t.test('isEmpty', function (st) {
    let account = new Account()
    st.ok(account.isEmpty(), 'should return true for an empty account')

    const raw = {
      nonce: '0x01',
      balance: '0x0042',
      stateRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      codeHash: '0xd748bf26ab37599c944babfdbeecf6690801bd61bf2670efb0a34adfc6dca10b',
    }
    account = Account.fromAccountData(raw)
    st.notOk(account.isEmpty(), 'should return false for a non-empty account')
    st.end()
  })

  t.test('validation', function (st) {
    st.throws(() => {
      new Account(undefined, undefined, Buffer.from('hey'), undefined)
    }, 'should only accept length 32 buffer for stateRoot')

    st.throws(() => {
      new Account(undefined, undefined, undefined, Buffer.from('hey'))
    }, 'should only accept length 32 buffer for codeHash')

    const data = { balance: new BN(5) }
    st.throws(() => {
      Account.fromRlpSerializedAccount(data as any)
    }, 'should only accept an array in fromRlpSerializedAccount')

    st.throws(() => {
      new Account(new BN(-5))
    }, 'should not accept nonce less than 0')

    st.throws(() => {
      new Account(undefined, new BN(-5))
    }, 'should not accept balance less than 0')
    st.end()
  })
})

tape('Utility Functions', function (t) {
  t.test('isValidPrivate', function (st) {
    const SECP256K1_N = new BN(
      'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
      16
    )

    let tmp = '0011223344'
    st.throws(function () {
      isValidPrivate(Buffer.from(tmp, 'hex'))
    }, 'should fail on short input')

    tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    st.throws(function () {
      isValidPrivate(Buffer.from(tmp, 'hex'))
    }, 'should fail on too big input')

    st.throws(function () {
      isValidPrivate((<unknown>'WRONG_INPUT_TYPE') as Buffer)
    }, 'should fail on wrong input type')

    tmp = '0000000000000000000000000000000000000000000000000000000000000000'
    st.notOk(isValidPrivate(Buffer.from(tmp, 'hex')), 'should fail on invalid curve (zero)')

    tmp = SECP256K1_N.toString(16)
    st.notOk(isValidPrivate(Buffer.from(tmp, 'hex')), 'should fail on invalid curve (== N)')

    tmp = SECP256K1_N.addn(1).toString(16)
    st.notOk(isValidPrivate(Buffer.from(tmp, 'hex')), 'should fail on invalid curve (>= N)')

    tmp = SECP256K1_N.subn(1).toString(16)
    st.ok(isValidPrivate(Buffer.from(tmp, 'hex')), 'should work otherwise (< N)')
    st.end()
  })

  t.test('isValidPublic', function (st) {
    let pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex'
    )
    st.notOk(isValidPublic(pubKey), 'should fail on too short input')

    pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d00',
      'hex'
    )
    st.notOk(isValidPublic(pubKey), 'should fail on too big input')

    pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    st.notOk(isValidPublic(pubKey), 'should fail on SEC1 key')

    pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    st.ok(isValidPublic(pubKey, true), "shouldn't fail on SEC1 key wt.testh sant.testize enabled")

    pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    st.notOk(isValidPublic(pubKey), 'should fail wt.testh an invalid SEC1 public key')

    pubKey = Buffer.from(
      '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a',
      'hex'
    )
    st.ok(
      isValidPublic(pubKey, true),
      'should work wt.testh compressed keys wt.testh sant.testize enabled'
    )

    pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    st.ok(isValidPublic(pubKey, true), 'should work wt.testh sant.testize enabled')

    pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    st.ok(isValidPublic(pubKey), 'should work otherwise')

    pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d' as any
    try {
      isValidPublic((<unknown>pubKey) as Buffer)
    } catch (err: any) {
      st.ok(
        err.message.includes('This method only supports Buffer'),
        'should throw if input is not Buffer'
      )
    }
    st.end()
  })

  t.test('importPublic', function (st) {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'

    let tmp =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    st.equal(
      importPublic(Buffer.from(tmp, 'hex')).toString('hex'),
      pubKey,
      'should work wt.testh an Ethereum public key'
    )

    tmp =
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    st.equal(
      importPublic(Buffer.from(tmp, 'hex')).toString('hex'),
      pubKey,
      'should work wt.testh uncompressed SEC1 keys'
    )

    tmp = '033a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a'
    st.equal(
      importPublic(Buffer.from(tmp, 'hex')).toString('hex'),
      pubKey,
      'should work wt.testh compressed SEC1 keys'
    )

    st.throws(function () {
      importPublic((<unknown>pubKey) as Buffer)
    }, 'should throw if input is not Buffer')
    st.end()
  })

  t.test('publicToAddress', function (st) {
    let pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    let address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    let r = publicToAddress(pubKey)
    st.equal(r.toString('hex'), address, 'should produce an address given a public key')

    pubKey = Buffer.from(
      '043a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    r = publicToAddress(pubKey, true)
    st.equal(r.toString('hex'), address, 'should produce an address given a SEC1 public key')

    pubKey = Buffer.from(
      '023a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d',
      'hex'
    )
    st.throws(function () {
      publicToAddress(pubKey, true)
    }, "shouldn't produce an address given an invalid SEC1 public key")

    pubKey = Buffer.from(
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae744',
      'hex'
    )
    st.throws(function () {
      publicToAddress(pubKey)
    }, "shouldn't produce an address given an invalid public key")

    pubKey =
      '0x3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d' as any
    st.throws(function () {
      publicToAddress(pubKey)
    }, 'should throw if input is not a buffer')
    st.end()
  })

  t.test('privateToPublic', function (st) {
    const pubKey =
      '3a443d8381a6798a70c6ff9304bdc8cb0163c23211d11628fae52ef9e0dca11a001cf066d56a8156fc201cd5df8a36ef694eecd258903fca7086c1fae7441e1d'
    let privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
      'hex'
    )
    const r = privateToPublic(privateKey)
    st.equal(r.toString('hex'), pubKey, 'should produce a public key given a private key')

    privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f2a',
      'hex'
    )
    st.throws(function () {
      privateToPublic(privateKey)
    }, "shouldn't produce a public key given an invalid private key")

    privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c',
      'hex'
    )
    st.throws(function () {
      privateToPublic(privateKey)
    }, "shouldn't produce a public key given an invalid private key")

    privateKey = '0xea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f' as any
    try {
      privateToPublic((<unknown>privateKey) as Buffer)
    } catch (err: any) {
      st.ok(
        err.message.includes('This method only supports Buffer'),
        'should throw if private key is not Buffer'
      )
      st.ok(err.message.includes(privateKey), 'should throw if private key is not Buffer')
    }
    st.end()
  })

  t.test('privateToAddress', function (st) {
    const address = '2f015c60e0be116b1f0cd534704db9c92118fb6a'
    // Our private key
    const privateKey = Buffer.from(
      'ea54bdc52d163f88c93ab0615782cf718a2efb9e51a7989aab1b08067e9c1c5f',
      'hex'
    )
    const r = privateToAddress(privateKey)
    st.equal(r.toString('hex'), address, 'should produce an address given a private key')
    st.end()
  })

  t.test('generateAddress', function (st) {
    const addr = generateAddress(
      Buffer.from('990ccf8a0de58091c028d6ff76bb235ee67c1c39', 'utf8'),
      toBuffer(14)
    )
    st.equal(
      addr.toString('hex'),
      '936a4295d8d74e310c0c95f0a63e53737b998d12',
      'should produce an address given a public key'
    )
    st.end()
  })

  t.test('generateAddress wt.testh hex prefix', function (st) {
    const addr = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(14)
    )
    st.equal(
      addr.toString('hex'),
      'd658a4b8247c14868f3c512fa5cbb6e458e4a989',
      'should produce an address given a public key'
    )
    st.end()
  })

  t.test('generateAddress wt.testh nonce 0 (special case)', function (st) {
    const addr = generateAddress(
      toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
      toBuffer(0)
    )
    st.equal(
      addr.toString('hex'),
      'bfa69ba91385206bfdd2d8b9c1a5d6c10097a85b',
      'should produce an address given a public key'
    )
    st.end()
  })

  t.test('generateAddress wt.testh non-buffer inputs', function (st) {
    st.throws(function () {
      generateAddress(
        (<unknown>'0x990ccf8a0de58091c028d6ff76bb235ee67c1c39') as Buffer,
        toBuffer(0)
      )
    }, 'should throw if address is not Buffer')

    st.throws(function () {
      generateAddress(
        toBuffer('0x990ccf8a0de58091c028d6ff76bb235ee67c1c39'),
        (<unknown>0) as Buffer
      )
    }, 'should throw if nonce is not Buffer')
    st.end()
  })

  t.test('generateAddress2: EIP-1014 testdata examples', function (st) {
    for (const testdata of eip1014Testdata) {
      const { address, comment, result, salt, initCode } = testdata
      const addr = generateAddress2(toBuffer(address), toBuffer(salt), toBuffer(initCode))
      st.equal(
        '0x' + addr.toString('hex'),
        result,
        `${comment}: should generate the addresses provided`
      )
    }
    st.end()
  })

  t.test('generateAddress2: non-buffer inputs', function (st) {
    const { address, salt, initCode } = eip1014Testdata[0]

    st.throws(function () {
      generateAddress2((<unknown>address) as Buffer, toBuffer(salt), toBuffer(initCode))
    }, 'should throw if address is not Buffer')

    st.throws(function () {
      generateAddress2(toBuffer(address), (<unknown>salt) as Buffer, toBuffer(initCode))
    }, 'should throw if salt is not Buffer')

    st.throws(function () {
      generateAddress2(toBuffer(address), toBuffer(salt), (<unknown>initCode) as Buffer)
    }, 'should throw if initCode is not Buffer')
    st.end()
  })

  const eip55ChecksumAddresses = [
    // All caps
    '0x52908400098527886E0F7030069857D2E4169EE7',
    '0x8617E340B3D01FA5F11F306F4090FD50E238070D',
    // All Lower
    '0xde709f2102306220921060314715629080e2fb77',
    '0x27b1fdb04752bbc536007a920d24acb045561c26',
    // Normal
    '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
    '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
    '0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb',
  ]

  const eip1191ChecksummAddresses = {
    1: [
      '0x88021160c5C792225E4E5452585947470010289d',
      '0x27b1FdB04752bBc536007a920D24ACB045561c26',
      '0x52908400098527886e0f7030069857D2e4169EE7',
      '0x5aaeB6053f3E94C9b9A09f33669435e7Ef1bEAed',
      '0x8617E340b3d01FA5F11F306f4090FD50E238070d',
      '0xd1220a0CF47C7B9Be7A2E6ba89F429762E7B9Adb',
      '0xdBf03b407c01e7cD3CBea99509d93f8dDDC8C6fB',
      '0xDe709F2102306220921060314715629080E2fb77',
      '0xfb6916095Ca1dF60bB79cE92ce3ea74C37c5D359',
    ],
    30: [
      '0x6549F4939460DE12611948B3F82B88C3C8975323',
      '0x27b1FdB04752BBc536007A920D24ACB045561c26',
      '0x3599689E6292B81B2D85451025146515070129Bb',
      '0x52908400098527886E0F7030069857D2E4169ee7',
      '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
      '0x8617E340b3D01Fa5f11f306f4090fd50E238070D',
      '0xD1220A0Cf47c7B9BE7a2e6ba89F429762E7B9adB',
      '0xDBF03B407c01E7CD3cBea99509D93F8Dddc8C6FB',
      '0xDe709F2102306220921060314715629080e2FB77',
      '0xFb6916095cA1Df60bb79ce92cE3EA74c37c5d359',
    ],
    31: [
      '0x42712D45473476B98452F434E72461577D686318',
      '0x27B1FdB04752BbC536007a920D24acB045561C26',
      '0x3599689e6292b81b2D85451025146515070129Bb',
      '0x52908400098527886E0F7030069857D2e4169EE7',
      '0x5aAeb6053F3e94c9b9A09F33669435E7EF1BEaEd',
      '0x66f9664F97F2b50f62d13eA064982F936DE76657',
      '0x8617e340b3D01fa5F11f306F4090Fd50e238070d',
      '0xDE709F2102306220921060314715629080e2Fb77',
      '0xFb6916095CA1dF60bb79CE92ce3Ea74C37c5D359',
      '0xd1220a0CF47c7B9Be7A2E6Ba89f429762E7b9adB',
      '0xdbF03B407C01E7cd3cbEa99509D93f8dDDc8C6fB',
    ],
  }

  t.test('toChecksumAddress()', function (st) {
    st.test('EIP55', function (st) {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        const tmp = eip55ChecksumAddresses[i]
        st.equal(toChecksumAddress(tmp.toLowerCase()), tmp)
      }
      st.end()
    })

    st.test('EIP1191', function (st) {
      st.test('Should encode the example addresses correctly', function (st) {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
          for (const addr of addresses) {
            st.equal(toChecksumAddress(addr.toLowerCase(), Number(chainId)), addr)
            st.equal(toChecksumAddress(addr.toLowerCase(), Buffer.from([chainId] as any)), addr)
            st.equal(toChecksumAddress(addr.toLowerCase(), new BN(chainId)), addr)
            st.equal(
              toChecksumAddress(
                addr.toLowerCase(),
                '0x' + Buffer.from([chainId] as any).toString('hex')
              ),
              addr
            )
          }
        }
        st.end()
      })
      st.test('Should encode large chain ids greater than MAX_INTEGER correctly', function (st) {
        const addr = '0x88021160C5C792225E4E5452585947470010289D'
        const chainIDBuffer = Buffer.from('796f6c6f763378', 'hex')
        st.equal(toChecksumAddress(addr.toLowerCase(), chainIDBuffer), addr)
        st.equal(toChecksumAddress(addr.toLowerCase(), new BN(chainIDBuffer)), addr)
        st.equal(toChecksumAddress(addr.toLowerCase(), '0x' + chainIDBuffer.toString('hex')), addr)
        const chainIDNumber = parseInt(chainIDBuffer.toString('hex'), 16)
        st.throws(() => {
          toChecksumAddress(addr.toLowerCase(), chainIDNumber)
        })
        st.end()
      })
      st.end()
    })

    st.test('input format', function (st) {
      st.throws(function () {
        toChecksumAddress('52908400098527886E0F7030069857D2E4169EE7'.toLowerCase())
      }, 'Should throw when the address is not hex-prefixed')

      st.throws(function () {
        toChecksumAddress('0xde709f2102306220921060314715629080e2fb77', '1234')
      }, 'Should throw when the chainId is not hex-prefixed')
      st.end()
    })
  })

  t.test('isValidChecksumAddress()', function (st) {
    st.test('EIP55', function (st) {
      for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
        st.ok(isValidChecksumAddress(eip55ChecksumAddresses[i]))
      }
      st.notOk(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      st.end()
    })

    st.test('EIP1191', function (st) {
      st.test('Should return true for the example addresses', function (st) {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
          for (const addr of addresses) {
            st.ok(isValidChecksumAddress(addr, Number(chainId)))
            st.ok(isValidChecksumAddress(addr, Buffer.from([chainId] as any)))
            st.ok(isValidChecksumAddress(addr, new BN(chainId)))
            st.equal(
              isValidChecksumAddress(addr, '0x' + Buffer.from([chainId] as any).toString('hex')),
              true
            )
          }
        }
        st.end()
      })

      st.test('Should return false for invalid cases', function (st) {
        // If we set the chain id, an EIP55 encoded address should be invalid
        for (let i = 0; i < eip55ChecksumAddresses.length; i++) {
          st.notOk(isValidChecksumAddress(eip55ChecksumAddresses[i], 1))
        }

        st.notOk(isValidChecksumAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a', 1))
        st.end()
      })

      st.test('Should return false if the wrong chain id is used', function (st) {
        for (const [chainId, addresses] of Object.entries(eip1191ChecksummAddresses)) {
          for (const addr of addresses) {
            st.notOk(isValidChecksumAddress(addr, Number(chainId) + 1))
          }
        }
        st.end()
      })

      st.test('Should return false if input is not hex-prefixed', function (st) {
        st.notOk(isValidChecksumAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a'))
        st.end()
      })

      st.end()
    })
  })

  t.test('isValidAddress()', function (st) {
    st.test('should return true', function (st) {
      st.ok(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      st.ok(isValidAddress('0x52908400098527886E0F7030069857D2E4169EE7'))
      st.end()
    })
    st.test('should return false', function (st) {
      st.notOk(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6'))
      st.notOk(isValidAddress('0x2f015c60e0be116b1f0cd534704db9c92118fb6aa'))
      st.notOk(isValidAddress('2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      st.notOk(isValidAddress('x2f015c60e0be116b1f0cd534704db9c92118fb6a'))
      st.notOk(isValidAddress('0X52908400098527886E0F7030069857D2E4169EE7'))
      st.end()
    })
  })
})
