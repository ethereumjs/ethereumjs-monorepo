import {
  bytesToHex,
  createBlockLevelAccessListFromJSON,
  validateBlockAccessListHashFromJSON,
  validateBlockAccessListStructure,
} from '@ethereumjs/util'

const main = () => {
  const balJson = [
    {
      address: '0x0000000000000000000000000000000000000001',
      storageChanges: [],
      storageReads: [],
      balanceChanges: [{ blockAccessIndex: '0x01', postBalance: '0x03e8' }],
      nonceChanges: [],
      codeChanges: [],
    },
  ]

  const bal = createBlockLevelAccessListFromJSON(balJson)
  validateBlockAccessListStructure(bal)
  validateBlockAccessListHashFromJSON(balJson, bal.hash())

  console.log(`BAL account count: ${bal.toJSON().length}`)
  console.log(`BAL hash: ${bytesToHex(bal.hash())}`)
}

void main()
