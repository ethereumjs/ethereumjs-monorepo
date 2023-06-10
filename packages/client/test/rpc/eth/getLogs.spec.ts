import { LegacyTransaction } from '@ethereumjs/tx'
import { Address, bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, dummy, params, runBlockWithTxs, setupChain } from '../helpers'
import { checkError } from '../util'

import pow = require('./../../testdata/geth-genesis/pow.json')

const method = 'eth_getLogs'

/*
  Contract to test logs:
  ```sol
  pragma solidity >=0.7.0 <0.9.0;
  contract LogExample {
      event Log(uint256 indexed num1, uint256 indexed num2, uint256 indexed num3, uint256 num4);
      function log(uint256 logCount, uint256 num1, uint256 num2, uint256 num3, uint256 num4) public {
          for (uint i=0; i<logCount; i++) {
            emit Log(num1, num2, num3, num4);
          }
      }
  }
  ```
*/
const logExampleBytecode = hexStringToBytes(
  '608060405234801561001057600080fd5b50610257806100206000396000f3fe608060405234801561001057600080fd5b5060043610610048576000357c010000000000000000000000000000000000000000000000000000000090048063aefb4f0a1461004d575b600080fd5b610067600480360381019061006291906100de565b610069565b005b60005b858110156100c1578284867fbf642f3055e2ef2589825c2c0dd4855c1137a63f6260d9d112629e5cd034a3eb856040516100a69190610168565b60405180910390a480806100b99061018d565b91505061006c565b505050505050565b6000813590506100d88161020a565b92915050565b600080600080600060a086880312156100fa576100f9610205565b5b6000610108888289016100c9565b9550506020610119888289016100c9565b945050604061012a888289016100c9565b935050606061013b888289016100c9565b925050608061014c888289016100c9565b9150509295509295909350565b61016281610183565b82525050565b600060208201905061017d6000830184610159565b92915050565b6000819050919050565b600061019882610183565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156101cb576101ca6101d6565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600080fd5b61021381610183565b811461021e57600080fd5b5056fea2646970667358221220b98f45f4d4112e71fd287ab0ce7cc1872e53b463eb0abf1182b892192d3d8a1d64736f6c63430008070033'
)

tape(`${method}: call with valid arguments`, async (t) => {
  const { chain, common, execution, server } = await setupChain(pow, 'pow')

  // deploy contracts at two different addresses
  const txData = { gasLimit: 2000000, gasPrice: 100 }
  const tx1 = LegacyTransaction.fromTxData(
    {
      ...txData,
      data: logExampleBytecode,
      nonce: 0,
    },
    { common }
  ).sign(dummy.privKey)
  const tx2 = LegacyTransaction.fromTxData(
    {
      ...txData,
      data: logExampleBytecode,
      nonce: 1,
    },
    { common }
  ).sign(dummy.privKey)

  const contractAddr1 = Address.generate(dummy.addr, BigInt(0))
  const contractAddr2 = Address.generate(dummy.addr, BigInt(1))
  // construct txs to emit the logs
  // data calls log(logCount: 10, num1: 1, num2: 2, num3: 3, num4: 4)
  const data = hexStringToBytes(
    'aefb4f0a000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004'
  )
  const tx3 = LegacyTransaction.fromTxData(
    {
      ...txData,
      data,
      to: contractAddr1,
      nonce: 2,
    },
    { common }
  ).sign(dummy.privKey)
  const tx4 = LegacyTransaction.fromTxData(
    {
      ...txData,
      data,
      to: contractAddr2,
      nonce: 3,
    },
    { common }
  ).sign(dummy.privKey)

  await runBlockWithTxs(chain, execution, [tx1, tx2, tx3, tx4])

  // compare the logs
  let req = params(method, [{ fromBlock: 'earliest', toBlock: 'latest' }])
  let expectRes = (res: any) => {
    const msg = `should return the correct logs (fromBlock/toBlock as 'earliest' and 'latest')`
    if (
      res.body.result.length === 20 &&
      res.body.result[0].address === contractAddr1.toString() &&
      res.body.result[10].address === contractAddr2.toString() &&
      res.body.result[0].topics[0] ===
        '0xbf642f3055e2ef2589825c2c0dd4855c1137a63f6260d9d112629e5cd034a3eb' &&
      res.body.result[0].topics[1] ===
        '0x0000000000000000000000000000000000000000000000000000000000000001' &&
      res.body.result[0].topics[2] ===
        '0x0000000000000000000000000000000000000000000000000000000000000002' &&
      res.body.result[0].topics[3] ===
        '0x0000000000000000000000000000000000000000000000000000000000000003'
    ) {
      t.pass(msg)
    } else {
      t.fail(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // get the logs using fromBlock/toBlock as numbers
  req = params(method, [{ fromBlock: '0x0', toBlock: '0x1' }])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (fromBlock/toBlock as block numbers)'
    t.equal(res.body.result.length, 20, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by single address
  req = params(method, [{ address: contractAddr1.toString() }])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by single address)'
    if (
      res.body.result.length === 10 &&
      res.body.result.every((r: any) => r.address === contractAddr1.toString()) === true
    ) {
      t.pass(msg)
    } else {
      t.fail(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by multiple addresses
  const addresses = [contractAddr1.toString(), contractAddr2.toString()]
  req = params(method, [{ address: addresses }])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by multiple addresses)'
    if (
      res.body.result.length === 20 &&
      res.body.result.every((r: any) => addresses.includes(r.address)) === true
    ) {
      t.pass(msg)
    } else {
      t.fail(msg)
    }
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by topics (empty means anything)
  req = params(method, [{ topics: [] }])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by topic - empty means anything)'
    t.equal(res.body.result.length, 20, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by topics (exact match)
  req = params(method, [
    { topics: ['0xbf642f3055e2ef2589825c2c0dd4855c1137a63f6260d9d112629e5cd034a3eb'] },
  ])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by topic - exact match)'
    t.equal(res.body.result.length, 20, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by topics (exact match for second topic)
  req = params(method, [
    { topics: [null, '0x0000000000000000000000000000000000000000000000000000000000000001'] },
  ])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by topic - exact match for second topic)'
    t.equal(res.body.result.length, 20, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by topics (A or B in first position)
  req = params(method, [
    {
      topics: [
        [
          '0xbf642f3055e2ef2589825c2c0dd4855c1137a63f6260d9d112629e5cd034a3eb',
          '0x0000000000000000000000000000000000000000000000000000000000000001',
        ],
        null,
        '0x0000000000000000000000000000000000000000000000000000000000000002',
      ],
    },
  ])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by topic - A or B in first position)'
    t.equal(res.body.result.length, 20, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by topics (null means anything)
  req = params(method, [
    {
      topics: [null, null, '0x0000000000000000000000000000000000000000000000000000000000000002'],
    },
  ])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by topic - null means anything)'
    t.equal(res.body.result.length, 20, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // test filtering by blockHash
  const latestHeader = chain.headers.latest!
  req = params(method, [
    {
      blockHash: bytesToPrefixedHexString(latestHeader.hash()),
    },
  ])
  expectRes = (res: any) => {
    const msg = 'should return the correct logs (filter by blockHash)'
    t.equal(res.body.result.length, 20, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, true) // pass endOnFinish=true for last test
})

tape(`${method}: call with invalid params`, async (t) => {
  const { server } = await setupChain(pow, 'pow')

  // fromBlock greater than current height
  let req = params(method, [{ fromBlock: '0x1234' }])
  let expectRes = checkError(t, INVALID_PARAMS, 'specified `fromBlock` greater than current height')
  await baseRequest(t, server, req, 200, expectRes, false)

  // toBlock greater than current height
  req = params(method, [{ toBlock: '0x1234' }])
  expectRes = checkError(t, INVALID_PARAMS, 'specified `toBlock` greater than current height')
  await baseRequest(t, server, req, 200, expectRes, false)

  // unknown blockHash
  req = params(method, [
    { blockHash: '0x1000000000000000000000000000000000000000000000000000000000000001' },
  ])
  expectRes = checkError(t, INVALID_PARAMS, 'unknown blockHash')
  await baseRequest(t, server, req, 200, expectRes, false)

  // specifying fromBlock or toBlock with blockHash
  req = params(method, [
    {
      fromBlock: 'latest',
      blockHash: '0x1000000000000000000000000000000000000000000000000000000000000001',
    },
  ])
  expectRes = checkError(
    t,
    INVALID_PARAMS,
    'Can only specify a blockHash if fromBlock or toBlock are not provided'
  )
  await baseRequest(t, server, req, 200, expectRes, false)
  req = params(method, [
    {
      toBlock: 'latest',
      blockHash: '0x1000000000000000000000000000000000000000000000000000000000000001',
    },
  ])
  expectRes = checkError(
    t,
    INVALID_PARAMS,
    'Can only specify a blockHash if fromBlock or toBlock are not provided'
  )
  await baseRequest(t, server, req, 200, expectRes, false)

  // unknown address
  req = params(method, [{ address: '0x0000000000000000000000000000000000000001' }])
  expectRes = (res: any) => {
    const msg = 'should return empty logs'
    t.equal(res.body.result.length, 0, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // invalid topic
  req = params(method, [{ topics: ['0x1234'] }])
  expectRes = (res: any) => {
    const msg = 'should return empty logs'
    t.equal(res.body.result.length, 0, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, true) // pass endOnFinish=true for last test
})
