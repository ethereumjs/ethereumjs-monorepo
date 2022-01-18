import {toBuffer} from 'ethereumjs-util'
import VM from "@ethereumjs/vm";
import {debugLog, deploySimpleStorage, encodeParameters, execute, insertOne, privateKey} from "@ethereumjs/test-cases";
import Common, {Chain} from "@ethereumjs/common";
import {TxData} from "@ethereumjs/tx";

const main = async () => {
  const common = new Common({
    chain: Chain.Mainnet
  })

  const vm = new VM({common})

  // used to sign transactions and generate addresses
  const privateKeyBuf: Buffer = toBuffer(privateKey)
  const {address: accountAddress} = await insertOne(vm)

  debugLog(`Account ${accountAddress.toString()} has been saved into local chain`)

  const deployContractTransaction = deploySimpleStorage()
  const contractAddress = await execute(vm, deployContractTransaction, privateKeyBuf)

  const params = {
    types: ['uint256'],
    values: [10]
  }
  const updateStorageData = encodeParameters('store', params)

  const updateStorageTransaction: TxData = {
    to: contractAddress,
    data: updateStorageData,
    nonce: "0x01",
    gasPrice: "0x09184e72a000",
    gasLimit: "0x90710",
  }

  await execute(vm, updateStorageTransaction, privateKeyBuf)


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })