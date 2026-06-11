import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  // Setup an event listener on the `afterTx` event
  vm.events.on('afterTx', (event, resolve) => {
    console.log('asynchronous listener to afterTx', bytesToHex(event.transaction.hash()))
    // we need to call resolve() to avoid the event listener hanging
    resolve?.()
  })

  vm.events.on('afterTx', (event) => {
    console.log('synchronous listener to afterTx', bytesToHex(event.transaction.hash()))
  })

  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 1_000_000_000n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const res = await runTx(vm, { tx })
  console.log(res.totalGasSpent) // 21000n - gas cost for simple ETH transfer
}

void main()
