import {
  addressToBuffer,
  divCeil,
  maxCallGas,
  setLengthLeftStorage,
  subMemUsage,
  trap,
  updateSstoreGas,
} from '.'
import { Address, BN } from '../../../../util/dist'
import { ERROR } from '../../exceptions'
import { RunState } from '../interpreter'
import Common from '@ethereumjs/common'
import { updateSstoreGasEIP1283 } from './EIP1283'
import { updateSstoreGasEIP2200 } from './EIP2200'
import { accessAddressEIP2929, accessStorageEIP2929 } from './EIP2929'

/**
 * This file returns the dynamic parts of opcodes which have dynamic gas
 * These are not pure functions: some edit the size of the memory
 * These functions are therefore not read-only
 */

export interface AsyncDynamicGasHandler {
  (runState: RunState, common: Common): Promise<BN>
}

export const dynamicGasHandlers: Map<number, AsyncDynamicGasHandler> = new Map<
  number,
  AsyncDynamicGasHandler
>([
  [
    /* SHA3 */
    0x20,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [offset, length] = runState.stack.peek(2)
      const gas = subMemUsage(runState, offset, length, common)
      gas.iadd(new BN(common.param('gasPrices', 'sha3Word')).imul(divCeil(length, new BN(32))))
      return gas
    },
  ],
  [
    /* BALANCE */
    0x31,
    async function (runState: RunState, common: Common): Promise<BN> {
      const addressBN = runState.stack.peek()[0]
      const address = new Address(addressToBuffer(addressBN))
      return accessAddressEIP2929(runState, address, common)
    },
  ],
  [
    /* CALLDATACOPY */
    0x37,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [memOffset /*dataOffset*/, , dataLength] = runState.stack.peek(3)

      const gas = subMemUsage(runState, memOffset, dataLength, common)
      if (!dataLength.eqn(0)) {
        gas.iadd(new BN(common.param('gasPrices', 'copy')).imul(divCeil(dataLength, new BN(32))))
      }
      return gas
    },
  ],
  [
    /* CODECOPY */
    0x39,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [memOffset /*codeOffset*/, , dataLength] = runState.stack.peek(3)

      const gas = subMemUsage(runState, memOffset, dataLength, common)
      if (!dataLength.eqn(0)) {
        gas.iadd(new BN(common.param('gasPrices', 'copy')).imul(divCeil(dataLength, new BN(32))))
      }
      return gas
    },
  ],
  [
    /* EXTCODESIZE */
    0x3b,
    async function (runState: RunState, common: Common): Promise<BN> {
      const addressBN = runState.stack.peek()[0]
      const address = new Address(addressToBuffer(addressBN))
      return accessAddressEIP2929(runState, address, common)
    },
  ],
  [
    /* EXTCODECOPY */
    0x3c,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [addressBN, memOffset /*codeOffset*/, , dataLength] = runState.stack.peek(4)

      const gas = subMemUsage(runState, memOffset, dataLength, common)
      const address = new Address(addressToBuffer(addressBN))
      gas.iadd(accessAddressEIP2929(runState, address, common))

      if (!dataLength.eqn(0)) {
        gas.iadd(new BN(common.param('gasPrices', 'copy')).imul(divCeil(dataLength, new BN(32))))
      }

      return gas
    },
  ],
  [
    /* RETURNDATACOPY */
    0x3e,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [memOffset /*returnDataOffset*/, , dataLength] = runState.stack.peek(3)

      const gas = subMemUsage(runState, memOffset, dataLength, common)

      if (!dataLength.eqn(0)) {
        gas.iadd(new BN(common.param('gasPrices', 'copy')).mul(divCeil(dataLength, new BN(32))))
      }
      return gas
    },
  ],
  [
    /* EXTCODEHASH */
    0x3f,
    async function (runState: RunState, common: Common): Promise<BN> {
      const addressBN = runState.stack.peek(1)[0]
      const address = new Address(addressToBuffer(addressBN))
      return accessAddressEIP2929(runState, address, common)
    },
  ],
  [
    /* MLOAD */
    0x51,
    async function (runState: RunState, common: Common): Promise<BN> {
      const pos = runState.stack.peek()[0]
      return subMemUsage(runState, pos, new BN(32), common)
    },
  ],
  [
    /* MSTORE */
    0x52,
    async function (runState: RunState, common: Common): Promise<BN> {
      const offset = runState.stack.peek()[0]
      return subMemUsage(runState, offset, new BN(32), common)
    },
  ],
  [
    /* MSTORE8 */
    0x53,
    async function (runState: RunState, common: Common): Promise<BN> {
      const offset = runState.stack.peek()[0]
      return subMemUsage(runState, offset, new BN(1), common)
    },
  ],
  [
    /* SLOAD */
    0x54,
    async function (runState: RunState, common: Common): Promise<BN> {
      const key = runState.stack.peek()[0]
      const keyBuf = key.toArrayLike(Buffer, 'be', 32)

      return accessStorageEIP2929(runState, keyBuf, false, common)
    },
  ],
  [
    /* SSTORE */
    0x55,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [key, val] = runState.stack.peek(2)

      const keyBuf = key.toArrayLike(Buffer, 'be', 32)
      // NOTE: this should be the shortest representation
      let value
      if (val.isZero()) {
        value = Buffer.from([])
      } else {
        value = val.toArrayLike(Buffer, 'be')
      }

      // TODO: Replace getContractStorage with EEI method
      const currentStorage = setLengthLeftStorage(await runState.eei.storageLoad(keyBuf))
      const originalStorage = setLengthLeftStorage(await runState.eei.storageLoad(keyBuf, true))
      let gas: BN
      if (common.hardfork() === 'constantinople') {
        gas = updateSstoreGasEIP1283(
          runState,
          currentStorage,
          originalStorage,
          setLengthLeftStorage(value),
          common
        )
      } else if (common.gteHardfork('istanbul')) {
        gas = updateSstoreGasEIP2200(
          runState,
          currentStorage,
          originalStorage,
          setLengthLeftStorage(value),
          keyBuf,
          common
        )
      } else {
        gas = updateSstoreGas(runState, currentStorage, setLengthLeftStorage(value), keyBuf, common)
      }

      // We have to do this after the Istanbul (EIP2200) checks.
      // Otherwise, we might run out of gas, due to "sentry check" of 2300 gas, if we deduct extra gas first.
      gas.iadd(accessStorageEIP2929(runState, keyBuf, true, common))
      return gas
    },
  ],
  [
    /* LOG */
    0xa0,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [memOffset, memLength] = runState.stack.peek(2)

      const topicsCount = runState.opCode - 0xa0

      const gas = subMemUsage(runState, memOffset, memLength, common)
      gas.iadd(
        new BN(common.param('gasPrices', 'logTopic'))
          .imuln(topicsCount)
          .iadd(memLength.muln(common.param('gasPrices', 'logData')))
      )
      return gas
    },
  ],
  [
    /* CREATE */
    0xf0,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [, /*value*/ offset, length] = runState.stack.peek(3)

      const gas = accessAddressEIP2929(runState, runState.eei.getAddress(), common, false)

      gas.iadd(subMemUsage(runState, offset, length, common))

      let gasLimit = new BN(runState.eei.getGasLeft().isub(gas))
      gasLimit = maxCallGas(gasLimit, gasLimit.clone(), runState, common)

      runState.messageGasLimit = gasLimit

      return gas
    },
  ],
  [
    /* CALL */
    0xf1,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.peek(7)
      const toAddress = new Address(addressToBuffer(toAddr))

      if (runState.eei.isStatic() && !value.isZero()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }
      const gas = subMemUsage(runState, inOffset, inLength, common)
      gas.iadd(subMemUsage(runState, outOffset, outLength, common))
      gas.iadd(accessAddressEIP2929(runState, toAddress, common))

      if (!value.isZero()) {
        gas.iadd(new BN(common.param('gasPrices', 'callValueTransfer')))
      }

      if (common.gteHardfork('spuriousDragon')) {
        // We are at or after Spurious Dragon
        // Call new account gas: account is DEAD and we transfer nonzero value
        if ((await runState.eei.isAccountEmpty(toAddress)) && !value.isZero()) {
          gas.iadd(new BN(common.param('gasPrices', 'callNewAccount')))
        }
      } else if (!(await runState.eei.accountExists(toAddress))) {
        // We are before Spurious Dragon and the account does not exist.
        // Call new account gas: account does not exist (it is not in the state trie, not even as an "empty" account)
        gas.iadd(new BN(common.param('gasPrices', 'callNewAccount')))
      }

      const gasLimit = maxCallGas(
        currentGasLimit,
        runState.eei.getGasLeft().isub(gas),
        runState,
        common
      )
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
        trap(ERROR.OUT_OF_GAS)
      }

      if (!value.isZero()) {
        // TODO: Don't use private attr directly
        runState.eei._gasLeft.iaddn(common.param('gasPrices', 'callStipend'))
        gasLimit.iaddn(common.param('gasPrices', 'callStipend'))
      }

      runState.messageGasLimit = gasLimit

      return gas
    },
  ],
  [
    /* CALLCODE */
    0xf2,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [currentGasLimit, toAddr, value, inOffset, inLength, outOffset, outLength] =
        runState.stack.peek(7)
      const toAddress = new Address(addressToBuffer(toAddr))

      const gas = subMemUsage(runState, inOffset, inLength, common)
      gas.iadd(subMemUsage(runState, outOffset, outLength, common))
      gas.iadd(accessAddressEIP2929(runState, toAddress, common))

      if (!value.isZero()) {
        gas.iadd(new BN(common.param('gasPrices', 'callValueTransfer')))
      }
      const gasLimit = maxCallGas(
        currentGasLimit,
        runState.eei.getGasLeft().isub(gas),
        runState,
        common
      )
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
        trap(ERROR.OUT_OF_GAS)
      }
      if (!value.isZero()) {
        // TODO: Don't use private attr directly
        runState.eei._gasLeft.iaddn(common.param('gasPrices', 'callStipend'))
        gasLimit.iaddn(common.param('gasPrices', 'callStipend'))
      }

      runState.messageGasLimit = gasLimit
      return gas
    },
  ],
  [
    /* RETURN */
    0xf3,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [offset, length] = runState.stack.peek(2)
      return subMemUsage(runState, offset, length, common)
    },
  ],
  [
    /* DELEGATECALL */
    0xf4,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.peek(6)
      const toAddress = new Address(addressToBuffer(toAddr))

      const gas = subMemUsage(runState, inOffset, inLength, common)
      gas.iadd(subMemUsage(runState, outOffset, outLength, common))
      gas.iadd(accessAddressEIP2929(runState, toAddress, common))
      const gasLimit = maxCallGas(
        currentGasLimit,
        runState.eei.getGasLeft().isub(gas),
        runState,
        common
      )
      // note that TangerineWhistle or later this cannot happen (it could have ran out of gas prior to getting here though)
      if (gasLimit.gt(runState.eei.getGasLeft().isub(gas))) {
        trap(ERROR.OUT_OF_GAS)
      }

      runState.messageGasLimit = gasLimit

      return gas
    },
  ],
  [
    /* CREATE2 */
    0xf5,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [, /*value*/ offset, length /*salt*/] = runState.stack.peek(4)

      const gas = subMemUsage(runState, offset, length, common)
      gas.iadd(accessAddressEIP2929(runState, runState.eei.getAddress(), common, false))
      gas.iadd(new BN(common.param('gasPrices', 'sha3Word')).imul(divCeil(length, new BN(32))))
      let gasLimit = new BN(runState.eei.getGasLeft().isub(gas))
      gasLimit = maxCallGas(gasLimit, gasLimit.clone(), runState, common) // CREATE2 is only available after TangerineWhistle (Constantinople introduced this opcode)
      runState.messageGasLimit = gasLimit

      return gas
    },
  ],
  [
    /* STATICCALL */
    0xfa,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [currentGasLimit, toAddr, inOffset, inLength, outOffset, outLength] =
        runState.stack.peek(6)
      const toAddress = new Address(addressToBuffer(toAddr))

      const gas = subMemUsage(runState, inOffset, inLength, common)
      gas.iadd(subMemUsage(runState, outOffset, outLength, common))
      gas.iadd(accessAddressEIP2929(runState, toAddress, common))
      const gasLimit = maxCallGas(
        currentGasLimit,
        runState.eei.getGasLeft().isub(gas),
        runState,
        common
      ) // we set TangerineWhistle or later to true here, as STATICCALL was available from Byzantium (which is after TangerineWhistle)

      runState.messageGasLimit = gasLimit

      return gas
    },
  ],
  [
    /* REVERT */
    0xfd,
    async function (runState: RunState, common: Common): Promise<BN> {
      const [offset, length] = runState.stack.peek(2)
      return subMemUsage(runState, offset, length, common)
    },
  ],
  [
    /* SELFDESTRUCT */
    0xff,
    async function (runState: RunState, common: Common): Promise<BN> {
      const selfdestructToAddressBN = runState.stack.peek()[0]
      if (runState.eei.isStatic()) {
        trap(ERROR.STATIC_STATE_CHANGE)
      }

      const selfdestructToAddress = new Address(addressToBuffer(selfdestructToAddressBN))
      let deductGas = false
      if (common.gteHardfork('spuriousDragon')) {
        // EIP-161: State Trie Clearing
        const balance = await runState.eei.getExternalBalance(runState.eei.getAddress())
        if (balance.gtn(0)) {
          // This technically checks if account is empty or non-existent
          // TODO: improve on the API here (EEI and StateManager)
          const empty = await runState.eei.isAccountEmpty(selfdestructToAddress)
          if (empty) {
            deductGas = true
          }
        }
      } else if (common.gteHardfork('tangerineWhistle')) {
        // Pre EIP-150 (Tangerine Whistle) gas semantics
        const exists = await runState.stateManager.accountExists(selfdestructToAddress)
        if (!exists) {
          deductGas = true
        }
      }
      const gas = new BN(0)
      if (deductGas) {
        gas.iadd(new BN(common.param('gasPrices', 'callNewAccount')))
      }

      gas.iadd(accessAddressEIP2929(runState, selfdestructToAddress, common, true, true))
      return gas
    },
  ],
])

// Set the range [0xa0, 0xa4] to the LOG handler
const logDynamicFunc = dynamicGasHandlers.get(0xa0)!
for (let i = 0xa1; i <= 0xa4; i++) {
  dynamicGasHandlers.set(i, logDynamicFunc)
}
