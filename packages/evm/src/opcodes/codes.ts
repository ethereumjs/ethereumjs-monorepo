import { Hardfork } from "@ethereumjs/common";

import { handlers } from "./functions.js";
import { dynamicGasHandlers } from "./gas.js";
import { getFullname } from "./util.js";

import type { Common } from "@ethereumjs/common";
import type { CustomOpcode } from "../types.js";
import type { OpHandler } from "./functions.js";
import type { AsyncDynamicGasHandler, SyncDynamicGasHandler } from "./gas.js";

export class Opcode {
  readonly code: number;
  readonly name: string;
  readonly fullName: string;
  readonly fee: number;
  readonly feeBigInt: bigint;
  readonly isAsync: boolean;
  readonly dynamicGas: boolean;
  readonly isInvalid: boolean;

  constructor({
    code,
    name,
    fullName,
    fee,
    isAsync,
    dynamicGas,
  }: {
    code: number;
    name: string;
    fullName: string;
    fee: number;
    isAsync: boolean;
    dynamicGas: boolean;
  }) {
    this.code = code;
    this.name = name;
    this.fullName = fullName;
    this.fee = fee;
    this.feeBigInt = BigInt(fee);
    this.isAsync = isAsync;
    this.dynamicGas = dynamicGas;
    this.isInvalid = this.name === "INVALID";

    // Opcode isn't subject to change, thus all further modifications are prevented.
    Object.freeze(this);
  }
}

export type OpcodeList = Map<number, Opcode>;
type OpcodeEntry = {
  [key: number]: { name: string; isAsync: boolean; dynamicGas: boolean };
};
type OpcodeEntryFee = OpcodeEntry & { [key: number]: { fee: number } };

// Default: sync and no dynamic gas
const defaultOp = (name: string) => {
  return { name, isAsync: false, dynamicGas: false };
};
const dynamicGasOp = (name: string) => {
  return { name, isAsync: false, dynamicGas: true };
};
const asyncOp = (name: string) => {
  return { name, isAsync: true, dynamicGas: false };
};
const asyncAndDynamicGasOp = (name: string) => {
  return { name, isAsync: true, dynamicGas: true };
};

// Base opcode list. The opcode list is extended in future hardforks
const opcodes: OpcodeEntry = {
  // 0x0 range - arithmetic ops
  // name, async
  0: defaultOp("STOP"),
  1: defaultOp("ADD"),
  2: defaultOp("MUL"),
  3: defaultOp("SUB"),
  4: defaultOp("DIV"),
  5: defaultOp("SDIV"),
  6: defaultOp("MOD"),
  7: defaultOp("SMOD"),
  8: defaultOp("ADDMOD"),
  9: defaultOp("MULMOD"),
  10: dynamicGasOp("EXP"),
  11: defaultOp("SIGNEXTEND"),

  // 0x10 range - bit ops
  16: defaultOp("LT"),
  17: defaultOp("GT"),
  18: defaultOp("SLT"),
  19: defaultOp("SGT"),
  20: defaultOp("EQ"),
  21: defaultOp("ISZERO"),
  22: defaultOp("AND"),
  23: defaultOp("OR"),
  24: defaultOp("XOR"),
  25: defaultOp("NOT"),
  26: defaultOp("BYTE"),

  // 0x20 range - crypto
  32: dynamicGasOp("KECCAK256"),

  // 0x30 range - closure state
  48: asyncOp("ADDRESS"),
  49: asyncAndDynamicGasOp("BALANCE"),
  50: asyncOp("ORIGIN"),
  51: asyncOp("CALLER"),
  52: asyncOp("CALLVALUE"),
  53: asyncOp("CALLDATALOAD"),
  54: asyncOp("CALLDATASIZE"),
  55: asyncAndDynamicGasOp("CALLDATACOPY"),
  56: defaultOp("CODESIZE"),
  57: dynamicGasOp("CODECOPY"),
  58: defaultOp("GASPRICE"),
  59: asyncAndDynamicGasOp("EXTCODESIZE"),
  60: asyncAndDynamicGasOp("EXTCODECOPY"),

  // '0x40' range - block operations
  64: asyncOp("BLOCKHASH"),
  65: asyncOp("COINBASE"),
  66: asyncOp("TIMESTAMP"),
  67: asyncOp("NUMBER"),
  68: asyncOp("DIFFICULTY"),
  69: asyncOp("GASLIMIT"),

  // 0x50 range - 'storage' and execution
  80: defaultOp("POP"),
  81: dynamicGasOp("MLOAD"),
  82: dynamicGasOp("MSTORE"),
  83: dynamicGasOp("MSTORE8"),
  84: asyncAndDynamicGasOp("SLOAD"),
  85: asyncAndDynamicGasOp("SSTORE"),
  86: defaultOp("JUMP"),
  87: defaultOp("JUMPI"),
  88: defaultOp("PC"),
  89: defaultOp("MSIZE"),
  90: defaultOp("GAS"),
  91: defaultOp("JUMPDEST"),

  // 0x60, range
  96: defaultOp("PUSH"),
  97: defaultOp("PUSH"),
  98: defaultOp("PUSH"),
  99: defaultOp("PUSH"),
  100: defaultOp("PUSH"),
  101: defaultOp("PUSH"),
  102: defaultOp("PUSH"),
  103: defaultOp("PUSH"),
  104: defaultOp("PUSH"),
  105: defaultOp("PUSH"),
  106: defaultOp("PUSH"),
  107: defaultOp("PUSH"),
  108: defaultOp("PUSH"),
  109: defaultOp("PUSH"),
  110: defaultOp("PUSH"),
  111: defaultOp("PUSH"),
  112: defaultOp("PUSH"),
  113: defaultOp("PUSH"),
  114: defaultOp("PUSH"),
  115: defaultOp("PUSH"),
  116: defaultOp("PUSH"),
  117: defaultOp("PUSH"),
  118: defaultOp("PUSH"),
  119: defaultOp("PUSH"),
  120: defaultOp("PUSH"),
  121: defaultOp("PUSH"),
  122: defaultOp("PUSH"),
  123: defaultOp("PUSH"),
  124: defaultOp("PUSH"),
  125: defaultOp("PUSH"),
  126: defaultOp("PUSH"),
  127: defaultOp("PUSH"),

  128: defaultOp("DUP"),
  129: defaultOp("DUP"),
  130: defaultOp("DUP"),
  131: defaultOp("DUP"),
  132: defaultOp("DUP"),
  133: defaultOp("DUP"),
  134: defaultOp("DUP"),
  135: defaultOp("DUP"),
  136: defaultOp("DUP"),
  137: defaultOp("DUP"),
  138: defaultOp("DUP"),
  139: defaultOp("DUP"),
  140: defaultOp("DUP"),
  141: defaultOp("DUP"),
  142: defaultOp("DUP"),
  143: defaultOp("DUP"),

  144: defaultOp("SWAP"),
  145: defaultOp("SWAP"),
  146: defaultOp("SWAP"),
  147: defaultOp("SWAP"),
  148: defaultOp("SWAP"),
  149: defaultOp("SWAP"),
  150: defaultOp("SWAP"),
  151: defaultOp("SWAP"),
  152: defaultOp("SWAP"),
  153: defaultOp("SWAP"),
  154: defaultOp("SWAP"),
  155: defaultOp("SWAP"),
  156: defaultOp("SWAP"),
  157: defaultOp("SWAP"),
  158: defaultOp("SWAP"),
  159: defaultOp("SWAP"),

  160: dynamicGasOp("LOG"),
  161: dynamicGasOp("LOG"),
  162: dynamicGasOp("LOG"),
  163: dynamicGasOp("LOG"),
  164: dynamicGasOp("LOG"),

  // '0xf0' range - closures
  240: asyncAndDynamicGasOp("CREATE"),
  241: asyncAndDynamicGasOp("CALL"),
  242: asyncAndDynamicGasOp("CALLCODE"),
  243: dynamicGasOp("RETURN"),

  // '0x70', range - other
  254: defaultOp("INVALID"),
  255: asyncAndDynamicGasOp("SELFDESTRUCT"),
};

// Array of hard forks in order. These changes are repeatedly applied to `opcodes` until the hard fork is in the future based upon the common
// TODO: All gas price changes should be moved to common
// If the base gas cost of any of the operations change, then these should also be added to this list.
// If there are context variables changed (such as "warm slot reads") which are not the base gas fees,
// Then this does not have to be added.
const hardforkOpcodes: { hardfork: Hardfork; opcodes: OpcodeEntry }[] = [
  {
    hardfork: Hardfork.Homestead,
    opcodes: {
      244: asyncAndDynamicGasOp("DELEGATECALL"), // EIP-7
    },
  },
  {
    hardfork: Hardfork.TangerineWhistle,
    opcodes: {
      84: asyncAndDynamicGasOp("SLOAD"),
      241: asyncAndDynamicGasOp("CALL"),
      242: asyncAndDynamicGasOp("CALLCODE"),
      59: asyncAndDynamicGasOp("EXTCODESIZE"),
      60: asyncAndDynamicGasOp("EXTCODECOPY"),
      244: asyncAndDynamicGasOp("DELEGATECALL"), // EIP-7
      255: asyncAndDynamicGasOp("SELFDESTRUCT"),
      49: asyncAndDynamicGasOp("BALANCE"),
    },
  },
  {
    hardfork: Hardfork.Byzantium,
    opcodes: {
      253: dynamicGasOp("REVERT"), // EIP-140
      250: asyncAndDynamicGasOp("STATICCALL"), // EIP-214
      61: asyncOp("RETURNDATASIZE"), // EIP-211
      62: asyncAndDynamicGasOp("RETURNDATACOPY"), // EIP-211
    },
  },
  {
    hardfork: Hardfork.Constantinople,
    opcodes: {
      27: defaultOp("SHL"), // EIP-145
      28: defaultOp("SHR"), // EIP-145
      29: defaultOp("SAR"), // EIP-145
      63: asyncAndDynamicGasOp("EXTCODEHASH"), // EIP-1052
      245: asyncAndDynamicGasOp("CREATE2"), // EIP-1014
    },
  },
  {
    hardfork: Hardfork.Istanbul,
    opcodes: {
      70: defaultOp("CHAINID"), // EIP-1344
      71: defaultOp("SELFBALANCE"), // EIP-1884
    },
  },
  {
    hardfork: Hardfork.Paris,
    opcodes: {
      68: asyncOp("PREVRANDAO"), // EIP-4399
    },
  },
];

const eipOpcodes: { eip: number; opcodes: OpcodeEntry }[] = [
  {
    eip: 663,
    opcodes: {
      230: defaultOp("DUPN"),
      231: defaultOp("SWAPN"),
      232: defaultOp("EXCHANGE"),
    },
  },
  {
    eip: 1153,
    opcodes: {
      92: defaultOp("TLOAD"),
      93: defaultOp("TSTORE"),
    },
  },
  {
    eip: 3198,
    opcodes: {
      72: defaultOp("BASEFEE"),
    },
  },
  {
    eip: 3855,
    opcodes: {
      95: defaultOp("PUSH0"),
    },
  },
  {
    eip: 4200,
    opcodes: {
      224: defaultOp("RJUMP"),
      225: defaultOp("RJUMPI"),
      226: defaultOp("RJUMPV"),
    },
  },
  {
    eip: 4750,
    opcodes: {
      227: defaultOp("CALLF"),
      228: defaultOp("RETF"),
    },
  },
  {
    eip: 4844,
    opcodes: {
      73: defaultOp("BLOBHASH"),
    },
  },
  {
    eip: 5656,
    opcodes: {
      94: dynamicGasOp("MCOPY"),
    },
  },
  {
    eip: 6206,
    opcodes: {
      229: defaultOp("JUMPF"),
    },
  },
  {
    eip: 7069,
    opcodes: {
      247: defaultOp("RETURNDATALOAD"),
      248: asyncAndDynamicGasOp("EXTCALL"),
      249: asyncAndDynamicGasOp("EXTDELEGATECALL"),
      251: asyncAndDynamicGasOp("EXTSTATICCALL"),
    },
  },
  {
    eip: 7480,
    opcodes: {
      208: defaultOp("DATALOAD"),
      209: defaultOp("DATALOADN"),
      210: defaultOp("DATASIZE"),
      211: dynamicGasOp("DATACOPY"),
    },
  },
  {
    eip: 7516,
    opcodes: {
      74: defaultOp("BLOBBASEFEE"),
    },
  },
  {
    eip: 7620,
    opcodes: {
      236: asyncAndDynamicGasOp("EOFCREATE"),
      238: asyncAndDynamicGasOp("RETURNCONTRACT"),
    },
  },
];

/**
 * Convert basic opcode info dictionary into complete OpcodeList instance.
 *
 * @param opcodes {Object} Receive basic opcodes info dictionary.
 * @returns {OpcodeList} Complete Opcode list
 */
function createOpcodes(opcodes: OpcodeEntryFee): OpcodeList {
  const result: OpcodeList = new Map();
  for (const [key, value] of Object.entries(opcodes)) {
    const code = Number.parseInt(key, 10);
    if (isNaN(value.fee)) value.fee = 0;
    result.set(
      code,
      new Opcode({
        code,
        fullName: getFullname(code, value.name),
        ...value,
      }),
    );
  }
  return result;
}

type OpcodeContext = {
  dynamicGasHandlers: Map<
    number,
    AsyncDynamicGasHandler | SyncDynamicGasHandler
  >;
  handlers: Map<number, OpHandler>;
  opcodes: OpcodeList;
  opcodeMap: OpcodeMap;
};

export type OpcodeMapEntry = {
  opcodeInfo: Opcode;
  opHandler: OpHandler;
  gasHandler: AsyncDynamicGasHandler | SyncDynamicGasHandler;
};
export type OpcodeMap = OpcodeMapEntry[];

/**
 * Get suitable opcodes for the required hardfork.
 *
 * @param common {Common} Ethereumjs Common metadata object.
 * @param customOpcodes List with custom opcodes (see EVM `customOpcodes` option description).
 * @returns {OpcodeList} Opcodes dictionary object.
 */
export function getOpcodesForHF(
  common: Common,
  customOpcodes?: CustomOpcode[],
): OpcodeContext {
  let opcodeBuilder: any = { ...opcodes };

  const handlersCopy = new Map(handlers);
  const dynamicGasHandlersCopy = new Map(dynamicGasHandlers);

  for (let fork = 0; fork < hardforkOpcodes.length; fork++) {
    if (common.gteHardfork(hardforkOpcodes[fork].hardfork)) {
      opcodeBuilder = { ...opcodeBuilder, ...hardforkOpcodes[fork].opcodes };
    }
  }
  for (const eipOps of eipOpcodes) {
    if (common.isActivatedEIP(eipOps.eip)) {
      opcodeBuilder = { ...opcodeBuilder, ...eipOps.opcodes };
    }
  }

  for (const key in opcodeBuilder) {
    const baseFee = Number(
      common.param(`${opcodeBuilder[key].name.toLowerCase()}Gas`),
    );
    // explicitly verify that we have defined a base fee
    if (baseFee === undefined) {
      throw new Error(`base fee not defined for: ${opcodeBuilder[key].name}`);
    }
    opcodeBuilder[key].fee = baseFee;
  }

  if (customOpcodes) {
    for (const _code of customOpcodes) {
      const code = <any>_code;
      if (code.logicFunction === undefined) {
        delete opcodeBuilder[code.opcode];
        continue;
      }

      // Sanity checks
      if (code.opcodeName === undefined || code.baseFee === undefined) {
        throw new Error(
          `Custom opcode ${code.opcode} does not have the required values: opcodeName and baseFee are required`,
        );
      }
      const entry = {
        [code.opcode]: {
          name: code.opcodeName,
          isAsync: true,
          dynamicGas: code.gasFunction !== undefined,
          fee: code.baseFee,
          feeBigInt: BigInt(code.baseFee),
        },
      };
      opcodeBuilder = { ...opcodeBuilder, ...entry };
      if (code.gasFunction !== undefined) {
        dynamicGasHandlersCopy.set(code.opcode, code.gasFunction);
      }
      // logicFunction is never undefined
      handlersCopy.set(code.opcode, code.logicFunction);
    }
  }

  //const dynamicGasHandlers = dynamicGasHandlersCopy
  //const handlers = handlersCopy
  const ops = createOpcodes(opcodeBuilder);

  const opcodeMap: OpcodeMap = [];

  for (const [opNumber, op] of ops) {
    const dynamicGas = dynamicGasHandlersCopy.get(opNumber)!;
    const handler = handlersCopy.get(opNumber)!;
    opcodeMap[opNumber] = {
      opcodeInfo: op,
      opHandler: handler,
      gasHandler: dynamicGas,
    };
  }

  const invalid = opcodeMap[0xfe];

  for (let i = 0x0; i <= 0xff; i++) {
    if (opcodeMap[i] === undefined) {
      opcodeMap[i] = invalid;
    }
  }

  return {
    dynamicGasHandlers: dynamicGasHandlersCopy,
    handlers: handlersCopy,
    opcodes: ops,
    opcodeMap,
  };
}
