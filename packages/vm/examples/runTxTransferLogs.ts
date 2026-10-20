import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { decodeEIP7708TransferLog } from '@ethereumjs/evm'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

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
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const block = createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const tx = createLegacyTx(
    {
      gasLimit: 300_000n,
      gasPrice: 10n,
      value: 1_000_000_000_000_000n,
      to: createZeroAddress(),
    },
    { common },
  ).sign(senderKey)

  const result = await runTx(vm, { tx, block })
  const logs = result.receipt.logs

  console.log(`Receipt contains ${logs.length} log(s)`)
  for (const [index, log] of logs.entries()) {
    const formatted = formatLog(log)
    console.log(`  log[${index}] address=${formatted.address}`)
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
