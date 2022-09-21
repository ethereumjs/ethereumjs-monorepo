import { intToHex, isHexPrefixed, stripHexPrefix } from '@ethereumjs/util'

import { Hardfork } from './enums'

/**
 * Transforms Geth formatted nonce (i.e. hex string) to 8 byte 0x-prefixed string used internally
 * @param nonce string parsed from the Geth genesis file
 * @returns nonce as a 0x-prefixed 8 byte string
 */
function formatNonce(nonce: string): string {
  if (!nonce || nonce === '0x0') {
    return '0x0000000000000000'
  }
  if (isHexPrefixed(nonce)) {
    return '0x' + stripHexPrefix(nonce).padStart(16, '0')
  }
  return '0x' + nonce.padStart(16, '0')
}

/**
 * Converts Geth genesis parameters to an EthereumJS compatible `CommonOpts` object
 * @param json object representing the Geth genesis file
 * @returns genesis parameters in a `CommonOpts` compliant object
 */
function parseGethParams(json: any) {
  const { name, config, difficulty, mixHash, gasLimit, coinbase, baseFeePerGas } = json
  let { extraData, timestamp, nonce } = json
  const { chainId } = config

  // geth is not strictly putting empty fields with a 0x prefix
  if (extraData === '') {
    extraData = '0x'
  }
  // geth may use number for timestamp
  if (!isHexPrefixed(timestamp)) {
    timestamp = intToHex(parseInt(timestamp))
  }
  // geth may not give us a nonce strictly formatted to an 8 byte hex string
  if (nonce.length !== 18) {
    nonce = formatNonce(nonce)
  }

  // EIP155 and EIP158 are both part of Spurious Dragon hardfork and must occur at the same time
  // but have different configuration parameters in geth genesis parameters
  if (config.eip155Block !== config.eip158Block) {
    throw new Error(
      'EIP155 block number must equal EIP 158 block number since both are part of SpuriousDragon hardfork and the client only supports activating the full hardfork'
    )
  }

  const params: any = {
    name,
    chainId,
    networkId: chainId,
    genesis: {
      timestamp,
      gasLimit: parseInt(gasLimit), // geth gasLimit and difficulty are hex strings while ours are `number`s
      difficulty: parseInt(difficulty),
      nonce,
      extraData,
      mixHash,
      coinbase,
      baseFeePerGas,
    },
    bootstrapNodes: [],
    consensus:
      config.clique !== undefined
        ? {
            type: 'poa',
            algorithm: 'clique',
            clique: {
              period: config.clique.period,
              epoch: config.clique.epoch,
            },
          }
        : {
            type: 'pow',
            algorithm: 'ethash',
            ethash: {},
          },
  }

  const forkMap: { [key: string]: string } = {
    [Hardfork.Homestead]: 'homesteadBlock',
    [Hardfork.Dao]: 'daoForkBlock',
    [Hardfork.TangerineWhistle]: 'eip150Block',
    [Hardfork.SpuriousDragon]: 'eip155Block',
    [Hardfork.Byzantium]: 'byzantiumBlock',
    [Hardfork.Constantinople]: 'constantinopleBlock',
    [Hardfork.Petersburg]: 'petersburgBlock',
    [Hardfork.Istanbul]: 'istanbulBlock',
    [Hardfork.MuirGlacier]: 'muirGlacierBlock',
    [Hardfork.Berlin]: 'berlinBlock',
    [Hardfork.London]: 'londonBlock',
    [Hardfork.MergeForkIdTransition]: 'mergeForkBlock',
  }
  params.hardforks = Object.values(Hardfork)
    .map((name) => ({
      name,
      block: name === Hardfork.Chainstart ? 0 : config[forkMap[name]] ?? null,
    }))
    .filter((fork) => fork.block !== null)
  if (config.terminalTotalDifficulty !== undefined) {
    params.hardforks.push({
      name: Hardfork.Merge,
      ttd: config.terminalTotalDifficulty,
      block: null,
    })
  }
  return params
}

/**
 * Parses a genesis.json exported from Geth into parameters for Common instance
 * @param json representing the Geth genesis file
 * @param name optional chain name
 * @returns parsed params
 */
export function parseGethGenesis(json: any, name?: string) {
  try {
    if (['config', 'difficulty', 'gasLimit', 'alloc'].some((field) => !(field in json))) {
      throw new Error('Invalid format, expected geth genesis fields missing')
    }
    if (name !== undefined) {
      json.name = name
    }
    return parseGethParams(json)
  } catch (e: any) {
    throw new Error(`Error parsing parameters file: ${e.message}`)
  }
}
