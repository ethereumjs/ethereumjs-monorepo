import { Account, Address, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

import pow = require('./../../testdata/geth-genesis/pow.json')

const method = 'eth_getStorageAt'

tape(`${method}: call with valid arguments`, async (t) => {
  const address = Address.fromString(`0x${'11'.repeat(20)}`)
  const emptySlotStr = `0x${'00'.repeat(32)}`

  const { execution, server } = await setupChain(pow, 'pow')

  let req = params(method, [address.toString(), '0x0', 'latest'])
  let expectRes = (res: any) => {
    const msg = 'should return the empty slot for nonexistent account'
    t.equal(res.body.result, emptySlotStr, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  await execution.vm.stateManager.putAccount(address, new Account())

  req = params(method, [address.toString(), '0x0', 'latest'])
  expectRes = (res: any) => {
    const msg = 'should return the empty slot for nonexistent slot'
    t.equal(res.body.result, emptySlotStr, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  const key = `0x${'01'.repeat(32)}`
  const value = `0x01`
  const valueAsBytes32 = `0x${'00'.repeat(31)}01`
  await execution.vm.stateManager.putContractStorage(
    address,
    hexStringToBytes(key),
    hexStringToBytes(value)
  )

  req = params(method, [address.toString(), key, 'latest'])
  expectRes = (res: any) => {
    const msg = 'should return the correct slot value'
    t.equal(res.body.result, valueAsBytes32, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // call with unsupported block argument
  req = params(method, [address.toString(), '0x0', 'pending'])
  expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})
