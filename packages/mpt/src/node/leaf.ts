import { ExtensionOrLeafMPTNodeBase } from './extensionOrLeafNodeBase.ts'

import type { Nibbles, RawLeafMPTNode } from '../types.ts'

/** Leaf MPT node: remaining path suffix with a stored value. */
export class LeafMPTNode extends ExtensionOrLeafMPTNodeBase {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, true)
  }

  raw(): RawLeafMPTNode {
    return super.raw()
  }
}
