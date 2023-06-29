import { Block } from '@ethereumjs/block'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import pow from '../../testdata/geth-genesis/pow.json'
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

const method = 'eth_getStorageAt'

tape(`${method}: call with valid arguments`, async (t) => {
  const address = Address.fromString(`0x${'11'.repeat(20)}`)
  const emptySlotStr = `0x${'00'.repeat(32)}`

  const { execution, common, server, chain } = await setupChain(pow, 'pow')

  let req = params(method, [address.toString(), '0x0', 'latest'])
  let expectRes = (res: any) => {
    const msg = 'should return the empty slot for nonexistent account'
    t.equal(res.body.result, emptySlotStr, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // easy sample init contract:
  // push 00 NOT push 00 sstore
  // this stores NOT(0) (=0xfffff..ff) into slot 0
  // Note: previously a contract was initialized which stored 0x64 (100) here
  // However, 0x64 in RLP is still 0x64.
  // This new storage tests that higher RLP values than 0x80 also get returned correctly
  const data = '0x600019600055'
  const expectedSlotValue = '0x' + 'ff'.repeat(32)

  // construct block with tx
  const gasLimit = 2000000
  const tx = LegacyTransaction.fromTxData({ gasLimit, data }, { common, freeze: false })
  const signedTx = tx.sign(tx.getHashedMessageToSign())

  const parent = await chain.blockchain.getCanonicalHeadHeader()
  const block = Block.fromBlockData(
    {
      header: {
        parentHash: parent.hash(),
        number: 1,
        gasLimit,
      },
    },
    { common, calcDifficultyFromHeader: parent }
  )
  block.transactions[0] = signedTx

  // deploy contract
  let ranBlock: Block | undefined = undefined
  execution.vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
  const result = await execution.vm.runBlock({ block, generate: true, skipBlockValidation: true })
  const { createdAddress } = result.results[0]
  await chain.putBlocks([ranBlock as unknown as Block])

  // call with 'latest tag to see if account storage reflects newly put storage value
  req = params(method, [createdAddress!.toString(), '0x0', 'latest'])
  expectRes = (res: any) => {
    const msg = 'should return the correct slot value'
    t.equal(res.body.result, expectedSlotValue, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // call with 'earliest' tag to see if getStorageAt allows addressing blocks that are older than the latest block by tag
  req = params(method, [createdAddress!.toString(), '0x0', 'earliest'])
  expectRes = (res: any) => {
    const msg =
      'should not have new slot value for block that is addressed by "earliest" tag and is older than latest'
    t.equal(res.body.result, emptySlotStr, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // call with integer for block number to see if getStorageAt allows addressing blocks by number index
  req = params(method, [createdAddress!.toString(), '0x0', '0x1'])
  expectRes = (res: any) => {
    const msg =
      'should return the correct slot value when addressing the latest block by integer index'
    t.equal(res.body.result, expectedSlotValue, msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  // call with unsupported block argument
  req = params(method, [address.toString(), '0x0', 'pending'])
  expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})
