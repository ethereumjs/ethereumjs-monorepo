import Benchmark = require('benchmark')
import { BenchmarksType } from './util'
import { mainnetBlocks } from './mainnetBlocks'

// Add an import and a BENCHMARKS entry to list a new benchmark
const BENCHMARKS: BenchmarksType = {
  mainnetBlocks: {
    function: mainnetBlocks,
  },
}

const onCycle = (event: Benchmark.Event) => {
  console.log(String(event.target))
}

async function main() {
  const args = process.argv

  // Input validation
  if (args.length < 4) {
    console.log(
      'Please provide at least one benchmark name when running a benchmark or doing profiling.',
    )
    console.log(
      'Usage: npm run benchmarks|profiling -- BENCHMARK_NAME[:NUM_SAMPLES][,BENCHMARK_NAME[:NUM_SAMPLES]]',
    )
    console.log(`Benchmarks available: ${Object.keys(BENCHMARKS).join(', ')}`)
    return process.exit(1)
  }

  // Initialization
  let suite = null
  // Choose between benchmarking or profiling (with 0x)
  if (args[2] === 'benchmarks') {
    console.log('Benchmarking started...')
    suite = new Benchmark.Suite()
  } else {
    console.log('Profiling started...')
  }

  const benchmarks = args[3].split(',')

  // Benchmark execution
  for (const benchmark of benchmarks) {
    const [name, numSamples] = benchmark.split(':')

    if (name in BENCHMARKS) {
      console.log(`Running '${name}':`)
      await BENCHMARKS[name].function(suite, Number(numSamples))
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
