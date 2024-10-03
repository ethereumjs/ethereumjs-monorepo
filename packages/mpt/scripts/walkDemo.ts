import { view } from '../dist/cjs/util/view.js'
import { debug } from 'debug'

debug.enable('*')
const trieTests = require('../test/fixtures/trietest.json')
const testNames = Object.keys(trieTests.tests) as Array<keyof typeof trieTests.tests>
process.env.DEBUG = '*'
const run = async () => {
  for (const testName of testNames) {
    const test: any = trieTests.tests[testName]
    await view(testName as string, test.in, test.root)
  }
}

run().then(() => debug.disable())
