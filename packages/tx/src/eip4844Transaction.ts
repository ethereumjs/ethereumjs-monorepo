import { BaseTransaction } from './baseTransaction'

import type { FeeMarketEIP1559Transaction } from './eip1559Transaction'
import type {
  AccessListEIP2930ValuesArray,
  FeeMarketEIP1559ValuesArray,
  JsonTx,
  TxValuesArray,
} from './types'

const TRANSACTION_TYPE = 0x05

export class Blob4844Transaction extends BaseTransaction<FeeMarketEIP1559Transaction> {
  getUpfrontCost(): bigint {
    throw new Error('Method not implemented.')
  }
  raw(): TxValuesArray | AccessListEIP2930ValuesArray | FeeMarketEIP1559ValuesArray {
    throw new Error('Method not implemented.')
  }
  serialize(): Buffer {
    throw new Error('Method not implemented.')
  }
  getMessageToSign(hashMessage: false): Buffer | Buffer[]
  getMessageToSign(hashMessage?: true | undefined): Buffer
  getMessageToSign(hashMessage?: unknown): Buffer | Buffer[] {
    throw new Error('Method not implemented.')
  }
  hash(): Buffer {
    throw new Error('Method not implemented.')
  }
  getMessageToVerifySignature(): Buffer {
    throw new Error('Method not implemented.')
  }
  getSenderPublicKey(): Buffer {
    throw new Error('Method not implemented.')
  }
  toJSON(): JsonTx {
    throw new Error('Method not implemented.')
  }
  protected _processSignature(v: bigint, r: Buffer, s: Buffer): FeeMarketEIP1559Transaction {
    throw new Error('Method not implemented.')
  }
  public errorStr(): string {
    throw new Error('Method not implemented.')
  }
  protected _errorMsg(msg: string): string {
    throw new Error('Method not implemented.')
  }
}
