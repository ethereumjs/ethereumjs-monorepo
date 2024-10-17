import { createEVM } from '@ethereumjs/evm'
import { createAddressFromString, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const evm = await createEVM()

  evm.events.on('beforeMessage', (event) => {
    console.log('synchronous listener to beforeMessage', event)
  })
  evm.events.on('afterMessage', (event, resolve) => {
    console.log('asynchronous listener to beforeMessage', event)
    // we need to call resolve() to avoid the event listener hanging
    resolve?.()
  })
  const res = await evm.runCall({
    to: createAddressFromString('0x0000000000000000000000000000000000000000'),
    value: 0n,
    data: hexToBytes('0x6001'), // PUSH1 01 -- simple bytecode to push 1 onto the stack
  })
  console.log(res.execResult.executionGasUsed) // 0n
}

void main()
