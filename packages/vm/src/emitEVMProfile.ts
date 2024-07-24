import type { EVMPerformanceLogOutput } from '@ethereumjs/evm'

/**
 * Emit EVM profile logs
 * @param logs
 * @param profileTitle
 * @hidden
 */
export function emitEVMProfile(logs: EVMPerformanceLogOutput[], profileTitle: string) {
  if (logs.length === 0) {
    return
  }

  // Track total calls / time (ms) / gas

  let calls = 0
  let totalMs = 0
  let totalGas = 0

  // Order of columns to report (see `EVMPerformanceLogOutput` type)

  const colOrder: (keyof EVMPerformanceLogOutput)[] = [
    'tag',
    'calls',
    'avgTimePerCall',
    'totalTime',
    'staticGasUsed',
    'dynamicGasUsed',
    'gasUsed',
    'staticGas',
    'millionGasPerSecond',
    'blocksPerSlot',
  ]

  // The name of this column to report (saves space)
  const colNames = [
    'tag',
    'calls',
    'ms/call',
    'total (ms)',
    'sgas',
    'dgas',
    'total (s+d)',
    'static fee',
    'Mgas/s',
    'BpS',
  ]

  // Special padStr method which inserts whitespace left and right
  // This ensures that there is at least one whitespace between the columns (denoted by pipe `|` chars)
  function padStr(str: string | number, leftpad: number) {
    return ' ' + str.toString().padStart(leftpad, ' ') + ' '
  }
  // Returns the string length of this column. Used to calculate how big the header / footer should be
  function strLen(str: string | number) {
    return padStr(str, 0).length - 2
  }

  // Step one: calculate the length of each colum
  const colLength: number[] = []

  for (const entry of logs) {
    let ins = 0
    colLength[ins] = Math.max(colLength[ins] ?? 0, strLen(colNames[ins]))
    for (const key of colOrder) {
      if (entry[key] !== undefined) {
        // If entry is available, max out the current column length (this will be the longest string of this column)
        colLength[ins] = Math.max(colLength[ins] ?? 0, strLen(entry[key]!))
        ins++
        // In this switch statement update the total calls / time / gas used
        switch (key) {
          case 'calls':
            calls += entry[key]
            break
          case 'totalTime':
            totalMs += entry[key]
            break
          case 'gasUsed':
            totalGas += entry[key]
            break
        }
      }
    }
  }

  // Ensure that the column names also fit on the column length
  for (const i in colLength) {
    colLength[i] = Math.max(colLength[i] ?? 0, strLen(colNames[i]))
  }

  // Calculate the total header length
  // This is done by summing all columns together, plus adding three extra chars per column (two whitespace, one pipe)
  // Remove the final pipe character since this is included in the header string (so subtract one)
  const headerLength = colLength.reduce((pv, cv) => pv + cv, 0) + colLength.length * 3 - 1

  const blockGasLimit = 30_000_000 // Block gas limit
  const slotTime = 12000 // Time in milliseconds (!) per slot

  // Normalize constant to check if execution time is above one block per slot (>=1) or not (<1)
  const bpsNormalizer = blockGasLimit / slotTime

  const avgGas = totalGas / totalMs // Gas per millisecond
  const mGasSAvg = Math.round(avgGas) / 1e3
  const bpSAvg = Math.round((avgGas / bpsNormalizer) * 1e3) / 1e3

  // Write the profile title
  // eslint-disable-next-line
  console.log('+== ' + profileTitle + ' ==+')
  // Write the summary of this profile
  // eslint-disable-next-line
  console.log(
    `+== Calls: ${calls}, Total time: ${
      Math.round(totalMs * 1e3) / 1e3
    }ms, Total gas: ${totalGas}, MGas/s: ${mGasSAvg}, Blocks per Slot (BpS): ${bpSAvg} ==+`,
  )

  // Generate and write the header
  const header = '|' + '-'.repeat(headerLength) + '|'
  // eslint-disable-next-line
  console.log(header)

  // Write the columns
  let str = ''
  for (const i in colLength) {
    str += '|' + padStr(colNames[i], colLength[i])
  }
  str += '|'

  // eslint-disable-next-line
  console.log(str)

  // Write each profile entry
  for (const entry of logs) {
    let str = ''
    let i = 0
    for (const key of colOrder) {
      if (entry[key] !== undefined) {
        str += '|' + padStr(entry[key]!, colLength[i])
        i++
      }
    }
    str += '|'
    // eslint-disable-next-line
    console.log(str)
  }

  // Finally, write the footer
  const footer = '+' + '-'.repeat(headerLength) + '+'
  // eslint-disable-next-line
  console.log(footer)
}
