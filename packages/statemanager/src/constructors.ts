import { MerkleStateManager } from './merkleStateManager.ts'
import { RPCStateManager } from './rpcStateManager.ts'
import { SimpleStateManager } from './simpleStateManager.ts'
import { StatefulBinaryTreeStateManager } from './statefulBinaryTreeStateManager.ts'

import type {
  MerkleStateManagerOpts,
  RPCStateManagerOpts,
  SimpleStateManagerOpts,
  StatefulBinaryTreeStateManagerOpts,
} from './types.ts'

/**
 * Convenience `createX()` factories aligning state-manager construction with the monorepo-wide
 * constructor convention. Each is equivalent to `new XStateManager(opts)`; the public constructors
 * remain fully supported.
 */

/**
 * Creates a {@link MerkleStateManager}. Equivalent to `new MerkleStateManager(opts)`.
 */
export function createMerkleStateManager(opts: MerkleStateManagerOpts = {}): MerkleStateManager {
  return new MerkleStateManager(opts)
}

/**
 * Creates a {@link SimpleStateManager}. Equivalent to `new SimpleStateManager(opts)`.
 */
export function createSimpleStateManager(opts: SimpleStateManagerOpts = {}): SimpleStateManager {
  return new SimpleStateManager(opts)
}

/**
 * Creates an {@link RPCStateManager}. Equivalent to `new RPCStateManager(opts)`.
 */
export function createRPCStateManager(opts: RPCStateManagerOpts): RPCStateManager {
  return new RPCStateManager(opts)
}

/**
 * Creates a {@link StatefulBinaryTreeStateManager}. Equivalent to
 * `new StatefulBinaryTreeStateManager(opts)`.
 */
export function createStatefulBinaryTreeStateManager(
  opts: StatefulBinaryTreeStateManagerOpts,
): StatefulBinaryTreeStateManager {
  return new StatefulBinaryTreeStateManager(opts)
}
