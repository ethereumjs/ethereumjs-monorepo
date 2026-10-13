import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import {
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'

import type { Log } from '@ethereumjs/evm'

const PUSH32 = 0x7f
const PUSH1 = 0x60
const MSTORE = 0x52
const LOG1 = 0xa1
const STOP = 0x00

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
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const evm = await createEVM({ common })

  const contract = createAddressFromString('0x00000000000000000000000000000000000000c0')

  // MSTORE 32 bytes at offset 0, then LOG1. LOG1 pops (top first): memOffset, memLength, topic.
  const topic = hexToBytes(`0x${'11'.repeat(32)}`)
  const dataWord = hexToBytes(`0x${'00'.repeat(31)}42`)
  const code = concatBytes(
    Uint8Array.from([PUSH32]),
    dataWord,
    Uint8Array.from([PUSH1, 0x00, MSTORE]),
    Uint8Array.from([PUSH32]),
    topic,
    Uint8Array.from([PUSH1, 0x20, PUSH1, 0x00, LOG1, STOP]),
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
    console.log(`  log[${index}] emitter=${formatted.address}`)
    console.log(`           topics=${formatted.topics.join(', ')}`)
    console.log(`           data=${formatted.data} (value=${bytesToBigInt(log[2])})`)
  }
}

void main()
