export type Comparator<T> = (a: T, b: T) => number

export interface QHeapOptions<T> {
  comparBefore?(a: T, b: T): boolean
  compar?(a: T, b: T): number
  freeSpace?: number
  size?: number
}

export class QHeap<T> {
  private data: T[]
  private comparator: Comparator<T>

  constructor(opts?: QHeapOptions<T>) {
    this.data = []
    this.comparator = opts?.compar || ((a: T, b: T) => (a as any) - (b as any))
    if (opts?.size && opts.size > 0) this.data.length = opts.size
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2)
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2
  }

  private swap(index1: number, index2: number): void {
    ;[this.data[index1], this.data[index2]] = [this.data[index2], this.data[index1]]
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index)
      if (this.comparator(this.data[parentIndex], this.data[index]) > 0) {
        this.swap(parentIndex, index)
        index = parentIndex
      } else {
        break
      }
    }
  }

  private bubbleDown(index: number): void {
    const length = this.data.length
    while (index < length) {
      let minIndex = index
      const leftChildIndex = this.getLeftChildIndex(index)
      const rightChildIndex = this.getRightChildIndex(index)

      if (
        leftChildIndex < length &&
        this.comparator(this.data[leftChildIndex], this.data[minIndex]) < 0
      ) {
        minIndex = leftChildIndex
      }

      if (
        rightChildIndex < length &&
        this.comparator(this.data[rightChildIndex], this.data[minIndex]) < 0
      ) {
        minIndex = rightChildIndex
      }

      if (minIndex !== index) {
        this.swap(index, minIndex)
        index = minIndex
      } else {
        break
      }
    }
  }

  insert(item: T): void {
    this.data.push(item)
    this.bubbleUp(this.data.length - 1)
  }

  push(item: T): void {
    this.insert(item)
  }

  enqueue(item: T): void {
    this.insert(item)
  }

  remove(): T | undefined {
    if (this.data.length === 0) return undefined
    this.swap(0, this.data.length - 1)
    const removed = this.data.pop()
    this.bubbleDown(0)
    return removed
  }

  shift(): T | undefined {
    return this.remove()
  }

  dequeue(): T | undefined {
    return this.remove()
  }

  peek(): T | undefined {
    return this.data.length > 0 ? this.data[0] : undefined
  }

  get length(): number {
    return this.data.length
  }

  gc(opts: { minLength: number; maxLength: number }): void {
    while (this.data.length > opts.maxLength) {
      this.remove()
    }
    while (this.data.length < opts.minLength) {
      this.insert(null as any)
    }
  }
}
