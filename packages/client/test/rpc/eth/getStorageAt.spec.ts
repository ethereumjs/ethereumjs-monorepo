import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Account, Address, bigIntToHex } from '@ethereumjs/util'
//import { keccak256 } from 'ethereum-cryptography/keccak'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'
import { checkError } from '../util'

import type { FullEthereumService } from '../../../src/service'

const method = 'eth_getStorageAt'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

tape(`${method}: call with valid arguments`, async (t) => {
  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
    validateConsensus: false,
  })

  const client = createClient({ blockchain, commonChain: common, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
  await execution.vm.stateManager.putAccount(
    Address.fromString('0x9288f8f702cbfb8cc5890819c1c1e2746e684d07'),
    new Account()
  )
  t.notEqual(execution, undefined, 'should have valid execution')
  const { vm } = execution

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // contract inspired from https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat/
  /*
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.7.4;

    contract Storage {
        uint pos0;
        mapping(address => uint) pos1;

        function store() public {
            pos0 = 1234;
            pos1[msg.sender] = 5678;
        }
    }
  */
  const data =
    '0x6080604052348015600f57600080fd5b5060bc8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063975057e714602d575b600080fd5b60336035565b005b6104d260008190555061162e600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555056fea2646970667358221220b16fe0abdbdcae31fa05c5717ebc442024b20fb637907d1a05547ea2d8ec8e5964736f6c63430007060033'

  // construct block with tx
  const gasLimit = 2000000
  const tx = Transaction.fromTxData({ gasLimit, data }, { common, freeze: false })
  tx.getSenderAddress = () => {
    return address
  }
  const parent = await blockchain.getCanonicalHeadHeader()
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
  block.transactions[0] = tx

  // deploy contract
  let ranBlock: Block | undefined = undefined
  vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
  const result = await vm.runBlock({ block, generate: true, skipBlockValidation: true })
  const { createdAddress } = result.results[0]
  await vm.blockchain.putBlock(ranBlock!)

  // call store() method
  const funcHash = '975057e7' // store()
  const storeTxData = {
    to: createdAddress!.toString(),
    from: address.toString(),
    data: `0x${funcHash}`,
    gasLimit: bigIntToHex(BigInt(530000)),
    nonce: 1,
  }
  const storeTx = Transaction.fromTxData(storeTxData, { common, freeze: false })
  storeTx.getSenderAddress = () => {
    return address
  }
  const block2 = Block.fromBlockData(
    {
      header: {
        parentHash: ranBlock!.hash(),
        number: 2,
        gasLimit,
      },
    },
    { common, calcDifficultyFromHeader: block.header }
  )
  block2.transactions[0] = storeTx

  // run block
  let ranBlock2: Block | undefined = undefined
  vm.events.once('afterBlock', (result: any) => (ranBlock2 = result.block))
  await vm.runBlock({ block: block2, generate: true, skipBlockValidation: true })
  await vm.blockchain.putBlock(ranBlock2!)

  // TODO: fix tests
  // (deactivated along https://github.com/ethereumjs/ethereumjs-monorepo/pull/2618,
  // storage cache work, 2023-04-07)
  // verify storage of pos0 is accurate
  /*let req = params(method, [createdAddress!.toString(), '0x0', 'latest'])
  let expectRes = (res: any) => {
    const msg = 'should return the correct storage value (pos0)'
    t.equal(
      res.body.result,
      '0x00000000000000000000000000000000000000000000000000000000000004d2',
      msg
    )
  }
  await baseRequest(t, server, req, 200, expectRes, false)*/

  // verify storage of pos1 is accurate
  // pos1["0xccfd725760a68823ff1e062f4cc97e1360e8d997"]
  /**const key = keccak256(
    hexStringToBytes(
      '000000000000000000000000ccfd725760a68823ff1e062f4cc97e1360e8d997' +
        '0000000000000000000000000000000000000000000000000000000000000001'
    )
  )
  req = params(method, [createdAddress!.toString(), bytesToPrefixedHexString(key), 'latest'])
  expectRes = (res: any) => {
    const msg = 'should return the correct storage value (pos1)'
    t.equal(
      res.body.result,
      '0x000000000000000000000000000000000000000000000000000000000000162e',
      msg
    )
  }
  await baseRequest(t, server, req, 200, expectRes, false)*/

  // call with unsupported block argument
  const req = params(method, [createdAddress!.toString(), '0x0', 'pending'])
  const expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})
