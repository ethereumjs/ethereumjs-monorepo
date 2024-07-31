import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createLegacyTx } from '@ethereumjs/tx'
import { bigIntToHex, createAddressFromString } from '@ethereumjs/util'
import { runBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullEthereumService } from '../../../src/service/index.js'

const method = 'eth_getBalance'

describe(
  method,
  () => {
    it('ensure balance deducts after a tx', async () => {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
      const blockchain = await createBlockchain({ common })

      const client = await createClient({ blockchain, commonChain: common, includeVM: true })
      const manager = createManager(client)

      const rpc = getRpcClient(startRPC(manager.getMethods()))

      const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
      assert.notEqual(execution, undefined, 'should have valid execution')
      const { vm } = execution

      // since synchronizer.run() is not executed in the mock setup,
      // manually run stateManager.generateCanonicalGenesis()
      await vm.stateManager.generateCanonicalGenesis!(getGenesis(1))

      // genesis address with balance
      const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

      // verify balance is genesis amount
      const genesisBalance = BigInt(0x15ac56edc4d12c0000)
      let res = await rpc.request(method, [address.toString(), 'latest'])

      assert.equal(
        res.result,
        bigIntToHex(genesisBalance),
        'should return the correct genesis balance',
      )

      // construct block with tx
      const tx = createLegacyTx({ gasLimit: 53000 }, { common, freeze: false })
      tx.getSenderAddress = () => {
        return address
      }
      const block = createBlock({}, { common })
      block.transactions[0] = tx

      const result = await runBlock(vm, { block, generate: true, skipBlockValidation: true })
      const { amountSpent } = result.results[0]

      // verify balance is genesis amount minus amountSpent
      const expectedNewBalance = genesisBalance - amountSpent
      res = await rpc.request(method, [address.toString(), 'latest'])
      assert.equal(
        res.result,
        bigIntToHex(expectedNewBalance),
        'should return the correct balance after a tx',
      )

      // verify we can query with "earliest"
      res = await rpc.request(method, [address.toString(), 'earliest'])
      assert.equal(
        res.result,
        bigIntToHex(genesisBalance),
        "should return the correct balance with 'earliest'",
      )

      // verify we can query with a past block number
      res = await rpc.request(method, [address.toString(), '0x0'])
      assert.equal(
        res.result,
        bigIntToHex(genesisBalance),
        'should return the correct balance with a past block number',
      )

      // call with height that exceeds chain height
      res = await rpc.request(method, [address.toString(), '0x1'])
      assert.equal(res.error.code, INVALID_PARAMS)
      assert.ok(res.error.message.includes('specified block greater than current height'))

      // call with nonexistent account
      res = await rpc.request(method, [`0x${'11'.repeat(20)}`, 'latest'])
      assert.equal(res.result, `0x0`, 'should return 0x0 for nonexistent account')
    })

    it('call with unsupported block argument', async () => {
      const blockchain = await createBlockchain()

      const client = await createClient({ blockchain, includeVM: true })
      const manager = createManager(client)
      const rpc = getRpcClient(startRPC(manager.getMethods()))

      const res = await rpc.request(method, [
        '0xccfd725760a68823ff1e062f4cc97e1360e8d997',
        'pending',
      ])
      assert.equal(res.error.code, INVALID_PARAMS)
      assert.ok(res.error.message.includes('"pending" is not yet supported'))
    })
  },
  40000,
)
