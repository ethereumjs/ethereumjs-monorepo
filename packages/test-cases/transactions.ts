import VM from "@ethereumjs/vm";
import {AccessListEIP2930TxData, FeeMarketEIP1559TxData, Transaction, TxData} from "@ethereumjs/tx";
import {Address} from "ethereumjs-util";
import {defaultAbiCoder as AbiCoder, Interface} from "@ethersproject/abi";
import {debugLog} from "./utils";
import {simpleStorageData} from "./data";

export const execute = async (
  vm: VM,
  txData: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData,
  privateKey: Buffer
): Promise<Address | undefined> => {
  const tx = Transaction.fromTxData(txData).sign(privateKey)

  debugLog('EVM - Starting execution of transaction', tx)
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
  data: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData
): TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData => {


  return data
}

export const encodeParameters = (
  method: string,
  params?: {
    types: any[],
    values: unknown[]
  }): string => {
  const parameters = params.types ?? []
  const methodWithParemeters = `function ${method}(${parameters.join(',')})`
  const signatureHash = new Interface([methodWithParemeters]).getSighash(method)
  const encodedArgs = AbiCoder.encode(params.types, params.values);

  return signatureHash + encodedArgs.slice(2)
}