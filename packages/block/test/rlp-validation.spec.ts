import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { concatBytes, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createBlock, createBlockFromRLP } from '../src/index.ts'

import type { BlockBytes, BlockHeaderBytes, WithdrawalsBytes } from '../src/types.ts'

function fixture() {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const raw = createBlock(
    {
      header: {
        number: 1n,
        gasLimit: 30_000_000n,
        timestamp: 1_800_000_000n,
        baseFeePerGas: 7n,
        blobGasUsed: 0n,
        excessBlobGas: 0n,
        parentBeaconBlockRoot: new Uint8Array(32),
        requestsHash: new Uint8Array(32),
      },
      withdrawals: [
        { index: 1n, validatorIndex: 2n, address: new Uint8Array(20).fill(0x22), amount: 3n },
      ],
    },
    { common },
  ).raw()
  return { common, raw }
}

describe('[Block/RLP]: canonical integers', () => {
  for (const [name, index] of [
    ['difficulty', 7],
    ['number', 8],
    ['gasLimit', 9],
    ['gasUsed', 10],
    ['timestamp', 11],
    ['baseFeePerGas', 15],
    ['blobGasUsed', 17],
    ['excessBlobGas', 18],
  ] as const) {
    it(`rejects a leading zero in header ${name}`, () => {
      const { common, raw } = fixture()
      const header = [...raw[0]] as BlockHeaderBytes
      header[index] = concatBytes(new Uint8Array([0]), header[index])
      assert.throws(
        () => createBlockFromRLP(RLP.encode([header, ...raw.slice(1)]), { common }),
        /leading zeroes/,
      )
    })
  }
  for (const [name, index] of [
    ['index', 0],
    ['validatorIndex', 1],
    ['amount', 3],
  ] as const) {
    it(`rejects a leading zero in withdrawal ${name}`, () => {
      const { common, raw } = fixture()
      const withdrawal = [...(raw[3] as WithdrawalsBytes)[0]]
      withdrawal[index] = concatBytes(new Uint8Array([0]), withdrawal[index])
      assert.throws(
        () => createBlockFromRLP(RLP.encode([raw[0], raw[1], raw[2], [withdrawal]]), { common }),
        /leading zeroes/,
      )
    })
  }
  it('preserves canonical bytes including zero integers and fixed-width zero prefixes', () => {
    const { common, raw } = fixture()
    const encoded = RLP.encode(raw)
    assert.deepEqual(createBlockFromRLP(encoded, { common }).serialize(), encoded)
  })
})

describe('[Block/RLP]: list lengths', () => {
  for (const length of [3, 5]) {
    it(`rejects a withdrawal with ${length} fields`, () => {
      const { common, raw } = fixture()
      const withdrawal = [...(raw[3] as WithdrawalsBytes)[0], new Uint8Array()].slice(0, length)
      assert.throws(
        () => createBlockFromRLP(RLP.encode([raw[0], raw[1], raw[2], [withdrawal]]), { common }),
        /withdrawal.*length/,
      )
    })
  }
  it('rejects an extra block body element', () => {
    const { common, raw } = fixture()
    assert.throws(
      () => createBlockFromRLP(RLP.encode([...raw, new Uint8Array()]), { common }),
      /More values/,
    )
  })
  it('rejects withdrawals before Shanghai', () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const raw = createBlock({}, { common }).raw() as BlockBytes
    assert.throws(() => createBlockFromRLP(RLP.encode([...raw, []]), { common }), /More values/)
  })
  for (const encoded of ['0xc0', '0xc1c0', '0xc2c0c0'] as const) {
    it(`reports an incomplete block list ${encoded} without a TypeError`, () => {
      assert.throws(() => createBlockFromRLP(hexToBytes(encoded)), /Less values/)
    })
  }
})
