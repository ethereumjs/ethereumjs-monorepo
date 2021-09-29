declare module 'ethjs-util' {
  /**
   * @description Returns a `Boolean` on whether or not the a `String` starts with '0x'
   */
  export function isHexPrefixed(str: string): boolean

  /**
   * @description Removes '0x' from a given `String` if present
   */
  export function stripHexPrefix(str: string): string

  /**
   * @description Pads a `String` to have an even length
   */
  export function padToEven(value: string): string

  /**
   * @description Get the binary size of a string
   */
  export function getBinarySize(str: string): number

  /**
   * @description Returns TRUE if the first specified array contains all elements
   *              from the second one. FALSE otherwise. If `some` is true, will
   *              return true if first specified array contain some elements of
   *              the second.
   */
  export function arrayContainsArray(superset: any[], subset: any[], some?: boolean): boolean

  /**
   * @description Should be called to get utf8 from it's hex representation
   */
  export function toUtf8(hex: string): string

  /**
   * @description Should be called to get ascii from it's hex representation
   */
  export function toAscii(hex: string): string

  /**
   * @description Should be called to get hex representation (prefixed by 0x) of utf8 string
   */
  export function fromUtf8(stringValue: string): string

  /**
   * @description Should be called to get hex representation (prefixed by 0x) of ascii string
   */
  export function fromAscii(stringValue: string): string

  /**
   * @description getKeys([{a: 1, b: 2}, {a: 3, b: 4}], 'a') => [1, 3]
   */
  export function getKeys(params: any[], key: string, allowEmpty?: boolean): any[]

  /**
   * @description check if string is hex string of specific length
   */
  export function isHexString(value: string, length?: number): boolean
}
