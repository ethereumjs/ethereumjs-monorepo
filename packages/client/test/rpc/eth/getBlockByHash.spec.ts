import { Transaction } from '@ethereumjs/tx'
import tape from 'tape'
import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseSetup, params, baseRequest, dummy, runBlockWithTxs, setupChain } from '../helpers'
import { checkError } from '../util'
import pow from './../../testdata/geth-genesis/pow.json'

const method = 'eth_getBlockByHash'

tape(`${method}: call with valid arguments and includeTransactions = false`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [
    '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf',
    false,
  ])
  const expectRes = (res: any) => {
    const msg = 'should return the correct number'
    t.equal(res.body.result.number, '0x444444', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid arguments and includeTransactions = true`, async (t) => {
  const { chain, common, execution, server } = await setupChain(pow, 'pow', { txLookupLimit: 1 })

  // setup tx, block, and chain
  const tx = Transaction.fromTxData(
    { gasLimit: 2000000, gasPrice: 100, to: '0x0000000000000000000000000000000000000000' },
    { common }
  ).sign(dummy.privKey)
  await runBlockWithTxs(chain, execution, [tx])

  const req = params(method, [
    '0xb1ecc0eec666d08ae96f792f8105f316db20c3d59c77a60f685c2d0563b687cd',
    true,
  ])

  const expectRes = (res: any) => {
    t.equal(
      typeof res.body.result.transactions[0],
      'object',
      'should return a transaction object with an object'
    )
    t.equal(
      res.body.result.transactions[0].from,
      dummy.addr.toString(),
      'transaction object should contain correct "from" field'
    )
  }
  await baseRequest(t, server, req, 200, expectRes, true) // pass endOnFinish=true for last test
})

tape(`${method}: call with false for second argument`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, [
    '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
    false,
  ])
  const expectRes = (res: any) => {
    let msg = 'should return the correct number'
    t.equal(res.body.result.number, '0x444444', msg)
    msg = 'should return only the hashes of the transactions'
    t.equal(typeof res.body.result.transactions[0], 'string', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid block hash without 0x`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['WRONG BLOCK NUMBER', true])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument 0: hex string without 0x prefix'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex string as block hash`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0xWRONG BLOCK NUMBER', true])
  const expectRes = checkError(t, INVALID_PARAMS, 'invalid argument 0: invalid block hash')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call without second parameter`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0x0'])
  const expectRes = checkError(t, INVALID_PARAMS, 'missing value for required argument 1')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid second parameter`, async (t) => {
  const { server } = baseSetup()

  const req = params(method, ['0x0', 'INVALID PARAMETER'])
  const expectRes = checkError(t, INVALID_PARAMS)
  await baseRequest(t, server, req, 200, expectRes)
})
