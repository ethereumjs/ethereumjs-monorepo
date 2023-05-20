export enum Chain {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  OptimismGoerli = 420,
  Sepolia = 11155111,
}

export enum Hardfork {
  Chainstart = 'chainstart',
  Homestead = 'homestead',
  Dao = 'dao',
  TangerineWhistle = 'tangerineWhistle',
  SpuriousDragon = 'spuriousDragon',
  Byzantium = 'byzantium',
  Constantinople = 'constantinople',
  Petersburg = 'petersburg',
  Istanbul = 'istanbul',
  MuirGlacier = 'muirGlacier',
  Berlin = 'berlin',
  London = 'london',
  ArrowGlacier = 'arrowGlacier',
  GrayGlacier = 'grayGlacier',
  MergeForkIdTransition = 'mergeForkIdTransition',
  Paris = 'paris',
  Shanghai = 'shanghai',
  Cancun = 'cancun',
  // Optimism hardforks
  Bedrock = 'bedrock',
  Regolith = 'regolith',
}

export enum ConsensusType {
  ProofOfStake = 'pos',
  ProofOfWork = 'pow',
  ProofOfAuthority = 'poa',
}

export enum ConsensusAlgorithm {
  Ethash = 'ethash',
  Clique = 'clique',
  Casper = 'casper',
}

export enum CustomChain {
  /**
   * Polygon (Matic) Mainnet
   *
   * - [Documentation](https://docs.matic.network/docs/develop/network-details/network)
   */
  PolygonMainnet = 'polygon-mainnet',

  /**
   * Polygon (Matic) Mumbai Testnet
   *
   * - [Documentation](https://docs.matic.network/docs/develop/network-details/network)
   */
  PolygonMumbai = 'polygon-mumbai',

  /**
   * Arbitrum Rinkeby Testnet
   *
   * - [Documentation](https://developer.offchainlabs.com/docs/public_testnet)
   */
  ArbitrumRinkebyTestnet = 'arbitrum-rinkeby-testnet',

  /**
   * Arbitrum One - mainnet for Arbitrum roll-up
   *
   * - [Documentation](https://developer.offchainlabs.com/public-chains)
   */
  ArbitrumOne = 'arbitrum-one',

  /**
   * xDai EVM sidechain with a native stable token
   *
   * - [Documentation](https://www.xdaichain.com/)
   */
  xDaiChain = 'x-dai-chain',

  /**
   * Optimism Ethereum - Optimism roll-up Mainnet deployment
   *
   * - [Documentation](https://community.optimism.io/docs/useful-tools/networks/#optimism-mainnet)
   */
  OptimismEthereum = 'optimism-ethereum',

  /**
   * Optimism Ethereum - Optimism roll-up Goerli testnet
   *
   * - [Documentation](https://community.optimism.io/docs/useful-tools/networks/#optimism-goerli)
   */
  OptimismGoerli = 'optimism-goerli',
}
