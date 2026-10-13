// Constants from https://eips.ethereum.org/EIPS/eip-3540

/** EOF format byte (`0xEF`). */
export const FORMAT = 0xef
/** EOF magic byte (`0x00`). */
export const MAGIC = 0x00
/** EOF version byte (`0x01`). */
export const VERSION = 0x01

/** Minimum header size for a quick invalid-container check. */
export const MIN_HEADER_SIZE = 15
/** Maximum header size (EIP-3860 max initcode size). */
export const MAX_HEADER_SIZE = 49152

/** Header kind byte for the types section. */
export const KIND_TYPE = 0x01
/** Header kind byte for the code section. */
export const KIND_CODE = 0x02
/** Header kind byte for the optional container section. */
export const KIND_CONTAINER = 0x03
/** Header kind byte for the data section. */
export const KIND_DATA = 0x04
/** Header terminator byte. */
export const TERMINATOR = 0x00

/** Minimum types-section size in bytes. */
export const TYPE_MIN = 0x0004
/** Maximum types-section size in bytes. */
export const TYPE_MAX = 0x1000
/** Types-section size must be a multiple of this value. */
export const TYPE_DIVISOR = 4

/** Minimum number of code sections declared in the header. */
export const CODE_MIN = 0x0001

/** Minimum bytecode length per code section in the body. */
export const CODE_SIZE_MIN = 1

/** Minimum number of subcontainers declared in the header. */
export const CONTAINER_MIN = 0x0001
/** Maximum number of subcontainers declared in the header. */
export const CONTAINER_MAX = 0x0100

/** Minimum raw byte length of a subcontainer in the body. */
export const CONTAINER_SIZE_MIN = 1

/** Maximum stack inputs per code section type entry. */
export const INPUTS_MAX = 0x7f
/** Maximum stack outputs per code section type entry (`0x80` marks terminating sections). */
export const OUTPUTS_MAX = 0x80
/** Maximum declared stack height per code section (EIP-5450). */
export const MAX_STACK_HEIGHT = 0x03ff
