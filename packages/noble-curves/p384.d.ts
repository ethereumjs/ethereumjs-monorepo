import { type CurveFnWithCreate } from './_shortw_utils.js'
import { type HTFMethod } from './abstract/hash-to-curve.js'
/** secp384r1 curve, ECDSA and ECDH methods. */
export declare const p384: CurveFnWithCreate
/** Alias to p384. */
export declare const secp384r1: CurveFnWithCreate
/** secp384r1 hash-to-curve from [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380). */
export declare const hashToCurve: HTFMethod<bigint>
/** secp384r1 encode-to-curve from [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380). */
export declare const encodeToCurve: HTFMethod<bigint>
//# sourceMappingURL=p384.d.ts.map
