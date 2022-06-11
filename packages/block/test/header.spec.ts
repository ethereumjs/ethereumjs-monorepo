import tape from 'tape'
import { Address, zeros, KECCAK256_RLP, KECCAK256_RLP_ARRAY } from 'ethereumjs-util'
import RLP from 'rlp'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { Block } from '../src'
const blocksMainnet = require('./testdata/blocks_mainnet.json')
const blocksGoerli = require('./testdata/blocks_goerli.json')

tape('[Block]: Header functions', function (t) {
  t.test('should create with default constructor', function (st) {
    function compareDefaultHeader(st: tape.Test, header: BlockHeader) {
      st.ok(header.parentHash.equals(zeros(32)))
      st.ok(header.uncleHash.equals(KECCAK256_RLP_ARRAY))
      st.ok(header.coinbase.equals(Address.zero()))
      st.ok(header.stateRoot.equals(zeros(32)))
      st.ok(header.transactionsTrie.equals(KECCAK256_RLP))
      st.ok(header.receiptTrie.equals(KECCAK256_RLP))
      st.ok(header.logsBloom.equals(zeros(256)))
      st.equal(header.difficulty, BigInt(0))
      st.equal(header.number, BigInt(0))
      st.equal(header.gasLimit, BigInt('0xffffffffffffff'))
      st.equal(header.gasUsed, BigInt(0))
      st.equal(header.timestamp, BigInt(0))
      st.ok(header.extraData.equals(Buffer.from([])))
      st.ok(header.mixHash.equals(zeros(32)))
      st.ok(header.nonce.equals(zeros(8)))
    }

    const header = BlockHeader.fromHeaderData()
    compareDefaultHeader(st, header)

    const block = new Block()
    compareDefaultHeader(st, block.header)

    st.end()
  })

  t.test('Initialization -> fromHeaderData()', function (st) {
    const common = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    let header = BlockHeader.fromHeaderData(undefined, { common })
    st.ok(header.hash().toString('hex'), 'genesis block should initialize')
    st.equal(header._common.hardfork(), 'chainstart', 'should initialize with correct HF provided')

    common.setHardfork(Hardfork.Byzantium)
    st.equal(
      header._common.hardfork(),
      'chainstart',
      'should stay on correct HF if outer common HF changes'
    )

    header = BlockHeader.fromHeaderData({}, { common })
    st.ok(header.hash().toString('hex'), 'default block should initialize')

    // test default freeze values
    // also test if the options are carried over to the constructor
    header = BlockHeader.fromHeaderData({})
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromHeaderData({}, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')
    st.end()
  })

  t.test('Initialization -> fromRLPSerializedHeader()', function (st) {
    let header = BlockHeader.fromHeaderData({}, { freeze: false })

    const rlpHeader = header.serialize()
    header = BlockHeader.fromRLPSerializedHeader(rlpHeader)
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromRLPSerializedHeader(rlpHeader, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')

    st.end()
  })

  t.test('Initialization -> fromRLPSerializedHeader() -> error cases', function (st) {
    try {
      BlockHeader.fromRLPSerializedHeader(Buffer.from(RLP.encode('a')))
    } catch (e: any) {
      const expectedError = 'Invalid serialized header input. Must be array'
      st.ok(e.message.includes(expectedError), 'should throw with header as rlp encoded string')
    }
    st.end()
  })

  t.test('Initialization -> fromValuesArray()', function (st) {
    const zero = Buffer.alloc(0)
    const headerArray = []
    for (let item = 0; item < 15; item++) {
      headerArray.push(zero)
    }

    // mock header data (if set to zeros(0) header throws)
    headerArray[0] = zeros(32) //parentHash
    headerArray[2] = zeros(20) //coinbase
    headerArray[3] = zeros(32) //stateRoot
    headerArray[4] = zeros(32) //transactionsTrie
    headerArray[5] = zeros(32) //receiptTrie
    headerArray[13] = zeros(32) // mixHash
    headerArray[14] = zeros(8) // nonce

    let header = BlockHeader.fromValuesArray(headerArray)
    st.ok(Object.isFrozen(header), 'block should be frozen by default')

    header = BlockHeader.fromValuesArray(headerArray, { freeze: false })
    st.ok(!Object.isFrozen(header), 'block should not be frozen when freeze deactivated in options')
    st.end()
  })

  t.test('Initialization -> fromValuesArray() -> error cases', function (st) {
    const headerArray = Array(17).fill(Buffer.alloc(0))

    // mock header data (if set to zeros(0) header throws)
    headerArray[0] = zeros(32) //parentHash
    headerArray[2] = zeros(20) //coinbase
    headerArray[3] = zeros(32) //stateRoot
    headerArray[4] = zeros(32) //transactionsTrie
    headerArray[5] = zeros(32) //receiptTrie
    headerArray[13] = zeros(32) // mixHash
    headerArray[14] = zeros(8) // nonce
    headerArray[15] = zeros(4) // bad data
    try {
      BlockHeader.fromValuesArray(headerArray)
    } catch (e: any) {
      const expectedError = 'invalid header. More values than expected were received'
      st.ok(e.message.includes(expectedError), 'should throw on more values than expected')
    }

    try {
      BlockHeader.fromValuesArray(headerArray.slice(0, 5))
    } catch (e: any) {
      const expectedError = 'invalid header. Less values than expected were received'
      st.ok(e.message.includes(expectedError), 'should throw on less values than expected')
    }
    st.end()
  })

  t.test('Initialization -> Clique Blocks', function (st) {
    const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    const cliqueSigner = Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    )
    let header = BlockHeader.fromHeaderData(undefined, { common, cliqueSigner })
    st.ok(header.hash().toString('hex'), 'genesis block should initialize')
    header = BlockHeader.fromHeaderData({}, { common, cliqueSigner })
    st.ok(header.hash().toString('hex'), 'default block should initialize')
    st.end()
  })

  t.test('should test isGenesis()', function (st) {
    const header1 = BlockHeader.fromHeaderData({ number: 1 })
    st.equal(header1.isGenesis(), false)

    const header2 = BlockHeader.fromHeaderData()
    st.equal(header2.isGenesis(), true)
    st.end()
  })

  t.test('should test hash() function', function (st) {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    let header = BlockHeader.fromHeaderData(blocksMainnet[0]['header'], { common })
    st.equal(
      header.hash().toString('hex'),
      '88e96d4537bea4d9c05d12549907b32561d3bf31f45aae734cdc119f13406cb6',
      'correct PoW hash (mainnet block 1)'
    )

    common = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Chainstart })
    header = BlockHeader.fromHeaderData(blocksGoerli[0]['header'], { common })
    st.equal(
      header.hash().toString('hex'),
      '8f5bab218b6bb34476f51ca588e9f4553a3a7ce5e13a66c660a5283e97e9a85a',
      'correct PoA clique hash (goerli block 1)'
    )
    st.end()
  })
})
