import VM from "@ethereumjs/vm";
import {Transaction, TxData} from "@ethereumjs/tx";
import {Address} from "ethereumjs-util";
import {debugLog} from "../utils";

export const execute = async (vm: VM, txData: TxData, privateKey: Buffer): Promise<Address | undefined> => {
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