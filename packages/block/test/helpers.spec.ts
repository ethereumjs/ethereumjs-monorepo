import { assert, describe, it } from 'vitest'

import { getDifficulty, numberToHex, valuesArrayToHeaderData } from '../src/helpers.ts'

import type { BlockHeaderBytes } from '../src/types.ts'

const MIN_HEADER_FIELDS = 15
const canonicalHeaderValues = Array.from({ length: MIN_HEADER_FIELDS }, () => new Uint8Array(32))

describe('[Block/Helpers]: numberToHex', () => {
  it('numberToHex() converts decimal strings', () => {
    assert.strictEqual(numberToHex('10'), '0xa')
  })

  it('numberToHex() passes through 0x-prefixed hex', () => {
    assert.strictEqual(numberToHex('0x0a'), '0x0a')
  })

  it('numberToHex() rejects non-numeric junk', () => {
    assert.throws(() => numberToHex('10.1'))
    assert.throws(() => numberToHex('not-a-number'))
  })
})

describe('[Block/Helpers]: getDifficulty', () => {
  it('getDifficulty() returns bigint when set', () => {
    assert.strictEqual(getDifficulty({ difficulty: '0x2' }), 2n)
  })

  it('getDifficulty() returns null when unset', () => {
    assert.isNull(getDifficulty({}))
  })
})

describe('[Block/Helpers]: valuesArrayToHeaderData', () => {
  it('valuesArrayToHeaderData() parses canonical header fields', () => {
    const data = valuesArrayToHeaderData(canonicalHeaderValues as BlockHeaderBytes)
    assert.isDefined(data.parentHash)
    assert.isDefined(data.mixHash)
  })

  it('valuesArrayToHeaderData() rejects too few fields', () => {
    assert.throws(() =>
      valuesArrayToHeaderData(canonicalHeaderValues.slice(0, 14) as BlockHeaderBytes),
    )
  })

  it('valuesArrayToHeaderData() rejects too many fields', () => {
    const tooMany = Array.from({ length: 24 }, () => new Uint8Array(32))
    assert.throws(() => valuesArrayToHeaderData(tooMany as BlockHeaderBytes))
  })
})
