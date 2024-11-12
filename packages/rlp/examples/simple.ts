import assert from 'assert'
import { RLP } from '@ethereumjs/rlp'

const nestedList = [[], [[]], [[], [[]]]]
const encoded = RLP.encode(nestedList)
const decoded = RLP.decode(encoded)
assert.deepStrictEqual(decoded, nestedList, 'decoded output does not match original')
console.log('assert.deepStrictEqual would have thrown if the decoded output did not match')
