import { base64 } from '@scure/base'

import wasmB64 from './wasm.json'
const imports = {}

let wasm: any
let WASM_VECTOR_LEN = 0

let cachedUint8Memory0: null | Uint8Array = null

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8Memory0
}

const cachedTextEncoder = new TextEncoder()

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg: any, view: any) {
        return cachedTextEncoder.encodeInto(arg, view)
      }
    : function (arg: any, view: any) {
        const buf = cachedTextEncoder.encode(arg)
        view.set(buf)
        return {
          read: arg.length,
          written: buf.length,
        }
      }

function passStringToWasm0(arg: string, malloc: any, realloc: any) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length, 1) >>> 0
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len, 1) >>> 0

  const mem = getUint8Memory0()

  let offset = 0

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset)
    if (code > 0x7f) break
    mem[ptr + offset] = code
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset)
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len)
    const ret = encodeString(arg, view)

    offset += ret.written!
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

let cachedInt32Memory0: null | Int32Array = null

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachedInt32Memory0
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true })

cachedTextDecoder.decode()

function getStringFromWasm0(ptr: any, len: number) {
  ptr = ptr >>> 0
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}
/**
 * @param {string} input_hex
 * @returns {string}
 */
export const ec_mul = function (input_hex: string) {
  let deferred2_0
  let deferred2_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(input_hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.ec_mul(retptr, ptr0, len0)
    const r0 = getInt32Memory0()[retptr / 4 + 0]
    const r1 = getInt32Memory0()[retptr / 4 + 1]
    deferred2_0 = r0
    deferred2_1 = r1
    return getStringFromWasm0(r0, r1)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {string} input_str
 * @returns {string}
 */
export const ec_add = function (input_str: string) {
  let deferred2_0
  let deferred2_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(input_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.ec_add(retptr, ptr0, len0)
    const r0 = getInt32Memory0()[retptr / 4 + 0]
    const r1 = getInt32Memory0()[retptr / 4 + 1]
    deferred2_0 = r0
    deferred2_1 = r1
    return getStringFromWasm0(r0, r1)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

/**
 * @param {string} input_str
 * @returns {string}
 */
export const ec_pairing = function (input_str: string): string {
  let deferred2_0
  let deferred2_1
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    const ptr0 = passStringToWasm0(input_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len0 = WASM_VECTOR_LEN
    wasm.ec_pairing(retptr, ptr0, len0)
    const r0 = getInt32Memory0()[retptr / 4 + 0]
    const r1 = getInt32Memory0()[retptr / 4 + 1]
    deferred2_0 = r0
    deferred2_1 = r1
    return getStringFromWasm0(r0, r1)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
    wasm.__wbindgen_free(deferred2_0, deferred2_1, 1)
  }
}

const wasmInstance = await WebAssembly.instantiate(
  await WebAssembly.compile(base64.decode(wasmB64.wasm)),
  imports
)
wasm = wasmInstance.exports
