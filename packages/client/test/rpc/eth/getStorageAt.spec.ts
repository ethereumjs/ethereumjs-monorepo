import tape from 'tape'
import { Address, BN, keccak } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import { Transaction } from '@ethereumjs/tx'
import { FullSynchronizer } from '../../../lib/sync'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'eth_getStorageAt'

const setup = async () => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const service = client.services.find((s) => s.name === 'eth')
  const vm = (service!.synchronizer as FullSynchronizer).execution.vm

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // contract inspired from https://eth.wiki/json-rpc/API#example-14
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

  // construct tx
  const tx = Transaction.fromTxData({ gasLimit: 2000000, data }, { freeze: false })
  tx.getSenderAddress = () => {
    return address
  }

  // deploy contract
  const { createdAddress } = await vm.runTx({ tx })

  // call store() method
  const funcHash = '975057e7' // store()
  const storeTxData = {
    to: createdAddress!.toString(),
    from: address.toString(),
    data: `0x${funcHash}`,
    gasLimit: `0x${new BN(530000).toString(16)}`,
  }
  const storeTx = Transaction.fromTxData(storeTxData, { freeze: false })
  storeTx.getSenderAddress = () => {
    return address
  }
  await vm.runTx({
    tx: storeTx,
    skipNonce: true,
    skipBalance: true,
    skipBlockGasLimitValidation: true,
  })

  return { server, createdAddress: createdAddress! }
}

tape(`${method}: call with valid arguments (retrieve pos0)`, async (t) => {
  const { server, createdAddress } = await setup()

  // verify storage of pos0 is accurate
  const req = params(method, [createdAddress!.toString(), '0x0', 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct storage value'
    if (res.body.result === '0x00000000000000000000000000000000000000000000000000000000000004d2') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with valid arguments (retrieve pos1)`, async (t) => {
  const { server, createdAddress } = await setup()

  // verify storage of pos1 is accurate
  // pos1["0xccfd725760a68823ff1e062f4cc97e1360e8d997"]
  const key = keccak(
    Buffer.from(
      '000000000000000000000000ccfd725760a68823ff1e062f4cc97e1360e8d997' +
        '0000000000000000000000000000000000000000000000000000000000000001',
      'hex'
    )
  )
  const req = params(method, [createdAddress!.toString(), `0x${key.toString('hex')}`, 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct storage value'
    if (res.body.result === '0x000000000000000000000000000000000000000000000000000000000000162e') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
