import { Block } from '@ethereumjs/block'
import { Withdrawal, bigIntToHex, intToHex } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import genesisJSON = require('../../testdata/geth-genesis/withdrawals.json')
import { baseRequest, params, setupChain } from '../helpers'
import { checkError } from '../util'

import type { ExecutionPayload } from '../../../lib/rpc/modules/engine'

const validPayloadAttributes = {
  timestamp: '0x2f',
  prevRandao: '0xff00000000000000000000000000000000000000000000000000000000000000',
  suggestedFeeRecipient: '0xaa00000000000000000000000000000000000000',
}

const withdrawalsVector = [
  {
    Index: 0,
    Validator: 65535,
    Recipient: '0x0000000000000000000000000000000000000000',
    Amount: '0',
  },
  {
    Index: 1,
    Validator: 65536,
    Recipient: '0x0100000000000000000000000000000000000000',
    Amount: '452312848583266388373324160190187140051835877600158453279131187530910662656',
  },
  {
    Index: 2,
    Validator: 65537,
    Recipient: '0x0200000000000000000000000000000000000000',
    Amount: '904625697166532776746648320380374280103671755200316906558262375061821325312',
  },
  {
    Index: 3,
    Validator: 65538,
    Recipient: '0x0300000000000000000000000000000000000000',
    Amount: '1356938545749799165119972480570561420155507632800475359837393562592731987968',
  },
  {
    Index: 4,
    Validator: 65539,
    Recipient: '0x0400000000000000000000000000000000000000',
    Amount: '1809251394333065553493296640760748560207343510400633813116524750123642650624',
  },
  {
    Index: 5,
    Validator: 65540,
    Recipient: '0x0500000000000000000000000000000000000000',
    Amount: '2261564242916331941866620800950935700259179388000792266395655937654553313280',
  },
  {
    Index: 6,
    Validator: 65541,
    Recipient: '0x0600000000000000000000000000000000000000',
    Amount: '2713877091499598330239944961141122840311015265600950719674787125185463975936',
  },
  {
    Index: 7,
    Validator: 65542,
    Recipient: '0x0700000000000000000000000000000000000000',
    Amount: '3166189940082864718613269121331309980362851143201109172953918312716374638592',
  },
]

const withdrawalsGethVector = withdrawalsVector.map((testVec) => ({
  index: intToHex(testVec.Index),
  validatorIndex: intToHex(testVec.Validator),
  address: testVec.Recipient,
  amount: bigIntToHex(BigInt(testVec.Amount)),
}))

const validForkChoiceState = {
  headBlockHash: '0xfe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710',
  safeBlockHash: '0xfe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710',
  finalizedBlockHash: '0xfe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710',
}

const testCases = [
  {
    name: 'empty withdrawals',
    withdrawals: [],
    withdrawalsRoot: '56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  },
  {
    name: '8 withdrawals',
    withdrawals: withdrawalsGethVector,
    withdrawalsRoot: 'b695b29ec7ee934ef6a68838b13729f2d49fffe26718de16a1a9ed94a4d7d06d',
  },
]

for (const { name, withdrawals, withdrawalsRoot } of testCases) {
  const validPayloadAttributesWithWithdrawals = { ...validPayloadAttributes, withdrawals }
  tape(name, async (t) => {
    // check withdrawals root computation
    const computedWithdrawalsRoot = (
      await Block.withdrawalsTrieRoot(withdrawals.map(Withdrawal.fromWithdrawalData))
    ).toString('hex')
    t.equal(withdrawalsRoot, computedWithdrawalsRoot, 'withdrawalsRoot compuation should match')
    const { server } = await setupChain(genesisJSON, 'post-merge', { engine: true })

    let req = params('engine_forkchoiceUpdatedV2', [validForkChoiceState, validPayloadAttributes])
    let expectRes = checkError(
      t,
      INVALID_PARAMS,
      "invalid argument 1 for key 'withdrawals': argument is not array"
    )
    await baseRequest(t, server, req, 200, expectRes, false)

    req = params('engine_forkchoiceUpdatedV2', [
      validForkChoiceState,
      validPayloadAttributesWithWithdrawals,
    ])
    let payloadId
    expectRes = (res: any) => {
      t.equal(res.body.result.payloadId !== undefined, true)
      payloadId = res.body.result.payloadId
    }
    await baseRequest(t, server, req, 200, expectRes, false)

    let payload: ExecutionPayload | undefined = undefined
    req = params('engine_getPayloadV2', [payloadId])
    expectRes = (res: any) => {
      payload = res.body.result
      t.equal(payload!.blockNumber, '0x1')
      t.equal(payload!.withdrawals!.length, withdrawals.length, 'withdrawals should match')
    }
    await baseRequest(t, server, req, 200, expectRes, false)

    req = params('engine_newPayloadV2', [payload])
    expectRes = (res: any) => {
      t.equal(res.body.result.status, 'VALID')
    }
    await baseRequest(t, server, req, 200, expectRes, false)

    req = params('engine_forkchoiceUpdatedV2', [
      {
        ...validForkChoiceState,
        headBlockHash: payload!.blockHash,
      },
    ])
    expectRes = async (res: any) => {
      t.equal(res.body.result.payloadStatus.status, 'VALID')
    }
    await baseRequest(t, server, req, 200, expectRes)
  })
}
