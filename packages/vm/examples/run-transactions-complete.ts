import {toBuffer} from 'ethereumjs-util'
import VM from "@ethereumjs/vm";
import {debugLog, execute, insertOne, mockTransaction, privateKey} from "@ethereumjs/test-cases";

const main = async () => {
    const vm = new VM()

    // used to sign transactions and generate addresses
    const privateKeyBuf: Buffer = toBuffer(privateKey)
    const {address} = await insertOne(vm)

    debugLog(`Account ${address.toString()} has been saved into local chain`)

    const deployContractTransaction = mockTransaction()
    await execute(vm, deployContractTransaction, privateKeyBuf)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })