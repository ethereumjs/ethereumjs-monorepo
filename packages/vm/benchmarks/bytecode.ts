import { readFileSync } from 'fs'
import Benchmark from 'benchmark'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { getPreState } from './util'
import { EVM } from '@ethereumjs/evm'
import { Address, hexToBytes } from '@ethereumjs/util'
import { DefaultStateManager } from '@ethereumjs/statemanager'

class Stats {
  runId?: number
  iterationsCount!: number
  totalTimeNs!: number
  stdDevTimeNs!: number
}

type EvmCreator = () => Promise<EVM>

async function runBenchmark(bytecode: string, createEvm: EvmCreator): Promise<Stats> {
  const evm = await createEvm()

  let promiseResolve: any
  const resultPromise: Promise<Stats> = new Promise((resolve, reject) => {
    promiseResolve = resolve
  })

  const bytecodeHex = hexToBytes('0x' + bytecode)
  const gasLimit = BigInt(0xffff)

  const bench = new Benchmark({
    defer: true,
    maxTime: 0.5,
    name: `Running Opcodes`,
    fn: async (deferred: any) => {
      try {
        await evm.runCode({
          code: bytecodeHex,
          gasLimit: gasLimit,
        })
        deferred.resolve()
      } catch (err) {
        console.log('ERROR', err)
      }
    },
    onCycle: (event: any) => {
      evm.stateManager.clearContractStorage(Address.zero())
    },
  })
    .on('complete', () => {
      promiseResolve({
        iterationsCount: bench.count,
        totalTimeNs: Math.round(bench.stats.mean * 1_000_000_000),
        stdDevTimeNs: Math.round(bench.stats.deviation * 1_000_000_000),
      })
    })
    .run()

  return resultPromise
}

export async function bytecode(
  suite?: Benchmark.Suite,
  numSamples?: number,
  bytecode?: string,
  preState?: string
) {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun })
  let stateManager = new DefaultStateManager()

  if (preState) {
    let preStateData = JSON.parse(readFileSync(preState, 'utf8'))
    stateManager = await getPreState(preStateData, common)
  }

  const createEvm: EvmCreator = async () => {
    const profiler = { enabled: suite ? false : true }
    return await EVM.create({ stateManager, common, profiler })
  }

  for (let i = 0; i < (numSamples ?? 1); i++) {
    if (suite) {
      let results = await runBenchmark(bytecode!, createEvm)
      console.log(
        `${i}, ${results.iterationsCount}, ${results.totalTimeNs}, ${results.stdDevTimeNs}`
      )
    } else {
      let evm = await createEvm()
      evm.runCode({
        code: hexToBytes('0x' + bytecode!),
        gasLimit: BigInt(0xffff),
      })
    }
  }
}
