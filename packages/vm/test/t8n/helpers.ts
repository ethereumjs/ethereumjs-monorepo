import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import type { T8NOptions } from './types.js'

export function getArguments() {
  const argsParsed = yargs(hideBin(process.argv))
    .parserConfiguration({
      'dot-notation': false,
    })
    .option('state.fork', {
      describe: 'Fork to use',
      type: 'string',
      demandOption: true,
    })
    .option('state.chainid', {
      describe: 'ChainID to use',
      type: 'string',
      default: '1',
    })
    .option('state.reward', {
      describe:
        'Coinbase reward after running txs. If 0: coinbase account is touched and rewarded 0 wei. If -1, the coinbase account is not touched (default)',
      type: 'string',
      default: '-1',
    })
    .option('input.alloc', {
      describe: 'Initial state allocation',
      type: 'string',
      demandOption: true,
    })
    .option('input.txs', {
      describe: 'JSON input of txs to run on top of the initial state allocation',
      type: 'string',
      demandOption: true,
    })
    .option('input.env', {
      describe: 'Input environment (coinbase, difficulty, etc.)',
      type: 'string',
      demandOption: true,
    })
    .option('output.basedir', {
      describe: 'Base directory to write output to',
      type: 'string',
      demandOption: true,
    })
    .option('output.result', {
      describe: 'File to write output results to (relative to `output.basedir`)',
      type: 'string',
      demandOption: true,
    })
    .option('output.alloc', {
      describe: 'File to write output allocation to (after running the transactions)',
      type: 'string',
      demandOption: true,
    })
    .option('output.body', {
      describe: 'File to write the txs RLP to',
      type: 'string',
      default: 'txs.rlp',
    })
    .strict()
    .help().argv

  const args = argsParsed as any as T8NOptions

  args.input = {
    alloc: (<any>args)['input.alloc'],
    txs: (<any>args)['input.txs'],
    env: (<any>args)['input.env'],
  }
  args.output = {
    basedir: (<any>args)['output.basedir'],
    result: (<any>args)['output.result'],
    alloc: (<any>args)['output.alloc'],
    body: (<any>args)['output.body'],
  }
  args.state = {
    fork: (<any>args)['state.fork'],
    reward: BigInt((<any>args)['state.reward']),
    chainid: BigInt((<any>args)['state.chainid']),
  }

  return args
}
