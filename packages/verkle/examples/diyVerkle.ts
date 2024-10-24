import { bytesToHex } from '@ethereumjs/util'
import { VerkleTree } from '@ethereumjs/verkle'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'

const verkleCrypto = await loadVerkleCrypto()

const main = async () => {
  const tree = new VerkleTree({ verkleCrypto })
  await tree.createRootNode()
  console.log(bytesToHex(tree.root())) // 0x0000000000000000000000000000000000000000000000000000000000000000
}

void main()
