import * as assert from 'assert'
import * as RLP from '../dist'

describe('Distribution:', function() {
  it('should be able to execute functionality from distribution build', function() {
    const encodedSelf = RLP.encode('a')
    assert.equal(encodedSelf.toString(), 'a')
    assert.equal(RLP.getLength(encodedSelf), 1)
  })
})

/*
describe('CLI command:', function() {
  it('should be able to run CLI command', function() {
    const execP = util.promisify(exec)

    async function bin() {
      const { stdout, stderr } = await execP('./bin/rlp encode "[ 5 ]"')
      assert.equal(stdout.trim(), 'c105')
    }
    bin()
  })
})
*/
