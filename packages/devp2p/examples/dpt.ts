import { DPT } from '@ethereumjs/devp2p'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const PRIVATE_KEY = hexToBytes('0xed6df2d4b7e82d105538e4a1279925a16a84e772243e80a561e1b201f2e78220')
const main = async () => {
  const dpt = new DPT(PRIVATE_KEY, {
    endpoint: {
      address: '0.0.0.0',
      udpPort: null,
      tcpPort: null,
    },
  })
  console.log(`DPT is active and has id - ${bytesToHex(dpt.id!)}`)
  // Should log the DPT's hex ID - 0xcd80bb7a768432302d267729c15da61d172373ea036...
  dpt.destroy()
}

void main()
