import { FieldContext } from './index.js'

export class FieldAllocs {
  private alloced: Map<number, FieldContext>
  private active: FieldContext | null
  private allocedSize: bigint

  constructor() {
    this.alloced = new Map()
    this.active = null
    this.allocedSize = BigInt(0)
  }

  /**
   * AllocAndSetActive takes an id (number between 0 and 255 inclusive),
   * a big-endian modulus, and the number of field elements to allocate.
   * Each field element occupies memory equivalent to the size of the modulus
   * padded to the nearest multiple of 8 bytes.
   */
  async AllocAndSetActive(id: number, modulus: Uint8Array, allocCount: bigint): Promise<void> {
    if (id < 0 || id > 255) {
      throw new Error('id must be between 0 and 255 inclusive')
    }

    const fieldContext = new FieldContext(modulus, allocCount)
    this.alloced.set(id, fieldContext)
    this.active = fieldContext
    this.allocedSize += BigInt(fieldContext.getAllocatedSize())
  }

  /**
   * AllocSize returns the amount of EVMMAX-allocated memory (in bytes)
   * in the current EVM call context.
   */
  AllocSize(): bigint {
    return this.allocedSize
  }

  /**
   * SetActive sets a modulus as active in the current EVM call context.
   * The modulus associated with id is assumed to have already been instantiated
   * by a previous call to AllocAndSetActive.
   */
  SetActive(id: number): void {
    const fieldContext = this.alloced.get(id)
    if (!fieldContext) {
      throw new Error(`FieldContext with id ${id} not found`)
    }
    this.active = fieldContext
  }

  getActive(): FieldContext {
    if (this.active == null) throw new Error('Active not set')
    return this.active
  }
}
