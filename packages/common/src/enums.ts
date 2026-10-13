import { BIGINT_0, hexToBytes } from '@ethereumjs/util'

/** Numeric chain identifier enum. */
export type Chain = (typeof Chain)[keyof typeof Chain]

/**
 * Well-known Ethereum chain IDs.
 *
 * Use with {@link @ethereumjs/genesis!getGenesis} or pass a {@link ChainConfig}
 * from `chains.ts` (e.g. {@link Mainnet}) to {@link Common}.
 */
export const Chain = {
  Mainnet: 1,
  Sepolia: 11155111,
  Holesky: 17000,
  Hoodi: 560048,
} as const

/** Maps numeric {@link Chain} IDs back to their enum key names (e.g. `1` → `"Mainnet"`). */
export const ChainNameFromNumber: { [key in Chain]: string } = Object.entries(Chain).reduce(
  (acc, [key, value]) => {
    acc[value as Chain] = key
    return acc
  },
  {} as { [key in Chain]: string },
)

/**
 * Genesis state meta info which is decoupled from common's genesis params
 */
type GenesisState = {
  name: string
  /* blockNumber that can be used to update and track the regenesis marker */
  blockNumber: bigint
  /* stateRoot of the chain at the blockNumber */
  stateRoot: Uint8Array
}

// Having this info as record will force typescript to make sure no chain is missed
/**
 * GenesisState info about well known ethereum chains
 */
export const ChainGenesis: Record<Chain, GenesisState> = {
  [Chain.Mainnet]: {
    name: 'mainnet',
    blockNumber: BIGINT_0,
    stateRoot: hexToBytes('0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544'),
  },
  [Chain.Sepolia]: {
    name: 'sepolia',
    blockNumber: BIGINT_0,
    stateRoot: hexToBytes('0x5eb6e371a698b8d68f665192350ffcecbbbf322916f4b51bd79bb6887da3f494'),
  },
  [Chain.Holesky]: {
    name: 'holesky',
    blockNumber: BIGINT_0,
    stateRoot: hexToBytes('0x69d8c9d72f6fa4ad42d4702b433707212f90db395eb54dc20bc85de253788783'),
  },
  [Chain.Hoodi]: {
    name: 'hoodi',
    blockNumber: BIGINT_0,
    stateRoot: hexToBytes('0xda87d7f5f91c51508791bbcbd4aa5baf04917830b86985eeb9ad3d5bfb657576'),
  },
}

/** Named Ethereum hardfork enum. */
export type Hardfork = (typeof Hardfork)[keyof typeof Hardfork]

/**
 * Named Ethereum hardfork identifiers used by {@link Common}.
 *
 * Hardfork order and activation conditions are defined per chain in {@link ChainConfig}.
 */
export const Hardfork = {
  Chainstart: 'chainstart',
  Homestead: 'homestead',
  Dao: 'dao',
  TangerineWhistle: 'tangerineWhistle',
  SpuriousDragon: 'spuriousDragon',
  Byzantium: 'byzantium',
  Constantinople: 'constantinople',
  Petersburg: 'petersburg',
  Istanbul: 'istanbul',
  MuirGlacier: 'muirGlacier',
  Berlin: 'berlin',
  London: 'london',
  ArrowGlacier: 'arrowGlacier',
  GrayGlacier: 'grayGlacier',
  MergeNetsplitBlock: 'mergeNetsplitBlock',
  Paris: 'paris',
  Shanghai: 'shanghai',
  Cancun: 'cancun',
  Prague: 'prague',
  Osaka: 'osaka',
  Bpo1: 'bpo1',
  Bpo2: 'bpo2',
  Bpo3: 'bpo3',
  Bpo4: 'bpo4',
  Bpo5: 'bpo5',
  Amsterdam: 'amsterdam',
} as const

/** Consensus engine family enum. */
export type ConsensusType = (typeof ConsensusType)[keyof typeof ConsensusType]

/** Consensus engine family enum. */
export const ConsensusType = {
  ProofOfStake: 'pos',
  ProofOfWork: 'pow',
  ProofOfAuthority: 'poa',
} as const

/** Consensus algorithm identifier enum. */
export type ConsensusAlgorithm = (typeof ConsensusAlgorithm)[keyof typeof ConsensusAlgorithm]

/** Consensus algorithm identifier enum. */
export const ConsensusAlgorithm = {
  Ethash: 'ethash',
  Clique: 'clique',
  Casper: 'casper',
} as const
