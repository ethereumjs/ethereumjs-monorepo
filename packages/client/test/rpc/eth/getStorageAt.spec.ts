import { createBlock } from '@ethereumjs/block'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromString } from '@ethereumjs/util'
import { runBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import pow from '../../testdata/geth-genesis/pow.json'
import { getRpcClient, setupChain } from '../helpers.js'

import type { Block } from '@ethereumjs/block'

const method = 'eth_getStorageAt'

describe(method, async () => {
  it('call with valid arguments', async () => {
    const address = createAddressFromString(`0x${'11'.repeat(20)}`)
    const emptySlotStr = `0x${'00'.repeat(32)}`

    const { execution, common, server, chain } = await setupChain(pow, 'pow')
    const rpc = getRpcClient(server)
    let res = await rpc.request(method, [address.toString(), '0x0', 'latest'])
    assert.equal(res.result, emptySlotStr, 'should return the empty slot for nonexistent account')

    // sample contract from https://ethereum.stackexchange.com/a/70791
    const data =
      '0x608060405234801561001057600080fd5b506040516020806100ef8339810180604052602081101561003057600080fd5b810190808051906020019092919050505080600081905550506098806100576000396000f3fe6080604052600436106039576000357c010000000000000000000000000000000000000000000000000000000090048063a2a9679914603e575b600080fd5b348015604957600080fd5b5060506066565b6040518082815260200191505060405180910390f35b6000548156fea165627a7a72305820fe2ba3506418c87a075f8f3ae19bc636bd4c18ebde0644bcb45199379603a72c00290000000000000000000000000000000000000000000000000000000000000064'
    const expectedSlotValue = `0x${data.slice(data.length - 64)}`

    // construct block with tx
    const gasLimit = 2000000
    const tx = createLegacyTx({ gasLimit, data }, { common, freeze: false })
    const signedTx = tx.sign(tx.getHashedMessageToSign())

    const parent = await chain.blockchain.getCanonicalHeadHeader()
    const block = createBlock(
      {
        header: {
          parentHash: parent.hash(),
          number: 1,
          gasLimit,
        },
      },
      { common, calcDifficultyFromHeader: parent },
    )
    block.transactions[0] = signedTx

    // deploy contract
    let ranBlock: Block | undefined = undefined
    execution.vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
    const result = await runBlock(execution.vm, {
      block,
      generate: true,
      skipBlockValidation: true,
    })
    const { createdAddress } = result.results[0]
    await chain.putBlocks([ranBlock as unknown as Block])

    // call with 'latest tag to see if account storage reflects newly put storage value
    res = await rpc.request(method, [createdAddress!.toString(), '0x0', 'latest'])
    assert.equal(res.result, expectedSlotValue, 'should return the correct slot value')

    // call with 'earliest' tag to see if getStorageAt allows addressing blocks that are older than the latest block by tag
    res = await rpc.request(method, [createdAddress!.toString(), '0x0', 'earliest'])
    assert.equal(
      res.result,
      emptySlotStr,
      'should not have new slot value for block that is addressed by "earliest" tag and is older than latest',
    )

    // call with integer for block number to see if getStorageAt allows addressing blocks by number index
    res = await rpc.request(method, [createdAddress!.toString(), '0x0', '0x1'])
    assert.equal(
      res.result,
      expectedSlotValue,
      'should return the correct slot value when addressing the latest block by integer index',
    )

    // call with unsupported block argument
    res = await rpc.request(method, [address.toString(), '0x0', 'pending'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('"pending" is not yet supported'))
  })
})
