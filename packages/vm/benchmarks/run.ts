import Benchmark = require('benchmark')
import { mainnetBlocks } from './mainnetBlocks'

async function main() {
  const suite = new Benchmark.Suite()

  const args = process.argv
  const commandUsageStrg = 'Usage: node benchmarks/run.ts BENCHMARK_NAME'

  if (args.length < 3) {
    console.log('Please provide a benchmark name when running a benchmark')
    console.log(`${commandUsageStrg} [ BENCHMARK_SPECIFIC_ARGUMENTS ]`)
    return process.exit(1)
  }

  const name = args[2]
  const argErrorStrg = `Insufficient arguments for benchmark ${name}`

  // Benchmark: mainnetBlocks
  if (name === 'mainnetBlocks') {
    if (args.length < 4 || args.length > 5) {
      console.log(argErrorStrg)
      console.log(`${commandUsageStrg} BLOCK_FIXTURE [NUM_SAMPLES]`)
      return process.exit(1)
    }

    const blockFixture = args[3]
    const numSamples = args.length === 4 ? Number(args[4]) : undefined
    await mainnetBlocks(suite, blockFixture, numSamples)
  } else {
    console.log(`Benchmark with name ${name} doesn\'t exist`)
  }
}

main()
  .then(() => {
    console.log('Benchmark run finished.')
  })
  .catch((e: Error) => {
    throw e
  })
