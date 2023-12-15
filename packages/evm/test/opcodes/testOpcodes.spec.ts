import { describe, it } from 'vitest'

import { opcodeTests } from './tests.js'
import { runOpcodeTest } from './utils.js'

for (const testSet in opcodeTests) {
  describe(`should test ${testSet} tests`, () => {
    const testCases = opcodeTests[testSet]
    for (const opcodeName in testCases) {
      it(`should test opcode ${opcodeName}`, async () => {
        const testDataArray = testCases[opcodeName]
        for (const testData of testDataArray) {
          await runOpcodeTest({
            testName: testData.name,
            opcodeName,
            expected: testData.expected,
            expectedReturnType: 'topStack',
            input: testData.stack,
          })
        }
      })
    }
  })
}
