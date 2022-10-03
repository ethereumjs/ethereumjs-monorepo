let imports = {}
imports['__wbindgen_placeholder__'] = module.exports
let wasm
const { TextEncoder, TextDecoder } = require(`util`)

const heap = new Array(32).fill(undefined)

heap.push(undefined, null, true, false)

function getObject(idx) {
  return heap[idx]
}

let heap_next = heap.length

function dropObject(idx) {
  if (idx < 36) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

let WASM_VECTOR_LEN = 0

let cachegetUint8Memory0 = null
function getUint8Memory0() {
  if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
    cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachegetUint8Memory0
}

let cachedTextEncoder = new TextEncoder('utf-8')

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view)
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg)
        view.set(buf)
        return {
          read: arg.length,
          written: buf.length,
        }
      }

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length)
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len)

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
    ptr = realloc(ptr, len, (len = offset + arg.length * 3))
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len)
    const ret = encodeString(arg, view)

    offset += ret.written
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

function isLikeNone(x) {
  return x === undefined || x === null
}

let cachegetInt32Memory0 = null
function getInt32Memory0() {
  if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachegetInt32Memory0
}

function debugString(val) {
  // primitive types
  const type = typeof val
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`
  }
  if (type == 'string') {
    return `"${val}"`
  }
  if (type == 'symbol') {
    const description = val.description
    if (description == null) {
      return 'Symbol'
    } else {
      return `Symbol(${description})`
    }
  }
  if (type == 'function') {
    const name = val.name
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`
    } else {
      return 'Function'
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length
    let debug = '['
    if (length > 0) {
      debug += debugString(val[0])
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i])
    }
    debug += ']'
    return debug
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val))
  let className
  if (builtInMatches.length > 1) {
    className = builtInMatches[1]
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val)
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')'
    } catch (_) {
      return 'Object'
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true })

cachedTextDecoder.decode()

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}
/**
 * @param {Array<any>} values
 * @returns {any}
 */
module.exports.pedersen_hash = function (values) {
  var ret = wasm.pedersen_hash(addHeapObject(values))
  return takeObject(ret)
}

let stack_pointer = 32

function addBorrowedObject(obj) {
  if (stack_pointer == 1) throw new Error('out of js stack')
  heap[--stack_pointer] = obj
  return stack_pointer
}
/**
 * @param {Uint8Array} js_root
 * @param {Uint8Array} js_proof
 * @param {Map<any, any>} js_key_values
 * @returns {any}
 */
module.exports.verify_update = function (js_root, js_proof, js_key_values) {
  try {
    var ret = wasm.verify_update(
      addHeapObject(js_root),
      addHeapObject(js_proof),
      addBorrowedObject(js_key_values)
    )
    return takeObject(ret)
  } finally {
    heap[stack_pointer++] = undefined
  }
}

function handleError(f, args) {
  try {
    return f.apply(this, args)
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e))
  }
}

module.exports.__wbindgen_object_drop_ref = function (arg0) {
  takeObject(arg0)
}

module.exports.__wbg_log_73f700dbdcc58b99 = function (arg0, arg1) {
  console.log(getStringFromWasm0(arg0, arg1))
}

module.exports.__wbindgen_string_get = function (arg0, arg1) {
  const obj = getObject(arg1)
  var ret = typeof obj === 'string' ? obj : undefined
  var ptr0 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  var len0 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len0
  getInt32Memory0()[arg0 / 4 + 0] = ptr0
}

module.exports.__wbindgen_is_null = function (arg0) {
  var ret = getObject(arg0) === null
  return ret
}

module.exports.__wbg_new_693216e109162396 = function () {
  var ret = new Error()
  return addHeapObject(ret)
}

module.exports.__wbg_stack_0ddaca5d1abfb52f = function (arg0, arg1) {
  var ret = getObject(arg1).stack
  var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  var len0 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len0
  getInt32Memory0()[arg0 / 4 + 0] = ptr0
}

module.exports.__wbg_error_09919627ac0992f5 = function (arg0, arg1) {
  try {
    console.error(getStringFromWasm0(arg0, arg1))
  } finally {
    wasm.__wbindgen_free(arg0, arg1)
  }
}

module.exports.__wbg_get_f45dff51f52d7222 = function (arg0, arg1) {
  var ret = getObject(arg0)[arg1 >>> 0]
  return addHeapObject(ret)
}

module.exports.__wbg_next_dd1a890d37e38d73 = function () {
  return handleError(function (arg0) {
    var ret = getObject(arg0).next()
    return addHeapObject(ret)
  }, arguments)
}

module.exports.__wbg_done_982b1c7ac0cbc69d = function (arg0) {
  var ret = getObject(arg0).done
  return ret
}

module.exports.__wbg_value_2def2d1fb38b02cd = function (arg0) {
  var ret = getObject(arg0).value
  return addHeapObject(ret)
}

module.exports.__wbg_length_82ad48e8d91da336 = function (arg0) {
  var ret = getObject(arg0).length
  return ret
}

module.exports.__wbg_from_4216160a11e086ef = function (arg0) {
  var ret = Array.from(getObject(arg0))
  return addHeapObject(ret)
}

module.exports.__wbg_values_71935f80778b5113 = function (arg0) {
  var ret = getObject(arg0).values()
  return addHeapObject(ret)
}

module.exports.__wbg_BigInt_5179c5cb9cc5bfa4 = function () {
  return handleError(function (arg0) {
    var ret = BigInt(getObject(arg0))
    return addHeapObject(ret)
  }, arguments)
}

module.exports.__wbg_toString_438e03f57fe1aad9 = function () {
  return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).toString(arg1)
    return addHeapObject(ret)
  }, arguments)
}

module.exports.__wbg_entries_3b7c6644b64ed009 = function (arg0) {
  var ret = getObject(arg0).entries()
  return addHeapObject(ret)
}

module.exports.__wbg_buffer_5e74a88a1424a2e0 = function (arg0) {
  var ret = getObject(arg0).buffer
  return addHeapObject(ret)
}

module.exports.__wbg_newwithbyteoffsetandlength_278ec7532799393a = function (arg0, arg1, arg2) {
  var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0)
  return addHeapObject(ret)
}

module.exports.__wbg_new_e3b800e570795b3c = function (arg0) {
  var ret = new Uint8Array(getObject(arg0))
  return addHeapObject(ret)
}

module.exports.__wbg_set_5b8081e9d002f0df = function (arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0)
}

module.exports.__wbg_length_30803400a8f15c59 = function (arg0) {
  var ret = getObject(arg0).length
  return ret
}

module.exports.__wbindgen_debug_string = function (arg0, arg1) {
  var ret = debugString(getObject(arg1))
  var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  var len0 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len0
  getInt32Memory0()[arg0 / 4 + 0] = ptr0
}

module.exports.__wbindgen_throw = function (arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}

module.exports.__wbindgen_memory = function () {
  var ret = wasm.memory
  return addHeapObject(ret)
}

const path = require('path').join(__dirname, 'rust_verkle_wasm_bg.wasm')
const bytes = require('fs').readFileSync(path)

const wasmModule = new WebAssembly.Module(bytes)
const wasmInstance = new WebAssembly.Instance(wasmModule, imports)
wasm = wasmInstance.exports
module.exports.__wasm = wasm
