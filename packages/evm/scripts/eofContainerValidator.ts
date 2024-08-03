import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { unprefixedHexToBytes } from '@ethereumjs/util'
import * as readline from 'readline'

import { createEVM, validateEOF } from '../src/index.js'

/**
 * This script reads hex strings (either prefixed or non-prefixed with 0x) from stdin
 * It tries to validate the EOF container, if it is valid, it will print "OK"
 * If there is a validation error, it will print "err: <REASON>"
 * If the input is emtpy, the program will exit
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

const common = new Common({ chain: Mainnet })
common.setHardfork(Hardfork.Prague)
common.setEIPs([663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698])
const evm = await createEVM({ common })

rl.on('line', async (line) => {
  if (line.length === 0) {
    rl.close()
    return
  }
  let trimmed = line
  if (line.startsWith('0x')) {
    trimmed = line.slice(2)
  }
  const bytes = unprefixedHexToBytes(trimmed)
  try {
    validateEOF(bytes, evm)
    console.log('OK')
  } catch (e: any) {
    console.log('err: ' + e.message)
  }
})
