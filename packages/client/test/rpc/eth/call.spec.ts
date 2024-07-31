import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bigIntToHex, bytesToHex, createAddressFromString } from '@ethereumjs/util'
import { runBlock, runTx } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullEthereumService } from '../../../src/service/index.js'
import type { Block } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

const method = 'eth_call'

describe(method, () => {
  it('call with valid arguments', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
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

    // get return value
    const funcHash = '26b85ee1' // myAddress()
    const estimateTxData = {
      to: createdAddress!.toString(),
      from: address.toString(),
      data: `0x${funcHash}` as PrefixedHexString,
      gasLimit: bigIntToHex(BigInt(53000)),
    }
    const estimateTx = createLegacyTx(estimateTxData, { freeze: false })
    estimateTx.getSenderAddress = () => {
      return address
    }
    const vmCopy = await vm.shallowCopy()
    const { execResult } = await runTx(vmCopy, {
      tx: estimateTx,
      skipNonce: true,
      skipBalance: true,
      skipBlockGasLimitValidation: true,
      skipHardForkValidation: true,
    })

    // verify return value is accurate
    let res = await rpc.request(method, [
      { ...estimateTxData, gas: estimateTxData.gasLimit },
      'latest',
    ])
    assert.equal(res.error.code, 3, 'should return the correct error code')
    assert.equal(
      res.error.data,
      bytesToHex(execResult.returnValue),
      'should return the correct return value',
    )

    res = await rpc.request(method, [{ ...estimateTxData }, 'latest'])
    assert.equal(res.error.code, 3, 'should return the correct error code')
    assert.equal(
      res.error.data,
      bytesToHex(execResult.returnValue),
      'should return the correct return value with no gas limit provided',
    )

    res = await rpc.request(method, [{ gasLimit, data }, 'latest'])
    assert.equal(
      res.result,
      bytesToHex(result.results[0].execResult.returnValue),
      `should let run call without 'to' for contract creation`,
    )
  })

  it('call with unsupported block argument', async () => {
    const blockchain = await createBlockchain()

    const client = await createClient({ blockchain, includeVM: true })
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    // genesis address with balance
    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

    const funcHash = '26b85ee1' // borrowed from valid test above
    const estimateTxData = {
      to: address.toString(),
      from: address.toString(),
      data: `0x${funcHash}`,
      gasLimit: bigIntToHex(BigInt(53000)),
    }

    const res = await rpc.request(method, [
      { ...estimateTxData, gas: estimateTxData.gasLimit },
      'pending',
    ])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('"pending" is not yet supported'))
  })

  it('call with invalid hex params', async () => {
    const blockchain = await createBlockchain()

    const client = await createClient({ blockchain, includeVM: true })
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    // genesis address with balance
    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')
    const estimateTxData = {
      to: address.toString(),
      from: address.toString(),
      data: ``,
      gasLimit: bigIntToHex(BigInt(53000)),
    }

    const res = await rpc.request(method, [
      { ...estimateTxData, gas: estimateTxData.gasLimit },
      'latest',
    ])
    assert.equal(res.error.code, INVALID_PARAMS)
    assert.ok(res.error.message.includes('invalid argument data: hex string without 0x prefix'))
  })
})
