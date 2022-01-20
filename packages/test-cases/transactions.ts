import VM from "@ethereumjs/vm";
import {AccessListEIP2930TxData, FeeMarketEIP1559TxData, Transaction, TxData} from "@ethereumjs/tx";
import {Address} from "ethereumjs-util";
import {defaultAbiCoder as AbiCoder, Interface} from "@ethersproject/abi";
import {debugLog} from "./utils";
import {simpleStorageData} from "./data";

export type TransactionTypes = TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData;

export const read = async (
  vm: VM,
  txData: TransactionTypes & { from?: Address }
): Promise<any> => {
  const tx = Transaction.fromTxData(txData)

  const result = await vm.runCall({...tx, caller: txData.from})

  if (result.execResult.exceptionError) {
    throw result.execResult.exceptionError
  }

  const [decodedResult] = AbiCoder.decode(['uint256'], result.execResult.returnValue)

  return decodedResult
}

export const execute = async (
  vm: VM,
  txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData,
  privateKey: Buffer
): Promise<Address | undefined> => {
  const tx = Transaction.fromTxData(txData).sign(privateKey)

  const results = await vm.runTx({tx})

  debugLog('EVM - Gas used: ' + results.gasUsed.toString())
  debugLog('EVM - Execution result: ' + results.execResult.returnValue.toString('hex'))

  const createdAddress = results.createdAddress

  if (createdAddress) {
    debugLog('EVM - Address deployed to: ' + createdAddress.toString())
    return createdAddress
  }
}

export const deploySimpleStorage = (): TxData => {
  return createTransaction(simpleStorageData)
}

export const createTransaction = (
  data: TransactionTypes
): TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData => {


  return data
}

export const encodeParameters = (
  method: string,
  params?: {
    types: any[],
    values: unknown[]
  }): string => {
  const parameters = params?.types ?? []
  const methodWithParemeters = `function ${method}(${parameters.join(',')})`
  const signatureHash = new Interface([methodWithParemeters]).getSighash(method)
  const encodedArgs = AbiCoder.encode(parameters, params?.values ?? []);

  return signatureHash + encodedArgs.slice(2)
}