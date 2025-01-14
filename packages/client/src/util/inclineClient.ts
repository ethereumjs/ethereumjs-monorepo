import { CliqueConsensus, createBlockchain } from '@ethereumjs/blockchain'
import { type Common, ConsensusAlgorithm } from '@ethereumjs/common'
import { Level } from 'level'
import { MemoryLevel } from 'memory-level'

import { EthereumClient } from '../../src/client.js'
import { Config } from '../../src/config.js'
import { LevelDB } from '../../src/execution/level.js'

import type { ConsensusDict } from '@ethereumjs/blockchain'
import type { GenesisState } from '@ethereumjs/util'

export async function createInlineClient(
  config: Config,
  common: Common,
  customGenesisState: GenesisState,
  datadir: string = Config.DATADIR_DEFAULT,
  memoryDB: boolean = false,
) {
  let chainDB
  let stateDB
  let metaDB
  if (memoryDB) {
    chainDB = new MemoryLevel<string | Uint8Array, string | Uint8Array>()
    stateDB = new MemoryLevel<string | Uint8Array, string | Uint8Array>()
    metaDB = new MemoryLevel<string | Uint8Array, string | Uint8Array>()
  } else {
    chainDB = new Level<string | Uint8Array, string | Uint8Array>(
      `${datadir}/${common.chainName()}/chainDB`,
    )

    stateDB = new Level<string | Uint8Array, string | Uint8Array>(
      `${datadir}/${common.chainName()}/stateDB`,
    )
    metaDB = new Level<string | Uint8Array, string | Uint8Array>(
      `${datadir}/${common.chainName()}/metaDB`,
    )
  }
  let validateConsensus = false
  const consensusDict: ConsensusDict = {}
  if (customGenesisState !== undefined) {
    if (config.chainCommon.consensusAlgorithm() === ConsensusAlgorithm.Clique) {
      consensusDict[ConsensusAlgorithm.Clique] = new CliqueConsensus()
      validateConsensus = true
    }
  }
  const blockchain = await createBlockchain({
    db: new LevelDB(chainDB),
    genesisState: customGenesisState,
    common: config.chainCommon,
    hardforkByHeadBlockNumber: true,
    validateBlocks: true,
    validateConsensus,
    consensusDict,
  })
  config.chainCommon.setForkHashes(blockchain.genesisBlock.hash())
  const inlineClient = await EthereumClient.create({
    config,
    blockchain,
    chainDB,
    stateDB,
    metaDB,
    genesisState: customGenesisState,
  })
  await inlineClient.open()
  await inlineClient.start()
  return inlineClient
}
