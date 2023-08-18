import * as trieTests from '../test/fixtures/trietest.json'
import { view } from '../dist/cjs/util/view.js'

const testNames = Object.keys(trieTests.tests) as Array<keyof typeof trieTests.tests>

const run = async () => {
  for (const testName of testNames) {
    const test: any = trieTests.tests[testName]
    await view(testName, test.in, test.root)
  }
}

run()
