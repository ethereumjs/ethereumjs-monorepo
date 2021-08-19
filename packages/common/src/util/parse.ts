import { Account, BN, keccak, rlp, toBuffer, unpadBuffer, isHexPrefixed } from 'ethereumjs-util'
import { Chain } from '../types'


async function parseGethParams(json: any): Promise<Chain> {
  const { name, config, timestamp, gasLimit, difficulty, nonce, extraData, mixHash, coinbase } =
    json
  const { chainId  } = config
  const params: any = {
    name,
    chainId,
    networkId: chainId,
    genesis: {
      timestamp,
      gasLimit,
      difficulty,
      nonce,
      extraData,
      mixHash,
      coinbase,
    },
    bootstrapNodes: [],
  }
  const hardforks = [
    'chainstart',
    'homestead',
    'dao',
    'tangerineWhistle',
    'spuriousDragon',
    'byzantium',
    'constantinople',
    'hybridCasper',
  ]
  const forkMap: { [key: string]: string } = {
    homestead: 'homesteadBlock',
    dao: 'daoForkBlock',
    tangerineWhistle: 'eip150Block',
    spuriousDragon: 'eip155Block',
    byzantium: 'byzantiumBlock',
  }
  params.hardforks = hardforks.map((name) => ({
    name: name,
    block: name === 'chainstart' ? 0 : config[forkMap[name]] ?? null,
  }))
  return params
}

/**
 *
 * @param json a JSON representation of a Geth genesis parameters file
 * @returns Promise<Chain>
 */
export async function parseParams(json: any) {
  try {
    if (json.config && json.difficulty && json.gasLimit && json.alloc) {
      if (json.nonce === undefined || json.nonce === '0x0') {
        json.nonce = '0x0000000000000000'
      }
      return parseGethParams(json)
    } else {
      throw new Error('Invalid format')
    }
  } catch (e) {
    throw new Error(`Error parsing parameters: ${e.message}`)
  }
}
