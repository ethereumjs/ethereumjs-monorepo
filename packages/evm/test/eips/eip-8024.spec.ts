import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EVMError } from '../../src/errors.ts'
import {
  createEVM,
  decodeEIP8024PairImmediate,
  decodeEIP8024SingleImmediate,
  encodeEIP8024PairImmediate,
  encodeEIP8024SingleImmediate,
  isEIP8024PairImmediateValid,
  isEIP8024SingleImmediateValid,
} from '../../src/index.ts'

describe('[EVM/EIP-8024]: immediate encode and decode', () => {
  it('round-trips every valid DUPN and SWAPN immediate', () => {
    const depths = new Set<number>()
    for (let immediate = 0; immediate <= 255; immediate++) {
      if (!isEIP8024SingleImmediateValid(immediate)) {
        assert.throws(() => decodeEIP8024SingleImmediate(immediate), /not a valid operand/)
        continue
      }
      const depth = decodeEIP8024SingleImmediate(immediate)
      assert.ok(depth >= 17 && depth <= 235)
      assert.strictEqual(encodeEIP8024SingleImmediate(depth), immediate)
      depths.add(depth)
    }
    assert.strictEqual(depths.size, 235 - 17 + 1)
  })

  it('matches the EIP assembly vectors for DUPN and SWAPN', () => {
    assert.strictEqual(encodeEIP8024SingleImmediate(17), 0x80)
    assert.strictEqual(decodeEIP8024SingleImmediate(0x80), 17)
    assert.strictEqual(encodeEIP8024SingleImmediate(108), 0xdb)
    assert.strictEqual(decodeEIP8024SingleImmediate(0xdb), 108)
  })

  it('round-trips every valid EXCHANGE immediate', () => {
    for (let immediate = 0; immediate <= 255; immediate++) {
      if (!isEIP8024PairImmediateValid(immediate)) {
        assert.throws(() => decodeEIP8024PairImmediate(immediate), /not a valid operand/)
        continue
      }
      const [n, m] = decodeEIP8024PairImmediate(immediate)
      assert.ok(n >= 1 && n < m && n + m <= 30)
      assert.strictEqual(encodeEIP8024PairImmediate(n, m), immediate)
    }
  })

  it('matches the EIP assembly vectors for EXCHANGE', () => {
    assert.deepEqual(decodeEIP8024PairImmediate(0x9d), [2, 3])
    assert.strictEqual(encodeEIP8024PairImmediate(2, 3), 0x9d)
    assert.deepEqual(decodeEIP8024PairImmediate(0x2f), [1, 19])
    assert.strictEqual(encodeEIP8024PairImmediate(1, 19), 0x2f)
    assert.deepEqual(decodeEIP8024PairImmediate(0x50), [14, 16])
    assert.strictEqual(encodeEIP8024PairImmediate(14, 16), 0x50)
    assert.deepEqual(decodeEIP8024PairImmediate(0x51), [14, 15])
    assert.strictEqual(encodeEIP8024PairImmediate(14, 15), 0x51)
    assert.deepEqual(decodeEIP8024PairImmediate(0x8e), [1, 2])
    assert.strictEqual(encodeEIP8024PairImmediate(1, 2), 0x8e)
  })

  it('rejects depths and immediates outside the spec', () => {
    for (const depth of [16, 236, 17.5, Number.NaN, Number.POSITIVE_INFINITY, -1]) {
      assert.throws(() => encodeEIP8024SingleImmediate(depth), /17 to 235/)
    }
    for (const immediate of [256, -1, 0x5b + 0.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      assert.throws(() => decodeEIP8024SingleImmediate(immediate), /integer from 0 to 255/)
    }
    for (const pair of [
      [1, 1],
      [2, 1],
      [0, 1],
      [1, 30],
      [15, 16],
      [14, 17],
      [1.5, 2],
    ] as const) {
      assert.throws(() => encodeEIP8024PairImmediate(pair[0], pair[1]), /n \+ m <= 30/)
    }
    assert.throws(() => decodeEIP8024PairImmediate(0x52), /not a valid operand/)
    assert.throws(() => decodeEIP8024PairImmediate(256), /integer from 0 to 255/)
  })

  it('executes the spec vectors and keeps invalid immediates as invalid opcodes', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const evm = await createEVM({ common })

    const dupn = await evm.runCode({
      code: hexToBytes('0x60016000808080808080808080808080808080e680'),
      gasLimit: 100_000n,
    })
    assert.isUndefined(dupn.exceptionError)
    const dupnStack = dupn.runState!.stack.getStack()
    assert.strictEqual(dupnStack.length, 18)
    assert.strictEqual(dupnStack[0], 1n)
    assert.strictEqual(dupnStack[17], 1n)

    const exchange = await evm.runCode({
      code: hexToBytes('0x600060016002e88e'),
      gasLimit: 100_000n,
    })
    assert.isUndefined(exchange.exceptionError)
    assert.deepEqual(
      exchange.runState!.stack.getStack().map((word) => Number(word)),
      [1, 0, 2],
    )

    for (const code of ['0xe75b', '0xe65b', '0xe852'] as const) {
      const invalid = await evm.runCode({ code: hexToBytes(code), gasLimit: 100_000n })
      assert.strictEqual(invalid.exceptionError?.error, EVMError.errorMessages.INVALID_OPCODE)
    }
  })
})
