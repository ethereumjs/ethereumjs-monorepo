import { Address } from '@ethereumjs/util'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { hexToBytes } from '@ethereumjs/util'

const main = async () => {
  // setup `stateManager` with some existing address
  const stateManager = new DefaultStateManager()
  const contractAddress = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const byteCode = hexToBytes('0x67ffffffffffffffff600160006000fb')
  const storageKey1 = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000001'
  )
  const storageKey2 = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000002'
  )
  const storageValue1 = hexToBytes('0x01')
  const storageValue2 = hexToBytes('0x02')

  await stateManager.putContractCode(contractAddress, byteCode)
  await stateManager.putContractStorage(contractAddress, storageKey1, storageValue1)
  await stateManager.putContractStorage(contractAddress, storageKey2, storageValue2)

  const proof = await stateManager.getProof(contractAddress)
  const proofWithStorage = await stateManager.getProof(contractAddress, [storageKey1, storageKey2])
  const partialStateManager = await DefaultStateManager.fromProof(proof)

  // To add more proof data, use `addProofData`
  await partialStateManager.addProofData(proofWithStorage)
  console.log(await partialStateManager.getContractCode(contractAddress)) // contract bytecode is not included in proof
  console.log(
    await partialStateManager.getContractStorage(contractAddress, storageKey1),
    storageValue1
  ) // should match
  console.log(
    await partialStateManager.getContractStorage(contractAddress, storageKey2),
    storageValue2
  ) // should match

  const accountFromNewSM = await partialStateManager.getAccount(contractAddress)
  const accountFromOldSM = await stateManager.getAccount(contractAddress)
  console.log(accountFromNewSM, accountFromOldSM) // should match

  const slot1FromNewSM = await stateManager.getContractStorage(contractAddress, storageKey1)
  const slot2FromNewSM = await stateManager.getContractStorage(contractAddress, storageKey2)
  console.log(slot1FromNewSM, storageValue1) // should match
  console.log(slot2FromNewSM, storageValue2) // should match
}
main()
