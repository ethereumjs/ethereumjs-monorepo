import { createHeader } from '@ethereumjs/block'
import { bytesToHex } from '@ethereumjs/util'

import type { HeaderData } from '@ethereumjs/block'

const headerData: HeaderData = {
  number: 15,
  parentHash: '0x6bfee7294bf44572b7266358e627f3c35105e1c3851f3de09e6d646f955725a7',
  gasLimit: 8000000,
  timestamp: 1562422144,
}
const header = createHeader(headerData)
console.log(`Created block header with hash=${bytesToHex(header.hash())}`)
