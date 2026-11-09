const GWEI = 1_000_000_000n

export function formatGwei(wei: bigint | undefined): string {
  if (wei === undefined) return '—'
  const whole = wei / GWEI
  const frac = wei % GWEI
  const tenths = Number((frac * 10n) / GWEI)
  if (tenths === 0) return `${whole.toString()} Gwei`
  return `${whole.toString()}.${tenths.toString()} Gwei`
}

export function formatEthFromWei(wei: bigint): string {
  if (wei === 0n) return '0 ETH'
  const ethWhole = Number(wei) / 1e18
  if (ethWhole < 0.1) return `${ethWhole.toFixed(3)} ETH`
  return `${ethWhole.toFixed(1)} ETH`
}

export function shortAddress(addr: string): string {
  const a = addr.startsWith('0x') ? addr : `0x${addr}`
  if (a.length < 12) return a
  return `${a.slice(0, 6)}…${a.slice(-4)}`
}

export function trendArrow(trend: 'up' | 'down' | 'flat' | undefined): string {
  if (trend === 'up') return ' ↑'
  if (trend === 'down') return ' ↓'
  return ''
}

export function formatTrendSuffix(
  trend: 'up' | 'down' | 'flat' | undefined,
  percent: number | undefined,
): string {
  if (trend === undefined || trend === 'flat' || percent === undefined) return ''
  const sign = trend === 'up' ? '+' : ''
  return ` ${sign}${percent}%`
}
