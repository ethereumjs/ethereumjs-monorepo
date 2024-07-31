import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bigIntToHex, createAddressFromString } from '@ethereumjs/util'
import { runBlock } from '@ethereumjs/vm'
import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullEthereumService } from '../../../src/service/index.js'
import type { Block } from '@ethereumjs/block'
import type { PrefixedHexString } from '@ethereumjs/util'

const method = 'eth_getProof'

const expectedProof = {
  address: '0x9288f8f702cbfb8cc5890819c1c1e2746e684d07',
  balance: '0x0',
  codeHash: '0x05698751a8fe928d7049ee0af6927f3ff6e398d7d11293ea4c6786d7cfc3dbd4',
  nonce: '0x1',
  storageHash: '0xb39609ba55cc225a26265fc5e80d51e07a4410c1725cf69dbf15a8b09ad1a0a0',
  accountProof: [
    '0xf8718080808080a0b356351d60bc9894cf1f1d6cb68c815f0131d50f1da83c4023a09ec855cfff91808080a086a4665abc4f7e6f3a2da6a3c112616b1954be58ac4f6ff236b5b5f9ba295e4ca043a5b2616ae3a304fe34c5402d41893c49cb75b2ecd25b8b8b53f0926c957f23808080808080',
    '0xf869a03bdcfb03f3efaf0a5250648861b575109e8bb8084a0b74b0ec15d41366a4a7abb846f8440180a0b39609ba55cc225a26265fc5e80d51e07a4410c1725cf69dbf15a8b09ad1a0a0a005698751a8fe928d7049ee0af6927f3ff6e398d7d11293ea4c6786d7cfc3dbd4',
  ],
  storageProof: [
    {
      key: '0x0',
      value: '0x04d2',
      proof: [
        '0xf8518080a036bb5f2fd6f99b186600638644e2f0396989955e201672f7e81e8c8f466ed5b9a010859880cfb38603690e8c4dfcc5595c203de6b901a503f944ef21a6120926a680808080808080808080808080',
        '0xe5a0390decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563838204d2',
      ],
    },
  ],
}

// Note: this is all added to ensure to run on Istanbul hardfork, and without a mainnet genesis state setup
// Without this, the test will fail because the store() method uses SHR
// Which is only available since Constantinople (and thus also in Istanbul)
// Preserving to use Istanbul as hardfork as per the original test
const testnetData = {
  name: 'testnet2',
  chainId: 12345,
  defaultHardfork: 'istanbul',
  consensus: {
    type: 'pow',
    algorithm: 'ethash',
  },
  genesis: {
    gasLimit: 1000000,
    difficulty: 1,
    nonce: '0x0000000000000000' as PrefixedHexString,
    extraData: '0x' as PrefixedHexString,
  },
  hardforks: [
    {
      name: 'chainstart',
      block: 0,
    },
    {
      name: 'homestead',
      block: 0,
    },
    {
      name: 'tangerineWhistle',
      block: 0,
    },
    {
      name: 'spuriousDragon',
      block: 0,
    },
    {
      name: 'byzantium',
      block: 0,
    },
    {
      name: 'constantinople',
      block: 0,
    },
    {
      name: 'istanbul',
      block: 0,
    },
  ],
  bootstrapNodes: [],
}

const common = new Common({ chain: 'testnet2', customChains: [testnetData] })

describe(method, async () => {
  it('call with valid arguments', async () => {
    const blockchain = await createBlockchain({
      common,
      validateBlocks: false,
      validateConsensus: false,
    })

    const client = await createClient({ blockchain, commonChain: common, includeVM: true })
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
    assert.notEqual(execution, undefined, 'should have valid execution')
    const { vm } = execution

    // genesis address with balance
    const address = createAddressFromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

    // contract inspired from https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getstorageat/
    /*
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.7.4;

    contract Storage {
        uint pos0;
        mapping(address => uint) pos1;
        function store() public {
            pos0 = 1234;
            pos1[msg.sender] = 5678;
        }
    }
  */
    const data =
      '0x6080604052348015600f57600080fd5b5060bc8061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063975057e714602d575b600080fd5b60336035565b005b6104d260008190555061162e600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555056fea2646970667358221220b16fe0abdbdcae31fa05c5717ebc442024b20fb637907d1a05547ea2d8ec8e5964736f6c63430007060033'

    // construct block with tx
    const gasLimit = 2000000
    const tx = createLegacyTx({ gasLimit, data }, { common, freeze: false })
    tx.getSenderAddress = () => {
      return address
    }
    const parent = await blockchain.getCanonicalHeadHeader()
    const block = createBlock(
      {
        header: {
          parentHash: parent.hash(),
          number: 1,
          gasLimit,
        },
      },
      { common, calcDifficultyFromHeader: parent },
    )
    block.transactions[0] = tx

    // deploy contract
    let ranBlock: Block | undefined = undefined
    vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
    const result = await runBlock(vm, { block, generate: true, skipBlockValidation: true })
    const { createdAddress } = result.results[0]
    await vm.blockchain.putBlock(ranBlock!)

    // call store() method
    const funcHash = '975057e7' // store()
    const storeTxData = {
      to: createdAddress!.toString(),
      from: address.toString(),
      data: `0x${funcHash}` as PrefixedHexString,
      gasLimit: bigIntToHex(BigInt(530000)),
      nonce: 1,
    }
    const storeTx = createLegacyTx(storeTxData, { common, freeze: false })
    storeTx.getSenderAddress = () => {
      return address
    }
    const block2 = createBlock(
      {
        header: {
          parentHash: ranBlock!.hash(),
          number: 2,
          gasLimit,
        },
      },
      { common, calcDifficultyFromHeader: block.header },
    )
    block2.transactions[0] = storeTx

    // run block
    let ranBlock2: Block | undefined = undefined
    vm.events.once('afterBlock', (result: any) => (ranBlock2 = result.block))
    await runBlock(vm, { block: block2, generate: true, skipBlockValidation: true })
    await vm.blockchain.putBlock(ranBlock2!)

    // verify proof is accurate
    const res = await rpc.request(method, [createdAddress!.toString(), ['0x0'], 'latest'])
    assert.deepEqual(res.result, expectedProof, 'should return the correct proof')
  })
})
