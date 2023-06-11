import { Account, Address, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

const adds = {
  add0: '0x69c062dc38aab6a18da167c52eeae1652d5d8a69',
  add1: '0xa87bb6892f4e3cbdc18bf21be0a43e322b087f93',
  add2: '0xae7fe8650a5d7aa209cb2036bf7560f4e45e1321',
  add3: '0x5591e84fed05624d813e597ffb2c97014e37fc59',
  add4: '0x8df6bcf19a27f15328a2b49b71ce35f35e1f44d0',
  add5: '0xc7c1d1b546fd052dee3e5826b92def56f90ce17d',
  add6: '0xf5bf2816865d47a6c8416b4d269d4743d4ab9ec2',
  add7: '0xd350318479fc781252e92af34f023d4550be33b3',
  add8: '0x8e14c21755ee367eb4de0610300b0361c7e72657',
  add9: '0xa24fb4fc97fe6d5282dd415de455ea025a3eb1d9',
}

tape('address strings', (t) => {
  for (const [i, add] of Object.entries(adds)) {
    const address = Address.fromString(add)
    const addBytes = address.bytes
    const strBytes = hexStringToBytes(add)
    t.deepEqual(addBytes, strBytes, `[${i}] ${add} bytes match`)
  }

  t.end()
})
