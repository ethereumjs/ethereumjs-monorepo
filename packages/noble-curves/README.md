# noble-curves

Audited & minimal JS implementation of elliptic curve cryptography.

- 🔒 [**Audited**](#security) by independent security firms
- 🔻 Tree-shakeable: unused code is excluded from your builds
- 🏎 Fast: hand-optimized for caveats of JS engines
- 🔍 Reliable: cross-library / wycheproof tests and fuzzing ensure correctness
- ➰ Short Weierstrass, Edwards, Montgomery curves
- ✍️ ECDSA, EdDSA, Schnorr, BLS, ECDH, hashing to curves, Poseidon ZK-friendly hash
- 🔖 SUF-CMA, SBS (non-repudiation), ZIP215 (consensus friendliness) features for ed25519 & ed448
- 🪶 93KB for everything with hashes, 26KB (11KB gzipped) for single-curve build

Curves have 4KB sister projects
[secp256k1](https://github.com/paulmillr/noble-secp256k1) & [ed25519](https://github.com/paulmillr/noble-ed25519).
They have smaller attack surface, but less features.

Take a glance at [GitHub Discussions](https://github.com/paulmillr/noble-curves/discussions) for questions and support.

### This library belongs to _noble_ cryptography

> **noble cryptography** — high-security, easily auditable set of contained cryptographic libraries and tools.

- Zero or minimal dependencies
- Highly readable TypeScript / JS code
- PGP-signed releases and transparent NPM builds
- All libraries:
  [ciphers](https://github.com/paulmillr/noble-ciphers),
  [curves](https://github.com/paulmillr/noble-curves),
  [hashes](https://github.com/paulmillr/noble-hashes),
  [post-quantum](https://github.com/paulmillr/noble-post-quantum),
  4kb [secp256k1](https://github.com/paulmillr/noble-secp256k1) /
  [ed25519](https://github.com/paulmillr/noble-ed25519)
- [Check out homepage](https://paulmillr.com/noble/)
  for reading resources, documentation and apps built with noble

## Usage

> `npm install @noble/curves`

> `deno add jsr:@noble/curves`

> `deno doc jsr:@noble/curves`  # command-line documentation

We support all major platforms and runtimes.
For React Native, you may need a [polyfill for getRandomValues](https://github.com/LinusU/react-native-get-random-values).
A standalone file [noble-curves.js](https://github.com/paulmillr/noble-curves/releases) is also available.

```js
// import * from '@noble/curves'; // Error: use sub-imports, to ensure small app size
import { secp256k1 } from '@noble/curves/secp256k1'; // ESM and Common.js
// import { secp256k1 } from 'npm:@noble/curves@1.6.0/secp256k1'; // Deno
```

- [Implementations](#implementations)
  - [ECDSA signatures over secp256k1 and others](#ecdsa-signatures-over-secp256k1-and-others)
  - [ECDSA public key recovery & extra entropy](#ecdsa-public-key-recovery--extra-entropy)
  - [ECDH: Elliptic Curve Diffie-Hellman](#ecdh-elliptic-curve-diffie-hellman)
  - [Schnorr signatures over secp256k1, BIP340](#schnorr-signatures-over-secp256k1-bip340)
  - [ed25519, X25519, ristretto255](#ed25519-x25519-ristretto255)
  - [ed448, X448, decaf448](#ed448-x448-decaf448)
  - [bls12-381](#bls12-381)
  - [bn254 aka alt_bn128](#bn254-aka-alt_bn128)
  - [Multi-scalar-multiplication](#multi-scalar-multiplication)
  - [Accessing a curve's variables](#accessing-a-curves-variables)
  - [All available imports](#all-available-imports)
- [Abstract API](#abstract-api)
  - [weierstrass: Short Weierstrass curve](#weierstrass-short-weierstrass-curve)
  - [edwards: Twisted Edwards curve](#edwards-twisted-edwards-curve)
  - [montgomery: Montgomery curve](#montgomery-montgomery-curve)
  - [bls: Barreto-Lynn-Scott curves](#bls-barreto-lynn-scott-curves)
  - [hash-to-curve: Hashing strings to curve points](#hash-to-curve-hashing-strings-to-curve-points)
  - [poseidon: Poseidon hash](#poseidon-poseidon-hash)
  - [modular: Modular arithmetics utilities](#modular-modular-arithmetics-utilities)
    - [Creating private keys from hashes](#creating-private-keys-from-hashes)
  - [utils: Useful utilities](#utils-useful-utilities)
- [Security](#security)
- [Speed](#speed)
- [Upgrading](#upgrading)
- [Contributing & testing](#contributing--testing)
- [License](#license)

### Implementations

Implementations use [noble-hashes](https://github.com/paulmillr/noble-hashes).
If you want to use a different hashing library, [abstract API](#abstract-api) doesn't depend on them.

#### ECDSA signatures over secp256k1 and others

```ts
import { secp256k1 } from '@noble/curves/secp256k1';
// import { p256 } from '@noble/curves/p256'; // or p384 / p521

const priv = secp256k1.utils.randomPrivateKey();
const pub = secp256k1.getPublicKey(priv);
const msg = new Uint8Array(32).fill(1); // message hash (not message) in ecdsa
const sig = secp256k1.sign(msg, priv); // `{prehash: true}` option is available
const isValid = secp256k1.verify(sig, msg, pub) === true;

// hex strings are also supported besides Uint8Array-s:
const privHex = '46c930bc7bb4db7f55da20798697421b98c4175a52c630294d75a84b9c126236';
const pub2 = secp256k1.getPublicKey(privHex);
```

The same code would work for NIST P256 (secp256r1), P384 (secp384r1) & P521 (secp521r1).

#### ECDSA public key recovery & extra entropy

```ts
// let sig = secp256k1.Signature.fromCompact(sigHex); // or .fromDER(sigDERHex)
// sig = sig.addRecoveryBit(bit); // bit is not serialized into compact / der format
sig.recoverPublicKey(msg).toRawBytes(); // === pub; // public key recovery

// extraEntropy https://moderncrypto.org/mail-archive/curves/2017/000925.html
const sigImprovedSecurity = secp256k1.sign(msg, priv, { extraEntropy: true });
```

#### ECDH: Elliptic Curve Diffie-Hellman

```ts
// 1. The output includes parity byte. Strip it using shared.slice(1)
// 2. The output is not hashed. More secure way is sha256(shared) or hkdf(shared)
const someonesPub = secp256k1.getPublicKey(secp256k1.utils.randomPrivateKey());
const shared = secp256k1.getSharedSecret(priv, someonesPub);
```

#### Schnorr signatures over secp256k1 (BIP340)

```ts
import { schnorr } from '@noble/curves/secp256k1';
const priv = schnorr.utils.randomPrivateKey();
const pub = schnorr.getPublicKey(priv);
const msg = new TextEncoder().encode('hello');
const sig = schnorr.sign(msg, priv);
const isValid = schnorr.verify(sig, msg, pub);
```

#### ed25519, X25519, ristretto255

```ts
import { ed25519 } from '@noble/curves/ed25519';
const priv = ed25519.utils.randomPrivateKey();
const pub = ed25519.getPublicKey(priv);
const msg = new TextEncoder().encode('hello');
const sig = ed25519.sign(msg, priv);
ed25519.verify(sig, msg, pub); // Default mode: follows ZIP215
ed25519.verify(sig, msg, pub, { zip215: false }); // RFC8032 / FIPS 186-5
```

Default `verify` behavior follows [ZIP215](https://zips.z.cash/zip-0215) and
[can be used in consensus-critical applications](https://hdevalence.ca/blog/2020-10-04-its-25519am).
It has SUF-CMA (strong unforgeability under chosen message attacks).
`zip215: false` option switches verification criteria to strict
[RFC8032](https://www.rfc-editor.org/rfc/rfc8032) / [FIPS 186-5](https://csrc.nist.gov/publications/detail/fips/186/5/final)
and additionally provides [non-repudiation with SBS](#edwards-twisted-edwards-curve).

X25519 follows [RFC7748](https://www.rfc-editor.org/rfc/rfc7748).

```ts
// Variants from RFC8032: with context, prehashed
import { ed25519ctx, ed25519ph } from '@noble/curves/ed25519';

// ECDH using curve25519 aka x25519
import { x25519 } from '@noble/curves/ed25519';
const priv = 'a546e36bf0527c9d3b16154b82465edd62144c0ac1fc5a18506a2244ba449ac4';
const pub = 'e6db6867583030db3594c1a424b15f7c726624ec26b3353b10a903a6d0ab1c4c';
x25519.getSharedSecret(priv, pub) === x25519.scalarMult(priv, pub); // aliases
x25519.getPublicKey(priv) === x25519.scalarMultBase(priv);
x25519.getPublicKey(x25519.utils.randomPrivateKey());

// ed25519 => x25519 conversion
import { edwardsToMontgomeryPub, edwardsToMontgomeryPriv } from '@noble/curves/ed25519';
edwardsToMontgomeryPub(ed25519.getPublicKey(ed25519.utils.randomPrivateKey()));
edwardsToMontgomeryPriv(ed25519.utils.randomPrivateKey());
```

ristretto255 follows [irtf draft](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-ristretto255-decaf448).

```ts
// hash-to-curve, ristretto255
import { utf8ToBytes } from '@noble/hashes/utils';
import { sha512 } from '@noble/hashes/sha512';
import {
  hashToCurve,
  encodeToCurve,
  RistrettoPoint,
  hashToRistretto255,
} from '@noble/curves/ed25519';

const msg = utf8ToBytes('Ristretto is traditionally a short shot of espresso coffee');
hashToCurve(msg);

const rp = RistrettoPoint.fromHex(
  '6a493210f7499cd17fecb510ae0cea23a110e8d5b901f8acadd3095c73a3b919'
);
RistrettoPoint.BASE.multiply(2n).add(rp).subtract(RistrettoPoint.BASE).toRawBytes();
RistrettoPoint.ZERO.equals(dp) === false;
// pre-hashed hash-to-curve
RistrettoPoint.hashToCurve(sha512(msg));
// full hash-to-curve including domain separation tag
hashToRistretto255(msg, { DST: 'ristretto255_XMD:SHA-512_R255MAP_RO_' });
```

#### ed448, X448, decaf448

```ts
import { ed448 } from '@noble/curves/ed448';
const priv = ed448.utils.randomPrivateKey();
const pub = ed448.getPublicKey(priv);
const msg = new TextEncoder().encode('whatsup');
const sig = ed448.sign(msg, priv);
ed448.verify(sig, msg, pub);

// Variants from RFC8032: prehashed
import { ed448ph } from '@noble/curves/ed448';
```

ECDH using Curve448 aka X448, follows [RFC7748](https://www.rfc-editor.org/rfc/rfc7748).

```ts
import { x448 } from '@noble/curves/ed448';
x448.getSharedSecret(priv, pub) === x448.scalarMult(priv, pub); // aliases
x448.getPublicKey(priv) === x448.scalarMultBase(priv);

// ed448 => x448 conversion
import { edwardsToMontgomeryPub } from '@noble/curves/ed448';
edwardsToMontgomeryPub(ed448.getPublicKey(ed448.utils.randomPrivateKey()));
```

decaf448 follows [irtf draft](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-ristretto255-decaf448).

```ts
import { utf8ToBytes } from '@noble/hashes/utils';
import { shake256 } from '@noble/hashes/sha3';
import { hashToCurve, encodeToCurve, DecafPoint, hashToDecaf448 } from '@noble/curves/ed448';

const msg = utf8ToBytes('Ristretto is traditionally a short shot of espresso coffee');
hashToCurve(msg);

const dp = DecafPoint.fromHex(
  'c898eb4f87f97c564c6fd61fc7e49689314a1f818ec85eeb3bd5514ac816d38778f69ef347a89fca817e66defdedce178c7cc709b2116e75'
);
DecafPoint.BASE.multiply(2n).add(dp).subtract(DecafPoint.BASE).toRawBytes();
DecafPoint.ZERO.equals(dp) === false;
// pre-hashed hash-to-curve
DecafPoint.hashToCurve(shake256(msg, { dkLen: 112 }));
// full hash-to-curve including domain separation tag
hashToDecaf448(msg, { DST: 'decaf448_XOF:SHAKE256_D448MAP_RO_' });
```

Same RFC7748 / RFC8032 / IRTF draft are followed.

#### bls12-381

```ts
import { bls12_381 as bls } from '@noble/curves/bls12-381';

// G1 keys, G2 signatures
const privateKey = '67d53f170b908cabb9eb326c3c337762d59289a8fec79f7bc9254b584b73265c';
const message = '64726e3da8';
const publicKey = bls.getPublicKey(privateKey);
const signature = bls.sign(message, privateKey);
const isValid = bls.verify(signature, message, publicKey);
console.log({ publicKey, signature, isValid });

// G2 keys, G1 signatures
// getPublicKeyForShortSignatures(privateKey)
// signShortSignature(message, privateKey)
// verifyShortSignature(signature, message, publicKey)
// aggregateShortSignatures(signatures)

// Custom DST
const htfEthereum = { DST: 'BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_' };
const signatureEth = bls.sign(message, privateKey, htfEthereum);
const isValidEth = bls.verify(signature, message, publicKey, htfEthereum);

// Aggregation
const aggregatedKey = bls.aggregatePublicKeys([bls.utils.randomPrivateKey(), bls.utils.randomPrivateKey()])
// const aggregatedSig = bls.aggregateSignatures(sigs)

// Pairings, with and without final exponentiation
// bls.pairing(PointG1, PointG2);
// bls.pairing(PointG1, PointG2, false);
// bls.fields.Fp12.finalExponentiate(bls.fields.Fp12.mul(PointG1, PointG2));

// Others
// bls.G1.ProjectivePoint.BASE, bls.G2.ProjectivePoint.BASE;
// bls.fields.Fp, bls.fields.Fp2, bls.fields.Fp12, bls.fields.Fr;
```

See [abstract/bls](#bls-barreto-lynn-scott-curves).
For example usage, check out [the implementation of BLS EVM precompiles](https://github.com/ethereumjs/ethereumjs-monorepo/blob/361f4edbc239e795a411ac2da7e5567298b9e7e5/packages/evm/src/precompiles/bls12_381/noble.ts).

#### bn254 aka alt_bn128

```ts
import { bn254 } from '@noble/curves/bn254';

console.log(
  bn254.G1,
  bn254.G2,
  bn254.pairing
)
```

The API mirrors [BLS](#bls12-381). The curve was previously called alt_bn128.
The implementation is compatible with [EIP-196](https://eips.ethereum.org/EIPS/eip-196) and
[EIP-197](https://eips.ethereum.org/EIPS/eip-197).

Keep in mind that we don't implement Point methods toHex / toRawBytes. It's because
different implementations of bn254 do it differently - there is no standard. Points of divergence:

- Endianness: LE vs BE (byte-swapped)
- Flags as first hex bits (similar to BLS) vs no-flags
- Imaginary part last in G2 vs first (c0, c1 vs c1, c0)

For example usage, check out [the implementation of bn254 EVM precompiles](https://github.com/paulmillr/noble-curves/blob/3ed792f8ad9932765b84d1064afea8663a255457/test/bn254.test.js#L697).

#### Multi-scalar-multiplication

```ts
import { secp256k1 } from '@noble/curves/secp256k1';
const p = secp256k1.ProjectivePoint;
const points = [p.BASE, p.BASE.multiply(2n), p.BASE.multiply(4n), p.BASE.multiply(8n)];
p.msm(points, [3n, 5n, 7n, 11n]).equals(p.BASE.multiply(129n)); // 129*G
```

Pippenger algorithm is used underneath.
Multi-scalar-multiplication (MSM) is basically `(Pa + Qb + Rc + ...)`.
It's 10-30x faster vs naive addition for large amount of points.

#### Accessing a curve's variables

```ts
import { secp256k1 } from '@noble/curves/secp256k1';
// Every curve has `CURVE` object that contains its parameters, field, and others
console.log(secp256k1.CURVE.p); // field modulus
console.log(secp256k1.CURVE.n); // curve order
console.log(secp256k1.CURVE.a, secp256k1.CURVE.b); // equation params
console.log(secp256k1.CURVE.Gx, secp256k1.CURVE.Gy); // base point coordinates
```


#### All available imports

```typescript
import { secp256k1, schnorr } from '@noble/curves/secp256k1';
import { ed25519, ed25519ph, ed25519ctx, x25519, RistrettoPoint } from '@noble/curves/ed25519';
import { ed448, ed448ph, ed448ctx, x448 } from '@noble/curves/ed448';
import { p256 } from '@noble/curves/p256';
import { p384 } from '@noble/curves/p384';
import { p521 } from '@noble/curves/p521';
import { pallas, vesta } from '@noble/curves/pasta';
import { bls12_381 } from '@noble/curves/bls12-381';
import { bn254 } from '@noble/curves/bn254'; // also known as alt_bn128
import { jubjub } from '@noble/curves/jubjub';
import { bytesToHex, hexToBytes, concatBytes, utf8ToBytes } from '@noble/curves/abstract/utils';
```

## Abstract API

Abstract API allows to define custom curves. All arithmetics is done with JS
bigints over finite fields, which is defined from `modular` sub-module. For
scalar multiplication, we use
[precomputed tables with w-ary non-adjacent form (wNAF)](https://paulmillr.com/posts/noble-secp256k1-fast-ecc/).
Precomputes are enabled for weierstrass and edwards BASE points of a curve. You
could precompute any other point (e.g. for ECDH) using `utils.precompute()`
method: check out examples.

### weierstrass: Short Weierstrass curve

```ts
import { weierstrass } from '@noble/curves/abstract/weierstrass';
import { Field } from '@noble/curves/abstract/modular'; // finite field for mod arithmetics
import { sha256 } from '@noble/hashes/sha256'; // 3rd-party sha256() of type utils.CHash
import { hmac } from '@noble/hashes/hmac'; // 3rd-party hmac() that will accept sha256()
import { concatBytes, randomBytes } from '@noble/hashes/utils'; // 3rd-party utilities

const hmacSha256 = (key: Uint8Array, ...msgs: Uint8Array[]) => hmac(sha256, key, concatBytes(...msgs));

// secq256k1: cycle of secp256k1 with Fp/N flipped.
// https://personaelabs.org/posts/spartan-ecdsa
// https://zcash.github.io/halo2/background/curves.html#cycles-of-curves
const secq256k1 = weierstrass({
  // Curve equation params a, b
  a: 0n,
  b: 7n,
  // Field over which we'll do calculations
  Fp: Field(2n ** 256n - 432420386565659656852420866394968145599n),
  // Curve order, total count of valid points in the field.
  n: 2n ** 256n - 2n ** 32n - 2n ** 9n - 2n ** 8n - 2n ** 7n - 2n ** 6n - 2n ** 4n - 1n,
  // Base point (x, y) aka generator point
  Gx: 55066263022277343669578718895168534326250603453777594175500187360389116729240n,
  Gy: 32670510020758816978083085130507043184471273380659243275938904335757337482424n,

  hash: sha256,
  hmac: hmacSha256,
  randomBytes,
});

// NIST secp192r1 aka p192 https://www.secg.org/sec2-v2.pdf, https://neuromancer.sk/std/secg/secp192r1
const secp192r1 = weierstrass({
  a: BigInt('0xfffffffffffffffffffffffffffffffefffffffffffffffc'),
  b: BigInt('0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1'),
  Fp: Field(BigInt('0xfffffffffffffffffffffffffffffffeffffffffffffffff')),
  n: BigInt('0xffffffffffffffffffffffff99def836146bc9b1b4d22831'),
  Gx: BigInt('0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012'),
  Gy: BigInt('0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811'),
  h: BigInt(1),
  hash: sha256,
  hmac: hmacSha256,
  randomBytes,
});


// Replace weierstrass() with weierstrassPoints() if you don't need ECDSA, hash, hmac, randomBytes
```

Short Weierstrass curve's formula is `y² = x³ + ax + b`. `weierstrass`
expects arguments `a`, `b`, field `Fp`, curve order `n`, cofactor `h`
and coordinates `Gx`, `Gy` of generator point.

**`k` generation** is done deterministically, following
[RFC6979](https://www.rfc-editor.org/rfc/rfc6979). It is suggested to use `extraEntropy`
option, which incorporates randomness into signatures to increase their security.

For k generation, specifying `hmac` & `hash` is required,
which in our implementations is done by noble-hashes. If
you're using different hashing library, make sure to wrap it in the following interface:

```ts
type CHash = {
  (message: Uint8Array): Uint8Array;
  blockLen: number;
  outputLen: number;
  create(): any;
};

// example
function sha256(message: Uint8Array) {
  return _internal_lowlvl(message);
}
sha256.outputLen = 32; // 32 bytes of output for sha2-256
```

**Message hash** is expected instead of message itself:

- `sign(msgHash, privKey)` is default behavior, assuming you pre-hash msg with sha2, or other hash
- `sign(msg, privKey, {prehash: true})` option can be used if you want to pass the message itself

**Weierstrass points:**

1. Exported as `ProjectivePoint`
2. Represented in projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
3. Use complete exception-free formulas for addition and doubling
4. Can be decoded/encoded from/to Uint8Array / hex strings using
   `ProjectivePoint.fromHex` and `ProjectivePoint#toRawBytes()`
5. Have `assertValidity()` which checks for being on-curve
6. Have `toAffine()` and `x` / `y` getters which convert to 2d xy affine coordinates

```ts
// `weierstrassPoints()` returns `CURVE` and `ProjectivePoint`
// `weierstrass()` returns `CurveFn`
type SignOpts = { lowS?: boolean; prehash?: boolean; extraEntropy: boolean | Uint8Array };
type CurveFn = {
  CURVE: ReturnType<typeof validateOpts>;
  getPublicKey: (privateKey: PrivKey, isCompressed?: boolean) => Uint8Array;
  getSharedSecret: (privateA: PrivKey, publicB: Hex, isCompressed?: boolean) => Uint8Array;
  sign: (msgHash: Hex, privKey: PrivKey, opts?: SignOpts) => SignatureType;
  verify: (
    signature: Hex | SignatureType,
    msgHash: Hex,
    publicKey: Hex,
    opts?: { lowS?: boolean; prehash?: boolean; format?: 'compact' | 'der' }
  ) => boolean;
  ProjectivePoint: ProjectivePointConstructor;
  Signature: SignatureConstructor;
  utils: {
    normPrivateKeyToScalar: (key: PrivKey) => bigint;
    isValidPrivateKey(key: PrivKey): boolean;
    randomPrivateKey: () => Uint8Array;
    precompute: (windowSize?: number, point?: ProjPointType<bigint>) => ProjPointType<bigint>;
  };
};

// T is usually bigint, but can be something else like complex numbers in BLS curves
interface ProjPointType<T> extends Group<ProjPointType<T>> {
  readonly px: T;
  readonly py: T;
  readonly pz: T;
  get x(): bigint;
  get y(): bigint;
  multiply(scalar: bigint): ProjPointType<T>;
  multiplyUnsafe(scalar: bigint): ProjPointType<T>;
  multiplyAndAddUnsafe(Q: ProjPointType<T>, a: bigint, b: bigint): ProjPointType<T> | undefined;
  toAffine(iz?: T): AffinePoint<T>;
  isTorsionFree(): boolean;
  clearCofactor(): ProjPointType<T>;
  assertValidity(): void;
  hasEvenY(): boolean;
  toRawBytes(isCompressed?: boolean): Uint8Array;
  toHex(isCompressed?: boolean): string;
}
// Static methods for 3d XYZ points
interface ProjConstructor<T> extends GroupConstructor<ProjPointType<T>> {
  new (x: T, y: T, z: T): ProjPointType<T>;
  fromAffine(p: AffinePoint<T>): ProjPointType<T>;
  fromHex(hex: Hex): ProjPointType<T>;
  fromPrivateKey(privateKey: PrivKey): ProjPointType<T>;
  msm(points: ProjPointType[], scalars: bigint[]): ProjPointType<T>;
}
```

**ECDSA signatures** are represented by `Signature` instances and can be
described by the interface:

```ts
interface SignatureType {
  readonly r: bigint;
  readonly s: bigint;
  readonly recovery?: number;
  assertValidity(): void;
  addRecoveryBit(recovery: number): SignatureType;
  hasHighS(): boolean;
  normalizeS(): SignatureType;
  recoverPublicKey(msgHash: Hex): ProjPointType<bigint>;
  toCompactRawBytes(): Uint8Array;
  toCompactHex(): string;
  // DER-encoded
  toDERRawBytes(): Uint8Array;
  toDERHex(): string;
}
type SignatureConstructor = {
  new (r: bigint, s: bigint): SignatureType;
  fromCompact(hex: Hex): SignatureType;
  fromDER(hex: Hex): SignatureType;
};
```

More examples:

```typescript
// All curves expose same generic interface.
const priv = secq256k1.utils.randomPrivateKey();
secq256k1.getPublicKey(priv); // Convert private key to public.
const sig = secq256k1.sign(msg, priv); // Sign msg with private key.
const sig2 = secq256k1.sign(msg, priv, { prehash: true }); // hash(msg)
secq256k1.verify(sig, msg, priv); // Verify if sig is correct.

// Default behavior is "try DER, then try compact if fails". Can be explicit:
secq256k1.verify(sig.toCompactHex(), msg, priv, { format: 'compact' });

const Point = secq256k1.ProjectivePoint;
const point = Point.BASE; // Elliptic curve Point class and BASE point static var.
point.add(point).equals(point.double()); // add(), equals(), double() methods
point.subtract(point).equals(Point.ZERO); // subtract() method, ZERO static var
point.negate(); // Flips point over x/y coordinate.
point.multiply(31415n); // Multiplication of Point by scalar.

point.assertValidity(); // Checks for being on-curve
point.toAffine(); // Converts to 2d affine xy coordinates

secq256k1.CURVE.n;
secq256k1.CURVE.p;
secq256k1.CURVE.Fp.mod();
secq256k1.CURVE.hash();

// precomputes
const fast = secq256k1.utils.precompute(8, Point.fromHex(someonesPubKey));
fast.multiply(privKey); // much faster ECDH now
```

### edwards: Twisted Edwards curve

```ts
import { twistedEdwards } from '@noble/curves/abstract/edwards';
import { Field } from '@noble/curves/abstract/modular';
import { sha512 } from '@noble/hashes/sha512';
import { randomBytes } from '@noble/hashes/utils';

const Fp = Field(2n ** 255n - 19n);
const ed25519 = twistedEdwards({
  a: Fp.create(-1n),
  d: Fp.div(-121665n, 121666n), // -121665n/121666n mod p
  Fp: Fp,
  n: 2n ** 252n + 27742317777372353535851937790883648493n,
  h: 8n,
  Gx: 15112221349535400772501151409588531511454012693041857206046113283949847762202n,
  Gy: 46316835694926478169428394003475163141307993866256225615783033603165251855960n,
  hash: sha512,
  randomBytes,
  adjustScalarBytes(bytes) {
    // optional; but mandatory in ed25519
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
  },
} as const);
```

Twisted Edwards curve's formula is `ax² + y² = 1 + dx²y²`. You must specify `a`, `d`, field `Fp`, order `n`, cofactor `h`
and coordinates `Gx`, `Gy` of generator point.

For EdDSA signatures, `hash` param required. `adjustScalarBytes` which instructs how to change private scalars could be specified.

We support [non-repudiation](https://eprint.iacr.org/2020/1244), which help in following scenarios:

- Contract Signing: if A signed an agreement with B using key that allows repudiation, it can later claim that it signed a different contract
- E-voting: malicious voters may pick keys that allow repudiation in order to deny results
- Blockchains: transaction of amount X might also be valid for a different amount Y

**Edwards points:**

1. Exported as `ExtendedPoint`
2. Represented in extended coordinates: (x, y, z, t) ∋ (x=x/z, y=y/z)
3. Use complete exception-free formulas for addition and doubling
4. Can be decoded/encoded from/to Uint8Array / hex strings using `ExtendedPoint.fromHex` and `ExtendedPoint#toRawBytes()`
5. Have `assertValidity()` which checks for being on-curve
6. Have `toAffine()` and `x` / `y` getters which convert to 2d xy affine coordinates
7. Have `isTorsionFree()`, `clearCofactor()` and `isSmallOrder()` utilities to handle torsions

```ts
// `twistedEdwards()` returns `CurveFn` of following type:
type CurveFn = {
  CURVE: ReturnType<typeof validateOpts>;
  getPublicKey: (privateKey: Hex) => Uint8Array;
  sign: (message: Hex, privateKey: Hex, context?: Hex) => Uint8Array;
  verify: (sig: SigType, message: Hex, publicKey: Hex, context?: Hex) => boolean;
  ExtendedPoint: ExtPointConstructor;
  utils: {
    randomPrivateKey: () => Uint8Array;
    getExtendedPublicKey: (key: PrivKey) => {
      head: Uint8Array;
      prefix: Uint8Array;
      scalar: bigint;
      point: PointType;
      pointBytes: Uint8Array;
    };
  };
};

interface ExtPointType extends Group<ExtPointType> {
  readonly ex: bigint;
  readonly ey: bigint;
  readonly ez: bigint;
  readonly et: bigint;
  get x(): bigint;
  get y(): bigint;
  assertValidity(): void;
  multiply(scalar: bigint): ExtPointType;
  multiplyUnsafe(scalar: bigint): ExtPointType;
  isSmallOrder(): boolean;
  isTorsionFree(): boolean;
  clearCofactor(): ExtPointType;
  toAffine(iz?: bigint): AffinePoint<bigint>;
  toRawBytes(isCompressed?: boolean): Uint8Array;
  toHex(isCompressed?: boolean): string;
}
// Static methods of Extended Point with coordinates in X, Y, Z, T
interface ExtPointConstructor extends GroupConstructor<ExtPointType> {
  new (x: bigint, y: bigint, z: bigint, t: bigint): ExtPointType;
  fromAffine(p: AffinePoint<bigint>): ExtPointType;
  fromHex(hex: Hex): ExtPointType;
  fromPrivateKey(privateKey: Hex): ExtPointType;
  msm(points: ExtPointType[], scalars: bigint[]): ExtPointType;
}
```

### montgomery: Montgomery curve

```typescript
import { montgomery } from '@noble/curves/abstract/montgomery';
import { Field } from '@noble/curves/abstract/modular';

const x25519 = montgomery({
  a: 486662n,
  Gu: 9n,
  P: 2n ** 255n - 19n,
  montgomeryBits: 255,
  nByteLength: 32,
  // Optional param
  adjustScalarBytes(bytes) {
    bytes[0] &= 248;
    bytes[31] &= 127;
    bytes[31] |= 64;
    return bytes;
  },
});
```

The module contains methods for x-only ECDH on Curve25519 / Curve448 from RFC7748.
Proper Elliptic Curve Points are not implemented yet.

You must specify curve params `Fp`, `a`, `Gu` coordinate of u, `montgomeryBits` and `nByteLength`.

### bls: Barreto-Lynn-Scott curves

The module abstracts BLS (Barreto-Lynn-Scott) pairing-friendly elliptic curve construction.
They allow to construct [zk-SNARKs](https://z.cash/technology/zksnarks/) and
use aggregated, batch-verifiable
[threshold signatures](https://medium.com/snigirev.stepan/bls-signatures-better-than-schnorr-5a7fe30ea716),
using Boneh-Lynn-Shacham signature scheme.

The module doesn't expose `CURVE` property: use `G1.CURVE`, `G2.CURVE` instead.
Only BLS12-381 is currently implemented.
Defining BLS12-377 and BLS24 should be straightforward.

The default BLS uses short public keys (with public keys in G1 and signatures in G2).
Short signatures (public keys in G2 and signatures in G1) are also supported.

### hash-to-curve: Hashing strings to curve points

The module allows to hash arbitrary strings to elliptic curve points. Implements [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380).

Every curve has exported `hashToCurve` and `encodeToCurve` methods. You should always prefer `hashToCurve` for security:

```ts
import { hashToCurve, encodeToCurve } from '@noble/curves/secp256k1';
import { randomBytes } from '@noble/hashes/utils';
hashToCurve('0102abcd');
console.log(hashToCurve(randomBytes()));
console.log(encodeToCurve(randomBytes()));

import { bls12_381 } from '@noble/curves/bls12-381';
bls12_381.G1.hashToCurve(randomBytes(), { DST: 'another' });
bls12_381.G2.hashToCurve(randomBytes(), { DST: 'custom' });
```

Low-level methods from the spec:

```ts
// produces a uniformly random byte string using a cryptographic hash function H that outputs b bits.
function expand_message_xmd(
  msg: Uint8Array,
  DST: Uint8Array,
  lenInBytes: number,
  H: CHash // For CHash see abstract/weierstrass docs section
): Uint8Array;
// produces a uniformly random byte string using an extendable-output function (XOF) H.
function expand_message_xof(
  msg: Uint8Array,
  DST: Uint8Array,
  lenInBytes: number,
  k: number,
  H: CHash
): Uint8Array;
// Hashes arbitrary-length byte strings to a list of one or more elements of a finite field F
function hash_to_field(msg: Uint8Array, count: number, options: Opts): bigint[][];

/**
 * * `DST` is a domain separation tag, defined in section 2.2.5
 * * `p` characteristic of F, where F is a finite field of characteristic p and order q = p^m
 * * `m` is extension degree (1 for prime fields)
 * * `k` is the target security target in bits (e.g. 128), from section 5.1
 * * `expand` is `xmd` (SHA2, SHA3, BLAKE) or `xof` (SHAKE, BLAKE-XOF)
 * * `hash` conforming to `utils.CHash` interface, with `outputLen` / `blockLen` props
 */
type UnicodeOrBytes = string | Uint8Array;
type Opts = {
  DST: UnicodeOrBytes;
  p: bigint;
  m: number;
  k: number;
  expand?: 'xmd' | 'xof';
  hash: CHash;
};
```

### poseidon: Poseidon hash

Implements [Poseidon](https://www.poseidon-hash.info) ZK-friendly hash.

There are many poseidon variants with different constants.
We don't provide them: you should construct them manually.
Check out [micro-starknet](https://github.com/paulmillr/micro-starknet) package for a proper example.

```ts
import { poseidon } from '@noble/curves/abstract/poseidon';

type PoseidonOpts = {
  Fp: Field<bigint>;
  t: number;
  roundsFull: number;
  roundsPartial: number;
  sboxPower?: number;
  reversePartialPowIdx?: boolean;
  mds: bigint[][];
  roundConstants: bigint[][];
};
const instance = poseidon(opts: PoseidonOpts);
```

### modular: Modular arithmetics utilities

```ts
import * as mod from '@noble/curves/abstract/modular';

// Finite Field utils
const fp = mod.Field(2n ** 255n - 19n); // Finite field over 2^255-19
fp.mul(591n, 932n); // multiplication
fp.pow(481n, 11024858120n); // exponentiation
fp.div(5n, 17n); // division: 5/17 mod 2^255-19 == 5 * invert(17)
fp.inv(5n); // modular inverse
fp.sqrt(21n); // square root

// Non-Field generic utils are also available
mod.mod(21n, 10n); // 21 mod 10 == 1n; fixed version of 21 % 10
mod.invert(17n, 10n); // invert(17) mod 10; modular multiplicative inverse
mod.invertBatch([1n, 2n, 4n], 21n); // => [1n, 11n, 16n] in one inversion
```

Field operations are not constant-time: they are using JS bigints, see [security](#security).
The fact is mostly irrelevant, but the important method to keep in mind is `pow`,
which may leak exponent bits, when used naïvely.

`mod.Field` is always **field over prime number**. Non-prime fields aren't supported for now.
We don't test for prime-ness for speed and because algorithms are probabilistic anyway.
Initializing a non-prime field could make your app suspectible to
DoS (infilite loop) on Tonelli-Shanks square root calculation.

Unlike `mod.inv`, `mod.invertBatch` won't throw on `0`: make sure to throw an error yourself.

#### Creating private keys from hashes

You can't simply make a 32-byte private key from a 32-byte hash.
Doing so will make the key [biased](https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/).

To make the bias negligible, we follow [FIPS 186-5 A.2](https://csrc.nist.gov/publications/detail/fips/186/5/final)
and [RFC 9380](https://www.rfc-editor.org/rfc/rfc9380#section-5.2).
This means, for 32-byte key, we would need 48-byte hash to get 2^-128 bias, which matches curve security level.

`hashToPrivateScalar()` that hashes to **private key** was created for this purpose.
Use [abstract/hash-to-curve](#hash-to-curve-hashing-strings-to-curve-points)
if you need to hash to **public key**.

```ts
import { p256 } from '@noble/curves/p256';
import { sha256 } from '@noble/hashes/sha256';
import { hkdf } from '@noble/hashes/hkdf';
import * as mod from '@noble/curves/abstract/modular';
const someKey = new Uint8Array(32).fill(2); // Needs to actually be random, not .fill(2)
const derived = hkdf(sha256, someKey, undefined, 'application', 48); // 48 bytes for 32-byte priv
const validPrivateKey = mod.hashToPrivateScalar(derived, p256.CURVE.n);
```

### utils: Useful utilities

```ts
import * as utils from '@noble/curves/abstract/utils';

utils.bytesToHex(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]));
utils.hexToBytes('deadbeef');
utils.numberToHexUnpadded(123n);
utils.hexToNumber();

utils.bytesToNumberBE(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]));
utils.bytesToNumberLE(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]));
utils.numberToBytesBE(123n, 32);
utils.numberToBytesLE(123n, 64);

utils.concatBytes(Uint8Array.from([0xde, 0xad]), Uint8Array.from([0xbe, 0xef]));
utils.nLength(255n);
utils.equalBytes(Uint8Array.from([0xde]), Uint8Array.from([0xde]));
```

## Security

The library has been independently audited:

- at version 1.6.0, in Sep 2024, by [Cure53](https://cure53.de)
  - PDFs: [website](https://cure53.de/audit-report_noble-crypto-libs.pdf), [in-repo](./audit/2024-09-cure53-audit-nbl4.pdf)
  - [Changes since audit](https://github.com/paulmillr/noble-curves/compare/1.6.0..main)
  - Scope: ed25519, ed448, their add-ons, bls12-381, bn254,
    hash-to-curve, low-level primitives bls, tower, edwards, montgomery.
  - The audit has been funded by [OpenSats](https://opensats.org)
- at version 1.2.0, in Sep 2023, by [Kudelski Security](https://kudelskisecurity.com)
  - PDFs: [in-repo](./audit/2023-09-kudelski-audit-starknet.pdf)
  - [Changes since audit](https://github.com/paulmillr/noble-curves/compare/1.2.0..main)
  - Scope: [scure-starknet](https://github.com/paulmillr/scure-starknet) and its related
    abstract modules of noble-curves: `curve`, `modular`, `poseidon`, `weierstrass`
  - The audit has been funded by [Starkware](https://starkware.co)
- at version 0.7.3, in Feb 2023, by [Trail of Bits](https://www.trailofbits.com)
  - PDFs: [website](https://github.com/trailofbits/publications/blob/master/reviews/2023-01-ryanshea-noblecurveslibrary-securityreview.pdf),
    [in-repo](./audit/2023-01-trailofbits-audit-curves.pdf)
  - [Changes since audit](https://github.com/paulmillr/noble-curves/compare/0.7.3..main)
  - Scope: abstract modules `curve`, `hash-to-curve`, `modular`, `poseidon`, `utils`, `weierstrass` and
    top-level modules `_shortw_utils` and `secp256k1`
  - The audit has been funded by [Ryan Shea](https://www.shea.io)

It is tested against property-based, cross-library and Wycheproof vectors,
and has fuzzing by [Guido Vranken's cryptofuzz](https://github.com/guidovranken/cryptofuzz).

If you see anything unusual: investigate and report.

### Constant-timeness

_JIT-compiler_ and _Garbage Collector_ make "constant time" extremely hard to
achieve [timing attack](https://en.wikipedia.org/wiki/Timing_attack) resistance
in a scripting language. Which means _any other JS library can't have
constant-timeness_. Even statically typed Rust, a language without GC,
[makes it harder to achieve constant-time](https://www.chosenplaintext.ca/open-source/rust-timing-shield/security)
for some cases. If your goal is absolute security, don't use any JS lib — including bindings to native ones.
Use low-level libraries & languages. Nonetheless we're targetting algorithmic constant time.

### Supply chain security

- **Commits** are signed with PGP keys, to prevent forgery. Make sure to verify commit signatures.
- **Releases** are transparent and built on GitHub CI. Make sure to verify [provenance](https://docs.npmjs.com/generating-provenance-statements) logs
- **Rare releasing** is followed to ensure less re-audit need for end-users
- **Dependencies** are minimized and locked-down:
  - If your app has 500 dependencies, any dep could get hacked and you'll be downloading
    malware with every install. We make sure to use as few dependencies as possible
  - We prevent automatic dependency updates by locking-down version ranges. Every update is checked with `npm-diff`
  - One dependency [noble-hashes](https://github.com/paulmillr/noble-hashes) is used, by the same author, to provide hashing functionality
- **Dev Dependencies** are only used if you want to contribute to the repo. They are disabled for end-users:
  - scure-base, scure-bip32, scure-bip39, micro-bmark and micro-should are developed by the same author and follow identical security practices
  - prettier (linter), fast-check (property-based testing) and typescript are used for code quality, vector generation and ts compilation. The packages are big, which makes it hard to audit their source code thoroughly and fully

### Randomness

We're deferring to built-in
[crypto.getRandomValues](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
which is considered cryptographically secure (CSPRNG).

In the past, browsers had bugs that made it weak: it may happen again.
Implementing a userspace CSPRNG to get resilient to the weakness
is even worse: there is no reliable userspace source of quality entropy.

### Quantum computers

Cryptographically relevant quantum computer, if built, will allow to
break elliptic curve cryptography (both ECDSA / EdDSA & ECDH) using Shor's algorithm.

Consider switching to newer / hybrid algorithms, such as SPHINCS+. They are available in
[noble-post-quantum](https://github.com/paulmillr/noble-post-quantum).

NIST prohibits classical cryptography (RSA, DSA, ECDSA, ECDH) [after 2035](https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8547.ipd.pdf). Australian ASD prohibits it [after 2030](https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/ism/cyber-security-guidelines/guidelines-cryptography).

## Speed

Benchmark results on Apple M2 with node v22:

```
secp256k1
init x 68 ops/sec @ 14ms/op
getPublicKey x 6,839 ops/sec @ 146μs/op
sign x 5,226 ops/sec @ 191μs/op
verify x 893 ops/sec @ 1ms/op
getSharedSecret x 538 ops/sec @ 1ms/op
recoverPublicKey x 923 ops/sec @ 1ms/op
schnorr.sign x 700 ops/sec @ 1ms/op
schnorr.verify x 919 ops/sec @ 1ms/op

ed25519
init x 51 ops/sec @ 19ms/op
getPublicKey x 9,809 ops/sec @ 101μs/op
sign x 4,976 ops/sec @ 200μs/op
verify x 1,018 ops/sec @ 981μs/op

ed448
init x 19 ops/sec @ 50ms/op
getPublicKey x 3,723 ops/sec @ 268μs/op
sign x 1,759 ops/sec @ 568μs/op
verify x 344 ops/sec @ 2ms/op

p256
init x 39 ops/sec @ 25ms/op
getPublicKey x 6,518 ops/sec @ 153μs/op
sign x 5,148 ops/sec @ 194μs/op
verify x 609 ops/sec @ 1ms/op

p384
init x 17 ops/sec @ 57ms/op
getPublicKey x 2,933 ops/sec @ 340μs/op
sign x 2,327 ops/sec @ 429μs/op
verify x 244 ops/sec @ 4ms/op

p521
init x 8 ops/sec @ 112ms/op
getPublicKey x 1,484 ops/sec @ 673μs/op
sign x 1,264 ops/sec @ 790μs/op
verify x 124 ops/sec @ 8ms/op

ristretto255
add x 680,735 ops/sec @ 1μs/op
multiply x 10,766 ops/sec @ 92μs/op
encode x 15,835 ops/sec @ 63μs/op
decode x 15,972 ops/sec @ 62μs/op

decaf448
add x 345,303 ops/sec @ 2μs/op
multiply x 300 ops/sec @ 3ms/op
encode x 5,987 ops/sec @ 167μs/op
decode x 5,892 ops/sec @ 169μs/op

ecdh
├─x25519 x 1,477 ops/sec @ 676μs/op
├─secp256k1 x 537 ops/sec @ 1ms/op
├─p256 x 512 ops/sec @ 1ms/op
├─p384 x 198 ops/sec @ 5ms/op
├─p521 x 99 ops/sec @ 10ms/op
└─x448 x 504 ops/sec @ 1ms/op

bls12-381
init x 36 ops/sec @ 27ms/op
getPublicKey x 960 ops/sec @ 1ms/op
sign x 60 ops/sec @ 16ms/op
verify x 47 ops/sec @ 21ms/op
pairing x 125 ops/sec @ 7ms/op
pairing10 x 40 ops/sec @ 24ms/op ± 23.27% (min: 21ms, max: 48ms)
MSM 4096 scalars x points x 0 ops/sec @ 4655ms/op
aggregatePublicKeys/8 x 129 ops/sec @ 7ms/op
aggregatePublicKeys/32 x 34 ops/sec @ 28ms/op
aggregatePublicKeys/128 x 8 ops/sec @ 113ms/op
aggregatePublicKeys/512 x 2 ops/sec @ 449ms/op
aggregatePublicKeys/2048 x 0 ops/sec @ 1792ms/op
aggregateSignatures/8 x 62 ops/sec @ 15ms/op
aggregateSignatures/32 x 16 ops/sec @ 60ms/op
aggregateSignatures/128 x 4 ops/sec @ 238ms/op
aggregateSignatures/512 x 1 ops/sec @ 946ms/op
aggregateSignatures/2048 x 0 ops/sec @ 3774ms/op

hash-to-curve
hash_to_field x 91,600 ops/sec @ 10μs/op
secp256k1 x 2,373 ops/sec @ 421μs/op
p256 x 4,310 ops/sec @ 231μs/op
p384 x 1,664 ops/sec @ 600μs/op
p521 x 807 ops/sec @ 1ms/op
ed25519 x 3,088 ops/sec @ 323μs/op
ed448 x 1,247 ops/sec @ 801μs/op
```

## Upgrading

Previously, the library was split into single-feature packages
[noble-secp256k1](https://github.com/paulmillr/noble-secp256k1),
[noble-ed25519](https://github.com/paulmillr/noble-ed25519) and
[noble-bls12-381](https://github.com/paulmillr/noble-bls12-381).

Curves continue their original work. The single-feature packages changed their
direction towards providing minimal 4kb implementations of cryptography,
which means they have less features.

Upgrading from noble-secp256k1 2.0 or noble-ed25519 2.0: no changes, libraries are compatible.

Upgrading from noble-secp256k1 1.7:

- `getPublicKey`
  - now produce 33-byte compressed signatures by default
  - to use old behavior, which produced 65-byte uncompressed keys, set
    argument `isCompressed` to `false`: `getPublicKey(priv, false)`
- `sign`
  - is now sync
  - now returns `Signature` instance with `{ r, s, recovery }` properties
  - `canonical` option was renamed to `lowS`
  - `recovered` option has been removed because recovery bit is always returned now
  - `der` option has been removed. There are 2 options:
    1. Use compact encoding: `fromCompact`, `toCompactRawBytes`, `toCompactHex`.
       Compact encoding is simply a concatenation of 32-byte r and 32-byte s.
    2. If you must use DER encoding, switch to noble-curves (see above).
- `verify`
  - is now sync
  - `strict` option was renamed to `lowS`
- `getSharedSecret`
  - now produce 33-byte compressed signatures by default
  - to use old behavior, which produced 65-byte uncompressed keys, set
    argument `isCompressed` to `false`: `getSharedSecret(a, b, false)`
- `recoverPublicKey(msg, sig, rec)` was changed to `sig.recoverPublicKey(msg)`
- `number` type for private keys have been removed: use `bigint` instead
- `Point` (2d xy) has been changed to `ProjectivePoint` (3d xyz)
- `utils` were split into `utils` (same api as in noble-curves) and
  `etc` (`hmacSha256Sync` and others)

Upgrading from [@noble/ed25519](https://github.com/paulmillr/noble-ed25519) 1.7:

- Methods are now sync by default
- `bigint` is no longer allowed in `getPublicKey`, `sign`, `verify`. Reason: ed25519 is LE, can lead to bugs
- `Point` (2d xy) has been changed to `ExtendedPoint` (xyzt)
- `Signature` was removed: just use raw bytes or hex now
- `utils` were split into `utils` (same api as in noble-curves) and
  `etc` (`sha512Sync` and others)
- `getSharedSecret` was moved to `x25519` module
- `toX25519` has been moved to `edwardsToMontgomeryPub` and `edwardsToMontgomeryPriv` methods

Upgrading from [@noble/bls12-381](https://github.com/paulmillr/noble-bls12-381):

- Methods and classes were renamed:
  - PointG1 -> G1.Point, PointG2 -> G2.Point
  - PointG2.fromSignature -> Signature.decode, PointG2.toSignature -> Signature.encode
- Fp2 ORDER was corrected

## Contributing & testing

* `npm install && npm run build && npm test` will build the code and run tests.
* `npm run lint` / `npm run format` will run linter / fix linter issues.
* `npm run bench` will run benchmarks, which may need their deps first (`npm run bench:install`)
* `cd build && npm install && npm run build:release` will build single file

Check out [github.com/paulmillr/guidelines](https://github.com/paulmillr/guidelines)
for general coding practices and rules.

See [paulmillr.com/noble](https://paulmillr.com/noble/)
for useful resources, articles, documentation and demos
related to the library.

## License

The MIT License (MIT)

Copyright (c) 2022 Paul Miller [(https://paulmillr.com)](https://paulmillr.com)

See LICENSE file.
