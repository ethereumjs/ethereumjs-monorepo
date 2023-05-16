export class Journaling<K, V> {
  public journal: Map<K, Map<V, number>>
  protected journalStack: { [key: number]: Set<K> }
  protected journalHeight: Map<K, number>
  protected height: number

  constructor() {
    this.journal = new Map()
    this.journalStack = {}
    this.journalHeight = new Map()
    this.height = 0
  }

  clear() {
    this.journal.clear()
    this.journalStack = {}
    this.journalHeight = new Map()
    this.height = 0
  }

  checkpoint() {
    this.height++
  }

  revert(ignoreItem?: K) {
    const height = this.height
    if (height in this.journalStack) {
      for (const key of this.journalStack[height]) {
        // Exceptional case due to consensus issue in Geth and Parity.
        // See [EIP issue #716](https://github.com/ethereum/EIPs/issues/716) for context.
        // The RIPEMD precompile has to remain *touched* even when the call reverts,
        // and be considered for deletion.
        if (key === ignoreItem) {
          continue
        }

        if (this.journal.has(key) && this.journalHeight.get(key)! >= height) {
          this.journal.delete(key)
          this.journalHeight.delete(key)
        }
      }
      delete this.journalStack[height]
    }
    this.height--
  }

  commit() {
    const height = this.height
    if (height in this.journalStack) {
      // Copy the items-to-delete in case of a revert into one level higher
      if (height > 0) {
        if (this.journalStack[height - 1] === undefined) {
          this.journalStack[height - 1] = new Set()
        }
        for (const address of this.journalStack[height]) {
          this.journalStack[height - 1].add(address)
          if (this.journalHeight.get(address) === height) {
            this.journalHeight.set(address, height - 1)
          }
        }
      } else {
        this.journal = new Map()
        this.journalHeight = new Map()
      }
      delete this.journalStack[height]
    }
    this.height--
  }

  addJournalItem(key: K, value: V) {
    const height = this.height
    if (!(height in this.journalStack)) {
      this.journalStack[height] = new Set()
    }
    this.journalStack[height].add(key)

    this.journal.set(key, value)
    if (this.journalHeight.get(key) === undefined) {
      this.journalHeight.set(key, height)
    }
  }
}
