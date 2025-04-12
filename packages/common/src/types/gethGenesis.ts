/**
 * Interface for Geth Genesis Config
 */
export interface GethGenesisConfig {
  chainId: number
  homesteadBlock?: number
  daoForkBlock?: number
  daoForkSupport?: boolean
  eip150Block?: number
  eip150Hash?: string
  eip155Block?: number
  eip158Block?: number
  byzantiumBlock?: number
  constantinopleBlock?: number
  petersburgBlock?: number
  istanbulBlock?: number
  muirGlacierBlock?: number
  berlinBlock?: number
  londonBlock?: number
  mergeForkBlock?: number
  cancunBlock?: number
  shanghaiTime?: number
  cancunTime?: number
  terminalTotalDifficulty?: number
  terminalTotalDifficultyPassed?: boolean
  ethash?: {}
  clique?: {
    period?: number
    epoch?: number
    blockperiodseconds?: number
    epochlength?: number
  }
  trustedCheckpoint?: {
    sectionIndex: number
    sectionHead: string
    chtRoot: string
    bloomRoot: string
  }
  trustedCheckpointOracle?: {
    address: string
    signers: string[]
    threshold: number
  }
}

/**
 * Interface for account allocation in Geth Genesis
 */
export interface GethGenesisAlloc {
  [address: string]: {
    balance?: string
    code?: string
    storage?: { [key: string]: string }
    nonce?: string
  }
}

/**
 * Interface for Geth Genesis object
 */
export interface GethGenesis {
  config: GethGenesisConfig
  nonce?: string
  timestamp?: string
  extraData?: string
  gasLimit: string
  difficulty?: string
  mixHash?: string
  coinbase?: string
  alloc?: GethGenesisAlloc
  number?: string
  gasUsed?: string
  parentHash?: string
  baseFeePerGas?: string | number | null
}

/**
 * Type for the options passed to createCommonFromGethGenesis
 */
export interface CreateCommonFromGethGenesisOpts {
  chain?: string
  genesisHash?: string
  mergeForkIdPostMerge?: boolean
}
