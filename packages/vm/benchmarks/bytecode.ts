import { readFileSync } from 'fs'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { getPreState } from './util'
import { EVM } from '@ethereumjs/evm'
import { Address, hexToBytes } from '@ethereumjs/util'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Bench } from 'tinybench'

export async function bytecode(numSamples?: number, bytecode?: string, preState?: string) {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun })
  let stateManager = new DefaultStateManager()

  if (preState) {
    let preStateData = JSON.parse(readFileSync(preState, 'utf8'))
    stateManager = await getPreState(preStateData, common)
  }

  let evm = await EVM.create({ stateManager, common })
  const bytecodeHex = hexToBytes('0x' + bytecode)
  const gasLimit = BigInt(0xffff)

  const bench = new Bench({
    time: 100,
    teardown: async () => {
      await evm.stateManager.clearContractStorage(Address.zero())
    },
  })

  for (let i = 0; i < (numSamples ?? 1); i++) {
    bench.add('bytecode sample ' + i.toString(), async () => {
      // evm.stateManager.clearContractStorage(Address.zero())
      await evm.runCode({
        code: bytecodeHex,
        gasLimit: gasLimit,
      })
    })
  }

  await bench.warmup() // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
  await bench.run()

  return bench.table()
}
