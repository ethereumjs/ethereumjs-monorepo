import { Account, Address, bytesToHex } from '@ethereumjs/util'
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

  await stateManager.putContractCode(contractAddress, byteCode)
  await stateManager.putContractStorage(contractAddress, storageKey1, hexToBytes('0x01'))
  await stateManager.putContractStorage(contractAddress, storageKey2, hexToBytes('0x02'))

  const proof = await stateManager.getProof(contractAddress)
  const proofWithStorage = await stateManager.getProof(contractAddress, [storageKey1, storageKey2])

  const partialStateManager = await DefaultStateManager.fromProof(proof)
  // To add more proof data, use `addProofData`
  await partialStateManager.addProofData(proofWithStorage)
  const accountFromNewSM = await partialStateManager.getAccount(contractAddress)
  const accountFromOldSM = await stateManager.getAccount(contractAddress)
  console.log(accountFromNewSM, accountFromOldSM) // should match

  const slot1FromNewSM = await stateManager.getContractStorage(contractAddress, storageKey1)
  const slot2FromNewSM = await stateManager.getContractStorage(contractAddress, storageKey1)
  console.log(slot1FromNewSM, slot2FromNewSM) // should also match
}
main()
