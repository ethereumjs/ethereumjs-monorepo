import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { type PrefixedHexString, hexToBytes } from '@ethereumjs/util'
import { createEVM } from '../../src/index.ts'

const MSTORE8 = '53'
const RETURN = 'f3'

const SETMODX = 'c0'
const LOADX = 'c1'
const STOREX = 'c2'

const ADDMODX = 'c3'
const SUBMODX = 'c4'
const MULMODX = 'c5'

function numToOpcode(num: number) {
  return num.toString(16).padStart(2, '0')
}

function mstore8(index: number, value: number) {
  return numToOpcode(value) + numToOpcode(index) + MSTORE8
}

function ret(index: number, size: number) {
  return size + index + RETURN
}

function setupx(num_val_slots: number, mod_size: number, mod_offset: number) {
  return numToOpcode(num_val_slots) + numToOpcode(mod_size) + numToOpcode(mod_offset) + SETMODX
}

function storex(num_vals: number, val_offset: number, val_slot: number) {
  return numToOpcode(num_vals) + numToOpcode(val_offset) + numToOpcode(val_slot) + STOREX
}

function loadx(num_vals: number, val_idx: number, mem_offset: number) {
  return numToOpcode(num_vals) + numToOpcode(val_idx) + numToOpcode(mem_offset) + LOADX
}

function addmodx(result_slot_idx: number, x_slot_idx: number, y_slot_idx: number) {
  return ADDMODX + numToOpcode(result_slot_idx) + numToOpcode(x_slot_idx) + numToOpcode(y_slot_idx)
}

function submodx(result_slot_idx: number, x_slot_idx: number, y_slot_idx: number) {
  return SUBMODX + numToOpcode(result_slot_idx) + numToOpcode(x_slot_idx) + numToOpcode(y_slot_idx)
}

function mulmodx(result_slot_idx: number, x_slot_idx: number, y_slot_idx: number) {
  return MULMODX + numToOpcode(result_slot_idx) + numToOpcode(x_slot_idx) + numToOpcode(y_slot_idx)
}

describe('EVM -> getActiveOpcodes()', () => {
  it('should not expose opcodes from a follow-up HF (istanbul -> petersburg)', async () => {
    const common = new Common({ chain: Mainnet, eips: [6990] })
    const evm = await createEVM({ common })

    // create bytecode
    const bytecode =
      '0x' +
      mstore8(0, 7) + // store value 0x07 at index 0 in memory
      setupx(3, 32, 0) +
      mstore8(32, 3) +
      mstore8(64, 6) +
      storex(2, 32, 0) +
      addmodx(2, 1, 0) +
      mulmodx(2, 2, 1) +
      submodx(2, 2, 1) +
      loadx(1, 2, 96) +
      ret(96, 32)

    console.log(bytecode)

    const result = await evm.runCall({
      data: hexToBytes(bytecode as PrefixedHexString),
      gasLimit: BigInt(0xffffff),
    })

    console.log(result)
  })
})
