import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { CLRequest, bytesToBigInt, concatBytes, randomBytes } from '@ethereumjs/util'
import { assert, describe, expect, it } from 'vitest'

import { setupVM } from '../utils.js'

import type { CLRequestType } from '@ethereumjs/util'

class NumberRequest extends CLRequest implements CLRequestType<NumberRequest> {
  constructor(type: number, bytes: Uint8Array) {
    super(type, bytes)
  }

  public static fromRequestData(bytes: Uint8Array): CLRequestType<NumberRequest> {
    return new NumberRequest(0x1, bytes)
  }
  public greaterThan(a: NumberRequest): boolean {
    return bytesToBigInt(a.bytes) < bytesToBigInt(this.bytes)
  }

  serialize() {
    return concatBytes(Uint8Array.from([this.type]), this.bytes)
  }
}

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, eips: [7685] })

describe('EIP-7685 tests', () => {
  it('should not error when a valid requestsRoot is provided', async () => {
    const vm = await setupVM({ common })
    const emptyBlock = Block.fromBlockData({}, { common })
    const res = await vm.runBlock({
      block: emptyBlock,
      generate: true,
    })
    assert.equal(res.gasUsed, 0n)
  })
  it('should error when an invalid requestsRoot is provided', async () => {
    const vm = await setupVM({ common })
    const emptyBlock = Block.fromBlockData(
      { header: { requestsRoot: randomBytes(32) } },
      { common }
    )
    await expect(async () =>
      vm.runBlock({
        block: emptyBlock,
        generate: true,
      })
    ).rejects.toThrow('invalid requestsRoot')
  })
  it('should not error when valid requests are provided', async () => {
    const vm = await setupVM({ common })
    const request = new NumberRequest(0x1, randomBytes(32))
    const requestsRoot = await Block.genRequestsTrieRoot([request])
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot },
      },
      { common }
    )
    const res = await vm.runBlock({ block, generate: true })
    assert.equal(res.gasUsed, 0n)
  })
  it('should  error when requestsRoot does not match requests provided', async () => {
    const vm = await setupVM({ common })
    const request = new NumberRequest(0x1, randomBytes(32))
    const block = Block.fromBlockData(
      {
        requests: [request],
        header: { requestsRoot: randomBytes(32) },
      },
      { common }
    )
    await expect(() => vm.runBlock({ block, generate: true })).rejects.toThrow(
      'invalid requestsRoot'
    )
  })
})
