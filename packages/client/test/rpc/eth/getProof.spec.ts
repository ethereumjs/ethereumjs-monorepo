import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Address, bigIntToHex } from '@ethereumjs/util'
import * as tape from 'tape'

import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'

import type { FullEthereumService } from '../../../src/service'

const method = 'eth_getProof'

const expectedProof = {
  address: '0x9288f8f702cbfb8cc5890819c1c1e2746e684d07',
  balance: '0x0',
  codeHash: '0x05698751a8fe928d7049ee0af6927f3ff6e398d7d11293ea4c6786d7cfc3dbd4',
  nonce: '0x1',
  storageHash: '0xb39609ba55cc225a26265fc5e80d51e07a4410c1725cf69dbf15a8b09ad1a0a0',
  accountProof: [
    '0xf8718080808080a0b356351d60bc9894cf1f1d6cb68c815f0131d50f1da83c4023a09ec855cfff91808080a086a4665abc4f7e6f3a2da6a3c112616b1954be58ac4f6ff236b5b5f9ba295e4ca043a5b2616ae3a304fe34c5402d41893c49cb75b2ecd25b8b8b53f0926c957f23808080808080',
    '0xf869a03bdcfb03f3efaf0a5250648861b575109e8bb8084a0b74b0ec15d41366a4a7abb846f8440180a0b39609ba55cc225a26265fc5e80d51e07a4410c1725cf69dbf15a8b09ad1a0a0a005698751a8fe928d7049ee0af6927f3ff6e398d7d11293ea4c6786d7cfc3dbd4',
  ],
  storageProof: [
    {
      key: '0x0000000000000000000000000000000000000000000000000000000000000000',
      value: '0x04d2',
      proof: [
        '0xf8518080a036bb5f2fd6f99b186600638644e2f0396989955e201672f7e81e8c8f466ed5b9a010859880cfb38603690e8c4dfcc5595c203de6b901a503f944ef21a6120926a680808080808080808080808080',
        '0xe5a0390decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563838204d2',
      ],
    },
  ],
}

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

  // verify proof is accurate
  const req = params(method, [createdAddress!.toString(), ['0x0'], 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct proof'
    t.deepEqual(res.body.result, expectedProof, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})
