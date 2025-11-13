import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToBigInt, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM } from '../../../src/index.ts'

import type { InterpreterStep } from '@ethereumjs/evm'

describe('EIP-4399 -> 0x44 (DIFFICULTY) should return PREVRANDAO', () => {
  it('should return the right values', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const blockchain = await createBlockchain()
    const vm = await createVM({ common, blockchain })

    const genesis = await blockchain.getCanonicalHeadBlock!()
    const header = {
      number: 1,
      parentHash: genesis.header.hash(),
      timestamp: genesis.header.timestamp + BigInt(1),
      gasLimit: genesis.header.gasLimit,
    }
    let block = createBlock({ header }, { common, calcDifficultyFromHeader: genesis.header })

    // Track stack
    let stack: bigint[] = []
    const handler = (iStep: InterpreterStep) => {
      if (iStep.opcode.name === 'STOP') {
        stack = iStep.stack
      }
    }
    vm.evm.events!.on('step', handler)

    const runCodeArgs = {
      code: hexToBytes('0x4400'),
      gasLimit: BigInt(0xffff),
    }
    await vm.evm.runCode!({ ...runCodeArgs, block })
    assert.strictEqual(stack[0], block.header.difficulty, '0x44 returns DIFFICULTY (London)')

    common.setHardfork(Hardfork.Paris)
    const prevRandao = bytesToBigInt(new Uint8Array(32).fill(1))
    block = createBlock(
      {
        header: {
          ...header,
          mixHash: prevRandao,
        },
      },
      { common },
    )
    await vm.evm.runCode!({ ...runCodeArgs, block })
    assert.strictEqual(stack[0], prevRandao, '0x44 returns PREVRANDAO (Merge)')
    vm.evm.events!.removeListener('step', handler)
  })
})
