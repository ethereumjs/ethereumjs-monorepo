import {Address, toBuffer} from 'ethereumjs-util'
import VM from "@ethereumjs/vm";
import {encodeParameters, execute, privateKey, read} from "@ethereumjs/test-cases";
import deployContract from "./deployment-transaction"
import Common, {Chain} from "@ethereumjs/common";
import {TxData} from "@ethereumjs/tx";

const main = async () => {
  const common = new Common({
    chain: Chain.Mainnet
  })

  const vm = new VM({common})

  const {deployedContractAddress, accountAddress} = await deployContract(vm)

  const params = {
    types: ['uint256'],
    values: [10]
  }
  const updateStorageData = encodeParameters('store', params)

  const updateStorageTransaction: TxData = {
    to: deployedContractAddress,
    data: updateStorageData,
    nonce: "0x01",
    gasPrice: "0x09184e72a000",
    gasLimit: "0x90710",
  }
  await execute(vm, updateStorageTransaction, toBuffer(privateKey))

  const retrieveStorageData = encodeParameters('retrieve')

  const retrieveStorageTransaction: TxData & { from: Address } = {
    to: deployedContractAddress,
    data: retrieveStorageData,
    from: accountAddress,
    gasPrice: "0x09184e72a000",
    gasLimit: "0x90710"
  }

  const result = await read(vm, retrieveStorageTransaction)
  console.log({result})
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })