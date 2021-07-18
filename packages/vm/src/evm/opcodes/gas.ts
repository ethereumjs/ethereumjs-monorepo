import { BN } from '../../../../util/dist'
import { RunState } from '../interpreter'
import { DynamicGasHandler } from './functions'

export const dynamicGasHandlers: Map<number, DynamicGasHandler> = new Map([
  [
    /* SHA3 */
    0x20,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* BALANCE */
    0x31,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* CALLDATACOPY */
    0x37,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* CODECOPY */
    0x39,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* EXTCODESIZE */
    0x3b,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* EXTCODECOPY */
    0x3c,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* RETURNDATACOPY */
    0x3e,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* EXTCODEHASH */
    0x3f,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* MLOAD */
    0x51,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* MSTORE */
    0x52,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* MSTORE8 */
    0x53,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* SLOAD */
    0x54,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* SSTORE */
    0x55,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* LOG */
    0xa0,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* CREATE */
    0xf0,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* CALL */
    0xf1,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* CALLCODE */
    0xf2,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* RETURN */
    0xf3,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* DELEGATECALL */
    0xf4,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* CREATE2 */
    0xf5,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* STATICCALL */
    0xfa,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* REVERT */
    0xfd,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
  [
    /* SELFDESTRUCT */
    0xff,
    function (runState: RunState): BN {
      return new BN(0)
    },
  ],
])

// Set the range [0xa0, 0xa4] to the LOG handler
const logDynamicFunc = dynamicGasHandlers.get(0xa0)!
for (let i = 0xa1; i <= 0xa4; i++) {
  dynamicGasHandlers.set(i, logDynamicFunc)
}
