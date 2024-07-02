// Constants
export const FORMAT = 0xef
export const MAGIC = 0x00
export const VERSION = 0x01

export const MIN_HEADER_SIZE = 15

export const KIND_TYPE = 0x01
export const KIND_CODE = 0x02
export const KIND_CONTAINER = 0x03
export const KIND_DATA = 0x04
export const TERMINATOR = 0x00

export const TYPE_MIN = 0x0004
export const TYPE_MAX = 0x1000
export const TYPE_DIVISOR = 4

export const CODE_MIN = 0x0001

export const CODE_SIZE_MIN = 1

export const CONTAINER_MIN = 0x0001
export const CONTAINER_MAX = 0x00ff

export const CONTAINER_SIZE_MIN = 1

export const INPUTS_MAX = 0x7f
export const OUTPUTS_MAX = 0x80
export const MAX_STACK_HEIGHT = 0x03ff
