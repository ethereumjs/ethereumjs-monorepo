import { createEVM } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const evm = await createEVM({
    customOpcodes: [
      {
        opcode: 0x21,
        opcodeName: 'PUSH_ONE',
        baseFee: 3,
        gasFunction(_runState, gas) {
          return gas
        },
        logicFunction(runState) {
          runState.stack.push(1n)
        },
      },
    ],
  })

  const res = await evm.runCode({
    code: hexToBytes('0x21'),
    gasLimit: 100_000n,
  })

  const [top] = res.runState!.stack.peek(1)
  console.log(`Stack top after custom opcode: ${top}`)
  console.log(`Gas used: ${res.executionGasUsed}`)
}

void main()
