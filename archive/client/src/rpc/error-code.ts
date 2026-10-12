//  Error code from JSON-RPC 2.0 spec
//  reference: http://www.jsonrpc.org/specification#error_object
export const PARSE_ERROR = -32700
export const INVALID_REQUEST = -32600
export const METHOD_NOT_FOUND = -32601
export const INVALID_PARAMS = -32602
export const INTERNAL_ERROR = -32603
export const TOO_LARGE_REQUEST = -38004
export const UNSUPPORTED_FORK = -38005
export const UNKNOWN_PAYLOAD = -32001
export const INVALID_FORKCHOICE_STATE = -38002
export const INVALID_HEX_STRING = -32000

export const validEngineCodes = [
  PARSE_ERROR,
  INVALID_REQUEST,
  METHOD_NOT_FOUND,
  INVALID_PARAMS,
  INTERNAL_ERROR,
  TOO_LARGE_REQUEST,
  UNSUPPORTED_FORK,
  UNKNOWN_PAYLOAD,
]

// Errors for the ETH protocol
export const INVALID_BLOCK = -39001
