import { bytesToHex } from '@ethereumjs/util'

import { DataDirectory } from '../index.js'

import type { VMExecution } from '../execution/index.js'
import type { Block } from '@ethereumjs/block'

/**
 * Generates a code snippet which can be used to replay an erroneous block
 * locally in the VM
 *
 * @param block
 */
export async function debugCodeReplayBlock(execution: VMExecution, block: Block) {
  const code = `
/**
 * Script for locally executing a block in the EthereumJS VM,
 * meant to be used from packages/vm directory within the
 * https://github.com/ethereumjs/ethereumjs-monorepo repository.
 *
 * Block: ${block.header.number}
 * Hardfork: ${execution.hardfork}
 *
 * Run with: DEBUG=ethjs,vm:*:*,vm:*,-vm:ops:* tsx [SCRIPT_NAME].ts
 *
 */

import { Level } from 'level';
import { Common } from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import { VM, runBlock }  from './src'
import { Trie } from '@ethereumjs/trie'
import { DefaultStateManager } from './src/state'
import { Blockchain } from '@ethereumjs/blockchain'

const main = async () => {
  const common = new Common({ chain: '${execution.config.execCommon.chainName()}', hardfork: '${
    execution.hardfork
  }' })
  const block = createBlockFromRLPSerializedBlock(hexToBytes('${bytesToHex(
    block.serialize(),
  )}'), { common })

  const stateDB = new Level('${execution.config.getDataDirectory(DataDirectory.State)}')
  const trie = new Trie({ db: stateDB, useKeyHashing: true })
  const stateManager = new DefaultStateManager({ trie, common })
  // Ensure we run on the right root
  stateManager.setStateRoot(hexToBytes('${bytesToHex(
    await execution.vm.stateManager.getStateRoot(),
  )}'))


  const chainDB = new Level('${execution.config.getDataDirectory(DataDirectory.Chain)}')
  const blockchain = await createBlockchain({
    db: chainDB,
    common,
    validateBlocks: true,
    validateConsensus: false,
  })
  const vm = await VM.create({ stateManager, blockchain, common })

  await runBlock({ block })
}

main()
    `
  execution.config.logger.info(code)
}
