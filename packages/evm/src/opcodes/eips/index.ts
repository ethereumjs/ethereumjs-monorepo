import { eip1153 } from './eip1153.ts'
import { eip3198 } from './eip3198.ts'
import { eip3855 } from './eip3855.ts'
import { eip4844Blobhash } from './eip4844.ts'
import { eip5656 } from './eip5656.ts'
import { eip7516 } from './eip7516.ts'
import { eip7843 } from './eip7843.ts'
import { eip7939 } from './eip7939.ts'
import { eip8024 } from './eip8024.ts'

import type { OpcodeEipModule } from './types.ts'

/** Opcode-only EIP modules merged in EIP number order. */
export const OPCODE_EIP_MODULES: OpcodeEipModule[] = [
  eip1153,
  eip3198,
  eip3855,
  eip4844Blobhash,
  eip5656,
  eip7516,
  eip7843,
  eip7939,
  eip8024,
]
