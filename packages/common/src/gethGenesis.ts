import { type PrefixedHexString, addHexPrefix, bigIntToHex, isHexString } from '@ethereumjs/util'

/**
 * Interface for Geth Genesis Config
 */
export interface GethGenesisConfig {
  chainId: number
  depositContractAddress?: string
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
  arrowGlacierBlock?: number
  grayGlacierBlock?: number
  mergeNetsplitBlock?: number
  shanghaiTime?: number
  cancunTime?: number
  pragueTime?: number
  verkleTime?: number
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
  blobSchedule?: GethGenesisBlobSchedule
  proofInBlocks?: boolean
}

/**
 * Interface for account allocation in Geth Genesis
 */
export interface GethGenesisAlloc {
  [address: string]: {
    balance: string
    code?: string
    storage?: { [key: string]: string }
    nonce?: string
  }
}

/**
 * Interface for blob schedule in Geth Genesis (EIP-7840)
 */
export interface GethGenesisBlobSchedule {
  [fork: string]: {
    target?: number
    max?: number
    baseFeeUpdateFraction?: number
  }
}

/**
 * Interface for Geth Genesis object
 */
export interface GethGenesis {
  config: GethGenesisConfig
  name?: string
  excessBlobGas?: string
  requestsHash?: string
  nonce: string
  timestamp: string
  extraData?: string
  gasLimit: PrefixedHexString
  difficulty?: PrefixedHexString
  mixHash?: PrefixedHexString
  coinbase?: PrefixedHexString
  alloc: GethGenesisAlloc
  number?: PrefixedHexString
  gasUsed?: PrefixedHexString
  parentHash?: PrefixedHexString
  baseFeePerGas?: PrefixedHexString | number | null
}

/**
 * Type for the options passed to createCommonFromGethGenesis
 */
export interface CreateCommonFromGethGenesisOpts {
  chain?: string
  genesisHash?: string
  mergeForkIdPostMerge?: boolean
}

export type StoragePair = [key: PrefixedHexString, value: PrefixedHexString]

export type AccountState = [
  balance: PrefixedHexString,
  code?: PrefixedHexString,
  storage?: Array<StoragePair>,
  nonce?: PrefixedHexString,
]

/**
 * If you are using a custom chain {@link Common}, pass the genesis state.
 *
 * Pattern 1 (with genesis state see {@link GenesisState} for format):
 *
 * ```javascript
 * {
 *   '0x0...01': '0x100', // For EoA
 * }
 * ```
 *
 * Pattern 2 (with complex genesis state, containing contract accounts and storage).
 * Note that in {@link AccountState} there are two
 * accepted types. This allows to easily insert accounts in the genesis state:
 *
 * A complex genesis state with Contract and EoA states would have the following format:
 *
 * ```javascript
 * {
 *   '0x0...01': '0x100', // For EoA
 *   '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[storageKey1, storageValue1], [storageKey2, storageValue2]]] // For contracts
 * }
 * ```
 */
export interface GenesisState {
  [key: PrefixedHexString]: PrefixedHexString | AccountState
}

/**
 * Parses the geth genesis state into Blockchain {@link GenesisState}
 * @param gethGenesis GethGenesis object
 */
export function parseGethGenesisState(gethGenesis: GethGenesis): GenesisState {
  const state: GenesisState = {}

  for (const address of Object.keys(gethGenesis.alloc)) {
    const {
      balance: rawBalance,
      code: rawCode,
      nonce: rawNonce,
      storage: rawStorage,
    } = gethGenesis.alloc[address]
    // create a map with lowercase for easy lookups
    const prefixedAddress = addHexPrefix(address.toLowerCase())
    const balance = isHexString(rawBalance) ? rawBalance : bigIntToHex(BigInt(rawBalance))
    const code = rawCode !== undefined ? addHexPrefix(rawCode) : undefined
    const storage =
      rawStorage !== undefined
        ? (Object.entries(rawStorage).map((storagePair) =>
            storagePair.map(addHexPrefix),
          ) as StoragePair[])
        : undefined
    const nonce = rawNonce !== undefined ? addHexPrefix(rawNonce) : undefined
    state[prefixedAddress] = [balance, code, storage, nonce]
  }
  return state
}
