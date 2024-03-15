import { type BatchDBOp } from '@ethereumjs/util'

import { bytesToNibbles, nibblesCompare } from '../util/nibbles.js'

export function orderBatch(
  ops: BatchDBOp[],
  keyTransform: (msg: Uint8Array) => Uint8Array = (msg: Uint8Array) => {
    return msg
  }
): BatchDBOp[] {
  const keyNibbles: [number, number[]][] = ops.map((o, i) => {
    const appliedKey = keyTransform(o.key)
    const nibbles: number[] = bytesToNibbles(appliedKey)
    return [i, nibbles]
  })
  keyNibbles.sort(([_, a], [__, b]) => {
    return nibblesCompare(a, b)
  })
  return keyNibbles.map(([i, _]) => ops[i])
}
