import {
  eoaCode7702AuthorizationListBytesItemToJSON,
  eoaCode7702RecoverAuthority,
  eoaCode7702SignAuthorization,
  hexToBytes,
} from '@ethereumjs/util'

const privateKey = hexToBytes('0x45A915E4D060149EB4365960E6A7A45F334393093061116B197E3240065FF2D8')

const unsigned = {
  chainId: '0x',
  address: '0x0000000000000000000000000000000000001000',
  nonce: '0x',
}

const signed = eoaCode7702SignAuthorization(unsigned, privateKey)
const authority = eoaCode7702RecoverAuthority(signed)

console.log(`Recovered authority: ${authority.toString()}`)
console.log(`Signed item: ${JSON.stringify(eoaCode7702AuthorizationListBytesItemToJSON(signed))}`)
