import VM from '../../'

import Account from 'ethereumjs-account'
import Blockchain from 'ethereumjs-blockchain'
import * as utils from 'ethereumjs-util'
import { promisify } from 'util'
import PStateManager from '../../lib/state/promisified'

const Block = require('ethereumjs-block')
const BlockHeader = require('ethereumjs-block/header.js')
const testData = require('./test-data')
const level = require('level')

async function main() {
  const hardfork = testData.network.toLowerCase()

  const blockchain = new Blockchain({
    hardfork,
    // This flag can be control whether the blocks are validated. This includes:
    //    * Verifying PoW
    //    * Validating each blocks's difficulty, uncles, tries, header and uncles.
    validate: true,
  })

  // When verifying PoW, setting this cache improves the performance of subsequent runs of this
  // script. It has no effect if the blockchain is initialized with `validate: false`.
  setEthashCache(blockchain)

  const vm = new VM({
    blockchain: blockchain,
    hardfork,
  })

  await setupPreConditions(vm, testData)

  await setGenesisBlock(blockchain, hardfork)

  await putBlocks(blockchain, hardfork, testData)

  await vm.runBlockchain(blockchain)

  const blockchainHead = await promisify<any>(vm.blockchain.getHead.bind(vm.blockchain))()

  console.log('--- Finished processing the BlockChain ---')
  console.log('New head:', '0x' + blockchainHead.hash().toString('hex'))
  console.log('Expected:', testData.lastblockhash)
}

function setEthashCache(blockchain: any) {
  if (blockchain.validate) {
    blockchain.ethash.cacheDB = level('./.cachedb')
  }
}

async function setupPreConditions(vm: VM, testData: any) {
  const psm = new PStateManager(vm.stateManager)

  await psm.checkpoint()

  for (const address of Object.keys(testData.pre)) {
    const addressBuf = utils.toBuffer(address)

    const acctData = testData.pre[address]
    const account = new Account({
      nonce: acctData.nonce,
      balance: acctData.balance,
    })

    await psm.putAccount(addressBuf, account)

    for (const hexStorageKey of Object.keys(acctData.storage)) {
      const val = utils.toBuffer(acctData.storage[hexStorageKey])
      const storageKey = utils.setLength(utils.toBuffer(hexStorageKey), 32)

      await psm.putContractStorage(addressBuf, storageKey, val)
    }

    const codeBuf = utils.toBuffer(acctData.code)

    await psm.putContractCode(addressBuf, codeBuf)
  }

  await psm.commit()
}

async function setGenesisBlock(blockchain: any, hardfork: string) {
  const genesisBlock = new Block({ hardfork })
  genesisBlock.header = new BlockHeader(testData.genesisBlockHeader, { hardfork })

  await promisify(blockchain.putGenesis.bind(blockchain))(genesisBlock)
}

async function putBlocks(blockchain: any, hardfork: string, testData: any) {
  for (const blockData of testData.blocks) {
    const block = new Block(utils.toBuffer(blockData.rlp), { hardfork })
    await promisify(blockchain.putBlock.bind(blockchain))(block)
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
