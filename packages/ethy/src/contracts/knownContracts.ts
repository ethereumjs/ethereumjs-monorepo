/** Public deployment hints — not an exhaustive registry. */

const MAINNET: Record<string, string> = {
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'WETH',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
  '0x0000000071727de22e5e9d8baf0edac6f37da032': 'EntryPoint v0.7',
}

const SEPOLIA: Record<string, string> = {
  '0xfff9976782d46b056248514f4caf9bf5983a603f': 'WETH',
  '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238': 'USDC',
  '0x0000000071727de22e5e9d8baf0edac6f37da032': 'EntryPoint v0.7',
}

export function knownContractName(chainId: bigint, address: string): string | undefined {
  const addr = address.toLowerCase()
  if (chainId === 1n) return MAINNET[addr]
  if (chainId === 11155111n) return SEPOLIA[addr]
  return undefined
}
