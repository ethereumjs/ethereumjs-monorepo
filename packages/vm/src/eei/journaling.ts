export class Journaling<T> {
  public journal: Set<T>
  protected journalStack: { [key: number]: Set<T> }
  protected journalHeight: Map<T, number>
  protected height: number

  constructor() {
    this.journal = new Set()
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

  revert(ignoreItem?: T) {
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
        this.journal = new Set()
        this.journalHeight = new Map()
      }
      delete this.journalStack[height]
    }
    this.height--
  }

  addJournalItem(input: T) {
    const height = this.height
    if (!(height in this.journalStack)) {
      this.journalStack[height] = new Set()
    }
    this.journalStack[height].add(input)

    this.journal.add(input)
    if (this.journalHeight.get(input) === undefined) {
      this.journalHeight.set(input, height)
    }
  }
}
