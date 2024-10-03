import { ExtensionOrLeafMPTNodeBase } from './extensionOrLeafNodeBase.js'

import type { Nibbles, RawLeafMPTNode } from '../types.js'

export class LeafMPTNode extends ExtensionOrLeafMPTNodeBase {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, true)
  }

  raw(): RawLeafMPTNode {
    return super.raw()
  }
}
