import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { type EVM, createEVM } from '@ethereumjs/evm'
import { type PrefixedHexString, hexToBytes } from '@ethereumjs/util'

// CLZ (Count Leading Zeros) opcode (0x1e)
// Demonstrates the CLZ opcode introduced in https://eips.ethereum.org/EIPS/eip-7939
//
// The CLZ opcode returns the number of zero bits before the most significant 1-bit in a 256-bit value.
// It enables efficient computation of bit length, log₂, and prefix comparisons directly in the EVM.
//
// Doing this in Solidity/Yul requires a loop or binary search using shifts and comparisons,
// which costs hundreds of gas and bloats bytecode. By replacing multi-step shift and branch logic
// with a single instruction, it reduces gas cost, bytecode size, and zk-proof complexity.

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Osaka,
})

const assembleCode = (x: Uint8Array) => {
  if (x.length !== 32) {
    throw new Error('x must be 32 bytes')
  }

  const code = new Uint8Array(35) // PUSH32 + 32-byte operand + CLZ + STOP
  code[0] = 0x7f
  code.set(x, 1)
  code[33] = 0x1e
  code[34] = 0x00
  return code
}

const runCase = async (evm: EVM, x: PrefixedHexString) => {
  const code = assembleCode(hexToBytes(x))

  const res = await evm.runCode({ code })

  const stack = res.runState?.stack
  if (!stack) {
    throw new Error('Missing runState stack in result')
  }

  const [top] = stack.peek(1)
  const hexValue = `0x${top.toString(16)}`
  const gas = res.executionGasUsed
  console.log('--------------------------------')
  console.log(`input=${x}`)
  console.log(`output=${hexValue}  (leading zeros=${top})`)
  console.log(`Gas used: ${gas}`)
}

const main = async () => {
  const evm = await createEVM({ common })

  // Case 1: x == 0x00..00 -> expect 256
  await runCase(evm, `0x${'00'.repeat(32)}` as PrefixedHexString)

  // Case 2: x == 0x0..01 -> MSB at bit 0 -> expect 255
  await runCase(evm, `0x${'00'.repeat(31)}01` as PrefixedHexString)

  // Case 3: x == 0x40..00 -> MSB at bit 254 -> expect 1
  await runCase(evm, `0x40${'00'.repeat(31)}` as PrefixedHexString)

  // Case 4: x == 0x80..00 -> MSB at bit 255 -> expect 0
  await runCase(evm, `0x80${'00'.repeat(31)}` as PrefixedHexString)
  console.log('--------------------------------')
}

void main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
