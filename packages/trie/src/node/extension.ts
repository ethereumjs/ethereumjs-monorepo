import { ExtensionOrLeafMPTNodeBase } from './extensionOrLeafNodeBase.js'

import type { Nibbles, RawExtensionMPTNode } from '../types.js'

export class ExtensionMPTNode extends ExtensionOrLeafMPTNodeBase {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, false)
  }

  raw(): RawExtensionMPTNode {
    return super.raw()
  }
}
