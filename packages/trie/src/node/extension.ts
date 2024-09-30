import { ExtensionOrLeafNodeBase } from './extensionOrLeafNodeBase.js'

import type { Nibbles, RawExtensionNode } from '../types.js'

export class ExtensionNode extends ExtensionOrLeafNodeBase {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, false)
  }

  raw(): RawExtensionNode {
    return super.raw()
  }
}
