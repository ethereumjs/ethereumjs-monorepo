import Common from 'ethereumjs-common'

export interface Opcode {
  name: string
  fee: number
  isAsync: boolean
}

export interface OpcodeList {
  [code: number]: Opcode
}

const opcodes: OpcodeList = {
  // 0x0 range - arithmetic ops
  // name, baseCost, async
  0x00: { name: 'STOP', fee: 0, isAsync: false },
  0x01: { name: 'ADD', fee: 3, isAsync: false },
  0x02: { name: 'MUL', fee: 5, isAsync: false },
  0x03: { name: 'SUB', fee: 3, isAsync: false },
  0x04: { name: 'DIV', fee: 5, isAsync: false },
  0x05: { name: 'SDIV', fee: 5, isAsync: false },
  0x06: { name: 'MOD', fee: 5, isAsync: false },
  0x07: { name: 'SMOD', fee: 5, isAsync: false },
  0x08: { name: 'ADDMOD', fee: 8, isAsync: false },
  0x09: { name: 'MULMOD', fee: 8, isAsync: false },
  0x0a: { name: 'EXP', fee: 10, isAsync: false },
  0x0b: { name: 'SIGNEXTEND', fee: 5, isAsync: false },

  // 0x10 range - bit ops
  0x10: { name: 'LT', fee: 3, isAsync: false },
  0x11: { name: 'GT', fee: 3, isAsync: false },
  0x12: { name: 'SLT', fee: 3, isAsync: false },
  0x13: { name: 'SGT', fee: 3, isAsync: false },
  0x14: { name: 'EQ', fee: 3, isAsync: false },
  0x15: { name: 'ISZERO', fee: 3, isAsync: false },
  0x16: { name: 'AND', fee: 3, isAsync: false },
  0x17: { name: 'OR', fee: 3, isAsync: false },
  0x18: { name: 'XOR', fee: 3, isAsync: false },
  0x19: { name: 'NOT', fee: 3, isAsync: false },
  0x1a: { name: 'BYTE', fee: 3, isAsync: false },
  0x1b: { name: 'SHL', fee: 3, isAsync: false },
  0x1c: { name: 'SHR', fee: 3, isAsync: false },
  0x1d: { name: 'SAR', fee: 3, isAsync: false },

  // 0x20 range - crypto
  0x20: { name: 'SHA3', fee: 30, isAsync: false },

  // 0x30 range - closure state
  0x30: { name: 'ADDRESS', fee: 2, isAsync: true },
  0x31: { name: 'BALANCE', fee: 400, isAsync: true },
  0x32: { name: 'ORIGIN', fee: 2, isAsync: true },
  0x33: { name: 'CALLER', fee: 2, isAsync: true },
  0x34: { name: 'CALLVALUE', fee: 2, isAsync: true },
  0x35: { name: 'CALLDATALOAD', fee: 3, isAsync: true },
  0x36: { name: 'CALLDATASIZE', fee: 2, isAsync: true },
  0x37: { name: 'CALLDATACOPY', fee: 3, isAsync: true },
  0x38: { name: 'CODESIZE', fee: 2, isAsync: false },
  0x39: { name: 'CODECOPY', fee: 3, isAsync: false },
  0x3a: { name: 'GASPRICE', fee: 2, isAsync: false },
  0x3b: { name: 'EXTCODESIZE', fee: 700, isAsync: true },
  0x3c: { name: 'EXTCODECOPY', fee: 700, isAsync: true },
  0x3d: { name: 'RETURNDATASIZE', fee: 2, isAsync: true },
  0x3e: { name: 'RETURNDATACOPY', fee: 3, isAsync: true },
  0x3f: { name: 'EXTCODEHASH', fee: 400, isAsync: true },

  // '0x40' range - block operations
  0x40: { name: 'BLOCKHASH', fee: 20, isAsync: true },
  0x41: { name: 'COINBASE', fee: 2, isAsync: true },
  0x42: { name: 'TIMESTAMP', fee: 2, isAsync: true },
  0x43: { name: 'NUMBER', fee: 2, isAsync: true },
  0x44: { name: 'DIFFICULTY', fee: 2, isAsync: true },
  0x45: { name: 'GASLIMIT', fee: 2, isAsync: true },

  // 0x50 range - 'storage' and execution
  0x50: { name: 'POP', fee: 2, isAsync: false },
  0x51: { name: 'MLOAD', fee: 3, isAsync: false },
  0x52: { name: 'MSTORE', fee: 3, isAsync: false },
  0x53: { name: 'MSTORE8', fee: 3, isAsync: false },
  0x54: { name: 'SLOAD', fee: 200, isAsync: true },
  0x55: { name: 'SSTORE', fee: 0, isAsync: true },
  0x56: { name: 'JUMP', fee: 8, isAsync: false },
  0x57: { name: 'JUMPI', fee: 10, isAsync: false },
  0x58: { name: 'PC', fee: 2, isAsync: false },
  0x59: { name: 'MSIZE', fee: 2, isAsync: false },
  0x5a: { name: 'GAS', fee: 2, isAsync: false },
  0x5b: { name: 'JUMPDEST', fee: 1, isAsync: false },

  // 0x60, range
  0x60: { name: 'PUSH', fee: 3, isAsync: false },
  0x61: { name: 'PUSH', fee: 3, isAsync: false },
  0x62: { name: 'PUSH', fee: 3, isAsync: false },
  0x63: { name: 'PUSH', fee: 3, isAsync: false },
  0x64: { name: 'PUSH', fee: 3, isAsync: false },
  0x65: { name: 'PUSH', fee: 3, isAsync: false },
  0x66: { name: 'PUSH', fee: 3, isAsync: false },
  0x67: { name: 'PUSH', fee: 3, isAsync: false },
  0x68: { name: 'PUSH', fee: 3, isAsync: false },
  0x69: { name: 'PUSH', fee: 3, isAsync: false },
  0x6a: { name: 'PUSH', fee: 3, isAsync: false },
  0x6b: { name: 'PUSH', fee: 3, isAsync: false },
  0x6c: { name: 'PUSH', fee: 3, isAsync: false },
  0x6d: { name: 'PUSH', fee: 3, isAsync: false },
  0x6e: { name: 'PUSH', fee: 3, isAsync: false },
  0x6f: { name: 'PUSH', fee: 3, isAsync: false },
  0x70: { name: 'PUSH', fee: 3, isAsync: false },
  0x71: { name: 'PUSH', fee: 3, isAsync: false },
  0x72: { name: 'PUSH', fee: 3, isAsync: false },
  0x73: { name: 'PUSH', fee: 3, isAsync: false },
  0x74: { name: 'PUSH', fee: 3, isAsync: false },
  0x75: { name: 'PUSH', fee: 3, isAsync: false },
  0x76: { name: 'PUSH', fee: 3, isAsync: false },
  0x77: { name: 'PUSH', fee: 3, isAsync: false },
  0x78: { name: 'PUSH', fee: 3, isAsync: false },
  0x79: { name: 'PUSH', fee: 3, isAsync: false },
  0x7a: { name: 'PUSH', fee: 3, isAsync: false },
  0x7b: { name: 'PUSH', fee: 3, isAsync: false },
  0x7c: { name: 'PUSH', fee: 3, isAsync: false },
  0x7d: { name: 'PUSH', fee: 3, isAsync: false },
  0x7e: { name: 'PUSH', fee: 3, isAsync: false },
  0x7f: { name: 'PUSH', fee: 3, isAsync: false },

  0x80: { name: 'DUP', fee: 3, isAsync: false },
  0x81: { name: 'DUP', fee: 3, isAsync: false },
  0x82: { name: 'DUP', fee: 3, isAsync: false },
  0x83: { name: 'DUP', fee: 3, isAsync: false },
  0x84: { name: 'DUP', fee: 3, isAsync: false },
  0x85: { name: 'DUP', fee: 3, isAsync: false },
  0x86: { name: 'DUP', fee: 3, isAsync: false },
  0x87: { name: 'DUP', fee: 3, isAsync: false },
  0x88: { name: 'DUP', fee: 3, isAsync: false },
  0x89: { name: 'DUP', fee: 3, isAsync: false },
  0x8a: { name: 'DUP', fee: 3, isAsync: false },
  0x8b: { name: 'DUP', fee: 3, isAsync: false },
  0x8c: { name: 'DUP', fee: 3, isAsync: false },
  0x8d: { name: 'DUP', fee: 3, isAsync: false },
  0x8e: { name: 'DUP', fee: 3, isAsync: false },
  0x8f: { name: 'DUP', fee: 3, isAsync: false },

  0x90: { name: 'SWAP', fee: 3, isAsync: false },
  0x91: { name: 'SWAP', fee: 3, isAsync: false },
  0x92: { name: 'SWAP', fee: 3, isAsync: false },
  0x93: { name: 'SWAP', fee: 3, isAsync: false },
  0x94: { name: 'SWAP', fee: 3, isAsync: false },
  0x95: { name: 'SWAP', fee: 3, isAsync: false },
  0x96: { name: 'SWAP', fee: 3, isAsync: false },
  0x97: { name: 'SWAP', fee: 3, isAsync: false },
  0x98: { name: 'SWAP', fee: 3, isAsync: false },
  0x99: { name: 'SWAP', fee: 3, isAsync: false },
  0x9a: { name: 'SWAP', fee: 3, isAsync: false },
  0x9b: { name: 'SWAP', fee: 3, isAsync: false },
  0x9c: { name: 'SWAP', fee: 3, isAsync: false },
  0x9d: { name: 'SWAP', fee: 3, isAsync: false },
  0x9e: { name: 'SWAP', fee: 3, isAsync: false },
  0x9f: { name: 'SWAP', fee: 3, isAsync: false },

  0xa0: { name: 'LOG', fee: 375, isAsync: false },
  0xa1: { name: 'LOG', fee: 375, isAsync: false },
  0xa2: { name: 'LOG', fee: 375, isAsync: false },
  0xa3: { name: 'LOG', fee: 375, isAsync: false },
  0xa4: { name: 'LOG', fee: 375, isAsync: false },

  // '0xf0' range - closures
  0xf0: { name: 'CREATE', fee: 32000, isAsync: true },
  0xf1: { name: 'CALL', fee: 700, isAsync: true },
  0xf2: { name: 'CALLCODE', fee: 700, isAsync: true },
  0xf3: { name: 'RETURN', fee: 0, isAsync: false },
  0xf4: { name: 'DELEGATECALL', fee: 700, isAsync: true },
  0xf5: { name: 'CREATE2', fee: 32000, isAsync: true },
  0xfa: { name: 'STATICCALL', fee: 700, isAsync: true },
  0xfd: { name: 'REVERT', fee: 0, isAsync: false },

  // '0x70', range - other
  0xfe: { name: 'INVALID', fee: 0, isAsync: false },
  0xff: { name: 'SELFDESTRUCT', fee: 5000, isAsync: true },
}

const istanbulOpcodes: OpcodeList = {
  0x31: { name: 'BALANCE', fee: 700, isAsync: true },
  0x3f: { name: 'EXTCODEHASH', fee: 700, isAsync: true },
  0x46: { name: 'CHAINID', fee: 2, isAsync: false },
  0x47: { name: 'SELFBALANCE', fee: 5, isAsync: false },
  0x54: { name: 'SLOAD', fee: 800, isAsync: true },
}

export function getOpcodesForHF(common: Common) {
  if (common.gteHardfork('istanbul')) {
    return { ...opcodes, ...istanbulOpcodes }
  } else {
    return { ...opcodes }
  }
}
