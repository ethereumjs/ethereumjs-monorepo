import { createBinaryTree } from '@ethereumjs/binarytree'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const tree = await createBinaryTree()

  const key = hexToBytes(`0x${'00'.repeat(32)}`)
  const value = hexToBytes(`0x${'01'.repeat(32)}`)
  const stem = key.slice(0, 31)
  const index = key[31]

  await tree.put(stem, [index], [value])
  const [retrieved] = await tree.get(stem, [index])

  console.log(`Root: ${bytesToHex(tree.root())}`)
  console.log(`Value match: ${bytesToHex(retrieved!)}`)
}

void main()
