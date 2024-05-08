import { bigIntToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { INVALID_PARAMS } from '../../../src/rpc/error-code.js'
import blocks from '../../testdata/blocks/beacon.json'
import genesisJSON from '../../testdata/geth-genesis/post-merge.json'
import { getRpcClient, setupChain } from '../helpers.js'

const method = 'engine_newPayloadV4'
const [blockData] = blocks

const parentBeaconBlockRoot = '0x42942949c4ed512cd85c2cb54ca88591338cbb0564d3a2bea7961a639ef29d64'
const validForkChoiceState = {
  headBlockHash: '0x851260e77fad1197f6a57510bd970f5976ed213855522b5e9d02206c47b26953',
  safeBlockHash: '0x851260e77fad1197f6a57510bd970f5976ed213855522b5e9d02206c47b26953',
  finalizedBlockHash: '0x851260e77fad1197f6a57510bd970f5976ed213855522b5e9d02206c47b26953',
}
const validPayloadAttributes = {
  timestamp: '0x64ba84fd',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xaa00000000000000000000000000000000000000',
}

const validPayload = [
  validForkChoiceState,
  {
    ...validPayloadAttributes,
    withdrawals: [],
    parentBeaconBlockRoot,
  },
]

function readyPragueGenesis(genesisJSON: any) {
  const pragueTime = 1689945325
  // deep copy json and add shanghai and cancun to genesis to avoid contamination
  const pragueJson = JSON.parse(JSON.stringify(genesisJSON))
  pragueJson.config.shanghaiTime = pragueTime
  pragueJson.config.cancunTime = pragueTime
  pragueJson.config.pragueTime = pragueTime
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  Object.assign(pragueJson.alloc, electraGenesisContracts)
  return { pragueJson, pragueTime }
}

describe(`${method}: call with executionPayloadV4`, () => {
  it('valid data', async () => {
    // get the genesis json with late enougt date with respect to block data in batchBlocks

    const { pragueJson, pragueTime } = readyPragueGenesis(genesisJSON)
    const { server } = await setupChain(pragueJson, 'post-merge', { engine: true })
    const rpc = getRpcClient(server)
    const validBlock = {
      ...blockData,
      timestamp: bigIntToHex(BigInt(pragueTime)),
      withdrawals: [],
      blobGasUsed: '0x0',
      excessBlobGas: '0x0',
      depositRequests: [],
      withdrawalRequests: [],
      parentHash: '0x851260e77fad1197f6a57510bd970f5976ed213855522b5e9d02206c47b26953',
      stateRoot: '0x2cc2d8f1559ed8c16f31d76b613e37583cc255815004c791d19f6072bcb26871',
      blockHash: '0xf3e1fbbff8228a93bcdc9cdf88fc44940ca473709faa4f999a32266429903614',
    }
    let res

    const oldMethods = ['engine_newPayloadV1', 'engine_newPayloadV2', 'engine_newPayloadV3']
    const expectedErrors = [
      'NewPayloadV2 MUST be used after Shanghai is activated',
      'NewPayloadV3 MUST be used after Cancun is activated',
      'NewPayloadV4 MUST be used after Prague is activated',
    ]
    for (let index = 0; index < oldMethods.length; index++) {
      const oldMethod = oldMethods[index]
      const expectedError = expectedErrors[index]
      // extra params for old methods should be auto ignored
      res = await rpc.request(oldMethod, [validBlock, [], parentBeaconBlockRoot])
      assert.equal(res.error.code, INVALID_PARAMS)
      assert.ok(res.error.message.includes(expectedError))
    }

    res = await rpc.request(method, [validBlock, [], parentBeaconBlockRoot])
    // TODO: start the genesis state with deployed 7002 contract
    assert.equal(res.result.status, 'VALID')

    res = await rpc.request('engine_forkchoiceUpdatedV3', validPayload)
    const payloadId = res.result.payloadId
    assert.ok(payloadId !== undefined && payloadId !== null, 'valid payloadId should be received')
    res = await rpc.request('engine_getPayloadV3', [payloadId])
    const { executionPayload } = res.result
    assert.ok(
      executionPayload.depositRequests !== undefined,
      'depositRequests field should be received'
    )
    assert.ok(
      executionPayload.withdrawalRequests !== undefined,
      'depositRequests field should be received'
    )
  })
})

const electraGenesisContracts = {
  '0x25a219378dad9b3503c8268c9ca836a52427a4fb': {
    balance: '0',
    nonce: '1',
    code: '0x60203611603157600143035f35116029575f356120000143116029576120005f3506545f5260205ff35b5f5f5260205ff35b5f5ffd00',
  },
  '0x00A3ca265EBcb825B45F985A16CEFB49958cE017': {
    balance: '0',
    nonce: '1',
    code: '0x3373fffffffffffffffffffffffffffffffffffffffe146090573615156028575f545f5260205ff35b366038141561012e5760115f54600182026001905f5b5f82111560595781019083028483029004916001019190603e565b90939004341061012e57600154600101600155600354806003026004013381556001015f3581556001016020359055600101600355005b6003546002548082038060101160a4575060105b5f5b81811460dd5780604c02838201600302600401805490600101805490600101549160601b83528260140152906034015260010160a6565b910180921460ed579060025560f8565b90505f6002555f6003555b5f548061049d141561010757505f5b60015460028282011161011c5750505f610122565b01600290035b5f555f600155604c025ff35b5f5ffd',
    storage: {
      '0x0000000000000000000000000000000000000000000000000000000000000000':
        '0x000000000000000000000000000000000000000000000000000000000000049d',
    },
  },
}
