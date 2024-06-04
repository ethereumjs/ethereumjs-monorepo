import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BIGINT_1,
  bigIntToBytes,
  bytesToHex,
  equalsBytes,
  generateAddress,
  privateToAddress,
  setLengthLeft,
  zeros,
} from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { bytesToBigInt } from '../../../../util/src/bytes'
import { BIGINT_0 } from '../../../../util/src/constants'
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

const callerPrivateKey = hexToBytes(`0x${'44'.repeat(32)}`)
const callerAddress = new Address(privateToAddress(callerPrivateKey))
const PREBALANCE = BigInt(10000000)

// array of different deployment configurations
const deploymentConfigs = [
  // original configuration
  [
    // contract code
    '0x60203611603157600143035f35116029575f356120000143116029576120005f3506545f5260205ff35b5f5f5260205ff35b5f5ffd00',
    // deployment tx input
    '0x60368060095f395ff360203611603157600143035f35116029575f356120000143116029576120005f3506545f5260205ff35b5f5f5260205ff35b5f5ffd00',
    // v r s
    ['0x1b', '0x539', '0x1b9b6eb1f0'],
    // sender, hash, deployed address
    [
      '0xa4690f0ed0d089faa1e0ad94c8f1b4a2fd4b0734',
      '0x7ba81426bfa88a2cf4ea5c9abbbe83619505acd1173bc8450f93cf17cde3784b',
      '0x25a219378dad9b3503c8268c9ca836a52427a4fb',
    ],
  ],
  // may 25 configuration with set on the lines of 4788
  [
    // contract code
    '0x3373fffffffffffffffffffffffffffffffffffffffe1460575767ffffffffffffffff5f3511605357600143035f3511604b575f35612000014311604b57611fff5f3516545f5260205ff35b5f5f5260205ff35b5f5ffd5b5f35600143035500',
    // deployment tx input
    '0x60608060095f395ff33373fffffffffffffffffffffffffffffffffffffffe1460575767ffffffffffffffff5f3511605357600143035f3511604b575f35612000014311604b57611fff5f3516545f5260205ff35b5f5f5260205ff35b5f5ffd5b5f35600143035500',
    // v r s
    ['0x1b', '0x539', '0x1b9b6eb1f0'],
    // sender, hash, deployed address
    [
      '0x72eed28860ac985f1ec32306564b5926ea7c0b70',
      '0xe43ec833884324f31c2e8314534d5b15233d84f32f05a05ea2a45649b587a9df',
      '0xcc766763fcc59487cdab9f21487174417b1fa282',
    ],
  ],
]

describe('EIP 2935: historical block hashes', () => {
  for (const deploymentConfig of deploymentConfigs) {
    const [
      contract2935CodeHex,
      deploymentTxData,
      [deploymentV, deploymentR, deploymentS],
      [deploymentSender, deploymentTxHash, deployedToAddress],
    ] = deploymentConfig

    const historyAddress = Address.fromString(deployedToAddress)
    const contract2935Code = hexToBytes(contract2935CodeHex)

    // eslint-disable-next-line no-inner-declarations
    async function testBlockhashContract(vm: VM, block: Block, i: bigint): Promise<Uint8Array> {
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
      return blockHashi
    }

    it(`should validate the deployment tx`, async () => {
      const deployContractTxData = {
        type: '0x0',
        nonce: '0x0',
        to: null,
        gasLimit: '0x3d090',
        gasPrice: '0xe8d4a51000',
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        value: '0x0',
        // input from the EIP is data here
        data: deploymentTxData,
        v: deploymentV,
        r: deploymentR,
        s: deploymentS,
      }

      const deployTx = LegacyTransaction.fromTxData(deployContractTxData)
      const txSender = Address.fromPublicKey(deployTx.getSenderPublicKey()).toString()
      assert.equal(txSender, deploymentSender, 'tx sender should match')

      const txHash = bytesToHex(deployTx.hash())
      assert.equal(txHash, deploymentTxHash, 'tx hash should match')

      // tx sender is a random address with likely no tx history
      const txToAddress = bytesToHex(generateAddress(hexToBytes(txSender), bigIntToBytes(BIGINT_0)))
      assert.equal(txToAddress, deployedToAddress, 'deployment address should match')
    })

    it('should save genesis block hash to the history block hash contract', async () => {
      const commonGenesis = eip2935ActiveAtCommon(1)
      const blockchain = await Blockchain.create({
        common: commonGenesis,
        validateBlocks: false,
        validateConsensus: false,
      })
      const vm = await VM.create({ common: commonGenesis, blockchain })
      commonGenesis.setHardforkBy({
        timestamp: 1,
      })
      commonGenesis['_paramsCache']['vm']['historyStorageAddress'].v = bytesToBigInt(
        historyAddress.bytes
      )

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
      for (const i of [0, 1, blocksActivation, blocksToBuild - 1]) {
        const blockHashi = await testBlockhashContract(vm, block, BigInt(i))
        const blocki = await vm.blockchain.getBlock(i)
        assert.ok(equalsBytes(blockHashi, blocki.hash()))
      }

      // should be able to return 0 if input >= current block
      for (const i of [blocksToBuild, blocksToBuild + 100]) {
        const blockHashi = await testBlockhashContract(vm, block, BigInt(i))
        assert.ok(equalsBytes(blockHashi, setLengthLeft(bigIntToBytes(BigInt(0)), 32)))
      }
    })
  }
})
