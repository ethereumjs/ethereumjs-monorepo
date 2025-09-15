import * as fs from 'fs'
import path from 'path'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, hexToBigInt, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'
import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { createTxFromRLP } from '../src/transactionFactory.ts'

import type { PrefixedHexString } from '@ethereumjs/util'

type T9NArgs = {
  dir: string
}

type T9NTestResult =
  | {
      exception: undefined
      intrinsicGas: PrefixedHexString
      sender: PrefixedHexString
      hash: PrefixedHexString
    }
  | {
      exception: string
      intrinsicGas: undefined
      sender: undefined
      hash: undefined
    }

type T9NTest = {
  txbytes: string
  result: {
    [fork: string]: T9NTestResult
  }
}

const forkMap: { [key: string]: string } = {
  Frontier: Hardfork.Chainstart,
  EIP150: Hardfork.TangerineWhistle,
  EIP158: Hardfork.SpuriousDragon,
  ConstantinopleFix: Hardfork.Petersburg,
}

const args: T9NArgs = yargs
  .default(hideBin(process.argv))
  .parserConfiguration({
    'dot-notation': false,
  })
  .option('dir', {
    describe: 'Directory to road t9n tests from',
    default: '../ethereum-tests/TransactionTests',
    string: true,
  }).argv as T9NArgs

function getFork(fork: string) {
  const f = forkMap[fork] ?? fork
  // Normalize fork name to work with common (lowercase first character)
  return f[0].toLowerCase() + f.substring(1)
}

function runTests(filePath: string) {
  if (path.extname(filePath) === '.json') {
    const fname = path.parse(filePath).name

    describe(fname, async () => {
      const testsRaw: string = await new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
      })

      const tests: { [testName: string]: T9NTest } = JSON.parse(testsRaw)

      for (const testName in tests) {
        const test = tests[testName]
        const txBytes = hexToBytes(test.txbytes as PrefixedHexString)

        for (const fork in test.result) {
          it(`${testName} [${getFork(fork)}]`, () => {
            let common: Common
            try {
              common = new Common({ chain: Mainnet, hardfork: getFork(fork) })
            } catch {
              assert.isOk(true, `Unknown/unsupported hardfork ${fork}, skipping test`)
              return
            }
            const result = test.result[fork]

            try {
              const tx = createTxFromRLP(txBytes, { common })
              if (result.exception !== undefined) {
                assert.fail('RLP is invalid, but decoding succeeded')
              } else {
                assert.strictEqual(bytesToHex(tx.hash()), result.hash!, 'correct hash')
                assert.strictEqual(
                  tx.getIntrinsicGas(),
                  hexToBigInt(result.intrinsicGas),
                  'correct intrinsic gas',
                )
                assert.strictEqual(
                  tx.getSenderAddress().toString(),
                  result.sender,
                  'correct sender',
                )
              }
            } catch {
              if (result.exception === undefined) {
                assert.fail('RLP is valid, but decoding failed')
              } else {
                assert.isTrue(true, 'RLP decoding successfully failed')
              }
            }
          }, 20_000)
        }
      }
    })
  }
}

function recursiveLoad(dir: string) {
  fs.readdirSync(dir).forEach((file) => {
    const fullName = dir + '/' + file
    const stat = fs.statSync(fullName)
    if (stat.isFile()) {
      runTests(fullName)
    } else if (stat.isDirectory()) {
      recursiveLoad(fullName)
    }
  })
}

recursiveLoad(args.dir)
