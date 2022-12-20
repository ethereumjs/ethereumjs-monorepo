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

let WASM_VECTOR_LEN = 0

let cachedUint8Memory0 = new Uint8Array()

function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8Memory0
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

let cachedInt32Memory0 = new Int32Array()

function getInt32Memory0() {
  if (cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachedInt32Memory0
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
 * @param {Uint8Array} address_tree_index
 * @returns {any}
 */
module.exports.pedersen_hash = function (address_tree_index) {
  const ret = wasm.pedersen_hash(addHeapObject(address_tree_index))
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
    const ret = wasm.verify_update(
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

module.exports.__wbg_log_035529d7f1f4615f = function (arg0, arg1) {
  console.log(getStringFromWasm0(arg0, arg1))
}

module.exports.__wbindgen_is_null = function (arg0) {
  const ret = getObject(arg0) === null
  return ret
}

module.exports.__wbg_new_abda76e883ba8a5f = function () {
  const ret = new Error()
  return addHeapObject(ret)
}

module.exports.__wbg_stack_658279fe44541cf6 = function (arg0, arg1) {
  const ret = getObject(arg1).stack
  const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  const len0 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len0
  getInt32Memory0()[arg0 / 4 + 0] = ptr0
}

module.exports.__wbg_error_f851667af71bcfc6 = function (arg0, arg1) {
  try {
    console.error(getStringFromWasm0(arg0, arg1))
  } finally {
    wasm.__wbindgen_free(arg0, arg1)
  }
}

module.exports.__wbg_get_57245cc7d7c7619d = function (arg0, arg1) {
  const ret = getObject(arg0)[arg1 >>> 0]
  return addHeapObject(ret)
}

module.exports.__wbg_next_aaef7c8aa5e212ac = function () {
  return handleError(function (arg0) {
    const ret = getObject(arg0).next()
    return addHeapObject(ret)
  }, arguments)
}

module.exports.__wbg_done_1b73b0672e15f234 = function (arg0) {
  const ret = getObject(arg0).done
  return ret
}

module.exports.__wbg_value_1ccc36bc03462d71 = function (arg0) {
  const ret = getObject(arg0).value
  return addHeapObject(ret)
}

module.exports.__wbg_from_7ce3cb27cb258569 = function (arg0) {
  const ret = Array.from(getObject(arg0))
  return addHeapObject(ret)
}

module.exports.__wbg_entries_ff7071308de9aaec = function (arg0) {
  const ret = getObject(arg0).entries()
  return addHeapObject(ret)
}

module.exports.__wbg_buffer_3f3d764d4747d564 = function (arg0) {
  const ret = getObject(arg0).buffer
  return addHeapObject(ret)
}

module.exports.__wbg_newwithbyteoffsetandlength_d9aa266703cb98be = function (arg0, arg1, arg2) {
  const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0)
  return addHeapObject(ret)
}

module.exports.__wbg_new_8c3f0052272a457a = function (arg0) {
  const ret = new Uint8Array(getObject(arg0))
  return addHeapObject(ret)
}

module.exports.__wbg_set_83db9690f9353e79 = function (arg0, arg1, arg2) {
  getObject(arg0).set(getObject(arg1), arg2 >>> 0)
}

module.exports.__wbg_length_9e1ae1900cb0fbd5 = function (arg0) {
  const ret = getObject(arg0).length
  return ret
}

module.exports.__wbindgen_debug_string = function (arg0, arg1) {
  const ret = debugString(getObject(arg1))
  const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
  const len0 = WASM_VECTOR_LEN
  getInt32Memory0()[arg0 / 4 + 1] = len0
  getInt32Memory0()[arg0 / 4 + 0] = ptr0
}

module.exports.__wbindgen_throw = function (arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1))
}

module.exports.__wbindgen_memory = function () {
  const ret = wasm.memory
  return addHeapObject(ret)
}

const path = require('path').join(__dirname, 'rust_verkle_wasm_bg.wasm')
const bytes = require('fs').readFileSync(path)

const wasmModule = new WebAssembly.Module(bytes)
const wasmInstance = new WebAssembly.Instance(wasmModule, imports)
wasm = wasmInstance.exports
module.exports.__wasm = wasm
