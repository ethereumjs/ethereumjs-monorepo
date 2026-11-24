/** Public deployment hints — not an exhaustive registry. */

export type KnownContractKind = 'token' | 'protocol' | 'system' | 'bridge' | 'ens' | 'wallet'

export type KnownContractMeta = {
  name: string
  kind: KnownContractKind
  role: string
  symbol?: string
  decimals?: number
}

const SHARED_SYSTEM: Record<string, KnownContractMeta> = {
  '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e': {
    name: 'ENS Registry',
    kind: 'ens',
    role: 'Ethereum Name Service core registry contract',
  },
  '0x000000000022d473030f116ddee9f6b43ac78ba3': {
    name: 'Permit2',
    kind: 'protocol',
    role: 'Uniswap Permit2 signature-based token approval contract',
  },
  '0xca11bde05977b3631167028862be2a173976ca11': {
    name: 'Multicall3',
    kind: 'protocol',
    role: 'Multicall3 batched call aggregator contract',
  },
  '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789': {
    name: 'EntryPoint v0.6',
    kind: 'wallet',
    role: 'ERC-4337 Account Abstraction EntryPoint v0.6 contract',
  },
  '0x0000000071727de22e5e9d8baf0edac6f37da032': {
    name: 'EntryPoint v0.7',
    kind: 'wallet',
    role: 'ERC-4337 Account Abstraction EntryPoint v0.7 contract',
  },
  '0x00000961ef480eb55e80d19ad83579a64c007002': {
    name: 'EIP-7002 Sys',
    kind: 'system',
    role: 'EIP-7002 execution-layer validator withdrawal request system contract',
  },
  '0x0000bbddc7ce488642fb579f8b00f3a590007251': {
    name: 'EIP-7251 Sys',
    kind: 'system',
    role: 'EIP-7251 validator consolidation request system contract',
  },
  '0x0000f90827f1c53a10cb7a02335b175320002935': {
    name: 'EIP-2935 Sys',
    kind: 'system',
    role: 'EIP-2935 historical block hash ring-buffer system contract',
  },
  '0x000f3df6d732807ef1319fb7b8bb8522d0beac02': {
    name: 'EIP-4788 Roots',
    kind: 'system',
    role: 'EIP-4788 beacon block root oracle system contract',
  },
}

const MAINNET: Record<string, KnownContractMeta> = {
  ...SHARED_SYSTEM,
  '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63': {
    name: 'ENS Resolver',
    kind: 'ens',
    role: 'ENS Public Resolver contract',
  },
  '0xa58e81fe9b61b5c3fe2afd33cf304c454abfc7cb': {
    name: 'ENS Reverse',
    kind: 'ens',
    role: 'ENS Reverse Registrar (primary .eth name) contract',
  },
  '0xff00000000000000000000000000000000000001': {
    name: 'Optimism Batch',
    kind: 'bridge',
    role: 'Optimism L2 rollup batch inbox address',
  },
  '0xff0000000000000000000000000000000000016a': {
    name: 'Scroll Batch',
    kind: 'bridge',
    role: 'Scroll L2 rollup batch inbox address',
  },
  '0x8315177ab297ba92a06054eb21fed9bbea7a2b0b': {
    name: 'Arbitrum Inbox',
    kind: 'bridge',
    role: 'Arbitrum One L2 bridge inbox contract',
  },
  '0x49048044d57e1c92a77f3198807e55285093c3cb': {
    name: 'Base Inbox',
    kind: 'bridge',
    role: 'Base L2 bridge portal contract',
  },
  '0x0000008e8ea4ad816bdd687994d0275dd65734e8': {
    name: 'Seaport 1.6',
    kind: 'protocol',
    role: 'OpenSea Seaport 1.6 NFT marketplace contract',
  },
  '0x3fc91a8afd6176d28ce9786a1b7f27620814b9f3': {
    name: 'Uniswap UR',
    kind: 'protocol',
    role: 'Uniswap Universal Router swap contract',
  },
  '0x0000000000001ff3684f28b6753d57c32c06f352': {
    name: 'Safe Factory',
    kind: 'wallet',
    role: 'Safe smart-account proxy factory contract',
  },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    name: 'WETH',
    kind: 'token',
    symbol: 'WETH',
    decimals: 18,
    role: 'Wrapped Ether ERC-20 token contract',
  },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    name: 'USDC',
    kind: 'token',
    symbol: 'USDC',
    decimals: 6,
    role: 'USD Coin ERC-20 stablecoin contract',
  },
  '0xdac17f958d2ee523a2206206994597c13d831ec7': {
    name: 'USDT',
    kind: 'token',
    symbol: 'USDT',
    decimals: 6,
    role: 'Tether USD ERC-20 stablecoin contract',
  },
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    name: 'DAI',
    kind: 'token',
    symbol: 'DAI',
    decimals: 18,
    role: 'Dai ERC-20 stablecoin contract',
  },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': {
    name: 'WBTC',
    kind: 'token',
    symbol: 'WBTC',
    decimals: 8,
    role: 'Wrapped Bitcoin ERC-20 token contract',
  },
  '0x514910771af9ca656af840dff83e8264ecf986ca': {
    name: 'LINK',
    kind: 'token',
    symbol: 'LINK',
    decimals: 18,
    role: 'LINK ERC-20 oracle token contract',
  },
}

const SEPOLIA: Record<string, KnownContractMeta> = {
  ...SHARED_SYSTEM,
  '0x8fde66519a807141ae54e6d71039776df826a46': {
    name: 'ENS Resolver',
    kind: 'ens',
    role: 'Sepolia ENS Public Resolver contract',
  },
  '0xa0a1abcdae13a2ab1f457ea56db1f344d5109840': {
    name: 'ENS Reverse',
    kind: 'ens',
    role: 'Sepolia ENS Reverse Registrar (primary .eth name) contract',
  },
  '0xfff9976782d46b056248514f4caf9bf5983a603f': {
    name: 'WETH',
    kind: 'token',
    symbol: 'WETH',
    decimals: 18,
    role: 'Sepolia Wrapped Ether ERC-20 token contract',
  },
  '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': {
    name: 'USDC',
    kind: 'token',
    symbol: 'USDC',
    decimals: 6,
    role: 'Sepolia USD Coin ERC-20 test token contract',
  },
  '0x779877a7b0d9e8603169ddbd7836e478b4624789': {
    name: 'LINK',
    kind: 'token',
    symbol: 'LINK',
    decimals: 18,
    role: 'Sepolia LINK ERC-20 test token contract',
  },
  '0x00000000219ab540356cbb839cbe05303d7705fa': {
    name: 'Deposit Contr',
    kind: 'system',
    role: 'Beacon Chain staking deposit contract',
  },
  '0x4242424242424242424242424242424242424242': {
    name: 'Deposit Contr',
    kind: 'system',
    role: 'Sepolia Beacon Chain staking deposit contract',
  },
}

export function knownContractMeta(chainId: bigint, address: string): KnownContractMeta | undefined {
  const addr = address.toLowerCase()
  if (chainId === 1n) return MAINNET[addr]
  if (chainId === 11155111n) return SEPOLIA[addr]
  return undefined
}

export function knownContractName(chainId: bigint, address: string): string | undefined {
  return knownContractMeta(chainId, address)?.name
}
