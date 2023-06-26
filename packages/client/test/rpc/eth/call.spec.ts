import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Address, bigIntToHex, bytesToPrefixedHexString } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'
import { checkError } from '../util'

import type { FullEthereumService } from '../../../src/service'

const method = 'eth_call'

tape(`${method}: call with valid arguments`, async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
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

  // construct block with tx
  const gasLimit = 2000000
  const tx = LegacyTransaction.fromTxData({ gasLimit, data }, { common, freeze: false })
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

  // get return value
  const funcHash = '26b85ee1' // myAddress()
  const estimateTxData = {
    to: createdAddress!.toString(),
    from: address.toString(),
    data: `0x${funcHash}`,
    gasLimit: bigIntToHex(BigInt(53000)),
  }
  const estimateTx = LegacyTransaction.fromTxData(estimateTxData, { freeze: false })
  estimateTx.getSenderAddress = () => {
    return address
  }
  const { execResult } = await (
    await vm.copy()
  ).runTx({
    tx: estimateTx,
    skipNonce: true,
    skipBalance: true,
    skipBlockGasLimitValidation: true,
    skipHardForkValidation: true,
  })

  // verify return value is accurate
  let req = params(method, [{ ...estimateTxData, gas: estimateTxData.gasLimit }, 'latest'])
  let expectRes = (res: any) => {
    const msg = 'should return the correct return value'
    t.equal(res.body.result, bytesToPrefixedHexString(execResult.returnValue), msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, [{ ...estimateTxData }, 'latest'])
  expectRes = (res: any) => {
    const msg = 'should return the correct return value with no gas limit provided'
    t.equal(res.body.result, bytesToPrefixedHexString(execResult.returnValue), msg)
  }
  await baseRequest(t, server, req, 200, expectRes, false)

  req = params(method, [{ gasLimit, data }, 'latest'])
  expectRes = (res: any) => {
    const msg = `should let run call without 'to' for contract creation`
    t.equal(
      res.body.result,
      bytesToPrefixedHexString(result.results[0].execResult.returnValue),
      msg
    )
  }
  await baseRequest(t, server, req, 200, expectRes, true)
})

tape(`${method}: call with unsupported block argument`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  const funcHash = '26b85ee1' // borrowed from valid test above
  const estimateTxData = {
    to: address.toString(),
    from: address.toString(),
    data: `0x${funcHash}`,
    gasLimit: bigIntToHex(BigInt(53000)),
  }

  const req = params(method, [{ ...estimateTxData, gas: estimateTxData.gasLimit }, 'pending'])
  const expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid hex params`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')
  const estimateTxData = {
    to: address.toString(),
    from: address.toString(),
    data: ``,
    gasLimit: bigIntToHex(BigInt(53000)),
  }

  const req = params(method, [{ ...estimateTxData, gas: estimateTxData.gasLimit }, 'latest'])
  const expectRes = checkError(
    t,
    INVALID_PARAMS,
    'invalid argument data: hex string without 0x prefix'
  )
  await baseRequest(t, server, req, 200, expectRes)
})
