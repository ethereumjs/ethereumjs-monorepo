import { Chain, Common } from '@ethereumjs/common'
import { bigIntToBytes, bytesToHex, concatBytes, setLengthLeft } from '@ethereumjs/util'

import { EVM, getActivePrecompiles } from '../../dist/cjs'

const Web3 = require('web3-eth')

// Create a web3 instance
const web3 = new Web3.default('https://mainnet.infura.io/v3/INFURAKEY')

// Example function to get the latest block number asynchronously
async function getInfura(data: string) {
  return await web3.call({
    to: '0x0000000000000000000000000000000000000005',
    data,
  })
}

const output: any = []

async function go() {
  const common = new Common({ chain: Chain.Mainnet })
  const evm = new EVM({
    common,
  })
  const addressStr = '0000000000000000000000000000000000000005'
  const MODEXP = getActivePrecompiles(common).get(addressStr)!

  function getData(
    bLen: bigint,
    eLen: bigint,
    mLen: bigint,
    b: bigint,
    e: bigint,
    m: bigint
  ): Uint8Array {
    const bLenBytes = setLengthLeft(bigIntToBytes(bLen), 32)
    const eLenBytes = setLengthLeft(bigIntToBytes(eLen), 32)
    const mLenBytes = setLengthLeft(bigIntToBytes(mLen), 32)
    const bBytes = bigIntToBytes(b)
    const eBytes = bigIntToBytes(e)
    const mBytes = bigIntToBytes(m)

    return concatBytes(bLenBytes, eLenBytes, mLenBytes, bBytes, eBytes, mBytes)
  }

  const inputs = [BigInt(0), BigInt(1), BigInt(2)]

  let chk = 0

  for (const i of inputs) {
    for (const j of inputs) {
      for (const k of inputs) {
        for (const x of inputs) {
          for (const y of inputs) {
            for (const z of inputs) {
              chk++
              console.log(chk, Math.pow(3, 6))
              const data = getData(i, j, k, x, y, z)

              const result = await MODEXP({
                data,
                gasLimit: BigInt(0xffff),
                common,
                _EVM: evm,
              })

              const hexOutput = bytesToHex(result.returnValue)
              const infura = await getInfura(bytesToHex(data))

              if (infura !== hexOutput) {
                console.log('ERROR')
                console.log(i, j, k, x, y, z)
                console.log('INPUT', bytesToHex(data))
                console.log('EXP', infura)
                console.log('GOT', hexOutput)
                output.push([bytesToHex(data), infura])
                return
              }
            }
          }
        }
      }
    }
  }
}

async function goFuzzer() {
  await go()
  console.log(JSON.stringify(output))
}

goFuzzer()
