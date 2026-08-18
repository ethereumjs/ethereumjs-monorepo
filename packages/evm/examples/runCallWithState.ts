import { createEVM } from '@ethereumjs/evm'
import { Account, bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const evm = await createEVM()
  const caller = createAddressFromString('0x00000000000000000000000000000000000000ee')
  const contract = createAddressFromString('0x00000000000000000000000000000000000000c0')

  // PUSH1 03 PUSH1 05 ADD — store 8 at memory[0], RETURN 32 bytes
  const code = hexToBytes('0x600360050160005260206000F3')
  await evm.stateManager.putCode(contract, code)
  await evm.stateManager.putAccount(caller, new Account(0n, 1_000_000_000_000n))

  const result = await evm.runCall({
    caller,
    to: contract,
    gasLimit: 100_000n,
  })

  console.log(`Return value: ${bytesToHex(result.execResult.returnValue)}`)
  console.log(`Gas used: ${result.execResult.executionGasUsed}`)
}

void main()
