import { BINARY_ACCOUNT_SIZE } from '@ethereumjs/util'

/** Accounts per arena page (`32_768 × 104` ≈ `3.4 MB` external memory per page). */
export const ARENA_PAGE_ACCOUNTS = 32_768

const PAGE_BYTES = ARENA_PAGE_ACCOUNTS * BINARY_ACCOUNT_SIZE

/**
 * Fixed-size pages for 104-byte snap account records (WP-04g).
 * Slot indices are dense integers; pages are never shrunk.
 */
export class BinaryAccountArena {
  private readonly pages: Uint8Array[] = []
  private readonly freeSlots: number[] = []
  private highWater = 0

  /** Allocate a slot index for a new account record. */
  alloc(): number {
    const recycled = this.freeSlots.pop()
    if (recycled !== undefined) return recycled
    const slot = this.highWater++
    const pageIndex = Math.floor(slot / ARENA_PAGE_ACCOUNTS)
    if (this.pages[pageIndex] === undefined) {
      this.pages[pageIndex] = new Uint8Array(PAGE_BYTES)
    }
    return slot
  }

  /** Return a slot to the free list after eviction or delete. */
  release(slot: number): void {
    this.freeSlots.push(slot)
  }

  /** Copy `src` (104 bytes) into `slot`. */
  write(slot: number, src: Uint8Array, srcOffset = 0): void {
    const page = this.pageForSlot(slot)
    const off = (slot % ARENA_PAGE_ACCOUNTS) * BINARY_ACCOUNT_SIZE
    page.set(src.subarray(srcOffset, srcOffset + BINARY_ACCOUNT_SIZE), off)
  }

  /** Copy 104 bytes from `slot` into `target` at `targetOffset`. */
  copyOut(slot: number, target: Uint8Array, targetOffset = 0): void {
    const page = this.pageForSlot(slot)
    const off = (slot % ARENA_PAGE_ACCOUNTS) * BINARY_ACCOUNT_SIZE
    target.set(page.subarray(off, off + BINARY_ACCOUNT_SIZE), targetOffset)
  }

  /** Read 104 bytes from `slot` into a fresh owned buffer. */
  copyOutOwned(slot: number): Uint8Array {
    const out = new Uint8Array(BINARY_ACCOUNT_SIZE)
    this.copyOut(slot, out)
    return out
  }

  /** True when `slot` is below the high-water mark (may still be on free list). */
  slotWasAllocated(slot: number): boolean {
    return slot >= 0 && slot < this.highWater
  }

  private pageForSlot(slot: number): Uint8Array {
    const pageIndex = Math.floor(slot / ARENA_PAGE_ACCOUNTS)
    const page = this.pages[pageIndex]
    if (page === undefined) {
      throw new Error(`BinaryAccountArena: missing page for slot ${slot}`)
    }
    return page
  }
}
