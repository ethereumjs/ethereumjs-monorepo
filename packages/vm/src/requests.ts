import { Mainnet } from '@ethereumjs/common'
import {
  bigIntToAddressBytes,
  bigIntToBytes,
  bytesToHex,
  bytesToInt,
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
  const depositContractAddressLowerCase = depositContractAddress.toLowerCase()
  for (const [_, tx] of txResults.entries()) {
    for (let i = 0; i < tx.receipt.logs.length; i++) {
      const log = tx.receipt.logs[i]
      if (bytesToHex(log[0]).toLowerCase() === depositContractAddressLowerCase) {
        // Extracts validator pubkey, withdrawal credential, deposit amount, signature,
        // and validator index from Deposit Event log.
        // The event fields are non-indexed so contained in one byte array (log[2]) so parsing is as follows:
        // 1. Read the first 32 bytes to get the starting position of the first field.
        // 2. Continue reading the byte array in 32 byte increments to get all the field starting positions
        // 3. Read 32 bytes starting with the first field position to get the size of the first field
        // 4. Read the bytes from first field position + 32 + the size of the first field to get the first field value
        // 5. Repeat steps 3-4 for each field
        // This is equivalent to ABI-decoding the event:
        // event DepositEvent(
        //  bytes pubkey,
        //  bytes withdrawal_credentials,
        //  bytes amount,
        //  bytes signature,
        //  bytes index
        //);

        const pubKeyIdx = bytesToInt(log[2].slice(0, 32))
        const pubKeySize = bytesToInt(log[2].slice(pubKeyIdx, pubKeyIdx + 32))
        const withdrawalCreditsIdx = bytesToInt(log[2].slice(32, 64))
        const withdrawalCreditsSize = bytesToInt(
          log[2].slice(withdrawalCreditsIdx, withdrawalCreditsIdx + 32),
        )
        const amountIdx = bytesToInt(log[2].slice(64, 96))
        const amountSize = bytesToInt(log[2].slice(amountIdx, amountIdx + 32))
        const sigIdx = bytesToInt(log[2].slice(96, 128))
        const sigSize = bytesToInt(log[2].slice(sigIdx, sigIdx + 32))
        const indexIdx = bytesToInt(log[2].slice(128, 160))
        const indexSize = bytesToInt(log[2].slice(indexIdx, indexIdx + 32))

        const pubkey = log[2].slice(pubKeyIdx + 32, pubKeyIdx + 32 + pubKeySize)
        const withdrawalCredentials = log[2].slice(
          withdrawalCreditsIdx + 32,
          withdrawalCreditsIdx + 32 + withdrawalCreditsSize,
        )
        const amount = log[2].slice(amountIdx + 32, amountIdx + 32 + amountSize)
        const signature = log[2].slice(sigIdx + 32, sigIdx + 32 + sigSize)
        const index = log[2].slice(indexIdx + 32, indexIdx + 32 + indexSize)

        const depositRequestBytes = concatBytes(
          pubkey,
          withdrawalCredentials,
          amount,
          signature,
          index,
        )

        resultsBytes = concatBytes(resultsBytes, depositRequestBytes)
      }
    }
  }

  return new DepositRequest(resultsBytes)
}
