import { type CurveFnWithCreate } from './_shortw_utils.js'
import { type HTFMethod } from './abstract/hash-to-curve.js'
/**
 * NIST secp521r1 aka p521.
 */
export declare const p521: CurveFnWithCreate
export declare const secp521r1: CurveFnWithCreate
/** secp521r1 hash-to-curve from [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380). */
export declare const hashToCurve: HTFMethod<bigint>
/** secp521r1 encode-to-curve from [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380). */
export declare const encodeToCurve: HTFMethod<bigint>
//# sourceMappingURL=p521.d.ts.map
