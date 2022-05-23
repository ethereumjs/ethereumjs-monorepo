import tape from 'tape'
import { Block } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import type { InterpreterStep } from '../../../src/evm/interpreter'
import { bufferToBigInt } from 'ethereumjs-util'

tape('EIP-4399 -> 0x44 (DIFFICULTY) should return PREVRANDAO', (t) => {
  t.test('should return the right values', async (st) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
    const vm = await VM.create({ common })

    const genesis = await vm.blockchain.getCanonicalHeadBlock()
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
    vm.evm.on('step', (istep: InterpreterStep) => {
      if (istep.opcode.name === 'STOP') {
        stack = istep.stack
      }
    })

    const runCodeArgs = {
      code: Buffer.from('4400', 'hex'),
      gasLimit: BigInt(0xffff),
    }
    await vm.evm.runCode({ ...runCodeArgs, block })
    st.equal(stack[0], block.header.difficulty, '0x44 returns DIFFICULTY (London)')

    common.setHardfork(Hardfork.Merge)
    const prevRandao = bufferToBigInt(Buffer.alloc(32, 1))
    block = Block.fromBlockData(
      {
        header: {
          ...header,
          mixHash: prevRandao,
        },
      },
      { common }
    )
    await vm.evm.runCode({ ...runCodeArgs, block })
    st.equal(stack[0], prevRandao, '0x44 returns PREVRANDAO (Merge)')

    st.end()
  })
})
