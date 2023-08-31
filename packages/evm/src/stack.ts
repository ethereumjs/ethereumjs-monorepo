import { ERROR, EvmError } from './exceptions.js'

/**
 * Implementation of the stack used in evm.
 */
export class Stack {
  _store: bigint[]
  _maxHeight: number

  private _len: number = 0

  constructor(maxHeight?: number) {
    this._store = [] //Array(maxHeight ?? 1024) -> initializing the array makes the constructor 10x slower
    this._maxHeight = maxHeight ?? 1024
  }

  get length() {
    return this._len
  }

  push(value: bigint) {
    if (this._len >= this._maxHeight) {
      throw new EvmError(ERROR.STACK_OVERFLOW)
    }

    this._store[this._len++] = value
  }

  pop(): bigint {
    if (this._len < 1) {
      throw new EvmError(ERROR.STACK_UNDERFLOW)
    }

    // Length is checked above, so pop shouldn't return undefined
    return this._store[--this._len]
  }

  /**
   * Pop multiple items from stack. Top of stack is first item
   * in returned array.
   * @param num - Number of items to pop
   */
  popN(num: number = 1): bigint[] {
    if (this._len < num) {
      throw new EvmError(ERROR.STACK_UNDERFLOW)
    }

    if (num === 0) {
      return []
    }

    const arr = Array(num)
    const cache = this._store

    for (let pop = 0; pop < num; pop++) {
      arr[pop] = cache[--this._len]
    }

    return arr
  }

  /**
   * Return items from the stack
   * @param num Number of items to return
   * @throws {@link ERROR.STACK_UNDERFLOW}
   */
  peek(num: number = 1): bigint[] {
    const peekArray: bigint[] = Array(num)
    let start = this._len

    for (let peek = 0; peek < num; peek++) {
      const index = --start
      if (index < 0) {
        throw new EvmError(ERROR.STACK_UNDERFLOW)
      }
      peekArray[peek] = this._store[index]
    }
    return peekArray
  }

  /**
   * Swap top of stack with an item in the stack.
   * @param position - Index of item from top of the stack (0-indexed)
   */
  swap(position: number) {
    if (this._len <= position) {
      throw new EvmError(ERROR.STACK_UNDERFLOW)
    }

    const head = this._len - 1
    const i = head - position
    const sto = this._store

    const tmp = sto[head]
    sto[head] = sto[i]
    sto[i] = tmp
  }

  /**
   * Pushes a copy of an item in the stack.
   * @param position - Index of item to be copied (1-indexed)
   */
  // I would say that we do not need this method any more
  // since you can't copy a primitive data type
  // Nevertheless not sure if we "loose" something here?
  // Will keep commented out for now
  dup(position: number) {
    const len = this._len
    if (len < position) {
      throw new EvmError(ERROR.STACK_UNDERFLOW)
    }
    if (len >= this._maxHeight) {
      throw new EvmError(ERROR.STACK_OVERFLOW)
    }

    const i = len - position
    this._store[this._len++] = this._store[i]
  }
}
