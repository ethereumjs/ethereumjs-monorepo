import { hexToBytes } from '@ethereumjs/util'
import { EVM } from '@ethereumjs/evm'

const main = async () => {
  const evm = await EVM.create()
  const res = await evm.runCode({ code: hexToBytes('0x6001') }) // PUSH1 01 -- simple bytecode to push 1 onto the stack
  console.log(res.executionGasUsed) // 3n
}

main()
