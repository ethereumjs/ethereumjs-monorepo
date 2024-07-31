import { createBlock, createHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createLegacyTx } from '@ethereumjs/tx'
import { bigIntToHex, createAddressFromString } from '@ethereumjs/util'
import { runBlock, runTx } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullEthereumService } from '../../../src/service/index.js'
import type { Block } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

const method = 'eth_estimateGas'

describe(
  method,
  () => {
    it('call with valid arguments', async () => {
      // Use custom genesis so we can test EIP1559 txs more easily
      const genesisJson = await import('../../testdata/geth-genesis/rpctestnet.json')
      const common = createCommonFromGethGenesis(genesisJson, {
        chain: 'testnet',
        hardfork: 'berlin',
      })
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

      // get gas estimate
      const funcHash = '26b85ee1' // myAddress()
      const estimateTxData = {
        to: createdAddress!.toString(),
        from: address.toString(),
        data: `0x${funcHash}` as PrefixedHexString,
        gasLimit: bigIntToHex(BigInt(53000)),
        gasPrice: bigIntToHex(BigInt(1000000000)),
      }
      const estimateTx = createLegacyTx(estimateTxData, { freeze: false })
      estimateTx.getSenderAddress = () => {
        return address
      }
      const vmCopy = await vm.shallowCopy()
      const { totalGasSpent } = await runTx(vmCopy, {
        tx: estimateTx,
        skipNonce: true,
        skipBalance: true,
        skipBlockGasLimitValidation: true,
        skipHardForkValidation: true,
      })

      // verify estimated gas is accurate
      const res = await rpc.request(method, [
        { ...estimateTxData, gas: estimateTxData.gasLimit },
        'latest',
      ])
      assert.equal(
        res.result,
        '0x' + totalGasSpent.toString(16),
        'should return the correct gas estimate',
      )

      // Test without blockopt as its optional and should default to latest
      const res2 = await rpc.request(method, [{ ...estimateTxData, gas: estimateTxData.gasLimit }])
      assert.equal(
        res2.result,
        '0x' + totalGasSpent.toString(16),
        'should return the correct gas estimate',
      )
      // Setup chain to run an EIP1559 tx
      const service = client.services[0] as FullEthereumService
      service.execution.vm.common.setHardfork('london')
      service.chain.config.chainCommon.setHardfork('london')
      const headBlock = await service.chain.getCanonicalHeadBlock()
      const londonBlock = createBlock(
        {
          header: createHeader(
            {
              baseFeePerGas: 1000000000n,
              number: 2n,
              parentHash: headBlock.header.hash(),
            },
            {
              common: service.chain.config.chainCommon,
              skipConsensusFormatValidation: true,
              calcDifficultyFromHeader: headBlock.header,
            },
          ),
        },
        { common: service.chain.config.chainCommon },
      )

      vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
      await runBlock(vm, { block: londonBlock, generate: true, skipBlockValidation: true })
      await vm.blockchain.putBlock(ranBlock!)

      // Test EIP1559 tx
      const EIP1559res = await rpc.request(method, [
        { ...estimateTxData, type: 2, maxFeePerGas: '0x' + 10000000000n.toString(16) },
      ])
      assert.equal(
        EIP1559res.result,
        '0x' + totalGasSpent.toString(16),
        'should return the correct gas estimate for EIP1559 tx',
      )

      // Test EIP1559 tx with no maxFeePerGas
      const EIP1559reqNoGas = await rpc.request(method, [
        {
          ...estimateTxData,
          type: 2,
          maxFeePerGas: undefined,
          gasLimit: undefined,
          gasPrice: undefined,
        },
      ])
      assert.equal(
        EIP1559reqNoGas.result,
        '0x' + totalGasSpent.toString(16),
        'should return the correct gas estimate',
      )

      // Test legacy tx with London head block
      const legacyTxNoGas = await rpc.request(method, [
        { ...estimateTxData, maxFeePerGas: undefined, gasLimit: undefined, gasPrice: undefined },
      ])
      assert.equal(
        legacyTxNoGas.result,
        '0x' + totalGasSpent.toString(16),
        'should return the correct gas estimate',
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
  },
  20000,
)
