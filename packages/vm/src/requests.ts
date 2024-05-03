import { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  Address,
  CLRequest,
  bigIntToBytes,
  bytesToHex,
  bytesToInt,
  setLengthLeft,
} from '@ethereumjs/util'

import type { RunTxResult } from './types'
import type { VM } from './vm.js'

/**
 * This helper method generates a list of all CL requests that can be included in a pending block
 * @param vm VM instance (used in deriving partial withdrawal requests)
 * @param txResults (used in deriving deposit requests)
 * @returns a list of CL requests in ascending order by type
 */
export const accumulateRequests = async (
  vm: VM,
  txResults: RunTxResult[]
): Promise<CLRequest[]> => {
  const requests: CLRequest[] = []
  const common = vm.common

  if (common.isActivatedEIP(6110)) {
    const depositContractAddress =
      Common.getInitializedChains()[vm.common.chainName()].depositContractAddress
    if (depositContractAddress === undefined)
      throw new Error('deposit contract address required with EIP 6110')
    await accumulateDeposits(depositContractAddress, txResults, requests)
  }

  if (common.isActivatedEIP(7002)) {
    await accumulateEIP7002Requests(vm, requests)
  }

  if (requests.length > 1) {
    for (let x = 1; x < requests.length; x++) {
      if (requests[x].type < requests[x - 1].type)
        throw new Error('requests are not in ascending order')
    }
  }
  return requests
}

const accumulateEIP7002Requests = async (vm: VM, requests: CLRequest[]): Promise<void> => {
  // Partial withdrawals logic
  const addressBytes = setLengthLeft(
    bigIntToBytes(vm.common.param('vm', 'withdrawalRequestPredeployAddress')),
    20
  )
  const withdrawalsAddress = Address.fromString(bytesToHex(addressBytes))

  const code = await vm.stateManager.getContractCode(withdrawalsAddress)

  if (code.length === 0) {
    throw new Error(
      'Attempt to accumulate EIP-7002 requests failed: the contract does not exist. Ensure the deployment tx has been run, or that the required contract code is stored'
    )
  }

  const systemAddressBytes = setLengthLeft(
    bigIntToBytes(vm.common.param('vm', 'systemAddress')),
    20
  )
  const systemAddress = Address.fromString(bytesToHex(systemAddressBytes))

  const results = await vm.evm.runCall({
    caller: systemAddress,
    gasLimit: BigInt(1_000_000),
    to: withdrawalsAddress,
  })

  const resultsBytes = results.execResult.returnValue
  if (resultsBytes.length > 0) {
    const withdrawalRequestType = Number(vm.common.param('vm', 'withdrawalRequestType'))
    // Each request is 76 bytes
    for (let startByte = 0; startByte < resultsBytes.length; startByte += 76) {
      const slicedBytes = resultsBytes.slice(startByte, startByte + 76)
      const sourceAddress = slicedBytes.slice(0, 20) // 20 Bytes
      const validatorPubkey = slicedBytes.slice(20, 68) // 48 Bytes
      const amount = slicedBytes.slice(68, 76) // 8 Bytes / Uint64
      const rlpData = RLP.encode([sourceAddress, validatorPubkey, amount])
      const request = new CLRequest(withdrawalRequestType, rlpData)
      requests.push(request)
    }
  }
}

const accumulateDeposits = async (
  depositContractAddress: string,
  txResults: RunTxResult[],
  requests: CLRequest[]
) => {
  for (const [_, tx] of txResults.entries()) {
    for (let i = 0; i < tx.receipt.logs.length; i++) {
      const log = tx.receipt.logs[i]
      if (bytesToHex(log[0]).toLowerCase() === depositContractAddress.toLowerCase()) {
        // Extracts validator pubkey, withdrawal credential, deposit amount, signature,
        // and validator index from Deposit Event log.
        // The event fields are non-indexed so contained in one byte array (log[2]) so parsing is as follows:
        // 1. Read the first 32 bytes to get the starting position of the first field.
        // 2. Continue reading the byte array in 32 byte increments to get all the field starting positions
        // 3. Read 32 bytes starting with the first field position to get the size of the first field
        // 4. Read the bytes from first field position + 32 + the size of the first field to get the first field value
        // 5. Repeat steps 3-4 for each field
        const pubKeyIdx = bytesToInt(log[2].slice(0, 32))
        const pubKeySize = bytesToInt(log[2].slice(pubKeyIdx, pubKeyIdx + 32))
        const withdrawalCredsIdx = bytesToInt(log[2].slice(32, 64))
        const withdrawalCredsSize = bytesToInt(
          log[2].slice(withdrawalCredsIdx, withdrawalCredsIdx + 32)
        )
        const amountIdx = bytesToInt(log[2].slice(64, 96))
        const amountSize = bytesToInt(log[2].slice(amountIdx, amountIdx + 32))
        const sigIdx = bytesToInt(log[2].slice(96, 128))
        const sigSize = bytesToInt(log[2].slice(sigIdx, sigIdx + 32))
        const indexIdx = bytesToInt(log[2].slice(128, 160))
        const indexSize = bytesToInt(log[2].slice(indexIdx, indexIdx + 32))
        const pubkey = log[2].slice(pubKeyIdx + 32, pubKeyIdx + 32 + pubKeySize)
        const withdrawalCreds = log[2].slice(
          withdrawalCredsIdx + 32,
          withdrawalCredsIdx + 32 + withdrawalCredsSize
        )
        const amount = log[2].slice(amountIdx + 32, amountIdx + 32 + amountSize)
        const signature = log[2].slice(sigIdx + 32, sigIdx + 32 + sigSize)
        const index = log[2].slice(indexIdx + 32, indexIdx + 32 + indexSize)
        requests.push(
          new CLRequest(0x0, RLP.encode([pubkey, withdrawalCreds, amount, signature, index]))
        )
      }
    }
  }
}
