import { bytesToUtf8, createAddressFromString, getVerkleStem, utf8ToBytes } from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'

async function test() {
  const addrHex = '0x781f1e4238f9de8b4d0ede9932f5a4d08f15dae7'
  const address = createAddressFromString(addrHex)
  const tree = await createVerkleTree()
  const stem = getVerkleStem(tree['verkleCrypto'], address)
  await tree.put(stem, [0], [utf8ToBytes('test')])
  const value = await tree.get(stem, [0, 1])
  console.log(value[0] ? bytesToUtf8(value[0]) : 'not found') // 'test'
  console.log(value[1] ? bytesToUtf8(value[1]) : 'not found') // 'not found'
}

void test()
