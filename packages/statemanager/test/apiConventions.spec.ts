import { assert, describe, it } from 'vitest'

import {
  MerkleStateManager,
  RPCStateManager,
  SimpleStateManager,
  StatefulBinaryTreeStateManager,
  createMerkleStateManager,
  createRPCStateManager,
  createSimpleStateManager,
  createStatefulBinaryTreeStateManager,
} from '../src/index.ts'

// D-NAME-4: the createX factories must construct the same class as `new XStateManager(opts)`.
describe('API conventions: state-manager createX factory aliases (D-NAME-4)', () => {
  it('createMerkleStateManager === new MerkleStateManager', () => {
    assert.instanceOf(createMerkleStateManager(), MerkleStateManager)
  })

  it('createSimpleStateManager === new SimpleStateManager', () => {
    assert.instanceOf(createSimpleStateManager(), SimpleStateManager)
  })

  it('createRPCStateManager === new RPCStateManager', () => {
    assert.instanceOf(
      createRPCStateManager({ provider: 'http://localhost:8545', blockTag: 0n }),
      RPCStateManager,
    )
  })

  it('createStatefulBinaryTreeStateManager === new StatefulBinaryTreeStateManager', () => {
    assert.instanceOf(createStatefulBinaryTreeStateManager({}), StatefulBinaryTreeStateManager)
  })
})
