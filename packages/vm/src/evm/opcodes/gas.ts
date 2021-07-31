import { addressToBuffer, divCeil, subMemUsage } from '.'
import { Address, BN } from '../../../../util/dist'
import { RunState } from '../interpreter'
import { accessAddressEIP2929 } from './EIP2929'
import { DynamicGasHandler } from './functions'
import Common from '@ethereumjs/common'

/**
 * This file returns the dynamic parts of opcodes which have dynamic gas
 * These are not pure functions: some edit the size of the memory
 * These functions are therefore not read-only
 */

export const dynamicGasHandlers: Map<number, DynamicGasHandler> = new Map([
  [
    /* SHA3 */
    0x20,
    function (runState: RunState, common: Common): BN {
      const [offset, length] = runState.stack.peek(2)
      const gas = subMemUsage(runState, offset, length, common)
      gas.iadd(
        new BN(common.param('gasPrices', 'sha3Word')).imul(divCeil(length, new BN(32)))
      )
      return gas
    },
  ],
  [
    /* BALANCE */
    0x31,
    function (runState: RunState, common: Common): BN {
      const addressBN = runState.stack.peek()[0]
      const address = new Address(addressToBuffer(addressBN))
      return accessAddressEIP2929(runState, address, common)
    },
  ],
  [
    /* CALLDATACOPY */
    0x37,
    function (runState: RunState, common: Common): BN {
      const [memOffset /*dataOffset*/, , dataLength] = runState.stack.popN(3)

      const gas = subMemUsage(runState, memOffset, dataLength, common)
      if (!dataLength.eqn(0)) {
        gas.iadd(
          new BN(common.param('gasPrices', 'copy')).imul(divCeil(dataLength, new BN(32)))
        )
      }
      return gas
    },
  ],
  [
    /* CODECOPY */
    0x39,
    function (runState: RunState, common: Common): BN {
      const [memOffset /*codeOffset*/, , dataLength] = runState.stack.popN(3)

      const gas = subMemUsage(runState, memOffset, dataLength, common)
      if (!dataLength.eqn(0)) {
        gas.iadd(
          new BN(common.param('gasPrices', 'copy')).imul(divCeil(dataLength, new BN(32)))
        )
      }
      return gas
    },
  ],
  [
    /* EXTCODESIZE */
    0x3b,
    function (runState: RunState, common: Common): BN {
      const addressBN = runState.stack.peek()[0]
      const address = new Address(addressToBuffer(addressBN))
      return accessAddressEIP2929(runState, address, common)
    },
  ],
  [
    /* EXTCODECOPY */
    0x3c,
    function (runState: RunState, common: Common): BN {
      const [addressBN, memOffset /*codeOffset*/, , dataLength] = runState.stack.popN(4)

      const gas = subMemUsage(runState, memOffset, dataLength, common)
      const address = new Address(addressToBuffer(addressBN))
      gas.iadd(accessAddressEIP2929(runState, address, common))

      if (!dataLength.eqn(0)) {
        gas.iadd(
          new BN(common.param('gasPrices', 'copy')).imul(divCeil(dataLength, new BN(32)))
        )
      }

      return gas
    },
  ],
  [
    /* RETURNDATACOPY */
    0x3e,
    function (runState: RunState, common: Common): BN {
      const [memOffset /*returnDataOffset*/, , dataLength] = runState.stack.popN(3)

      const gas = subMemUsage(runState, memOffset, dataLength, common)

      if (!dataLength.eqn(0)) {
        gas.iadd(
          new BN(common.param('gasPrices', 'copy')).mul(divCeil(dataLength, new BN(32)))
        )
      }
      return gas
    },
  ],
  [
    /* EXTCODEHASH */
    0x3f,
    function (runState: RunState, common: Common): BN {
      const addressBN = runState.stack.pop()
      const address = new Address(addressToBuffer(addressBN))
      return accessAddressEIP2929(runState, address, common)
    },
  ],
  [
    /* MLOAD */
    0x51,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* MSTORE */
    0x52,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* MSTORE8 */
    0x53,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* SLOAD */
    0x54,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* SSTORE */
    0x55,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* LOG */
    0xa0,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* CREATE */
    0xf0,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* CALL */
    0xf1,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* CALLCODE */
    0xf2,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* RETURN */
    0xf3,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* DELEGATECALL */
    0xf4,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* CREATE2 */
    0xf5,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* STATICCALL */
    0xfa,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* REVERT */
    0xfd,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
  [
    /* SELFDESTRUCT */
    0xff,
    function (runState: RunState, common: Common): BN {
      return new BN(0)
    },
  ],
])

// Set the range [0xa0, 0xa4] to the LOG handler
const logDynamicFunc = dynamicGasHandlers.get(0xa0)!
for (let i = 0xa1; i <= 0xa4; i++) {
  dynamicGasHandlers.set(i, logDynamicFunc)
}
