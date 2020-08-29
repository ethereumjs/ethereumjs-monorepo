import Benchmark = require('benchmark')
import { mainnetBlocks } from './mainnetBlocks'

const onCycle = (event: any) => {
  console.log(String(event.target))
}

async function main() {
  const args = process.argv
  let suite = null
  // Choose between benchmarking or profiling (with 0x)
  if (args[2] === 'benchmarks') {
    console.log('Benchmarking started...')
    suite = new Benchmark.Suite()
  } else {
    console.log('Profiling started...')
  }

  const commandUsageStrg =
    'Usage: npm run benchmarks|profiling -- BENCHMARK_NAME[:NUM_SAMPLES][,BENCHMARK_NAME[:NUM_SAMPLES]]'

  if (args.length < 4) {
    console.log('Please provide at least one benchmark name when running a benchmark')
    return process.exit(1)
  }

  const benchmarks = args[3].split(',')

  for (const benchmark of benchmarks) {
    const [name, numSamples] = benchmark.split(':')
    console.log(`Running '${name}':`)
    // Benchmark: mainnetBlocks
    if (name === 'mainnetBlocks') {
      await mainnetBlocks(suite, Number(numSamples))
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
