import { Mainnet } from '@ethereumjs/common'
import {
  bigIntToAddressBytes,
  bigIntToBytes,
  bytesToHex,
  createAddressFromString,
  setLengthLeft,
} from '@ethereumjs/util'

import { concatBytes } from '../../util/src/bytes.js'
import { ConsolidationRequest, DepositRequest, WithdrawalRequest } from '../../util/src/request.js'

import type { RunTxResult } from './types.js'
import type { VM } from './vm.js'
import type { CLRequest, CLRequestType } from '@ethereumjs/util'

/**
 * This helper method generates a list of all CL requests that can be included in a pending block
 * @param vm VM instance (used in deriving partial withdrawal requests)
 * @param txResults (used in deriving deposit requests)
 * @returns a list of CL requests in ascending order by type
 */
export const accumulateRequests = async (
  vm: VM,
  txResults: RunTxResult[],
): Promise<CLRequest<CLRequestType>[]> => {
  const requests: CLRequest<CLRequestType>[] = []
  const common = vm.common

  if (common.isActivatedEIP(6110)) {
    const depositContractAddress =
      vm.common['_chainParams'].depositContractAddress ?? Mainnet.depositContractAddress
    if (depositContractAddress === undefined)
      throw new Error('deposit contract address required with EIP 6110')
    const depositsRequest = accumulateDepositsRequest(depositContractAddress, txResults)
    requests.push(depositsRequest)
  }

  if (common.isActivatedEIP(7002)) {
    const withdrawalsRequest = await accumulateWithdrawalsRequest(vm)
    requests.push(withdrawalsRequest)
  }

  if (common.isActivatedEIP(7251)) {
    const consolidationsRequest = await accumulateConsolidationsRequest(vm)
    requests.push(consolidationsRequest)
  }

  // requests are already type byte ordered by construction
  return requests
}

const accumulateWithdrawalsRequest = async (
  vm: VM,
): Promise<CLRequest<CLRequestType.Withdrawal>> => {
  // Partial withdrawals logic
  const addressBytes = setLengthLeft(
    bigIntToBytes(vm.common.param('withdrawalRequestPredeployAddress')),
    20,
  )
  const withdrawalsAddress = createAddressFromString(bytesToHex(addressBytes))

  const systemAddressBytes = bigIntToAddressBytes(vm.common.param('systemAddress'))
  const systemAddress = createAddressFromString(bytesToHex(systemAddressBytes))
  const systemAccount = await vm.stateManager.getAccount(systemAddress)

  const originalAccount = await vm.stateManager.getAccount(withdrawalsAddress)

  if (originalAccount === undefined) {
    return new WithdrawalRequest(new Uint8Array())
  }

  const results = await vm.evm.runCall({
    caller: systemAddress,
    gasLimit: BigInt(1_000_000),
    to: withdrawalsAddress,
  })

  if (systemAccount === undefined) {
    await vm.stateManager.deleteAccount(systemAddress)
  } else {
    await vm.stateManager.putAccount(systemAddress, systemAccount)
  }

  const resultsBytes = results.execResult.returnValue
  return new WithdrawalRequest(resultsBytes)
}

const accumulateConsolidationsRequest = async (
  vm: VM,
): Promise<CLRequest<CLRequestType.Consolidation>> => {
  // Partial withdrawals logic
  const addressBytes = setLengthLeft(
    bigIntToBytes(vm.common.param('consolidationRequestPredeployAddress')),
    20,
  )
  const consolidationsAddress = createAddressFromString(bytesToHex(addressBytes))

  const systemAddressBytes = bigIntToAddressBytes(vm.common.param('systemAddress'))
  const systemAddress = createAddressFromString(bytesToHex(systemAddressBytes))
  const systemAccount = await vm.stateManager.getAccount(systemAddress)

  const originalAccount = await vm.stateManager.getAccount(consolidationsAddress)

  if (originalAccount === undefined) {
    return new ConsolidationRequest(new Uint8Array(0))
  }

  const results = await vm.evm.runCall({
    caller: systemAddress,
    gasLimit: BigInt(1_000_000),
    to: consolidationsAddress,
  })

  if (systemAccount === undefined) {
    await vm.stateManager.deleteAccount(systemAddress)
  } else {
    await vm.stateManager.putAccount(systemAddress, systemAccount)
  }

  const resultsBytes = results.execResult.returnValue
  return new ConsolidationRequest(resultsBytes)
}

const accumulateDepositsRequest = (
  depositContractAddress: string,
  txResults: RunTxResult[],
): CLRequest<CLRequestType.Deposit> => {
  let resultsBytes = new Uint8Array(0)
  for (const [_, tx] of txResults.entries()) {
    for (let i = 0; i < tx.receipt.logs.length; i++) {
      const log = tx.receipt.logs[i]
      if (bytesToHex(log[0]).toLowerCase() === depositContractAddress.toLowerCase()) {
        resultsBytes = concatBytes(resultsBytes, log[2])
      }
    }
  }

  return new DepositRequest(resultsBytes)
}
