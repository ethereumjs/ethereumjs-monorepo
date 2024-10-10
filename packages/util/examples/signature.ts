import { bytesToHex, ecrecover, hexToBytes } from '@ethereumjs/util'

const chainId = BigInt(3) // Ropsten

const ecHash = hexToBytes('0x82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28')
const r = hexToBytes('0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9')
const s = hexToBytes('0x129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66')
const v = BigInt(41)

const pubkey = ecrecover(ecHash, v, r, s, chainId)

console.log(`Recovered public key ${bytesToHex(pubkey)} from valid signature values`)
