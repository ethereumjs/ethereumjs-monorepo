import {debugLog, deploySimpleStorage, execute, insertOne, privateKey,} from "@ethereumjs/test-cases";
import VM from "@ethereumjs/vm";
import {toBuffer} from "ethereumjs-util";

const main = async (vmInstance?: VM) => {
  const vm = vmInstance ?? new VM()

  // used to sign transactions and generate addresses
  const privateKeyBuf: Buffer = toBuffer(privateKey)
  const {address} = await insertOne(vm)

  debugLog(`Account ${address.toString()} has been saved into local chain`)

  const deployContractTransaction = deploySimpleStorage()
  return {
    accountAddress: address,
    deployedContractAddress: await execute(vm, deployContractTransaction, privateKeyBuf)
  }
}

export default main

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })