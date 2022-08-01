import { TransactionFactory } from '@ethereumjs/tx'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { RLP } from 'rlp'
import { VM } from '../../src'
import { getCommon } from '../tester/config'
import { makeBlockFromEnv, setupPreConditions } from '../util'

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const args = yargs(hideBin(process.argv))
  .option('state.fork', {
    describe: 'Fork to use',
  })
  .option('input.alloc', {
    describe: 'Initial state allocation',
  })
  .option('inputs.txs', {
    describe: 'RLP input of txs to run on top of the initial state allocation',
  })
  .option('inputs.env', {
    describe: 'Input environment (coinbase, difficulty, etc.)',
  })
  .option('output.basedir', {
    describe: 'Base directory to write output to',
  })
  .option('output.result', {
    describe: 'File to write output results to (relative to `output.basedir`)',
  })
  .option('output.alloc', {
    describe: 'File to write output allocation to (after running the transactions)',
  }).argv

async function runTransition() {
  const alloc = JSON.parse(readFileSync(args.input.alloc).toString())
  const rlpTxs = JSON.parse(readFileSync(args.input.txs).toString())
  const inputEnv = JSON.parse(readFileSync(args.input.env).toString())

  const common = getCommon(args.state.fork)

  const vm = await VM.create({ common })
  await setupPreConditions(<any>vm.eei, { pre: alloc })

  const block = await makeBlockFromEnv(inputEnv, { common })

  const txsData = RLP.decode(Buffer.from(rlpTxs.slice(2), 'hex'))

  for (const txData of txsData) {
    const tx = TransactionFactory.fromSerializedData(Buffer.from(<Uint8Array>txData))
    await vm.runTx({ tx })
  }

  const output = {}
  const outputAlloc = {}

  const outputResultFilePath = join(args.output.basedir, args.output.result)
  const outputAllocFilePath = join(args.output.basedir, args.output.alloc)

  writeFileSync(outputResultFilePath, JSON.stringify(output))
  writeFileSync(outputAllocFilePath, JSON.stringify(outputAlloc))
}

runTransition().catch((e) => console.error(e))
