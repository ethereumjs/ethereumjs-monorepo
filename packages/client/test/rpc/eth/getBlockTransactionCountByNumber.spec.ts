import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromString } from '@ethereumjs/util'
import { runBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullEthereumService } from '../../../src/service/index.js'
import type { Block } from '@ethereumjs/block'

const method = 'eth_getBlockTransactionCountByNumber'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })

describe(method, () => {
  it('call with valid arguments', async () => {
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

    await vm.stateManager.generateCanonicalGenesis!(getGenesis(1))

    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

    // construct block with tx
    const tx = createLegacyTx({ gasLimit: 53000 }, { common, freeze: false })
    tx.getSenderAddress = () => {
      return address
    }
    const parent = await blockchain.getCanonicalHeadHeader()
    const block = createBlock(
      {
        header: {
          parentHash: parent.hash(),
          number: 1,
          gasLimit: 2000000,
        },
      },
      { common, calcDifficultyFromHeader: parent },
    )
    block.transactions[0] = tx

    let ranBlock: Block | undefined = undefined
    vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
    await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    await vm.blockchain.putBlock(ranBlock!)

    // verify that the transaction count is 1
    const res = await rpc.request(method, ['latest'])
    assert.equal(res.result, '0x1', 'should return the correct block transaction count(1)')
  })

  it('call with valid arguments (multiple transactions)', async () => {
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

    await vm.stateManager.generateCanonicalGenesis!(getGenesis(1))

    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

    // construct block with tx
    const tx = createLegacyTx({ gasLimit: 53000 }, { common, freeze: false })
    tx.getSenderAddress = () => {
      return address
    }
    const tx2 = createLegacyTx({ gasLimit: 53000, nonce: 1 }, { common, freeze: false })
    tx2.getSenderAddress = () => {
      return address
    }
    const tx3 = createLegacyTx({ gasLimit: 53000, nonce: 2 }, { common, freeze: false })
    tx3.getSenderAddress = () => {
      return address
    }

    const parent = await blockchain.getCanonicalHeadHeader()
    const block = createBlock(
      {
        header: {
          parentHash: parent.hash(),
          number: 1,
          gasLimit: 2000000,
        },
      },
      { common, calcDifficultyFromHeader: parent },
    )
    block.transactions[0] = tx
    block.transactions[1] = tx2
    block.transactions[2] = tx3

    let ranBlock: Block | undefined = undefined
    vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
    await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    await vm.blockchain.putBlock(ranBlock!)

    // verify that the transaction count is 3
    // specify the block number instead of using latest
    const res = await rpc.request(method, ['0x1'])
    assert.equal(res.result, '0x3', 'should return the correct block transaction count(3)')
  })

  it('call with unsupported block argument', async () => {
    const blockchain = await createBlockchain()

    const client = await createClient({ blockchain, includeVM: true })
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const res = await rpc.request(method, ['pending'])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('"pending" is not yet supported'))
  })
})
