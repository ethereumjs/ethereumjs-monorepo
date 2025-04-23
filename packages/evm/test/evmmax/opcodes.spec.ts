import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { type PrefixedHexString, hexToBytes } from '@ethereumjs/util'
import { LOADX_BASE_COST, SETMODX_BASE_COST, STOREX_BASE_COST } from '../../src/evmmax/index.ts'
import { createEVM } from '../../src/index.ts'

const MSTORE8 = '53'
const RETURN = 'f3'
const PUSH1 = '60'

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
  // return numToOpcode(value) + numToOpcode(index) + MSTORE8
  return PUSH1 + numToOpcode(value) + PUSH1 + numToOpcode(index) + MSTORE8
}

function ret(index: number, size: number) {
  return size + index + RETURN
}

function setupx(id: number, mod_size: number, mod_offset: number, alloc_count: number) {
  return (
    PUSH1 +
    numToOpcode(alloc_count) +
    PUSH1 +
    numToOpcode(mod_size) +
    PUSH1 +
    numToOpcode(mod_offset) +
    PUSH1 +
    numToOpcode(id) +
    SETMODX
  )
}

function storex(dst: number, source: number, count: number) {
  return (
    PUSH1 + numToOpcode(dst) + PUSH1 + numToOpcode(source) + PUSH1 + numToOpcode(count) + STOREX
  )
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
    const common = new Common({
      chain: Mainnet,
      eips: [6690],
      params: {
        6690: {
          setmodxGas: SETMODX_BASE_COST,
          loadxGas: LOADX_BASE_COST,
          storexGas: STOREX_BASE_COST,
          addmodxGas: 0,
          submodxGas: 0,
          mulmodxGas: 0,
        },
      },
    })
    const evm = await createEVM({ common })

    // create bytecode
    const bytecode =
      '0x' +
      mstore8(0, 7) + // store value 0x07 at index 0 in memory
      setupx(0, 1, 0, 3) +
      mstore8(1, 3) +
      mstore8(2, 6) +
      storex(2, 0, 0) +
      addmodx(2, 1, 0)
    // + mulmodx(2, 2, 1)
    // + submodx(2, 2, 1)
    // + loadx(1, 2, 96)
    // + ret(96, 32)

    console.log(bytecode)

    const result = await evm.runCall({
      data: hexToBytes(bytecode as PrefixedHexString),
      gasLimit: BigInt(0xffffff),
    })

    console.log(result)
  })
})
