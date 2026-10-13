import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, decodeEIP7708TransferLog } from '@ethereumjs/evm'
import { bytesToHex, createAccount, createAddressFromString } from '@ethereumjs/util'

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
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const evm = await createEVM({ common })

  const caller = createAddressFromString('0x00000000000000000000000000000000000000ee')
  const recipient = createAddressFromString('0x00000000000000000000000000000000000000aa')
  await evm.stateManager.putAccount(caller, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  // Value-bearing CALL with no bytecode still emits a system-address Transfer log.
  const result = await evm.runCall({
    caller,
    to: recipient,
    value: 1n,
    gasLimit: 300_000n,
  })

  const logs = result.execResult.logs ?? []
  console.log(`runCall emitted ${logs.length} log(s)`)
  for (const [index, log] of logs.entries()) {
    const formatted = formatLog(log)
    console.log(`  log[${index}] emitter=${formatted.address}`)
    console.log(`           topics=${formatted.topics.join(', ')}`)
    console.log(`           data=${formatted.data}`)

    const transfer = decodeEIP7708TransferLog(log)
    if (transfer !== undefined) {
      console.log(
        `           → EIP-7708 Transfer from ${transfer.from} to ${transfer.to} value=${transfer.value} wei`,
      )
    }
  }
}

void main()
