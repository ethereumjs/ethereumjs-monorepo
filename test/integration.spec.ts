import * as assert from 'assert'
import { exec } from 'child_process'
import * as RLP from '../dist'
import * as vm from 'vm'

describe('Distribution:', function () {
  it('should be able to execute functionality from distribution build', function () {
    const encodedSelf = RLP.encode('a')
    assert.equal(encodedSelf.toString(), 'a')
    assert.equal(RLP.getLength(encodedSelf), 1)
  })
})

describe('CLI command:', function () {
  it('should be able to run CLI command', function () {
    exec('./bin/rlp encode "[ 5 ]"', (_error, stdout) => {
      assert.equal(stdout.trim(), 'c105')
    })
  })
})

describe('Cross-frame:', function () {
  it('should be able to encode Arrays across stack frames', function () {
    assert.equal(
      vm.runInNewContext("RLP.encode(['dog', 'god', 'cat']).toString('hex')", { RLP }),
      'cc83646f6783676f6483636174'
    )
  })
})
