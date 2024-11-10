import { RLP } from '@ethereumjs/rlp'

import type { TxDataContainer } from '../dataContainerTypes.js'
import type { NestedUint8Array } from '@ethereumjs/rlp'

export abstract class TemplateDataContainer implements TxDataContainer {
  type = -1

  abstract raw(): NestedUint8Array
  serialize() {
    // Defaults to use RLP.encode
    return RLP.encode(this.raw())
  }

  supports(/*feature: Feature*/) {
    return false
  }

  toJSON() {
    return {}
  }
}
