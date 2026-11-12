/** Public deployment hints — not an exhaustive registry. */

const MAINNET: Record<string, string> = {
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'WETH',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
  '0x0000000071727de22e5e9d8baf0edac6f37da032': 'EntryPoint v0.7',
  '0x00000961ef480eb55e80d19ad83579a64c007002': 'EIP-7002 Sys',
  '0x0000bbddc7ce488642fb579f8b00f3a590007251': 'EIP-7251 Sys',
  '0x0000f90827f1c53a10cb7a02335b175320002935': 'EIP-2935 Sys',
  '0x000f3df6d732807ef1319fb7b8bb8522d0beac02': 'EIP-4788 Roots',
}

const SEPOLIA: Record<string, string> = {
  '0xfff9976782d46b056248514f4caf9bf5983a603f': 'WETH',
  '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': 'USDC',
  '0x0000000071727de22e5e9d8baf0edac6f37da032': 'EntryPoint v0.7',
  '0x00000961ef480eb55e80d19ad83579a64c007002': 'EIP-7002 Sys',
  '0x0000bbddc7ce488642fb579f8b00f3a590007251': 'EIP-7251 Sys',
  '0x0000f90827f1c53a10cb7a02335b175320002935': 'EIP-2935 Sys',
  '0x000f3df6d732807ef1319fb7b8bb8522d0beac02': 'EIP-4788 Roots',
  '0x00000000219ab540356cbb839cbe05303d7705fa': 'Deposit Contr',
  '0x4242424242424242424242424242424242424242': 'Deposit Contr',
}

export function knownContractName(chainId: bigint, address: string): string | undefined {
  const addr = address.toLowerCase()
  if (chainId === 1n) return MAINNET[addr]
  if (chainId === 11155111n) return SEPOLIA[addr]
  return undefined
}
