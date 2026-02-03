/**
 * BAL (Block-level Access List) Comparator Tool
 *
 * Self-contained utility for comparing expected vs generated BAL data
 * and producing a compact colored CLI diff output.
 *
 * FULLY AI-GENERATED - EVENTUALLY DELETE WHEN PURPOSE IS SERVED
 * Creation date: 2026-02-02, Opus 4.5, Cursor IDE
 */

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
}

// Type definitions matching the BAL raw format
type BALRawStorageChange = [number, Uint8Array]
type BALRawBalanceChange = [number, string]
type BALRawNonceChange = [number, string]
type BALRawCodeChange = [number, Uint8Array]
type BALRawSlotChanges = [string | Uint8Array, BALRawStorageChange[]]

type BALRawAccountChanges = [
  string, // address
  BALRawSlotChanges[], // storageChanges
  (string | Uint8Array)[], // storageReads
  BALRawBalanceChange[], // balanceChanges
  BALRawNonceChange[], // nonceChanges
  BALRawCodeChange[], // codeChanges
]

type BALRawBlockAccessList = BALRawAccountChanges[]

/**
 * Normalize a value to hex string for comparison
 */
function toHex(value: string | Uint8Array | number | bigint): string {
  if (typeof value === 'string') {
    return value.toLowerCase()
  }
  if (value instanceof Uint8Array) {
    if (value.length === 0) return '0x'
    return (
      '0x' +
      Array.from(value)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    )
  }
  if (typeof value === 'number' || typeof value === 'bigint') {
    return '0x' + value.toString(16)
  }
  return String(value)
}

/**
 * Truncate hex string for display (keep first and last parts)
 */
function truncateHex(hex: string, maxLen = 20): string {
  if (hex.length <= maxLen) return hex
  const keepChars = Math.floor((maxLen - 3) / 2)
  return hex.slice(0, keepChars + 2) + '...' + hex.slice(-keepChars)
}

/**
 * Compare two arrays of changes (balance, nonce, code, or storage)
 */
function compareChanges(
  expected: [number, string | Uint8Array][],
  generated: [number, string | Uint8Array][],
  label: string,
  _address: string,
): string[] {
  const diffs: string[] = []
  const expectedMap = new Map(expected.map(([idx, val]) => [idx, toHex(val)]))
  const generatedMap = new Map(generated.map(([idx, val]) => [idx, toHex(val)]))

  const allIndices = new Set([...expectedMap.keys(), ...generatedMap.keys()])

  for (const idx of [...allIndices].sort((a, b) => a - b)) {
    const exp = expectedMap.get(idx)
    const gen = generatedMap.get(idx)
    const expExists = exp !== undefined
    const genExists = gen !== undefined

    if (expExists && !genExists) {
      diffs.push(
        `  ${colors.red}✗ ${label} [${idx}] MISSING${colors.reset}` +
          `\n    ${colors.dim}Expected:${colors.reset} ${colors.green}${truncateHex(exp, 50)}${colors.reset}`,
      )
    } else if (!expExists && genExists) {
      diffs.push(
        `  ${colors.yellow}+ ${label} [${idx}] EXTRA${colors.reset}` +
          `\n    ${colors.dim}Generated:${colors.reset} ${colors.red}${truncateHex(gen, 50)}${colors.reset}`,
      )
    } else if (expExists && genExists && exp !== gen) {
      diffs.push(
        `  ${colors.red}✗ ${label} [${idx}] MISMATCH${colors.reset}` +
          `\n    ${colors.dim}Expected:${colors.reset}  ${colors.green}${truncateHex(exp, 50)}${colors.reset}` +
          `\n    ${colors.dim}Generated:${colors.reset} ${colors.red}${truncateHex(gen, 50)}${colors.reset}`,
      )
    }
  }

  return diffs
}

/**
 * Compare storage reads (arrays of hex strings)
 */
function compareStorageReads(
  expected: (string | Uint8Array)[],
  generated: (string | Uint8Array)[],
): string[] {
  const diffs: string[] = []
  const expSet = new Set(expected.map((v) => toHex(v)))
  const genSet = new Set(generated.map((v) => toHex(v)))

  const missing = [...expSet].filter((x) => !genSet.has(x))
  const extra = [...genSet].filter((x) => !expSet.has(x))

  if (missing.length > 0) {
    diffs.push(
      `  ${colors.red}✗ storageReads MISSING (${missing.length}):${colors.reset} ${missing
        .slice(0, 5)
        .map((m) => truncateHex(m, 20))
        .join(', ')}${missing.length > 5 ? '...' : ''}`,
    )
  }
  if (extra.length > 0) {
    diffs.push(
      `  ${colors.yellow}+ storageReads EXTRA (${extra.length}):${colors.reset} ${extra
        .slice(0, 5)
        .map((m) => truncateHex(m, 20))
        .join(', ')}${extra.length > 5 ? '...' : ''}`,
    )
  }

  return diffs
}

/**
 * Compare storage changes (slot -> array of changes)
 */
function compareStorageChanges(
  expected: BALRawSlotChanges[],
  generated: BALRawSlotChanges[],
  address: string,
): string[] {
  const diffs: string[] = []

  // Build maps keyed by normalized slot hex
  const expMap = new Map<string, BALRawStorageChange[]>()
  for (const [slot, changes] of expected) {
    expMap.set(toHex(slot), changes)
  }

  const genMap = new Map<string, BALRawStorageChange[]>()
  for (const [slot, changes] of generated) {
    genMap.set(toHex(slot), changes)
  }

  const allSlots = new Set([...expMap.keys(), ...genMap.keys()])

  for (const slot of [...allSlots].sort()) {
    const expChanges = expMap.get(slot)
    const genChanges = genMap.get(slot)

    if (expChanges && !genChanges) {
      diffs.push(
        `  ${colors.red}✗ storageChanges slot ${truncateHex(slot, 20)} MISSING${colors.reset}` +
          `\n    ${colors.dim}Expected ${expChanges.length} change(s):${colors.reset} ${expChanges.map(([i, v]) => `[${i}]:${truncateHex(toHex(v), 15)}`).join(', ')}`,
      )
    } else if (!expChanges && genChanges) {
      diffs.push(
        `  ${colors.yellow}+ storageChanges slot ${truncateHex(slot, 20)} EXTRA${colors.reset}` +
          `\n    ${colors.dim}Generated ${genChanges.length} change(s):${colors.reset} ${genChanges.map(([i, v]) => `[${i}]:${truncateHex(toHex(v), 15)}`).join(', ')}`,
      )
    } else if (expChanges && genChanges) {
      // Compare individual changes within the slot
      const slotDiffs = compareChanges(
        expChanges as [number, Uint8Array][],
        genChanges as [number, Uint8Array][],
        `slot ${truncateHex(slot, 15)}`,
        address,
      )
      if (slotDiffs.length > 0) {
        diffs.push(`  ${colors.cyan}Storage slot ${truncateHex(slot, 20)}:${colors.reset}`)
        diffs.push(...slotDiffs.map((d) => '  ' + d))
      }
    }
  }

  return diffs
}

/**
 * Compare two BAL account entries
 */
function compareAccount(
  address: string,
  expected: BALRawAccountChanges | undefined,
  generated: BALRawAccountChanges | undefined,
): string[] {
  const diffs: string[] = []

  if (!expected && !generated) return diffs

  if (expected && !generated) {
    diffs.push(`${colors.red}${colors.bold}✗ MISSING ADDRESS: ${address}${colors.reset}`)
    // Show summary of what was expected
    const [, storageChanges, storageReads, balanceChanges, nonceChanges, codeChanges] = expected
    const summary = []
    if (storageChanges.length > 0) summary.push(`${storageChanges.length} storageChanges`)
    if (storageReads.length > 0) summary.push(`${storageReads.length} storageReads`)
    if (balanceChanges.length > 0) summary.push(`${balanceChanges.length} balanceChanges`)
    if (nonceChanges.length > 0) summary.push(`${nonceChanges.length} nonceChanges`)
    if (codeChanges.length > 0) summary.push(`${codeChanges.length} codeChanges`)
    if (summary.length > 0) {
      diffs.push(`  ${colors.dim}Expected:${colors.reset} ${summary.join(', ')}`)
    }
    return diffs
  }

  if (!expected && generated) {
    diffs.push(`${colors.yellow}${colors.bold}+ EXTRA ADDRESS: ${address}${colors.reset}`)
    // Show summary of what was generated
    const [, storageChanges, storageReads, balanceChanges, nonceChanges, codeChanges] = generated
    const summary = []
    if (storageChanges.length > 0) summary.push(`${storageChanges.length} storageChanges`)
    if (storageReads.length > 0) summary.push(`${storageReads.length} storageReads`)
    if (balanceChanges.length > 0) summary.push(`${balanceChanges.length} balanceChanges`)
    if (nonceChanges.length > 0) summary.push(`${nonceChanges.length} nonceChanges`)
    if (codeChanges.length > 0) summary.push(`${codeChanges.length} codeChanges`)
    if (summary.length > 0) {
      diffs.push(`  ${colors.dim}Generated:${colors.reset} ${summary.join(', ')}`)
    }
    return diffs
  }

  // Both exist - compare fields
  const [, expStorage, expReads, expBalance, expNonce, expCode] = expected!
  const [, genStorage, genReads, genBalance, genNonce, genCode] = generated!

  const accountDiffs: string[] = []

  // Compare storage changes
  accountDiffs.push(...compareStorageChanges(expStorage, genStorage, address))

  // Compare storage reads
  accountDiffs.push(...compareStorageReads(expReads, genReads))

  // Compare balance changes
  accountDiffs.push(...compareChanges(expBalance, genBalance, 'balanceChanges', address))

  // Compare nonce changes
  accountDiffs.push(...compareChanges(expNonce, genNonce, 'nonceChanges', address))

  // Compare code changes
  accountDiffs.push(...compareChanges(expCode, genCode, 'codeChanges', address))

  if (accountDiffs.length > 0) {
    diffs.push(`${colors.blue}${colors.bold}● ${address}${colors.reset}`)
    diffs.push(...accountDiffs)
  }

  return diffs
}

/**
 * Main comparison function
 *
 * @param expected - The expected BAL raw data (from test fixtures)
 * @param generated - The generated BAL raw data (from VM execution)
 * @param printToConsole - Whether to also print to console (default: true for backwards compat)
 * @returns Object with `hasDiff` boolean and `diffString` for use in assertions
 */
export function compareBAL(
  expected: BALRawBlockAccessList,
  generated: BALRawBlockAccessList,
  printToConsole = true,
): { hasDiff: boolean; diffString: string } {
  const lines: string[] = []
  lines.push('\n' + colors.bold + colors.magenta + '═══ BAL COMPARISON ═══' + colors.reset + '\n')

  // Build maps keyed by address
  const expMap = new Map<string, BALRawAccountChanges>()
  for (const entry of expected) {
    expMap.set(entry[0].toLowerCase(), entry)
  }

  const genMap = new Map<string, BALRawAccountChanges>()
  for (const entry of generated) {
    genMap.set(entry[0].toLowerCase(), entry)
  }

  const allAddresses = new Set([...expMap.keys(), ...genMap.keys()])
  const sortedAddresses = [...allAddresses].sort()

  let totalDiffs = 0
  const allDiffs: string[] = []

  for (const address of sortedAddresses) {
    const accountDiffs = compareAccount(address, expMap.get(address), genMap.get(address))
    if (accountDiffs.length > 0) {
      totalDiffs++
      allDiffs.push(...accountDiffs, '')
    }
  }

  if (allDiffs.length === 0) {
    lines.push(colors.green + colors.bold + '✓ BAL MATCH - No differences found!' + colors.reset)
  } else {
    lines.push(
      colors.red +
        colors.bold +
        `✗ BAL MISMATCH - ${totalDiffs} address(es) with differences:` +
        colors.reset +
        '\n',
    )
    for (const line of allDiffs) {
      lines.push(line)
    }
  }

  // Summary statistics
  lines.push(colors.dim + '─'.repeat(50) + colors.reset)
  lines.push(
    colors.dim +
      `Expected: ${expected.length} addresses | Generated: ${generated.length} addresses` +
      colors.reset,
  )
  lines.push('')

  const diffString = lines.join('\n')

  if (printToConsole) {
    console.log(diffString)
  }

  return { hasDiff: totalDiffs > 0, diffString }
}

/**
 * Convenience wrapper for BlockLevelAccessList objects
 * Call with the result of bal.raw() for both expected and generated
 */
export function compareBALFromRaw(
  expected: unknown,
  generated: unknown,
  printToConsole = true,
): { hasDiff: boolean; diffString: string } {
  return compareBAL(
    expected as BALRawBlockAccessList,
    generated as BALRawBlockAccessList,
    printToConsole,
  )
}
