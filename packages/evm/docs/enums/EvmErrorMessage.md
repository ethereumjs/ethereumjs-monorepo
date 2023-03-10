[@ethereumjs/evm](../README.md) / EvmErrorMessage

# Enumeration: EvmErrorMessage

## Table of contents

### Enumeration Members

- [AUTHCALL\_NONZERO\_VALUEEXT](EvmErrorMessage.md#authcall_nonzero_valueext)
- [AUTHCALL\_UNSET](EvmErrorMessage.md#authcall_unset)
- [AUTH\_INVALID\_S](EvmErrorMessage.md#auth_invalid_s)
- [BLS\_12\_381\_FP\_NOT\_IN\_FIELD](EvmErrorMessage.md#bls_12_381_fp_not_in_field)
- [BLS\_12\_381\_INPUT\_EMPTY](EvmErrorMessage.md#bls_12_381_input_empty)
- [BLS\_12\_381\_INVALID\_INPUT\_LENGTH](EvmErrorMessage.md#bls_12_381_invalid_input_length)
- [BLS\_12\_381\_POINT\_NOT\_ON\_CURVE](EvmErrorMessage.md#bls_12_381_point_not_on_curve)
- [CODESIZE\_EXCEEDS\_MAXIMUM](EvmErrorMessage.md#codesize_exceeds_maximum)
- [CODESTORE\_OUT\_OF\_GAS](EvmErrorMessage.md#codestore_out_of_gas)
- [CREATE\_COLLISION](EvmErrorMessage.md#create_collision)
- [INITCODE\_SIZE\_VIOLATION](EvmErrorMessage.md#initcode_size_violation)
- [INSUFFICIENT\_BALANCE](EvmErrorMessage.md#insufficient_balance)
- [INTERNAL\_ERROR](EvmErrorMessage.md#internal_error)
- [INVALID\_BEGINSUB](EvmErrorMessage.md#invalid_beginsub)
- [INVALID\_BYTECODE\_RESULT](EvmErrorMessage.md#invalid_bytecode_result)
- [INVALID\_COMMITMENT](EvmErrorMessage.md#invalid_commitment)
- [INVALID\_EOF\_FORMAT](EvmErrorMessage.md#invalid_eof_format)
- [INVALID\_JUMP](EvmErrorMessage.md#invalid_jump)
- [INVALID\_JUMPSUB](EvmErrorMessage.md#invalid_jumpsub)
- [INVALID\_OPCODE](EvmErrorMessage.md#invalid_opcode)
- [INVALID\_RETURNSUB](EvmErrorMessage.md#invalid_returnsub)
- [OUT\_OF\_GAS](EvmErrorMessage.md#out_of_gas)
- [OUT\_OF\_RANGE](EvmErrorMessage.md#out_of_range)
- [POINT\_GREATER\_THAN\_BLS\_MODULUS](EvmErrorMessage.md#point_greater_than_bls_modulus)
- [REFUND\_EXHAUSTED](EvmErrorMessage.md#refund_exhausted)
- [REVERT](EvmErrorMessage.md#revert)
- [STACK\_OVERFLOW](EvmErrorMessage.md#stack_overflow)
- [STACK\_UNDERFLOW](EvmErrorMessage.md#stack_underflow)
- [STATIC\_STATE\_CHANGE](EvmErrorMessage.md#static_state_change)
- [STOP](EvmErrorMessage.md#stop)
- [VALUE\_OVERFLOW](EvmErrorMessage.md#value_overflow)

## Enumeration Members

### AUTHCALL\_NONZERO\_VALUEEXT

• **AUTHCALL\_NONZERO\_VALUEEXT** = ``"attempting to execute AUTHCALL with nonzero external value"``

#### Defined in

[exceptions.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L26)

___

### AUTHCALL\_UNSET

• **AUTHCALL\_UNSET** = ``"attempting to AUTHCALL without AUTH set"``

#### Defined in

[exceptions.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L25)

___

### AUTH\_INVALID\_S

• **AUTH\_INVALID\_S** = ``"invalid Signature: s-values greater than secp256k1n/2 are considered invalid"``

#### Defined in

[exceptions.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L27)

___

### BLS\_12\_381\_FP\_NOT\_IN\_FIELD

• **BLS\_12\_381\_FP\_NOT\_IN\_FIELD** = ``"fp point not in field"``

#### Defined in

[exceptions.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L33)

___

### BLS\_12\_381\_INPUT\_EMPTY

• **BLS\_12\_381\_INPUT\_EMPTY** = ``"input is empty"``

#### Defined in

[exceptions.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L32)

___

### BLS\_12\_381\_INVALID\_INPUT\_LENGTH

• **BLS\_12\_381\_INVALID\_INPUT\_LENGTH** = ``"invalid input length"``

#### Defined in

[exceptions.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L30)

___

### BLS\_12\_381\_POINT\_NOT\_ON\_CURVE

• **BLS\_12\_381\_POINT\_NOT\_ON\_CURVE** = ``"point not on curve"``

#### Defined in

[exceptions.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L31)

___

### CODESIZE\_EXCEEDS\_MAXIMUM

• **CODESIZE\_EXCEEDS\_MAXIMUM** = ``"code size to deposit exceeds maximum code size"``

#### Defined in

[exceptions.ts:4](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L4)

___

### CODESTORE\_OUT\_OF\_GAS

• **CODESTORE\_OUT\_OF\_GAS** = ``"code store out of gas"``

#### Defined in

[exceptions.ts:3](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L3)

___

### CREATE\_COLLISION

• **CREATE\_COLLISION** = ``"create collision"``

#### Defined in

[exceptions.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L13)

___

### INITCODE\_SIZE\_VIOLATION

• **INITCODE\_SIZE\_VIOLATION** = ``"initcode exceeds max initcode size"``

#### Defined in

[exceptions.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L23)

___

### INSUFFICIENT\_BALANCE

• **INSUFFICIENT\_BALANCE** = ``"insufficient balance"``

#### Defined in

[exceptions.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L17)

___

### INTERNAL\_ERROR

• **INTERNAL\_ERROR** = ``"internal error"``

#### Defined in

[exceptions.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L12)

___

### INVALID\_BEGINSUB

• **INVALID\_BEGINSUB** = ``"invalid BEGINSUB"``

#### Defined in

[exceptions.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L18)

___

### INVALID\_BYTECODE\_RESULT

• **INVALID\_BYTECODE\_RESULT** = ``"invalid bytecode deployed"``

#### Defined in

[exceptions.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L21)

___

### INVALID\_COMMITMENT

• **INVALID\_COMMITMENT** = ``"kzg commitment does not match versioned hash"``

#### Defined in

[exceptions.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L37)

___

### INVALID\_EOF\_FORMAT

• **INVALID\_EOF\_FORMAT** = ``"invalid EOF format"``

#### Defined in

[exceptions.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L22)

___

### INVALID\_JUMP

• **INVALID\_JUMP** = ``"invalid JUMP"``

#### Defined in

[exceptions.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L7)

___

### INVALID\_JUMPSUB

• **INVALID\_JUMPSUB** = ``"invalid JUMPSUB"``

#### Defined in

[exceptions.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L20)

___

### INVALID\_OPCODE

• **INVALID\_OPCODE** = ``"invalid opcode"``

#### Defined in

[exceptions.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L8)

___

### INVALID\_RETURNSUB

• **INVALID\_RETURNSUB** = ``"invalid RETURNSUB"``

#### Defined in

[exceptions.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L19)

___

### OUT\_OF\_GAS

• **OUT\_OF\_GAS** = ``"out of gas"``

#### Defined in

[exceptions.ts:2](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L2)

___

### OUT\_OF\_RANGE

• **OUT\_OF\_RANGE** = ``"value out of range"``

#### Defined in

[exceptions.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L9)

___

### POINT\_GREATER\_THAN\_BLS\_MODULUS

• **POINT\_GREATER\_THAN\_BLS\_MODULUS** = ``"point greater than BLS modulus"``

#### Defined in

[exceptions.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L36)

___

### REFUND\_EXHAUSTED

• **REFUND\_EXHAUSTED** = ``"refund exhausted"``

#### Defined in

[exceptions.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L15)

___

### REVERT

• **REVERT** = ``"revert"``

#### Defined in

[exceptions.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L10)

___

### STACK\_OVERFLOW

• **STACK\_OVERFLOW** = ``"stack overflow"``

#### Defined in

[exceptions.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L6)

___

### STACK\_UNDERFLOW

• **STACK\_UNDERFLOW** = ``"stack underflow"``

#### Defined in

[exceptions.ts:5](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L5)

___

### STATIC\_STATE\_CHANGE

• **STATIC\_STATE\_CHANGE** = ``"static state change"``

#### Defined in

[exceptions.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L11)

___

### STOP

• **STOP** = ``"stop"``

#### Defined in

[exceptions.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L14)

___

### VALUE\_OVERFLOW

• **VALUE\_OVERFLOW** = ``"value overflow"``

#### Defined in

[exceptions.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/exceptions.ts#L16)
