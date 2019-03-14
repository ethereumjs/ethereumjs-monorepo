;; This module aims to temporarily shim required missing features in wasm-js-api
;; to allow integration of ewasm in js. An example of that is the lack of support
;; for i64 values in the interface between wasm and js.
;; It currently implements only those shims necessary for a few precompiles, but will
;; have to be extended to support the full EEI interface.
(module
  (import "interface" "useGas" (func $useGas (param i32 i32)))
  (import "interface" "getGasLeftHigh" (func $getGasLeftHigh (result i32)))
  (import "interface" "getGasLeftLow" (func $getGasLeftLow (result i32)))
  (import "interface" "call" (func $call (param i32 i32 i32 i32 i32 i32) (result i32)))
  (import "interface" "callCode" (func $callCode (param i32 i32 i32 i32 i32 i32) (result i32)))
  (import "interface" "callDelegate" (func $callDelegate (param i32 i32 i32 i32 i32) (result i32)))
  (import "interface" "callStatic" (func $callStatic (param i32 i32 i32 i32 i32) (result i32)))

  (export "useGas" (func $useGasShim))
  (export "getGasLeft" (func $getGasLeft))
  (export "call" (func $callShim))
  (export "callCode" (func $callCodeShim))
  (export "callDelegate" (func $callDelegateShim))
  (export "callStatic" (func $callStaticShim))

  (func $useGasShim
    (param $amount i64)
    (call $useGas
                 (i32.wrap/i64
                   (i64.shr_u (get_local $amount) (i64.const 32)))
                 (i32.wrap/i64 (get_local $amount)))
  )

  (func $getGasLeft
    (result i64)
    (call $useGas (i32.const 0) (i32.const 2))
    (return
      (i64.add
        (i64.shl (i64.extend_u/i32 (call $getGasLeftHigh)) (i64.const 32))
        (i64.extend_u/i32 (call $getGasLeftLow))))
  )

  ;; call
  ;; (import $call "ethereum" "call" (param i32 i32 i32 i32 i32) (result i32))
  (func $callShim
    (param i64 i32 i32 i32 i32)
    (result i32)
    (call $call
           (i32.wrap/i64
             (i64.shr_u (get_local 0) (i64.const 32)))
           (i32.wrap/i64 (get_local 0))
           (get_local 1)
           (get_local 2)
           (get_local 3)
           (get_local 4)
    )
  )

  ;; callCode
  ;; (import $callCode "ethereum" "callCode" (param i32 i32 i32 i32 i32) (result i32))
  (func $callCodeShim
    (param i64 i32 i32 i32 i32)
    (result i32)
    (call $callCode
           (i32.wrap/i64
             (i64.shr_u (get_local 0) (i64.const 32)))
           (i32.wrap/i64 (get_local 0))
           (get_local 1)
           (get_local 2)
           (get_local 3)
           (get_local 4)
    )
  )

  (func $callDelegateShim
    (param i64 i32 i32 i32)
    (result i32)
    (call $callDelegate
           (i32.wrap/i64
             (i64.shr_u (get_local 0) (i64.const 32)))
           (i32.wrap/i64 (get_local 0))
           (get_local 1)
           (get_local 2)
           (get_local 3)
    )
  )

  (func $callStaticShim
    (param i64 i32 i32 i32)
    (result i32)
    (call $callStatic
           (i32.wrap/i64
             (i64.shr_u (get_local 0) (i64.const 32)))
           (i32.wrap/i64 (get_local 0))
           (get_local 1)
           (get_local 2)
           (get_local 3)
    )
  )
)
