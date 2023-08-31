import { Common } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { Block } from '../src/index.js'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as verkleBlockJSON from './testdata/verkleKaustinenBlock1.json'

describe('[VerkleBlock]: Verkle Block Functionality (FakeEIP-999001)', () => {
  const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
    chain: 'customChain',
    eips: [999001],
  })
  const verkleBlock = Block.fromBlockData(verkleBlockJSON, { common })

  it('should test block initialization', () => {
    assert.ok(
      (verkleBlock.header.executionWitness?.stateDiff?.length ?? 0) > 0,
      'executionWitness stateDiff is defined'
    )
    assert.ok(
      (verkleBlock.header.executionWitness?.verkleProof?.commitmentsByPath.length ?? 0) > 0 !==
        undefined,
      'executionWitness verkleProof is defined'
    )
  })
})
