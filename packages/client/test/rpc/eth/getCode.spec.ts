import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromString, createContractAddress } from '@ethereumjs/util'
import { runBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullEthereumService } from '../../../src/service/index.js'
import type { Block } from '@ethereumjs/block'

const method = 'eth_getCode'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })

describe(method, () => {
  it('call with valid arguments', async () => {
    const blockchain = await createBlockchain({ common })

    const client = await createClient({ blockchain, commonChain: common, includeVM: true })
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
    assert.notEqual(execution, undefined, 'should have valid execution')
    const { vm } = execution
    await vm.stateManager.generateCanonicalGenesis!(getGenesis(1))

    // genesis address
    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

    // verify code is null
    const res = await rpc.request(method, [address.toString(), 'latest'])
    assert.equal(res.result, '0x', 'should return the correct code')
  })

  it('ensure returns correct code', async () => {
    const blockchain = await createBlockchain({
      common,
      validateBlocks: false,
      validateConsensus: false,
    })

    const client = await createClient({ blockchain, commonChain: common, includeVM: true })
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
    assert.notEqual(execution, undefined, 'should have valid execution')
    const { vm } = execution

    // genesis address with balance
    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

    // sample contract from https://ethereum.stackexchange.com/a/70791
    const data =
      '0x608060405234801561001057600080fd5b506040516020806100ef8339810180604052602081101561003057600080fd5b810190808051906020019092919050505080600081905550506098806100576000396000f3fe6080604052600436106039576000357c010000000000000000000000000000000000000000000000000000000090048063a2a9679914603e575b600080fd5b348015604957600080fd5b5060506066565b6040518082815260200191505060405180910390f35b6000548156fea165627a7a72305820fe2ba3506418c87a075f8f3ae19bc636bd4c18ebde0644bcb45199379603a72c00290000000000000000000000000000000000000000000000000000000000000064'
    const code =
      '0x6080604052600436106039576000357c010000000000000000000000000000000000000000000000000000000090048063a2a9679914603e575b600080fd5b348015604957600080fd5b5060506066565b6040518082815260200191505060405180910390f35b6000548156fea165627a7a72305820fe2ba3506418c87a075f8f3ae19bc636bd4c18ebde0644bcb45199379603a72c0029'

    // construct block with tx
    const gasLimit = 2000000
    const tx = createLegacyTx({ gasLimit, data }, { common, freeze: false })
    tx.getSenderAddress = () => {
      return address
    }
    const parent = await blockchain.getCanonicalHeadHeader()
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
    block.transactions[0] = tx

    // deploy contract
    let ranBlock: Block | undefined = undefined
    vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
    const result = await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    const { createdAddress } = result.results[0]
    await vm.blockchain.putBlock(ranBlock!)

    const expectedContractAddress = createContractAddress(address, BigInt(0))
    assert.ok(
      createdAddress!.equals(expectedContractAddress),
      'should match the expected contract address',
    )

    // verify contract has code
    const res = await rpc.request(method, [expectedContractAddress.toString(), 'latest'])
    assert.equal(res.result, code, 'should return the correct code')
  })

  it('call with unsupported block argument', async () => {
    const blockchain = await createBlockchain()

    const client = await createClient({ blockchain, includeVM: true })
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['0xccfd725760a68823ff1e062f4cc97e1360e8d997', 'pending'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('"pending" is not yet supported'))
  })
})
