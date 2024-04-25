import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BIGINT_1,
  bigIntToBytes,
  bigIntToHex,
  bytesToHex,
  equalsBytes,
  privateToAddress,
  setLengthLeft,
  unprefixedHexToBytes,
  zeros,
} from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

function eip2935ActiveAtCommon(timestamp: number) {
  const hfs = [
    Hardfork.Chainstart,
    Hardfork.Homestead,
    Hardfork.Dao,
    Hardfork.Chainstart,
    Hardfork.SpuriousDragon,
    Hardfork.Byzantium,
    Hardfork.Constantinople,
    Hardfork.Petersburg,
    Hardfork.Istanbul,
    Hardfork.Berlin,
    Hardfork.London,
    Hardfork.ArrowGlacier,
    Hardfork.GrayGlacier,
    Hardfork.Shanghai,
    Hardfork.Paris,
    Hardfork.MergeForkIdTransition,
    Hardfork.Shanghai,
    Hardfork.Cancun,
  ]
  const hardforks = []
  for (const hf of hfs) {
    hardforks.push({
      name: hf,
      block: 0,
    })
  }
  hardforks.push({
    name: 'testEIP2935Hardfork',
    block: null,
    timestamp,
  })
  const c = Common.custom({
    customHardforks: {
      testEIP2935Hardfork: {
        name: 'testEIP2935Hardfork',
        comment: 'Start of the Ethereum main chain',
        url: '',
        status: 'final',
        eips: [2935],
      },
    },
    hardforks,
    /*genesis: {
      gasLimit: 30_000_000,
      timestamp: "0x0",
      extraData: "0x",
      difficulty: "0x0",
      nonce: "0x0000000000000000"
    }*/
  })
  return c
}

const commonGenesis = eip2935ActiveAtCommon(1)
commonGenesis.setHardforkBy({
  timestamp: 1,
})
const historyAddress = Address.fromString(
  bigIntToHex(commonGenesis.param('vm', 'historyStorageAddress'))
)
const contract2935Code = unprefixedHexToBytes(
  '60203611603157600143035f35116029575f356120000143116029576120005f3506545f5260205ff35b5f5f5260205ff35b5f5ffd00'
)

const callerPrivateKey = hexToBytes(`0x${'44'.repeat(32)}`)
const callerAddress = new Address(privateToAddress(callerPrivateKey))
const PREBALANCE = BigInt(10000000)

describe('EIP 2935: historical block hashes', () => {
  it('should save genesis block hash to the history block hash contract', async () => {
    commonGenesis.setHardfork(Hardfork.Chainstart)
    const blockchain = await Blockchain.create({
      common: commonGenesis,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await VM.create({ common: commonGenesis, blockchain })

    commonGenesis.setHardforkBy({
      timestamp: 1,
    })
    const genesis = await vm.blockchain.getBlock(0)
    const block = await (
      await vm.buildBlock({
        parentBlock: genesis,
        blockOpts: {
          putBlockIntoBlockchain: false,
        },
      })
    ).build()
    await vm.blockchain.putBlock(block)
    await vm.runBlock({ block, generate: true })

    const storage = await vm.stateManager.getContractStorage(
      historyAddress,
      setLengthLeft(bigIntToBytes(BigInt(0)), 32)
    )
    assert.ok(equalsBytes(storage, genesis.hash()))
  })
  it('should ensure blocks older than 256 blocks can be retrieved from the history contract', async () => {
    // Test: build a chain with 256+ blocks and then retrieve BLOCKHASH of the genesis block and block 1
    const blocksActivation = 256 // This ensures that block 0 - 255 all get stored into the hash contract
    // More than blocks activation to build, so we can ensure that we can also retrieve block 0 or block 1 hash at block 300
    const blocksToBuild = 300
    const commonGetHistoryServeWindow = eip2935ActiveAtCommon(0)
    commonGetHistoryServeWindow.setEIPs([2935])
    const common = eip2935ActiveAtCommon(blocksActivation)
    const historyServeWindow = commonGetHistoryServeWindow.param('vm', 'historyServeWindow')

    const blockchain = await Blockchain.create({
      common,
      validateBlocks: false,
      validateConsensus: false,
    })
    const vm = await VM.create({ common, blockchain })
    let parentBlock = await vm.blockchain.getBlock(0)
    for (let i = 1; i <= blocksToBuild; i++) {
      parentBlock = await (
        await vm.buildBlock({
          parentBlock,
          blockOpts: {
            putBlockIntoBlockchain: false,
            setHardfork: true,
          },
          headerData: {
            timestamp: parentBlock.header.number + BIGINT_1,
          },
        })
      ).build()
      await vm.blockchain.putBlock(parentBlock)
      await vm.runBlock({
        block: parentBlock,
        generate: true,
        skipHeaderValidation: true,
        setHardfork: true,
      })
    }

    for (let i = 0; i <= blocksToBuild; i++) {
      const block = await vm.blockchain.getBlock(i)
      const storage = await vm.stateManager.getContractStorage(
        historyAddress,
        setLengthLeft(bigIntToBytes(BigInt(i) % historyServeWindow), 32)
      )
      const ret = await vm.evm.runCall({
        // Code: RETURN the BLOCKHASH of block i
        // PUSH(i) BLOCKHASH PUSH(32) MSTORE PUSH(64) PUSH(0) RETURN
        // Note: need to return a contract with starting zero bytes to avoid non-deployable contracts by EIP 3540
        data: hexToBytes('0x61' + i.toString(16).padStart(4, '0') + '4060205260406000F3'),
        block: parentBlock,
      })
      if (i <= blocksToBuild - 1 && i >= blocksToBuild - Number(historyServeWindow)) {
        assert.ok(equalsBytes(setLengthLeft(storage, 32), block.hash()))
        assert.ok(equalsBytes(ret.execResult.returnValue, setLengthLeft(block.hash(), 64)))
      } else {
        assert.ok(equalsBytes(ret.execResult.returnValue, zeros(64)))
      }
    }

    // validate the contract code cases
    // const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
    const block = Block.fromBlockData(
      {
        header: {
          baseFeePerGas: BigInt(7),
          number: blocksToBuild,
        },
      },
      { common }
    )

    // should be able to resolve blockhash via contract code
    for (const iNum of [0, 1, blocksActivation, blocksToBuild - 1]) {
      const i = BigInt(iNum)
      const tx = LegacyTransaction.fromTxData({
        to: historyAddress,
        gasLimit: 1000000,
        gasPrice: 10,
        data: bytesToHex(setLengthLeft(bigIntToBytes(i), 32)),
      }).sign(callerPrivateKey)

      await vm.stateManager.putAccount(callerAddress, new Account())
      const account = await vm.stateManager.getAccount(callerAddress)
      account!.balance = PREBALANCE
      await vm.stateManager.putAccount(callerAddress, account!)
      await vm.stateManager.putContractCode(historyAddress, contract2935Code)

      const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
      const blockHashi = result.execResult.returnValue
      const blocki = await vm.blockchain.getBlock(i)
      assert.ok(equalsBytes(blockHashi, blocki.hash()))
    }

    // should be able to return 0 if input >= current block
    for (const iNum of [blocksToBuild, blocksToBuild + 100]) {
      const i = BigInt(iNum)
      const tx = LegacyTransaction.fromTxData({
        to: historyAddress,
        gasLimit: 1000000,
        gasPrice: 10,
        data: bytesToHex(setLengthLeft(bigIntToBytes(i), 32)),
      }).sign(callerPrivateKey)

      await vm.stateManager.putAccount(callerAddress, new Account())
      const account = await vm.stateManager.getAccount(callerAddress)
      account!.balance = PREBALANCE
      await vm.stateManager.putAccount(callerAddress, account!)
      await vm.stateManager.putContractCode(historyAddress, contract2935Code)

      const result = await vm.runTx({ tx, block, skipHardForkValidation: true })
      const blockHashi = result.execResult.returnValue
      assert.ok(equalsBytes(blockHashi, setLengthLeft(bigIntToBytes(BigInt(0)), 32)))
    }
  })
})
