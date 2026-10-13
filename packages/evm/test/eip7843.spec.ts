import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { createEVM } from '../src/index.ts'

const SLOTNUM = 0x4b
const STOP = 0x00

describe('[EVM/eip7843]: SLOTNUM default block', () => {
  it('runCode() without a block reads slotNumber 0 from the mock header', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const evm = await createEVM({ common })
    const res = await evm.runCode({
      code: Uint8Array.from([SLOTNUM, STOP]),
      gasLimit: 100_000n,
    })
    assert.isUndefined(res.exceptionError)
    const [top] = res.runState!.stack.peek(1)
    assert.strictEqual(top, 0n)
  })
})
