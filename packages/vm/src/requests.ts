import { Mainnet } from '@ethereumjs/common'
import {
  CLRequest,
  CLRequestType,
  EthereumJSErrorWithoutCode,
  bigIntToAddressBytes,
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  concatBytes,
  createAddressFromString,
  setLengthLeft,
} from '@ethereumjs/util'

import type { RunTxResult } from './types.ts'
import type { VM } from './vm.ts'

const DEPOSIT_TOPIC = '0x649bbc62d0e31342afea4e5cd82d4049e7e1ee912fc0889aa790803be39038c5'
const PUBKEY_OFFSET = BigInt(160)
const WITHDRAWAL_CREDENTIALS_OFFSET = BigInt(256)
const AMOUNT_OFFSET = BigInt(320)
const SIGNATURE_OFFSET = BigInt(384)
const INDEX_OFFSET = BigInt(512)
const PUBKEY_SIZE = BigInt(48)
const WITHDRAWAL_CREDENTIALS_SIZE = BigInt(32)
const AMOUNT_SIZE = BigInt(8)
const SIGNATURE_SIZE = BigInt(96)
const INDEX_SIZE = BigInt(8)
const LOG_SIZE = 576
const LOG_LAYOUT_MISMATCH = 'invalid deposit log: unsupported data layout'

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
      throw EthereumJSErrorWithoutCode('deposit contract address required with EIP 6110')
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
): Promise<CLRequest<typeof CLRequestType.Withdrawal>> => {
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
    return new CLRequest(CLRequestType.Withdrawal, new Uint8Array())
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
  return new CLRequest(CLRequestType.Withdrawal, resultsBytes)
}

const accumulateConsolidationsRequest = async (
  vm: VM,
): Promise<CLRequest<typeof CLRequestType.Consolidation>> => {
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
    return new CLRequest(CLRequestType.Consolidation, new Uint8Array(0))
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
  return new CLRequest(CLRequestType.Consolidation, resultsBytes)
}

const accumulateDepositsRequest = (
  depositContractAddress: string,
  txResults: RunTxResult[],
): CLRequest<typeof CLRequestType.Deposit> => {
  let resultsBytes = new Uint8Array(0)
  const depositContractAddressLowerCase = depositContractAddress.toLowerCase()
  for (const [_, tx] of txResults.entries()) {
    for (let i = 0; i < tx.receipt.logs.length; i++) {
      const log = tx.receipt.logs[i]
      const [address, topics, data] = log
      if (
        topics.length > 0 &&
        bytesToHex(topics[0]) === DEPOSIT_TOPIC &&
        depositContractAddressLowerCase === bytesToHex(address).toLowerCase()
      ) {
        const { pubkey, withdrawalCredentials, amount, signature, index } = parseDepositLog(data)
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

  return new CLRequest(CLRequestType.Deposit, resultsBytes)
}

function parseDepositLog(requestData: Uint8Array) {
  if (requestData.length !== LOG_SIZE) {
    throw EthereumJSErrorWithoutCode(LOG_LAYOUT_MISMATCH)
  }
  // Extracts validator pubkey, withdrawal credential, deposit amount, signature,
  // and validator index from Deposit Event log.
  // The event fields are non-indexed so contained in one byte array (log[2]) so parsing is as follows:
  // 1. Read the first 32 bytes to get the starting position of the first field.
  // 2. Continue reading the byte array in 32 byte increments to get all the field starting positions
  // 3. Read 32 bytes starting with the first field position to get the size of the first field
  // 4. Read the bytes from first field position + 32 + the size of the first field to get the first field value
  // 5. Repeat steps 3-4 for each field
  const pubKeyIdxBigInt = bytesToBigInt(requestData.slice(0, 32))
  const withdrawalCreditsIdxBigInt = bytesToBigInt(requestData.slice(32, 64))
  const amountIdxBigInt = bytesToBigInt(requestData.slice(64, 96))
  const sigIdxBigInt = bytesToBigInt(requestData.slice(96, 128))
  const indexIdxBigInt = bytesToBigInt(requestData.slice(128, 160))

  if (
    pubKeyIdxBigInt !== PUBKEY_OFFSET ||
    withdrawalCreditsIdxBigInt !== WITHDRAWAL_CREDENTIALS_OFFSET ||
    amountIdxBigInt !== AMOUNT_OFFSET ||
    sigIdxBigInt !== SIGNATURE_OFFSET ||
    indexIdxBigInt !== INDEX_OFFSET
  ) {
    throw EthereumJSErrorWithoutCode(LOG_LAYOUT_MISMATCH)
  }

  const pubKeyIdx = Number(pubKeyIdxBigInt)
  const withdrawalCreditsIdx = Number(withdrawalCreditsIdxBigInt)
  const amountIdx = Number(amountIdxBigInt)
  const sigIdx = Number(sigIdxBigInt)
  const indexIdx = Number(indexIdxBigInt)

  const pubKeySizeBigInt = bytesToBigInt(requestData.slice(pubKeyIdx, pubKeyIdx + 32))
  const withdrawalCreditsSizeBigInt = bytesToBigInt(
    requestData.slice(withdrawalCreditsIdx, withdrawalCreditsIdx + 32),
  )
  const amountSizeBigInt = bytesToBigInt(requestData.slice(amountIdx, amountIdx + 32))
  const sigSizeBigInt = bytesToBigInt(requestData.slice(sigIdx, sigIdx + 32))
  const indexSizeBigInt = bytesToBigInt(requestData.slice(indexIdx, indexIdx + 32))

  if (
    pubKeySizeBigInt !== PUBKEY_SIZE ||
    withdrawalCreditsSizeBigInt !== WITHDRAWAL_CREDENTIALS_SIZE ||
    amountSizeBigInt !== AMOUNT_SIZE ||
    sigSizeBigInt !== SIGNATURE_SIZE ||
    indexSizeBigInt !== INDEX_SIZE
  ) {
    throw EthereumJSErrorWithoutCode(LOG_LAYOUT_MISMATCH)
  }

  const pubKeySize = Number(pubKeySizeBigInt)
  const withdrawalCreditsSize = Number(withdrawalCreditsSizeBigInt)
  const amountSize = Number(amountSizeBigInt)
  const sigSize = Number(sigSizeBigInt)
  const indexSize = Number(indexSizeBigInt)

  const pubkey = requestData.slice(pubKeyIdx + 32, pubKeyIdx + 32 + pubKeySize)
  const withdrawalCredentials = requestData.slice(
    withdrawalCreditsIdx + 32,
    withdrawalCreditsIdx + 32 + withdrawalCreditsSize,
  )
  const amount = requestData.slice(amountIdx + 32, amountIdx + 32 + amountSize)
  const signature = requestData.slice(sigIdx + 32, sigIdx + 32 + sigSize)
  const index = requestData.slice(indexIdx + 32, indexIdx + 32 + indexSize)

  return {
    pubkey,
    withdrawalCredentials,
    amount,
    signature,
    index,
  }
}
