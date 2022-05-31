// The example does these things:
//
// 1. Instantiates a VM and a Blockchain
// 2. Creates the accounts from ../utils/blockchain-mock-data "pre" attribute
// 3. Creates a genesis block
// 4. Puts the blocks from ../utils/blockchain-mock-data "blocks" attribute into the Blockchain
// 5. Runs the Blockchain on the VM.

import { Account, Address, toBuffer, setLengthLeft } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import Blockchain, { EthashConsensus } from '@ethereumjs/blockchain'
import Common, { ConsensusType } from '@ethereumjs/common'
import VM from '../'
import { testData } from './helpers/blockchain-mock-data'
const level = require('level')

async function main() {
  const common = new Common({ chain: 1, hardfork: testData.network.toLowerCase() })
  const validatePow = common.consensusType() === ConsensusType.ProofOfWork
  const validateBlocks = true

  const genesisBlock = Block.fromBlockData({ header: testData.genesisBlockHeader }, { common })

  const blockchain = await Blockchain.create({
    common,
    validateConsensus: validatePow,
    validateBlocks,
    genesisBlock,
  })

  // When verifying PoW, setting this cache improves the
  // performance of subsequent runs of this script.
  // Note that this optimization is a bit hacky and might
  // not be working in the future though. :-)
  if (validatePow) {
    ;(blockchain.consensus as EthashConsensus)._ethash.cacheDB = level('./.cachedb')
  }

  const vm = await VM.create({ blockchain, common })

  await setupPreConditions(vm, testData)

  await putBlocks(blockchain, common, testData)

  await blockchain.iterator('vm', async (block: Block, reorg: boolean) => {
    const parentBlock = await blockchain!.getBlock(block.header.parentHash)
    const parentState = parentBlock.header.stateRoot
    // run block
    await vm.runBlock({ block, root: parentState })
  })

  const blockchainHead = await vm.blockchain.getIteratorHead()

  console.log('--- Finished processing the Blockchain ---')
  console.log('New head:', '0x' + blockchainHead.hash().toString('hex'))
  console.log('Expected:', testData.lastblockhash)
}

async function setupPreConditions(vm: VM, data: typeof testData) {
  await vm.stateManager.checkpoint()

  for (const [addr, acct] of Object.entries(data.pre)) {
    const { nonce, balance, storage, code } = acct

    const address = new Address(Buffer.from(addr.slice(2), 'hex'))
    const account = Account.fromAccountData({ nonce, balance })
    await vm.stateManager.putAccount(address, account)

    for (const [key, val] of Object.entries(storage)) {
      const storageKey = setLengthLeft(Buffer.from(key, 'hex'), 32)
      const storageVal = Buffer.from(val as string, 'hex')
      await vm.stateManager.putContractStorage(address, storageKey, storageVal)
    }

    const codeBuf = Buffer.from(code.slice(2), 'hex')
    await vm.stateManager.putContractCode(address, codeBuf)
  }

  await vm.stateManager.commit()
}

async function putBlocks(blockchain: Blockchain, common: Common, data: typeof testData) {
  for (const blockData of data.blocks) {
    const blockRlp = toBuffer(blockData.rlp)
    const block = Block.fromRLPSerializedBlock(blockRlp, { common })
    await blockchain.putBlock(block)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
