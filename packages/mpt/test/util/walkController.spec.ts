import { utf8ToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { MerklePatriciaTrie } from '../../src/index.ts'
import { WalkController } from '../../src/util/walkController.ts'

describe('[MPT/WalkController]: trie walk', () => {
  it('WalkController.newWalk() visits nodes in a small trie', async () => {
    const trie = new MerklePatriciaTrie()
    await trie.put(utf8ToBytes('a'), utf8ToBytes('1'))
    await trie.put(utf8ToBytes('b'), utf8ToBytes('2'))

    const visited: string[] = []
    await WalkController.newWalk(
      async (_nodeRef, node, _key, _walkController) => {
        visited.push(node?.constructor.name ?? 'null')
      },
      trie,
      trie.root(),
    )

    assert.isTrue(visited.length >= 1, 'should visit at least the root node')
  })
})
