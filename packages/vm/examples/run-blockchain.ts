// The example does these things:
//
// 1. Instantiates a VM and a Blockchain
// 2. Creates the accounts from ../utils/blockchain-mock-data "pre" attribute
// 3. Creates a genesis block
// 4. Puts the blocks from ../utils/blockchain-mock-data "blocks" attribute into the Blockchain
// 5. Runs the Blockchain on the VM.

import { createBlock, createBlockFromRLP } from '@ethereumjs/block'
import { EthashConsensus, createBlockchain } from '@ethereumjs/blockchain'
import { Common, ConsensusAlgorithm, ConsensusType, Mainnet } from '@ethereumjs/common'
import { Ethash } from '@ethereumjs/ethash'
import { Address, bytesToHex, createAccount, hexToBytes, setLengthLeft } from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

import { blockchainMockData } from './helpers/blockchain-mock-data.ts'

import type { Block, HeaderData } from '@ethereumjs/block'
import type { Blockchain, ConsensusDict } from '@ethereumjs/blockchain'
import type { PrefixedHexString } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'

async function setupPreConditions(vm: VM, data: any) {
  await vm.stateManager.checkpoint()

  for (const [addr, acct] of Object.entries(data.pre)) {
    const { nonce, balance, storage, code } = acct as any

    const address = new Address(hexToBytes(addr))
    const account = createAccount({ nonce, balance })
    await vm.stateManager.putAccount(address, account)

    for (const [key, val] of Object.entries(storage)) {
      const storageKey = setLengthLeft(hexToBytes(key), 32)
      const storageVal = hexToBytes(val as PrefixedHexString)
      await vm.stateManager.putStorage(address, storageKey, storageVal)
    }

    const codeBuf = hexToBytes(`0x${code}`)
    await vm.stateManager.putCode(address, codeBuf)
  }

  await vm.stateManager.commit()
}

async function putBlocks(blockchain: Blockchain, common: Common, data: typeof blockchainMockData) {
  for (const blockData of data.blocks) {
    const blockRlp = hexToBytes(blockData.rlp as PrefixedHexString)
    const block = createBlockFromRLP(blockRlp, { common })
    await blockchain.putBlock(block)
  }
}

async function main() {
  const common = new Common({ chain: Mainnet, hardfork: blockchainMockData.network.toLowerCase() })
  const validatePow = common.consensusType() === ConsensusType.ProofOfWork
  const validateBlocks = true

  const genesisBlock = createBlock(
    { header: blockchainMockData.genesisBlockHeader as HeaderData },
    { common },
  )

  const consensusDict: ConsensusDict = {}
  consensusDict[ConsensusAlgorithm.Ethash] = new EthashConsensus(new Ethash())
  const blockchain = await createBlockchain({
    common,
    validateBlocks,
    validateConsensus: validatePow,
    consensusDict,
    genesisBlock,
  })

  const vm = await createVM({ blockchain, common })

  await setupPreConditions(vm, blockchainMockData)

  await putBlocks(blockchain, common, blockchainMockData)

  await blockchain.iterator('vm', async (block: Block, _reorg: boolean) => {
    const parentBlock = await blockchain!.getBlock(block.header.parentHash)
    const parentState = parentBlock.header.stateRoot
    // run block
    await runBlock(vm, { block, root: parentState, skipHardForkValidation: true })
  })

  const blockchainHead = await vm.blockchain['getIteratorHead']()

  console.log('--- Finished processing the Blockchain ---')
  console.log('New head:', bytesToHex(blockchainHead.hash()))
  console.log('Expected:', blockchainMockData.lastblockhash)
}

void main()
