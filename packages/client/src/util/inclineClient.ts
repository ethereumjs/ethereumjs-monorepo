import { CliqueConsensus, createBlockchain } from '@ethereumjs/blockchain'
import { type Common, ConsensusAlgorithm } from '@ethereumjs/common'
import { Level } from 'level'
import { MemoryLevel } from 'memory-level'

import { EthereumClient } from '../client.ts'
import { Config } from '../config.ts'
import { LevelDB } from '../execution/level.ts'

import type { ConsensusDict } from '@ethereumjs/blockchain'
import type { GenesisState } from '@ethereumjs/util'
import type { AbstractLevel } from 'abstract-level'

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
    // `Level` and `AbstractLevel` somehow have a few property differences even though
    // `Level` extends `AbstractLevel`.  We don't use any of the missing properties so
    // just ignore this error
    chainDB = new MemoryLevel<
      string | Uint8Array,
      string | Uint8Array
    >() as unknown as AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
    stateDB = new MemoryLevel<
      string | Uint8Array,
      string | Uint8Array
    >() as unknown as AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
    metaDB = new MemoryLevel<
      string | Uint8Array,
      string | Uint8Array
    >() as unknown as AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
  } else {
    chainDB = new Level<string | Uint8Array, string | Uint8Array>(
      `${datadir}/${common.chainName()}/chain`,
    ) as unknown as AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>

    stateDB = new Level<string | Uint8Array, string | Uint8Array>(
      `${datadir}/${common.chainName()}/state`,
    ) as unknown as AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
    metaDB = new Level<string | Uint8Array, string | Uint8Array>(
      `${datadir}/${common.chainName()}/meta`,
    ) as unknown as AbstractLevel<string | Uint8Array, string | Uint8Array, string | Uint8Array>
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
