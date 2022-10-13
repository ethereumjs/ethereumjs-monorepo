import * as tape from 'tape'

import { BlobEIP4844Transaction, TransactionFactory } from '../src'

tape('EIP4844 constructor tests', (t) => {
  const txData = {
    type: 0x05,
    versionedHashes: [Buffer.from([])],
  }
  const tx = BlobEIP4844Transaction.fromTxData(txData)
  t.equal(tx.type, 5, 'successfully instantiated a blob transaction from txData')
  const factoryTx = TransactionFactory.fromTxData(txData)
  t.equal(factoryTx.type, 5, 'instantiated a blob transaction from the tx factory')

  const serializedTx = tx.serialize()
  t.equal(serializedTx[0], 5, 'successfully serialized a blob tx')
  const deserializedTx = BlobEIP4844Transaction.fromSerializedTx(serializedTx)
  t.equal(deserializedTx.type, 5, 'deserialized a blob tx')
  t.end()
})
