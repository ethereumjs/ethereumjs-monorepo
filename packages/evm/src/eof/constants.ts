// Constants, which are taken from https://eips.ethereum.org/EIPS/eip-3540

// The "starting bytes" of an EOF contract
export const FORMAT = 0xef
export const MAGIC = 0x00
export const VERSION = 0x01

// The min/max sizes of valid headers
export const MIN_HEADER_SIZE = 15 // Min size used to invalidate an invalid container quickly
export const MAX_HEADER_SIZE = 49152 // Max initcode size, EIP 3860

export const KIND_TYPE = 0x01 // Type byte of types section
export const KIND_CODE = 0x02 // Type byte of code section
export const KIND_CONTAINER = 0x03 // Type byte of container section (the only optional section in the header)
export const KIND_DATA = 0x04 // Type byte of  data section
export const TERMINATOR = 0x00 // Terminator byte of header

export const TYPE_MIN = 0x0004 // Minimum size of types section
export const TYPE_MAX = 0x1000 // Maximum size of types section
export const TYPE_DIVISOR = 4 // Divisor of types: the type section size should be a multiple of this

export const CODE_MIN = 0x0001 // Minimum size of code section

export const CODE_SIZE_MIN = 1 // Minimum size of a code section in the body (the actual code)

export const CONTAINER_MIN = 0x0001 // Minimum size of container section
export const CONTAINER_MAX = 0x0100 // Maximum size of container section

export const CONTAINER_SIZE_MIN = 1 // Minimum size of a container in the body

// Constants regarding the type section in the body of the container
export const INPUTS_MAX = 0x7f // Max inputs to a code section in the body
export const OUTPUTS_MAX = 0x80 // Max outputs of a code section in the body
// Note: 0x80 special amount, marks the code section as "terminating"
// A terminating section will exit the current call frame, such as RETURN / STOP opcodes. It will not RETF to another code section
export const MAX_STACK_HEIGHT = 0x03ff // Maximum stack height of a code section (enforces that the stack of this section cannot overflow)
