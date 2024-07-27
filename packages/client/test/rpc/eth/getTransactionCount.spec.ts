import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createLegacyTx, createTxFromTxData } from '@ethereumjs/tx'
import {
  Account,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { runBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullEthereumService } from '../../../src/service/index.js'
import type { Block } from '@ethereumjs/block'

const method = 'eth_getTransactionCount'

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

    // since synchronizer.run() is not executed in the mock setup,
    // manually run stateManager.generateCanonicalGenesis()
    await vm.stateManager.generateCanonicalGenesis!(getGenesis(1))

    // a genesis address
    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

    // verify nonce is 0
    let res = await rpc.request(method, [address.toString(), 'latest'])
    assert.equal(res.result, '0x0', 'should return the correct nonce (0)')

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

    // verify nonce increments after a tx
    res = await rpc.request(method, [address.toString(), 'latest'])
    assert.equal(res.result, '0x1', 'should return the correct nonce (1)')

    // call with nonexistent account
    res = await rpc.request(method, [`0x${'11'.repeat(20)}`, 'latest'])
    assert.equal(res.result, `0x0`, 'should return 0x0 for nonexistent account')
  }, 40000)

  it('call with pending block argument', async () => {
    const blockchain = await createBlockchain()

    const client = await createClient({ blockchain, includeVM: true })
    const manager = createManager(client)
    const service = client.services.find((s) => s.name === 'eth') as FullEthereumService
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const pk = hexToBytes('0x266682876da8fd86410d001ec33c7c281515aeeb640d175693534062e2599238')
    const address = createAddressFromPrivateKey(pk)
    await service.execution.vm.stateManager.putAccount(address, new Account())
    const account = await service.execution.vm.stateManager.getAccount(address)
    account!.balance = 0xffffffffffffffn
    await service.execution.vm.stateManager.putAccount(address, account!)
    const tx = createTxFromTxData({
      to: randomBytes(20),
      value: 1,
      maxFeePerGas: 0xffffff,
    }).sign(pk)

    // Set stubs so getTxCount won't validate txns or mess up state root
    service.txPool['validate'] = () => Promise.resolve(undefined)
    service.execution.vm.stateManager.setStateRoot = () => Promise.resolve(undefined)
    service.execution.vm.shallowCopy = () => Promise.resolve(service.execution.vm)

    await service.txPool.add(tx, true)

    const res = await rpc.request(method, [address.toString(), 'pending'])
    assert.equal(res.result, '0x1')
  }, 40000)
})
