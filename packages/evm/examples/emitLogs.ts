/**
 * Emit a LOG1 from hand-written bytecode and read logs from ExecResult.
 *
 * Usage: npx tsx examples/emitLogs.ts
 */
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import { bytesToBigInt, bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'

import type { Log } from '@ethereumjs/evm'

/** Pretty-print a Log tuple for console output (not an RPC formatter). */
function formatLog(log: Log) {
  const [address, topics, data] = log
  return {
    address: bytesToHex(address),
    topics: topics.map((topic) => bytesToHex(topic)),
    data: bytesToHex(data),
  }
}

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
  const evm = await createEVM({ common })

  const contract = createAddressFromString('0x00000000000000000000000000000000000000c0')

  // MSTORE a 32-byte data word at offset 0, then LOG1 with one topic.
  // Stack at LOG1 (bottom → top): memOffset, memLength, topic1
  const topic = hexToBytes(`0x${'11'.repeat(32)}`)
  const dataWord = hexToBytes(`0x${'00'.repeat(31)}42`)
  const code = hexToBytes(
    `0x7f${bytesToHex(dataWord).slice(2)}6000527f${bytesToHex(topic).slice(2)}60206000a100`,
  )

  const result = await evm.runCode({
    code,
    to: contract,
    gasLimit: 100_000n,
  })

  const logs = result.logs ?? []
  console.log(`Emitted ${logs.length} log(s) from ${contract.toString()}`)
  for (const [index, log] of logs.entries()) {
    const formatted = formatLog(log)
    console.log(`  log[${index}] address=${formatted.address}`)
    console.log(`           topics=${formatted.topics.join(', ')}`)
    console.log(`           data=${formatted.data} (value=${bytesToBigInt(log[2])})`)
  }
}

void main()
