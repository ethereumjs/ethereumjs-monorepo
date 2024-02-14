import { addHexPrefix } from '../util/hex.js'

import { Node } from './node.js'

import type { Nibbles } from '../types.js'

export class LeafNode extends Node {
  constructor(nibbles: Nibbles, value: Uint8Array) {
    super(nibbles, value, true)
  }

  static encodeKey(key: Nibbles): Nibbles {
    return addHexPrefix(key, true)
  }
}
