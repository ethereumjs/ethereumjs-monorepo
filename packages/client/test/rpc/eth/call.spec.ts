import tape from 'tape'
import { Address, BN, bufferToHex } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import { Transaction } from '@ethereumjs/tx'
import { FullSynchronizer } from '../../../lib/sync'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'eth_call'

tape(`${method}: call with valid arguments`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const service = client.services.find((s) => s.name === 'eth')
  const vm = (service!.synchronizer as FullSynchronizer).execution.vm

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // contract:
  /*
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.7.4;
        
        contract HelloWorld {
            function myAddress() public view returns (address addr) {
                return msg.sender;
            }
        }
    */
  const data =
    '0x6080604052348015600f57600080fd5b50609d8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806326b85ee114602d575b600080fd5b6033605f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60003390509056fea2646970667358221220455a67424337c6c5783846576348cb04caa9cf6f3e7def201c1f3fbc54aa373a64736f6c63430007060033'

  // construct tx
  const tx = Transaction.fromTxData({ gasLimit: 2000000, data }, { freeze: false })
  tx.getSenderAddress = () => {
    return address
  }

  // deploy contract
  const { createdAddress } = await vm.runTx({ tx })

  // get return value
  const funcHash = '26b85ee1' // myAddress()
  const estimateTxData = {
    to: createdAddress!.toString(),
    from: address.toString(),
    data: `0x${funcHash}`,
    gasLimit: `0x${new BN(53000).toString(16)}`,
  }
  const estimateTx = Transaction.fromTxData(estimateTxData, { freeze: false })
  estimateTx.getSenderAddress = () => {
    return address
  }
  const { execResult } = await vm.copy().runTx({
    tx: estimateTx,
    skipNonce: true,
    skipBalance: true,
    skipBlockGasLimitValidation: true,
  })

  // verify return value is accurate
  const req = params(method, [{ ...estimateTxData, gas: estimateTxData.gasLimit }, 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct return value'
    if (res.body.result === bufferToHex(execResult.returnValue)) {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
