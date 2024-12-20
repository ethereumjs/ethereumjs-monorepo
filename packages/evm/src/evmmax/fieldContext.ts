import { BIGINT_8, bytesToBigInt } from '@ethereumjs/util'
import { modInv } from 'bigint-mod-arith'
import { bytesToLimbs } from './util.js'

const MAX_MODULUS_SIZE = 96 // 768 bit max modulus width
const ZERO_BYTE = Uint8Array.from([0])

// checks if m
function isModulusBinary(modulus: bigint): boolean {
  return modulus > 0n && (modulus & (modulus - 1n)) === 0n
}

/**
 * FieldContext manages arithmetic in a finite field defined by a modulus n.
 * If useMontgomeryRepr is enabled, multiplication and inversion use Montgomery form.
 * Addition and subtraction are done at the byte level (bitwise modular arithmetic).
 */
export class FieldContext {
  // private n: bigint = 0n      // modulus as bigint
  // private nBytes: Uint8Array = new Uint8Array() // modulus as bytes
  // private nLen: number = 0    // length of n in bytes
  // private nbits: number = 0   // bit length of n
  // private r: bigint = 0n
  // private rInv: bigint = 0n
  // private nPrime: bigint = 0n
  // private useMontgomeryRepr: boolean = false

  private modulus: Uint8Array[]
	private r2: Uint8Array[]
	private modInv: Uint8Array

	private useMontgomeryRepr: boolean // true if values are represented in montgomery form internally
	private isModulusBinary: boolean

	private scratchSpace: Uint8Array[]
	private addSubCost: Uint8Array
	private mulCost: Uint8Array

	private addMod: Function
	private subMod: Function
	private mulMod: Function

	private one: Uint8Array[]
	private modulusInt: bigint
	private elemSize: bigint
	private scratchSpaceElemCount: bigint

  constructor(modBytes: Uint8Array, scratchSize: bigint) {
    if (modBytes.length > MAX_MODULUS_SIZE) {
      throw new Error("modulus cannot be greater than 768 bits")

    }
    if (modBytes.length === 0) {
      throw new Error("modulus must be non-empty")
    }
    if (modBytes.subarray(0, 2) === ZERO_BYTE) {
      throw new Error("most significant byte of modulus must not be zero")
    }
    if (scratchSize === 0n) {
      throw new Error("scratch space must have non-zero size")
    }
    if (scratchSize > 256n) {
      throw new Error("scratch space can allocate a maximum of 256 field elements")
    }

    const mod = bytesToBigInt(modBytes)
    const paddedSize = BigInt(Math.ceil(modBytes.length / 8) * 8) // Compute paddedSize as the next multiple of 8 bytes
    if (isModulusBinary(mod)) {
      this.modulus = bytesToLimbs(modBytes),
      this.mulMod = () => {}, // TODO filler function, replace with actual
      this.addMod = () => {}, // TODO filler function, replace with actual
      this.subMod = () => {}, // TODO filler function, replace with actual
      this.scratchSpace = new Uint8Array(Number((paddedSize / BIGINT_8) * scratchSize)),
      this.scratchSpaceElemCount = BigInt(scratchSize),
      this.modulusInt = mod,
      this.elemSize = paddedSize,
      this.useMontgomeryRepr = false,
      this.isModulusBinary = true, 
	  }
  }
}
