import type { BlockLevelAccessList, PrefixedHexString } from '@ethereumjs/util'

/**
 * Block access list side effects (EIP-7928). No-op when the EIP is inactive.
 */
export interface BlockAccessListRecorder {
  addAddress(addressHex: string): void
  checkpoint(): void
  revert(): void
  commit(): void
}

export class NoopBlockAccessListRecorder implements BlockAccessListRecorder {
  addAddress(_addressHex: string): void {}
  checkpoint(): void {}
  revert(): void {}
  commit(): void {}
}

export class BlockLevelAccessListRecorder implements BlockAccessListRecorder {
  private list: BlockLevelAccessList

  constructor(list: BlockLevelAccessList) {
    this.list = list
  }

  addAddress(addressHex: string): void {
    this.list.addAddress(addressHex as PrefixedHexString)
  }

  checkpoint(): void {
    this.list.checkpoint()
  }

  revert(): void {
    this.list.revert()
  }

  commit(): void {
    this.list.commit()
  }
}

export function createBlockAccessListRecorder(
  active: boolean,
  list?: BlockLevelAccessList,
): BlockAccessListRecorder {
  if (!active || list === undefined) {
    return new NoopBlockAccessListRecorder()
  }
  return new BlockLevelAccessListRecorder(list)
}
