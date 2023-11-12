import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain as ChainEnum, Common, Hardfork } from '@ethereumjs/common'
import { keccak256 } from '@ethereumjs/devp2p'
import { LegacyTransaction } from '@ethereumjs/tx'
import { bytesToHex, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { MemoryLevel } from 'memory-level'
import { assert, describe, it } from 'vitest'

import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { VMExecution } from '../../src/execution'
import { closeRPC, setupChain } from '../rpc/helpers'
import blocksDataGoerli from '../testdata/blocks/goerli.json'
import blocksDataMainnet from '../testdata/blocks/mainnet.json'
import testnet from '../testdata/common/testnet.json'
import shanghaiJSON from '../testdata/geth-genesis/withdrawals.json'

import type { Address } from '@ethereumjs/util'

const testGenesisBlock = {
  header: {
    bloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    coinbase: '0x8888f1f195afa192cfee860698584c030f4c9db1',
    difficulty: '0x020000',
    extraData: '0x42',
    gasLimit: '0x023e38',
    gasUsed: '0x00',
    hash: '0xce1f26f798dd03c8782d63b3e42e79a64eaea5694ea686ac5d7ce3df5171d1ae',
    mixHash: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    nonce: '0x0102030405060708',
    number: '0x00',
    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    receiptTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    stateRoot: '0xaf81e09f8c46ca322193edfda764fa7e88e81923f802f1d325ec0b0308ac2cd0',
    timestamp: '0x54c98c81',
    transactionsTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
    uncleHash: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  },
}
const testBlock = {
  header: {
    bloom:
      '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    coinbase: '0x8888f1f195afa192cfee860698584c030f4c9db1',
    difficulty: '0x020000',
    extraData: '0x',
    gasLimit: '0x023ec6',
    gasUsed: '0x021536',
    hash: '0xf53f268d23a71e85c7d6d83a9504298712b84c1a2ba220441c86eeda0bf0b6e3',
    mixHash: '0x29f07836e4e59229b3a065913afc27702642c683bba689910b2b2fd45db310d3',
    nonce: '0x8957e6d004a31802',
    number: '0x1',
    parentHash: '0xce1f26f798dd03c8782d63b3e42e79a64eaea5694ea686ac5d7ce3df5171d1ae',
    receiptTrie: '0x5c5b4fc43c2d45787f54e1ae7d27afdb4ad16dfc567c5692070d5c4556e0b1d7',
    stateRoot: '0xa65c2364cd0f1542d761823dc0109c6b072f14c20459598c5455c274601438f4',
    timestamp: '0x56851097',
    transactionsTrie: '0x70616ebd7ad2ed6fb7860cf7e9df00163842351c38a87cac2c1cb193895035a2',
    uncleHash: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  },
  // rlp: '0xf904a8f901faa0ce1f26f798dd03c8782d63b3e42e79a64eaea5694ea686ac5d7ce3df5171d1aea01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0a65c2364cd0f1542d761823dc0109c6b072f14c20459598c5455c274601438f4a070616ebd7ad2ed6fb7860cf7e9df00163842351c38a87cac2c1cb193895035a2a05c5b4fc43c2d45787f54e1ae7d27afdb4ad16dfc567c5692070d5c4556e0b1d7b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000830200000183023ec683021536845685109780a029f07836e4e59229b3a065913afc27702642c683bba689910b2b2fd45db310d3888957e6d004a31802f902a7f85f800a8255f094aaaf5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca0575da4e21b66fa764be5f74da9389e67693d066fb0d1312e19e17e501da00ecda06baf5a5327595f6619dfc2fcb3f2e6fb410b5810af3cb52d0e7508038e91a188f85f010a82520894bbbf5374fce5edbc8e2a8697c15331677e6ebf0b0a801ba04fa966bf34b93abc1bcd665554b7f316b50f928477b50be0f3285ead29d18c5ba017bba0eeec1625ab433746955e125d46d80b7fdc97386c51266f842d8e02192ef85f020a82520894bbbf5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca004377418ae981cc32b1312b4a427a1d69a821b28db8584f5f2bd8c6d42458adaa053a1dba1af177fac92f3b6af0a9fa46a22adf56e686c93794b6a012bf254abf5f85f030a82520894bbbf5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca04fe13febd28a05f4fcb2f451d7ddc2dda56486d9f8c79a62b0ba4da775122615a0651b2382dd402df9ebc27f8cb4b2e0f3cea68dda2dca0ee9603608f0b6f51668f85f040a82520894bbbf5374fce5edbc8e2a8697c15331677e6ebf0b0a801ba078e6a0ba086a08f8450e208a399bb2f2d2a0d984acd2517c7c7df66ccfab567da013254002cd45a97fac049ae00afbc43ed0d9961d0c56a3b2382c80ce41c198ddf85f050a82520894bbbf5374fce5edbc8e2a8697c15331677e6ebf0b0a801ba0a7174d8f43ea71c8e3ca9477691add8d80ac8e0ed89d8d8b572041eef81f4a54a0534ea2e28ec4da3b5b944b18c51ec84a5cf35f5b3343c5fb86521fd2d388f506f85f060a82520894bbbf5374fce5edbc8e2a8697c15331677e6ebf0b0a801ba034bd04065833536a10c77ee2a43a5371bc6d34837088b861dd9d4b7f44074b59a078807715786a13876d3455716a6b9cb2186b7a4887a5c31160fc877454958616c0',
  transactions: [
    {
      data: '0x',
      gasLimit: '0x55f0',
      gasPrice: '0x0a',
      nonce: '0x',
      r: '0x575da4e21b66fa764be5f74da9389e67693d066fb0d1312e19e17e501da00ecd',
      s: '0x6baf5a5327595f6619dfc2fcb3f2e6fb410b5810af3cb52d0e7508038e91a188',
      to: '0xaaaf5374fce5edbc8e2a8697c15331677e6ebf0b',
      v: '0x1c',
      value: '0x0a',
    },
    {
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x0a',
      nonce: '0x01',
      r: '0x4fa966bf34b93abc1bcd665554b7f316b50f928477b50be0f3285ead29d18c5b',
      s: '0x17bba0eeec1625ab433746955e125d46d80b7fdc97386c51266f842d8e02192e',
      to: '0xbbbf5374fce5edbc8e2a8697c15331677e6ebf0b',
      v: '0x1b',
      value: '0x0a',
    },
    {
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x0a',
      nonce: '0x02',
      r: '0x04377418ae981cc32b1312b4a427a1d69a821b28db8584f5f2bd8c6d42458ada',
      s: '0x53a1dba1af177fac92f3b6af0a9fa46a22adf56e686c93794b6a012bf254abf5',
      to: '0xbbbf5374fce5edbc8e2a8697c15331677e6ebf0b',
      v: '0x1c',
      value: '0x0a',
    },
    {
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x0a',
      nonce: '0x03',
      r: '0x4fe13febd28a05f4fcb2f451d7ddc2dda56486d9f8c79a62b0ba4da775122615',
      s: '0x651b2382dd402df9ebc27f8cb4b2e0f3cea68dda2dca0ee9603608f0b6f51668',
      to: '0xbbbf5374fce5edbc8e2a8697c15331677e6ebf0b',
      v: '0x1c',
      value: '0x0a',
    },
    {
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x0a',
      nonce: '0x04',
      r: '0x78e6a0ba086a08f8450e208a399bb2f2d2a0d984acd2517c7c7df66ccfab567d',
      s: '0x13254002cd45a97fac049ae00afbc43ed0d9961d0c56a3b2382c80ce41c198dd',
      to: '0xbbbf5374fce5edbc8e2a8697c15331677e6ebf0b',
      v: '0x1b',
      value: '0x0a',
    },
    {
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x0a',
      nonce: '0x05',
      r: '0xa7174d8f43ea71c8e3ca9477691add8d80ac8e0ed89d8d8b572041eef81f4a54',
      s: '0x534ea2e28ec4da3b5b944b18c51ec84a5cf35f5b3343c5fb86521fd2d388f506',
      to: '0xbbbf5374fce5edbc8e2a8697c15331677e6ebf0b',
      v: '0x1b',
      value: '0x0a',
    },
    {
      data: '0x',
      gasLimit: '0x5208',
      gasPrice: '0x0a',
      nonce: '0x06',
      r: '0x34bd04065833536a10c77ee2a43a5371bc6d34837088b861dd9d4b7f44074b59',
      s: '0x78807715786a13876d3455716a6b9cb2186b7a4887a5c31160fc877454958616',
      to: '0xbbbf5374fce5edbc8e2a8697c15331677e6ebf0b',
      v: '0x1b',
      value: '0x0a',
    },
  ],
  uncleHeaders: [],
}

const setBalance = async (vm: VM, address: Address, balance: bigint) => {
  await vm.stateManager.checkpoint()
  await vm.stateManager.modifyAccountFields(address, { balance })
  await vm.stateManager.commit()
}

describe('[VMExecution]', async () => {
  it('Initialization', async () => {
    const vm = await VM.create()
    const config = new Config({ vm, accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const exec = new VMExecution({ config, chain })
    assert.equal(exec.vm, vm, 'should use vm provided')
  })

  async function testSetup(blockchain: Blockchain, common?: Common) {
    const config = new Config({ common, accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config, blockchain })
    const exec = new VMExecution({ config, chain })
    await chain.open()
    await exec.open()
    return exec
  }

  it('Block execution / Hardforks PoW (mainnet)', async () => {
    let blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    let exec = await testSetup(blockchain)
    const oldHead = await exec.vm.blockchain.getIteratorHead!()
    await exec.run()
    let newHead = await exec.vm.blockchain.getIteratorHead!()
    assert.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on empty run')

    blockchain = await Blockchain.fromBlocksData(blocksDataMainnet, {
      validateBlocks: true,
      validateConsensus: false,
    })
    exec = await testSetup(blockchain)
    await exec.run()
    newHead = await exec.vm.blockchain.getIteratorHead!()
    assert.equal(newHead.header.number, BigInt(5), 'should run all blocks')

    const common = new Common({ chain: 'testnet', customChains: [testnet] })
    exec = await testSetup(blockchain, common)
    await exec.run()
    assert.equal(exec.hardfork, 'byzantium', 'should update HF on block run')
  })

  it('Test block execution using executeBlocks function', async () => {
    let blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    let exec = await testSetup(blockchain)

    blockchain = await Blockchain.fromBlocksData(blocksDataMainnet, {
      validateBlocks: true,
      validateConsensus: false,
    })
    exec = await testSetup(blockchain)
    await exec.run()

    assert.doesNotThrow(
      async () => exec.executeBlocks(1, 5, []),
      'blocks should execute without error'
    )
  })

  it.only(
    'Test block execution with savePreimages enabled',
    async () => {
      const testSetupWithPreimages = async (blockchain: Blockchain) => {
        const config = new Config({
          accountCache: 10000,
          storageCache: 1000,
          savePreimages: true,
        })
        const chain = await Chain.create({ config, blockchain })
        const exec = new VMExecution({ config, chain, metaDB: new MemoryLevel() })
        await chain.open()
        await exec.open()
        return exec
      }

      const blockchain = await Blockchain.create({
        validateBlocks: false,
        validateConsensus: false,
      })

      const block = Block.fromBlockData(testBlock, { common: blockchain.common })
      await blockchain.putBlock(block)

      const exec = await testSetupWithPreimages(blockchain)

      await exec.run()

      const touchedAccounts = block.transactions.flatMap((transcation) => [
        transcation.to!.bytes,
        transcation.getSenderAddress().bytes,
      ])
      const touchedAccountsHashedKeys = touchedAccounts.map((address) => keccak256(address))

      // The preimagesManager should be instantiated
      assert.ok(exec.preimagesManager !== undefined, 'preimagesManager should be instantiated')

      console.log('before for of loop')
      for (const [index, touchedAccount] of touchedAccounts.entries()) {
        console.log('inside loop')
        console.log('index: ', index)
        console.log('touchedAccount', bytesToHex(touchedAccount))
        const preimage = await exec.preimagesManager!.getPreimage(touchedAccountsHashedKeys[index])
        assert.ok(
          preimage !== null && equalsBytes(preimage, touchedAccount),
          'preimage should be recovered'
        )
      }
    },
    { timeout: 50000 }
  )

  it('Should fail opening if vmPromise already assigned', async () => {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
    })
    const exec = await testSetup(blockchain)
    assert.equal(exec.started, true, 'execution should be opened')
    await exec.stop()
    assert.equal(exec.started, false, 'execution should be stopped')
    exec['vmPromise'] = (async () => 0)()
    await exec.open()
    assert.equal(exec.started, false, 'execution should be stopped')
    exec['vmPromise'] = undefined
    await exec.open()
    assert.equal(exec.started, true, 'execution should be restarted')
    exec['vmPromise'] = (async () => 0)()
    await exec.stop()
    assert.equal(exec.started, false, 'execution should be restopped')
    assert.equal(exec['vmPromise'], undefined, 'vmPromise should be reset')
  })

  it('Block execution / Hardforks PoA (goerli)', async () => {
    const common = new Common({ chain: ChainEnum.Goerli, hardfork: Hardfork.Chainstart })
    let blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      common,
    })
    let exec = await testSetup(blockchain, common)
    const oldHead = await exec.vm.blockchain.getIteratorHead!()
    await exec.run()
    let newHead = await exec.vm.blockchain.getIteratorHead!()
    assert.deepEqual(newHead.hash(), oldHead.hash(), 'should not modify blockchain on empty run')

    blockchain = await Blockchain.fromBlocksData(blocksDataGoerli, {
      validateBlocks: true,
      validateConsensus: false,
      common,
    })
    exec = await testSetup(blockchain, common)
    await exec.run()
    newHead = await exec.vm.blockchain.getIteratorHead!()
    assert.equal(newHead.header.number, BigInt(7), 'should run all blocks')
  })

  it('Block execution / Hardforks PoA (goerli)', async () => {
    const { server, execution, blockchain } = await setupChain(shanghaiJSON, 'post-merge', {
      engine: true,
    })

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const block = await Block.fromExecutionPayload(shanghaiPayload)
    const oldHead = await blockchain.getIteratorHead()

    const parentStateRoot = oldHead.header.stateRoot
    await execution.runWithoutSetHead({ block, root: parentStateRoot })

    await blockchain.putBlock(block)
    await execution.run()

    let newHead = await blockchain.getIteratorHead()
    assert.equal(
      bytesToHex(block.hash()),
      bytesToHex(newHead.hash()),
      'vmHead should be on the latest block'
    )

    // reset head and run again
    await blockchain.setIteratorHead('vm', oldHead.hash())
    newHead = await blockchain.getIteratorHead()
    assert.equal(
      bytesToHex(oldHead.hash()),
      bytesToHex(newHead.hash()),
      'vmHead should be on the latest block'
    )
    await execution.run()

    newHead = await blockchain.getIteratorHead()
    assert.equal(
      bytesToHex(block.hash()),
      bytesToHex(newHead.hash()),
      'vmHead should be on the latest block'
    )

    closeRPC(server)
  })
})

const shanghaiPayload = {
  blockNumber: '0x1',
  parentHash: '0xfe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710',
  feeRecipient: '0xaa00000000000000000000000000000000000000',
  stateRoot: '0x23eadd91fca55c0e14034e4d63b2b3ed43f2e807b6bf4d276b784ac245e7fa3f',
  receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: '0x1c9c380',
  gasUsed: '0x0',
  timestamp: '0x2f',
  extraData: '0x',
  baseFeePerGas: '0x7',
  blockHash: '0xd30a8c821078a9153a5cbc5ac9a2c5baca7f7885496f1f461dbfcb8dbe1fa0c0',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  transactions: [],
  withdrawals: [
    {
      index: '0x0',
      validatorIndex: '0xffff',
      address: '0x0000000000000000000000000000000000000000',
      amount: '0x0',
    },
    {
      index: '0x1',
      validatorIndex: '0x10000',
      address: '0x0100000000000000000000000000000000000000',
      amount: '0x100000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x2',
      validatorIndex: '0x10001',
      address: '0x0200000000000000000000000000000000000000',
      amount: '0x200000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x3',
      validatorIndex: '0x10002',
      address: '0x0300000000000000000000000000000000000000',
      amount: '0x300000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x4',
      validatorIndex: '0x10003',
      address: '0x0400000000000000000000000000000000000000',
      amount: '0x400000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x5',
      validatorIndex: '0x10004',
      address: '0x0500000000000000000000000000000000000000',
      amount: '0x500000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x6',
      validatorIndex: '0x10005',
      address: '0x0600000000000000000000000000000000000000',
      amount: '0x600000000000000000000000000000000000000000000000000000000000000',
    },
    {
      index: '0x7',
      validatorIndex: '0x10006',
      address: '0x0700000000000000000000000000000000000000',
      amount: '0x700000000000000000000000000000000000000000000000000000000000000',
    },
  ],
}
