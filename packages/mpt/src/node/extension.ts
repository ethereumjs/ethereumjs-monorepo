import { ExtensionOrLeafMPTNodeBase } from './extensionOrLeafNodeBase.ts'

import type { Nibbles, RawExtensionMPTNode } from '../types.ts'

/** Extension MPT node: shared path prefix pointing to a child. */
export class ExtensionMPTNode extends ExtensionOrLeafMPTNodeBase {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, false)
  }

  raw(): RawExtensionMPTNode {
    return super.raw()
  }
}
