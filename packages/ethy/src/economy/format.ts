const GWEI = 1_000_000_000n

function trimTrailingFracDigits(s: string): string {
  return s.replace(/0+$/, '').replace(/\.$/, '')
}

function fracString(fracPart: bigint, maxDigits: number): string {
  const s = fracPart.toString().padStart(maxDigits, '0')
  return trimTrailingFracDigits(s)
}

/** Numeric base-fee string without the ` Gwei` suffix (for cockpit + AI). */
export function formatBaseFeeNumber(wei: bigint | undefined): string {
  if (wei === undefined) return '—'
  if (wei === 0n) return '0'
  if (wei < 1_000_000n) return '<0.001'

  if (wei >= 10_000_000_000n) {
    const whole = wei / GWEI
    const frac = wei % GWEI
    const tenths = (frac * 10n) / GWEI
    if (tenths === 0n) return whole.toString()
    return `${whole}.${tenths}`
  }
  if (wei >= 100_000_000n) {
    const whole = wei / GWEI
    const frac = wei % GWEI
    const hundredths = (frac * 100n) / GWEI
    if (hundredths === 0n) return whole.toString()
    const f = fracString(hundredths, 2)
    if (whole === 0n) return `0.${f}`
    return f.length > 0 ? `${whole}.${f}` : whole.toString()
  }
  const whole = wei / GWEI
  const frac = wei % GWEI
  const thousandths = (frac * 1000n) / GWEI
  if (thousandths === 0n) return whole.toString()
  const f = fracString(thousandths, 3)
  if (whole === 0n) return `0.${f}`
  return f.length > 0 ? `${whole}.${f}` : whole.toString()
}

export function formatGwei(wei: bigint | undefined): string {
  const num = formatBaseFeeNumber(wei)
  if (num === '—') return '—'
  return `${num} Gwei`
}

export function formatEthFromWei(wei: bigint): string {
  if (wei === 0n) return '0 ETH'
  const sign = wei < 0n ? '-' : ''
  const absWei = wei < 0n ? -wei : wei
  const ethWhole = Number(absWei) / 1e18
  if (ethWhole < 0.1) return `${sign}${ethWhole.toFixed(3)} ETH`
  return `${sign}${ethWhole.toFixed(1)} ETH`
}

export function formatSignedEthFromWei(wei: bigint): string {
  if (wei === 0n) return '0 ETH'
  const formatted = formatEthFromWei(wei)
  return wei > 0n ? `+${formatted}` : formatted
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
  const sign = trend === 'up' ? '+' : '-'
  return ` (${sign}${percent}%)`
}
