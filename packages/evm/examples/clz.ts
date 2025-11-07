import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { type EVM, createEVM } from '@ethereumjs/evm'
import { type PrefixedHexString, hexToBytes } from '@ethereumjs/util'

const common = new Common({
  chain: Mainnet,
  hardfork: Hardfork.Osaka,
  eips: [7939],
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

  const res = await evm.runCode({
    code,
    gasLimit: 1_000_000n,
  })

  const stack = res.runState?.stack
  if (!stack) {
    throw new Error('Missing runState stack in result')
  }

  const [top] = stack.peek(1)
  const hexValue = `0x${top.toString(16)}`
  console.log(`clz=${top} (hex=${hexValue}) for x=${x}`)
}

const main = async () => {
  const evm = await createEVM({ common })

  // Case 1: x == 0x00..00 -> expect 256
  await runCase(evm, `0x${'00'.repeat(32)}` as PrefixedHexString)

  // Case 2: x == 0x01..00 -> MSB at bit 255 -> expect 255
  await runCase(evm, `0x${'00'.repeat(31)}01` as PrefixedHexString)

  // Case 3: x == 0x40..00 -> MSB at bit 254 -> expect 1
  await runCase(evm, `0x40${'00'.repeat(31)}` as PrefixedHexString)

  // Case 4: x == 0x80..00 -> MSB at bit 255 -> expect 0
  await runCase(evm, `0x80${'00'.repeat(31)}` as PrefixedHexString)
}

void main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
