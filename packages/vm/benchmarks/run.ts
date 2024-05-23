import Benchmark from 'benchmark'
import { BenchmarksType } from './util'
import { mainnetBlocks } from './mainnetBlocks'
import { bytecode } from './bytecode'
import { ArgumentParser } from 'argparse'

// Add an import and a BENCHMARKS entry to list a new benchmark
const BENCHMARKS: BenchmarksType = {
  mainnetBlocks: {
    function: mainnetBlocks,
  },
  bytecode: {
    function: bytecode,
  },
}

const onCycle = (event: Benchmark.Event) => {
  console.log(String(event.target))
}

async function main() {
  const parser = new ArgumentParser({ description: 'Benchmark arbitrary bytecode.' })
  parser.add_argument('mode', {
    help: 'Mode of running',
    choices: ['benchmarks', 'profiling'],
    type: 'str',
  })
  parser.add_argument('benchmarks', {
    help: `Name(s) of benchmaks to run: BENCHMARK_NAME[:NUM_SAMPLES][,BENCHMARK_NAME[:NUM_SAMPLES]]. Benchmarks available: ${Object.keys(
      BENCHMARKS
    ).join(', ')}`,
    type: 'str',
  })
  parser.add_argument('-b', '--bytecode', { help: 'Bytecode to run', type: 'str' })
  parser.add_argument('-p', '--preState', { help: 'File containing prestate to load', type: 'str' })
  const args = parser.parse_args()

  // Initialization
  let suite
  // Choose between benchmarking or profiling (with 0x)
  if (args.mode === 'benchmarks') {
    console.log('Benchmarking started...')
    suite = new Benchmark.Suite()
  } else {
    console.log('Profiling started...')
  }

  // Benchmark execution
  const benchmarks = args.benchmarks.split(',')
  for (const benchmark of benchmarks) {
    const [name, numSamples] = benchmark.split(':')

    if (name in BENCHMARKS) {
      console.log(`Running '${name}':`)
      await BENCHMARKS[name].function(suite, Number(numSamples), args.bytecode, args.preState)
    } else {
      console.log(`Benchmark with name ${name} doesn't exist, skipping...`)
    }
  }

  if (suite) {
    suite.on('cycle', onCycle).run()
  }
}

main()
  .then(() => {
    console.log('Benchmark run finished.')
    process.exit(0)
  })
  .catch((e: Error) => {
    throw e
  })
