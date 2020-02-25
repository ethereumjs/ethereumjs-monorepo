import * as tape from 'tape'
import { Buffer } from 'buffer'
import { bufferToHex } from 'ethereumjs-util'
import Common from 'ethereumjs-common'
import { FakeTransaction } from '../src'
import { FakeTxData } from './types'

// Use private key 0x0000000000000000000000000000000000000000000000000000000000000001 as 'from' Account
const txData: FakeTxData = {
  data: '0x7cf5dab00000000000000000000000000000000000000000000000000000000000000005',
  gasLimit: '0x15f90',
  gasPrice: '0x1',
  nonce: '0x01',
  to: '0xd9024df085d09398ec76fbed18cac0e1149f50dc',
  value: '0x0',
  from: '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf',
  v: '0x1c',
  r: '0x25641558260ac737ea6d800906c6d085a801e5e0f0952bf93978d6fa468fbdfe',
  s: '0x5d0904b8f9cfc092805df0cde2574d25e2c5fc28907a9a4741b3e857b68b0778',
}

tape('[FakeTransaction]: Basic functions', function(t) {
  t.test('instantiate with from / create a hash', function(st) {
    st.plan(3)
    // This test doesn't use EIP155
    const tx = new FakeTransaction(txData, { chain: 'mainnet', hardfork: 'homestead' })
    const hash = tx.hash()
    const cmpHash = Buffer.from(
      'f74b039f6361c4351a99a7c6a10867369fe6701731d85dc07c15671ac1c1b648',
      'hex',
    )
    st.deepEqual(hash, cmpHash, 'should create hash with includeSignature=true (default)')
    const hash2 = tx.hash(false)
    const cmpHash2 = Buffer.from(
      '0401bf740d698674be321d0064f92cd6ebba5d73d1e5e5189c0bebbda33a85fe',
      'hex',
    )
    st.deepEqual(hash2, cmpHash2, 'should create hash with includeSignature=false')
    st.notDeepEqual(hash, hash2, 'previous hashes should be different')
  })

  t.test('instantiate without from / create a hash', function(st) {
    const txDataNoFrom = Object.assign({}, txData)
    delete txDataNoFrom['from']
    st.plan(3)
    const tx = new FakeTransaction(txDataNoFrom)
    const hash = tx.hash()
    const cmpHash = Buffer.from(
      '80a2ca70509414908881f718502e6bbb3bc67f416abdf972ea7c0888579be7b9',
      'hex',
    )
    st.deepEqual(hash, cmpHash, 'should create hash with includeSignature=true (default)')
    const hash2 = tx.hash(false)
    const cmpHash2 = Buffer.from(
      '0401bf740d698674be321d0064f92cd6ebba5d73d1e5e5189c0bebbda33a85fe',
      'hex',
    )
    st.deepEqual(hash2, cmpHash2, 'should create hash with includeSignature=false')
    st.notDeepEqual(hash, hash2, 'previous hashes should be different')
  })

  t.test('should not produce hash collsions for different senders', function(st) {
    st.plan(1)
    const txDataModFrom = Object.assign({}, txData, {
      from: '0x2222222222222222222222222222222222222222',
    })
    const tx = new FakeTransaction(txData)
    const txModFrom = new FakeTransaction(txDataModFrom)
    const hash = bufferToHex(tx.hash())
    const hashModFrom = bufferToHex(txModFrom.hash())
    st.notEqual(
      hash,
      hashModFrom,
      'FakeTransactions with different `from` addresses but otherwise identical data should have different hashes',
    )
  })

  t.test('should retrieve "from" from signature if transaction is signed', function(st) {
    const txDataNoFrom = Object.assign({}, txData)
    delete txDataNoFrom['from']
    st.plan(1)

    const tx = new FakeTransaction(txDataNoFrom)
    st.equal(bufferToHex(tx.from), txData.from)
  })

  t.test('should throw if common and chain options are passed to constructor', function(st) {
    const txOptsInvalid = {
      chain: 'mainnet',
      common: new Common('mainnet', 'chainstart'),
    }
    st.plan(1)
    st.throws(() => new FakeTransaction(txData, txOptsInvalid))
  })

  t.test('should return toCreationAddress', st => {
    const tx = new FakeTransaction(txData)
    const txNoTo = new FakeTransaction({ ...txData, to: undefined })
    st.plan(2)
    st.equal(tx.toCreationAddress(), false, 'tx is not "to" creation address')
    st.equal(txNoTo.toCreationAddress(), true, 'tx is "to" creation address')
  })

  t.test('should return getChainId', st => {
    const tx = new FakeTransaction(txData)
    const txWithChain = new FakeTransaction(txData, { chain: 3 })
    st.plan(2)
    st.equal(tx.getChainId(), 1, 'should return correct chainId')
    st.equal(txWithChain.getChainId(), 3, 'should return correct chainId')
  })

  t.test('should getSenderAddress and getSenderPublicKey', st => {
    const tx = new FakeTransaction(txData)
    st.plan(2)
    st.equal(
      tx.from.toString('hex'),
      '7e5f4552091a69125d5dfcb7b8c2659029395bdf',
      'this._from is set in FakeTransaction',
    )
    st.equal(
      tx.getSenderAddress().toString('hex'),
      '7e5f4552091a69125d5dfcb7b8c2659029395bdf',
      'should return correct address',
    )
  })

  t.test('should verifySignature', st => {
    const tx = new FakeTransaction(txData)
    const txWithWrongSignature = new FakeTransaction({
      ...txData,
      r: Buffer.from('abcd1558260ac737ea6d800906c6d085a801e5e0f0952bf93978d6fa468fbdff', 'hex'),
    })
    st.plan(2)
    st.true(tx.verifySignature(), 'signature is valid')
    st.false(txWithWrongSignature.verifySignature(), 'signature is not valid')
  })

  t.test('should sign', st => {
    const tx = new FakeTransaction(txData, { hardfork: 'tangerineWhistle' })
    tx.sign(Buffer.from('164122e5d39e9814ca723a749253663bafb07f6af91704d9754c361eb315f0c1', 'hex'))
    st.plan(3)
    st.equal(
      tx.r.toString('hex'),
      'c10062450d68caa5a688e2b6930f34f8302064afe6e1ba7f6ca459115a31d3b8',
      'r should be valid',
    )
    st.equal(
      tx.s.toString('hex'),
      '31718e6bf821a98d35b0d9cd66ea86f91f420c3c4658f60c607222de925d222a',
      's should be valid',
    )
    st.equal(tx.v.toString('hex'), '1c', 'v should be valid')
  })

  t.test('should getDataFee', st => {
    const tx = new FakeTransaction({ ...txData, data: '0x00000001' })
    st.plan(1)
    st.equal(tx.getDataFee().toString(), '80', 'data fee should be correct')
  })

  t.test('should getBaseFee', st => {
    const tx = new FakeTransaction({ ...txData, data: '0x00000001' })
    st.plan(1)
    st.equal(tx.getBaseFee().toString(), '21080', 'base fee should be correct')
  })

  t.test('should getUpfrontCost', st => {
    const tx = new FakeTransaction({ ...txData, gasLimit: '0x6464', gasPrice: '0x2' })
    st.plan(1)
    st.equal(tx.getUpfrontCost().toString(), '51400', 'base fee should be correct')
  })

  t.test('should validate', st => {
    const tx = new FakeTransaction(txData)
    const txWithWrongSignature = new FakeTransaction({
      ...txData,
      r: Buffer.from('abcd1558260ac737ea6d800906c6d085a801e5e0f0952bf93978d6fa468fbdff', 'hex'),
    })
    const txWithLowLimit = new FakeTransaction({
      ...txData,
      gasLimit: '0x1',
    })
    st.plan(6)
    st.true(tx.validate(), 'tx should be valid')
    st.false(txWithWrongSignature.validate(), 'tx should be invalid')
    st.false(txWithLowLimit.validate(), 'tx should be invalid')
    st.equal(tx.validate(true), '', 'tx should return no errors')
    st.equal(
      txWithWrongSignature.validate(true),
      'Invalid Signature',
      'tx should return correct error',
    )
    st.equal(
      txWithLowLimit.validate(true),
      'gas limit is too low. Need at least 21464',
      'tx should return correct error',
    )
  })
})
