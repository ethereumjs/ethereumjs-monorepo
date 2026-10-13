import { createAddressFromPrivateKey, createContractAddress, hexToBytes } from '@ethereumjs/util'

const privateKey = hexToBytes('0x45A915E4D060149EB4365960E6A7A45F334393093061116B197E3240065FF2D8')
const eoa = createAddressFromPrivateKey(privateKey)
const contract = createContractAddress(eoa, 0n)

console.log(`EOA ${eoa.toString()}`)
console.log(`First contract for nonce 0: ${contract.toString()}`)
