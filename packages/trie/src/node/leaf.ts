import { ExtensionOrLeafNodeBase } from './extensionOrLeafNodeBase.js'

import type { Nibbles, RawLeafNode } from '../types.js'

export class LeafNode extends ExtensionOrLeafNodeBase {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, true)
  }

  raw(): RawLeafNode {
    return super.raw()
  }
}
