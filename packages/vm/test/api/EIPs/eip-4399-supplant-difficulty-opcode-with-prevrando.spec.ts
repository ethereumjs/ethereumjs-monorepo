import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToBigInt } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

import type { InterpreterStep } from '@ethereumjs/evm'

describe('EIP-4399 -> 0x44 (DIFFICULTY) should return PREVRANDAO', () => {
  it('should return the right values', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const vm = await VM.create({ common })

    const genesis = await vm.blockchain.getCanonicalHeadBlock!()
    const header = {
      number: 1,
      parentHash: genesis.header.hash(),
      timestamp: genesis.header.timestamp + BigInt(1),
      gasLimit: genesis.header.gasLimit,
    }
    let block = Block.fromBlockData(
      { header },
      { common, calcDifficultyFromHeader: genesis.header }
    )

    // Track stack
    let stack: any = []
    vm.evm.events!.on('step', (istep: InterpreterStep) => {
      if (istep.opcode.name === 'STOP') {
        stack = istep.stack
      }
    })

    const runCodeArgs = {
      code: hexToBytes('4400'),
      gasLimit: BigInt(0xffff),
    }
    await vm.evm.runCode!({ ...runCodeArgs, block })
    assert.equal(stack[0], block.header.difficulty, '0x44 returns DIFFICULTY (London)')

    common.setHardfork(Hardfork.Paris)
    const prevRandao = bytesToBigInt(new Uint8Array(32).fill(1))
    block = Block.fromBlockData(
      {
        header: {
          ...header,
          mixHash: prevRandao,
        },
      },
      { common }
    )
    await vm.evm.runCode!({ ...runCodeArgs, block })
    assert.equal(stack[0], prevRandao, '0x44 returns PREVRANDAO (Merge)')
  })
})
