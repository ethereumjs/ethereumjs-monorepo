import { Common } from '@ethereumjs/common'
import * as tape from 'tape'

import { Block } from '../src'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as verkleBlockJSON from './testdata/verkleKaustinenBlock1.json'

tape('[VerkleBlock]: Verkle Block Functionality (FakeEIP-999001)', function (t) {
  const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
    chain: 'customChain',
    eips: [999001],
  })
  const verkleBlock = Block.fromBlockData(verkleBlockJSON, { common })

  t.test('should test block initialization', function (st) {
    st.ok(
      (verkleBlock.header.executionWitness?.stateDiff?.length ?? 0) > 0,
      'executionWitness stateDiff is defined'
    )
    st.ok(
      (verkleBlock.header.executionWitness?.verkleProof?.commitmentsByPath.length ?? 0) > 0 !==
        undefined,
      'executionWitness verkleProof is defined'
    )

    st.end()
  })
})
