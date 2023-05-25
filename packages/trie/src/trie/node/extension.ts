import { addHexPrefix } from '../../util/hex'

import { Node } from './node.js'

import type { Nibbles } from '../../types'

export class ExtensionNode extends Node {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, false)
  }

  static encodeKey(key: Nibbles): Nibbles {
    return addHexPrefix(key, false)
  }
}
