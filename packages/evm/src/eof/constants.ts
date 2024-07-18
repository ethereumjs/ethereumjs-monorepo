// Constants, which are taken from https://eips.ethereum.org/EIPS/eip-3540

// The "starting bytes" of an EOF contract
export const FORMAT = 0xef
export const MAGIC = 0x00
export const VERSION = 0x01

// The min/max sizes of valid headers
export const MIN_HEADER_SIZE = 15 // This min size is used to invalidate an invalid container quickly
export const MAX_HEADER_SIZE = 49152 // Max initcode size, EIP 3860

export const KIND_TYPE = 0x01 // The type byte of the types section
export const KIND_CODE = 0x02 // The type byte of the code section
export const KIND_CONTAINER = 0x03 // The type byte of the container section (this is the only optional section in the header)
export const KIND_DATA = 0x04 // The type byte of the data section
export const TERMINATOR = 0x00 // The terminator byte of the header

export const TYPE_MIN = 0x0004 // The minimum size of the types section
export const TYPE_MAX = 0x1000 // The maximum size of the types section
export const TYPE_DIVISOR = 4 // The divisor of types: the type section size should be a multiple of this

export const CODE_MIN = 0x0001 // The minimum size of the code section

export const CODE_SIZE_MIN = 1 // The minimum size of a code section in the body (the actual code)

export const CONTAINER_MIN = 0x0001 // The minimum size of the container section
export const CONTAINER_MAX = 0x0100 // The maximum size of the container section

export const CONTAINER_SIZE_MIN = 1 // The minimum size of a container in the body

// Constants regarding the type section in the body of the container
export const INPUTS_MAX = 0x7f // The maximum amounts of inputs to a code section in the body
export const OUTPUTS_MAX = 0x80 // The maximum amounts of outputs of a code section in the body
// Note: 0x80 is a special amount of outputs, this marks the code section as "terminating".
// A terminating section will exit the current call frame, such as RETURN / STOP opcodes. It will not RETF to another code section
export const MAX_STACK_HEIGHT = 0x03ff // The maximum stack height of a code section (this enforces that the stack of this section cannot overflow)
