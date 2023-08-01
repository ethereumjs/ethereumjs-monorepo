import { TransactionFactory } from '@ethereumjs/tx'
import { bigIntToHex, bytesToBigInt, bytesToHex, hexToBytes, setLengthLeft } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { assert, beforeEach, describe, it } from 'vitest'

import { INTERNAL_ERROR, INVALID_PARAMS } from '../../../src/rpc/error-code'
import genesisJSON from '../../testdata/geth-genesis/debug.json'
import { baseRequest, dummy, params, setupChain } from '../helpers'
import { checkError } from '../util'

import type { Block } from '@ethereumjs/block'
import type { StorageRange } from '@ethereumjs/common/src'
import type { Address } from '@ethereumjs/util'
import type { HttpServer } from 'jayson/promise'

const method = 'debug_storageRangeAt'

/*
  Contract used to test storageRangeAt(), compiled with solc 0.8.18+commit.87f61d96
  ```sol
  pragma solidity ^0.8.0;

  contract Storage {
      uint256 public x;
      uint256 public y;
      uint256 public z;

      constructor() {
          x = 0x42;
          y = 0x01;
          z = 0x02;
      }

      function update() public {
          x = 0x43;
      }
  }
  ```
*/
const storageBytecode: string =
  '0x608060405234801561001057600080fd5b5060426000819055506001808190555060028081905550610123806100366000396000f3fe6080604052348015600f57600080fd5b506004361060465760003560e01c80630c55699c14604b578063a2e62045146065578063a56dfe4a14606d578063c5d7802e146087575b600080fd5b605160a1565b604051605c919060d4565b60405180910390f35b606b60a7565b005b607360b1565b604051607e919060d4565b60405180910390f35b608d60b7565b6040516098919060d4565b60405180910390f35b60005481565b6043600081905550565b60015481565b60025481565b6000819050919050565b60ce8160bd565b82525050565b600060208201905060e7600083018460c7565b9291505056fea2646970667358221220702e3426f9487bc4c75cca28733223e1292e723c32bbea553973c1ebeaeeb87d64736f6c63430008120033'
/*
  Function selector of the contract's update() function.
 */
const updateBytecode: string = '0xa2e62045'
/*
  Contract used to test storageRangeAt(), compiled with solc 0.8.18+commit.87f61d96
  ```sol
  pragma solidity ^0.8.0;

  contract Empty {
      constructor() {
      }
  }
  ```
*/
const noStorageBytecode: string =
  '0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea26469706673582212202f85c21c604b5e0fde9dca0615b4dd49a586dd18ada5ad8b85aa950462e1e73664736f6c63430008120033'

describe(method, () => {
  /**
   * Object that is initialized before each test.
   */
  interface TestSetup {
    /**
     * The server object to query for the tests.
     */
    server: HttpServer
    /**
     * The block that contains the transactions to be tested.
     */
    block: Block
    /**
     * The address of the created dummy contract.
     */
    createdAddress: Address
    /**
     * The address of another created dummy contract that does not contain storage.
     */
    createdAddressNoStorage: Address
  }

  beforeEach<TestSetup>(async (context) => {
    // Populate a chain with three transactions: the first one deploys a contract,
    // the second one updates a value in that contract, and the third one deploys
    // another contract that does not put anything in its storage.

    const { chain, common, execution, server } = await setupChain(genesisJSON, 'post-merge', {
      txLookupLimit: 0,
    })

    const firstTx = TransactionFactory.fromTxData(
      {
        type: 0x2,
        gasLimit: 10000000,
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1,
        value: 0,
        data: storageBytecode,
      },
      { common, freeze: false }
    ).sign(dummy.privKey)

    const vmCopy = await execution.vm.shallowCopy()
    const parentBlock = await chain.getCanonicalHeadBlock()
    const blockBuilder = await vmCopy.buildBlock({
      parentBlock,
      headerData: {
        timestamp: parentBlock.header.timestamp + BigInt(1),
      },
      blockOpts: {
        calcDifficultyFromHeader: parentBlock.header,
        putBlockIntoBlockchain: false,
      },
    })

    const result = await blockBuilder.addTransaction(firstTx, { skipHardForkValidation: true })

    const secondTx = TransactionFactory.fromTxData(
      {
        to: result.createdAddress,
        type: 0x2,
        gasLimit: 10000000,
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1,
        value: 0,
        nonce: 1,
        data: updateBytecode,
      },
      { common, freeze: false }
    ).sign(dummy.privKey)

    await blockBuilder.addTransaction(secondTx, { skipHardForkValidation: true })

    const thirdTx = TransactionFactory.fromTxData(
      {
        type: 0x2,
        gasLimit: 10000000,
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1,
        value: 0,
        nonce: 2,
        data: noStorageBytecode,
      },
      { common, freeze: false }
    ).sign(dummy.privKey)

    const thirdResult = await blockBuilder.addTransaction(thirdTx, { skipHardForkValidation: true })

    const block = await blockBuilder.build()
    await chain.putBlocks([block], true)

    context.server = server
    context.block = await chain.getCanonicalHeadBlock()
    context.createdAddress = result.createdAddress!!
    context.createdAddressNoStorage = thirdResult.createdAddress!!
  })

  it<TestSetup>('Should return the correct (number of) key value pairs.', async ({
    server,
    block,
    createdAddress,
  }) => {
    const req = params(method, [
      bytesToHex(block.hash()),
      1,
      createdAddress.toString(),
      '0x00',
      100,
    ])
    const expectRes = (res: any) => {
      const storageRange: StorageRange = res.body.result

      const firstVariableHash = keccak256(setLengthLeft(hexToBytes('0x00'), 32))
      assert.equal(
        storageRange.storage[bytesToHex(firstVariableHash)].value,
        '0x43',
        'First variable correctly included.'
      )

      const secondVariableHash = keccak256(setLengthLeft(hexToBytes('0x01'), 32))
      assert.equal(
        storageRange.storage[bytesToHex(secondVariableHash)].value,
        '0x01',
        'Second variable correctly included.'
      )

      const thirdVariableHash = keccak256(setLengthLeft(hexToBytes('0x02'), 32))
      assert.equal(
        storageRange.storage[bytesToHex(thirdVariableHash)].value,
        '0x02',
        'Third variable correctly included.'
      )

      assert.equal(
        Object.keys(storageRange.storage).length,
        3,
        'Call returned the correct number of key value pairs.'
      )
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should return an old storage state if requested.', async ({
    server,
    block,
    createdAddress,
  }) => {
    // Call the method with txIndex = 0.
    const req = params(method, [
      bytesToHex(block.hash()),
      0,
      createdAddress.toString(),
      '0x00',
      100,
    ])
    const expectRes = (res: any) => {
      const storageRange: StorageRange = res.body.result

      const hashedKey = keccak256(setLengthLeft(hexToBytes('0x00'), 32))
      assert.equal(
        storageRange.storage[bytesToHex(hashedKey)].value,
        '0x42',
        'Old value was correctly reported.'
      )
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should not return too many storage keys.', async ({
    server,
    block,
    createdAddress,
  }) => {
    const req = params(method, [bytesToHex(block.hash()), 1, createdAddress.toString(), '0x00', 2])
    const expectRes = (res: any) => {
      const storageRange: StorageRange = res.body.result

      assert.equal(
        Object.keys(storageRange.storage).length,
        2,
        'Call returned the correct number of key value pairs.'
      )
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should return an empty result for accounts without storage.', async ({
    server,
    block,
    createdAddressNoStorage,
  }) => {
    const req = params(method, [
      bytesToHex(block.hash()),
      2,
      createdAddressNoStorage.toString(),
      '0x00',
      2,
    ])
    const expectRes = (res: any) => {
      const storageRange: StorageRange = res.body.result

      assert.equal(
        Object.keys(storageRange.storage).length,
        0,
        'Call returned the correct number of key value pairs.'
      )

      assert.isNull(storageRange.nextKey, 'nextKey was correctly set to null.')
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should not return keys falling outside the requested range.', async ({
    server,
    block,
    createdAddress,
  }) => {
    // The lowest hashed key in our example contract corresponds to storage slot 0x00.
    const smallestHashedKey = keccak256(setLengthLeft(hexToBytes('0x00'), 32))

    const req = params(method, [
      bytesToHex(block.hash()),
      1,
      createdAddress.toString(),
      // Add 1 to the smallest hashed key in our contract storage.
      bigIntToHex(bytesToBigInt(smallestHashedKey) + BigInt(1)),
      100,
    ])

    const expectRes = (res: any) => {
      const storageRange: StorageRange = res.body.result

      assert.equal(
        Object.keys(storageRange.storage).length,
        2,
        'Call returned the correct number of key value pairs.'
      )

      assert.isUndefined(
        storageRange.storage[bytesToHex(smallestHashedKey)],
        'Smallest hashed key was correctly excluded from result.'
      )
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should provide a null value for nextKey if there is no next key.', async ({
    server,
    block,
    createdAddress,
  }) => {
    const req = params(method, [
      bytesToHex(block.hash()),
      1,
      createdAddress.toString(),
      '0x00',
      100,
    ])
    const expectRes = (res: any) => {
      const storageRange: StorageRange = res.body.result

      assert.isNull(storageRange.nextKey, 'nextKey was correctly set to null.')
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should provide a valid nextKey if there is one.', async ({
    server,
    block,
    createdAddress,
  }) => {
    const req = params(method, [bytesToHex(block.hash()), 1, createdAddress.toString(), '0x00', 2])
    const expectRes = (res: any) => {
      // The largest hashed key in our example contract corresponds to storage slot 0x01.
      const largestHashedKey = bytesToHex(keccak256(setLengthLeft(hexToBytes('0x01'), 32)))

      const storageRange: StorageRange = res.body.result

      assert.equal(storageRange.nextKey, largestHashedKey, 'nextKey was correctly set.')
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should provide a null value for preimages (until this is implemented).', async ({
    server,
    block,
    createdAddress,
  }) => {
    const req = params(method, [
      bytesToHex(block.hash()),
      1,
      createdAddress.toString(),
      '0x00',
      100,
    ])
    const expectRes = (res: any) => {
      const storageRange: StorageRange = res.body.result

      for (const [_, KVPair] of Object.entries(storageRange.storage)) {
        assert.isNull(KVPair.key, 'Storage key preimage was intentionally set to null.')
      }
    }

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should throw an error if the requested block does not exist.', async ({
    server,
    createdAddress,
  }) => {
    const req = params(method, [
      bytesToHex(setLengthLeft(hexToBytes('0x00'), 32)),
      1,
      createdAddress.toString(),
      '0x00',
      100,
    ])
    const expectRes = checkError(INTERNAL_ERROR, 'Could not get requested block hash.')

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should throw an error if txIndex is too small or too large.', async ({
    server,
    block,
    createdAddress,
  }) => {
    let req = params(method, [bytesToHex(block.hash()), -1, createdAddress.toString(), '0x00', 100])
    let expectRes = checkError(INVALID_PARAMS, 'invalid argument 1: argument must be larger than 0')

    await baseRequest(server, req, 200, expectRes, false)

    req = params(method, [bytesToHex(block.hash()), 3, createdAddress.toString(), '0x00', 100])
    expectRes = checkError(
      INTERNAL_ERROR,
      'txIndex cannot be larger than the number of transactions in the block.'
    )

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should throw an error if the address is not formatted correctly.', async ({
    server,
    block,
  }) => {
    const req = params(method, [bytesToHex(block.hash()), 0, '0xabcd'.toString(), '0x00', 100])
    const expectRes = checkError(INVALID_PARAMS, 'invalid argument 2: invalid address')

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should throw an error if the address does not exist.', async ({
    server,
    block,
  }) => {
    // The address is formatted correctly but is not associated with any account.
    const req = params(method, [
      bytesToHex(block.hash()),
      0,
      '0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd'.toString(),
      '0x00',
      100,
    ])
    const expectRes = checkError(INTERNAL_ERROR, 'Account does not exist.')

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>('Should throw an error if limit is too small.', async ({
    server,
    block,
    createdAddress,
  }) => {
    const req = params(method, [bytesToHex(block.hash()), 0, createdAddress.toString(), '0x00', -1])
    const expectRes = checkError(
      INVALID_PARAMS,
      'invalid argument 4: argument must be larger than 0'
    )

    await baseRequest(server, req, 200, expectRes, true)
  })

  it<TestSetup>("Should throw an error if hex parameters do not start with '0x'.", async ({
    server,
    block,
    createdAddress,
  }) => {
    let req = params(method, [
      bytesToHex(block.hash()).slice(2),
      0,
      createdAddress.toString(),
      '0x00',
      -1,
    ])
    let expectRes = checkError(INVALID_PARAMS, 'invalid argument 0: hex string without 0x prefix')

    await baseRequest(server, req, 200, expectRes, false)

    req = params(method, [
      bytesToHex(block.hash()),
      0,
      createdAddress.toString().slice(2),
      '0x00',
      -1,
    ])
    expectRes = checkError(INVALID_PARAMS, 'invalid argument 2: missing 0x prefix')

    await baseRequest(server, req, 200, expectRes, false)

    req = params(method, [bytesToHex(block.hash()), 0, createdAddress.toString(), '00', -1])
    expectRes = checkError(INVALID_PARAMS, 'invalid argument 3: hex string without 0x prefix')

    await baseRequest(server, req, 200, expectRes, true)
  })
})
