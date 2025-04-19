import { type CurveFnWithCreate } from './_shortw_utils.js'
import { type HTFMethod } from './abstract/hash-to-curve.js'
/** secp256r1 curve, ECDSA and ECDH methods. */
export declare const p256: CurveFnWithCreate
/** Alias to p256. */
export declare const secp256r1: CurveFnWithCreate
/** secp256r1 hash-to-curve from [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380). */
export declare const hashToCurve: HTFMethod<bigint>
/** secp256r1 encode-to-curve from [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380). */
export declare const encodeToCurve: HTFMethod<bigint>
//# sourceMappingURL=p256.d.ts.map
