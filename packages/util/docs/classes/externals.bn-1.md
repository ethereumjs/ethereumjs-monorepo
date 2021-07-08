[ethereumjs-util](../README.md) / [externals](../modules/externals.md) / BN

# Class: BN

[externals](../modules/externals.md).BN

[`BN`](https://github.com/indutny/bn.js)

## Table of contents

### Constructors

- [constructor](externals.bn-1.md#constructor)

### Properties

- [BN](externals.bn-1.md#bn)
- [wordSize](externals.bn-1.md#wordsize)

### Methods

- [abs](externals.bn-1.md#abs)
- [add](externals.bn-1.md#add)
- [addn](externals.bn-1.md#addn)
- [and](externals.bn-1.md#and)
- [andln](externals.bn-1.md#andln)
- [bincn](externals.bn-1.md#bincn)
- [bitLength](externals.bn-1.md#bitlength)
- [byteLength](externals.bn-1.md#bytelength)
- [clone](externals.bn-1.md#clone)
- [cmp](externals.bn-1.md#cmp)
- [cmpn](externals.bn-1.md#cmpn)
- [div](externals.bn-1.md#div)
- [divRound](externals.bn-1.md#divround)
- [divn](externals.bn-1.md#divn)
- [egcd](externals.bn-1.md#egcd)
- [eq](externals.bn-1.md#eq)
- [eqn](externals.bn-1.md#eqn)
- [fromTwos](externals.bn-1.md#fromtwos)
- [gcd](externals.bn-1.md#gcd)
- [gt](externals.bn-1.md#gt)
- [gte](externals.bn-1.md#gte)
- [gten](externals.bn-1.md#gten)
- [gtn](externals.bn-1.md#gtn)
- [iabs](externals.bn-1.md#iabs)
- [iadd](externals.bn-1.md#iadd)
- [iaddn](externals.bn-1.md#iaddn)
- [iand](externals.bn-1.md#iand)
- [idivn](externals.bn-1.md#idivn)
- [imaskn](externals.bn-1.md#imaskn)
- [imul](externals.bn-1.md#imul)
- [imuln](externals.bn-1.md#imuln)
- [ineg](externals.bn-1.md#ineg)
- [inotn](externals.bn-1.md#inotn)
- [invm](externals.bn-1.md#invm)
- [ior](externals.bn-1.md#ior)
- [isEven](externals.bn-1.md#iseven)
- [isNeg](externals.bn-1.md#isneg)
- [isOdd](externals.bn-1.md#isodd)
- [isZero](externals.bn-1.md#iszero)
- [ishln](externals.bn-1.md#ishln)
- [ishrn](externals.bn-1.md#ishrn)
- [isqr](externals.bn-1.md#isqr)
- [isub](externals.bn-1.md#isub)
- [isubn](externals.bn-1.md#isubn)
- [iuand](externals.bn-1.md#iuand)
- [iuor](externals.bn-1.md#iuor)
- [iushln](externals.bn-1.md#iushln)
- [iushrn](externals.bn-1.md#iushrn)
- [iuxor](externals.bn-1.md#iuxor)
- [ixor](externals.bn-1.md#ixor)
- [lt](externals.bn-1.md#lt)
- [lte](externals.bn-1.md#lte)
- [lten](externals.bn-1.md#lten)
- [ltn](externals.bn-1.md#ltn)
- [maskn](externals.bn-1.md#maskn)
- [mod](externals.bn-1.md#mod)
- [modn](externals.bn-1.md#modn)
- [modrn](externals.bn-1.md#modrn)
- [mul](externals.bn-1.md#mul)
- [muln](externals.bn-1.md#muln)
- [neg](externals.bn-1.md#neg)
- [notn](externals.bn-1.md#notn)
- [or](externals.bn-1.md#or)
- [pow](externals.bn-1.md#pow)
- [setn](externals.bn-1.md#setn)
- [shln](externals.bn-1.md#shln)
- [shrn](externals.bn-1.md#shrn)
- [sqr](externals.bn-1.md#sqr)
- [sub](externals.bn-1.md#sub)
- [subn](externals.bn-1.md#subn)
- [testn](externals.bn-1.md#testn)
- [toArray](externals.bn-1.md#toarray)
- [toArrayLike](externals.bn-1.md#toarraylike)
- [toBuffer](externals.bn-1.md#tobuffer)
- [toJSON](externals.bn-1.md#tojson)
- [toNumber](externals.bn-1.md#tonumber)
- [toRed](externals.bn-1.md#tored)
- [toString](externals.bn-1.md#tostring)
- [toTwos](externals.bn-1.md#totwos)
- [uand](externals.bn-1.md#uand)
- [ucmp](externals.bn-1.md#ucmp)
- [umod](externals.bn-1.md#umod)
- [uor](externals.bn-1.md#uor)
- [ushln](externals.bn-1.md#ushln)
- [ushrn](externals.bn-1.md#ushrn)
- [uxor](externals.bn-1.md#uxor)
- [xor](externals.bn-1.md#xor)
- [zeroBits](externals.bn-1.md#zerobits)
- [isBN](externals.bn-1.md#isbn)
- [max](externals.bn-1.md#max)
- [min](externals.bn-1.md#min)
- [mont](externals.bn-1.md#mont)
- [red](externals.bn-1.md#red)

## Constructors

### constructor

• **new BN**(`number`, `base?`, `endian?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `string` \| `number` \| `Buffer` \| [BN](externals.bn-1.md) \| `Uint8Array` \| `number`[] |
| `base?` | `number` \| ``"hex"`` |
| `endian?` | ``"le"`` \| ``"be"`` |

#### Defined in

node_modules/@types/bn.js/index.d.ts:30

• **new BN**(`number`, `endian?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `string` \| `number` \| `Buffer` \| [BN](externals.bn-1.md) \| `Uint8Array` \| `number`[] |
| `endian?` | ``"le"`` \| ``"be"`` |

#### Defined in

node_modules/@types/bn.js/index.d.ts:36

## Properties

### BN

▪ `Static` **BN**: typeof [BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:29

___

### wordSize

▪ `Static` **wordSize**: ``26``

#### Defined in

node_modules/@types/bn.js/index.d.ts:30

## Methods

### abs

▸ **abs**(): [BN](externals.bn-1.md)

**`description`** absolute value

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:235

___

### add

▸ **add**(`b`): [BN](externals.bn-1.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:245

___

### addn

▸ **addn**(`b`): [BN](externals.bn-1.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:255

___

### and

▸ **and**(`b`): [BN](externals.bn-1.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:381

___

### andln

▸ **andln**(`b`): [BN](externals.bn-1.md)

**`description`** and (NOTE: `andln` is going to be replaced with `andn` in future)

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:401

___

### bincn

▸ **bincn**(`b`): [BN](externals.bn-1.md)

**`description`** add `1 << b` to the number

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:485

___

### bitLength

▸ **bitLength**(): `number`

**`description`** get number of bits occupied

#### Returns

`number`

#### Defined in

node_modules/@types/bn.js/index.d.ts:115

___

### byteLength

▸ **byteLength**(): `number`

**`description`** return number of bytes occupied

#### Returns

`number`

#### Defined in

node_modules/@types/bn.js/index.d.ts:125

___

### clone

▸ **clone**(): [BN](externals.bn-1.md)

**`description`** clone number

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:70

___

### cmp

▸ **cmp**(`b`): ``0`` \| ``1`` \| ``-1``

**`description`** compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

``0`` \| ``1`` \| ``-1``

#### Defined in

node_modules/@types/bn.js/index.d.ts:150

___

### cmpn

▸ **cmpn**(`b`): ``0`` \| ``1`` \| ``-1``

**`description`** compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

``0`` \| ``1`` \| ``-1``

#### Defined in

node_modules/@types/bn.js/index.d.ts:160

___

### div

▸ **div**(`b`): [BN](externals.bn-1.md)

**`description`** divide

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:320

___

### divRound

▸ **divRound**(`b`): [BN](externals.bn-1.md)

**`description`** rounded division

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:356

___

### divn

▸ **divn**(`b`): [BN](externals.bn-1.md)

**`description`** divide

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:325

___

### egcd

▸ **egcd**(`b`): `Object`

**`description`** Extended GCD results `({ a: ..., b: ..., gcd: ... })`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `a` | [BN](externals.bn-1.md) |
| `b` | [BN](externals.bn-1.md) |
| `gcd` | [BN](externals.bn-1.md) |

#### Defined in

node_modules/@types/bn.js/index.d.ts:505

___

### eq

▸ **eq**(`b`): `boolean`

**`description`** a equals b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:205

___

### eqn

▸ **eqn**(`b`): `boolean`

**`description`** a equals b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:210

___

### fromTwos

▸ **fromTwos**(`width`): [BN](externals.bn-1.md)

**`description`** convert from two's complement representation, where width is the bit width

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:220

___

### gcd

▸ **gcd**(`b`): [BN](externals.bn-1.md)

**`description`** GCD

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:500

___

### gt

▸ **gt**(`b`): `boolean`

**`description`** a greater than b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:185

___

### gte

▸ **gte**(`b`): `boolean`

**`description`** a greater than or equals b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:195

___

### gten

▸ **gten**(`b`): `boolean`

**`description`** a greater than or equals b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:200

___

### gtn

▸ **gtn**(`b`): `boolean`

**`description`** a greater than b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:190

___

### iabs

▸ **iabs**(): [BN](externals.bn-1.md)

**`description`** absolute value

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:240

___

### iadd

▸ **iadd**(`b`): [BN](externals.bn-1.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:250

___

### iaddn

▸ **iaddn**(`b`): [BN](externals.bn-1.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:260

___

### iand

▸ **iand**(`b`): [BN](externals.bn-1.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:386

___

### idivn

▸ **idivn**(`b`): [BN](externals.bn-1.md)

**`description`** divide

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:330

___

### imaskn

▸ **imaskn**(`b`): [BN](externals.bn-1.md)

**`description`** clear bits with indexes higher or equal to `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:481

___

### imul

▸ **imul**(`b`): [BN](externals.bn-1.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:290

___

### imuln

▸ **imuln**(`b`): [BN](externals.bn-1.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:300

___

### ineg

▸ **ineg**(): [BN](externals.bn-1.md)

**`description`** negate sign

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:230

___

### inotn

▸ **inotn**(`w`): [BN](externals.bn-1.md)

**`description`** not (for the width specified by `w`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `w` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:495

___

### invm

▸ **invm**(`b`): [BN](externals.bn-1.md)

**`description`** inverse `a` modulo `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:510

___

### ior

▸ **ior**(`b`): [BN](externals.bn-1.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:366

___

### isEven

▸ **isEven**(): `boolean`

**`description`** check if value is even

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:135

___

### isNeg

▸ **isNeg**(): `boolean`

**`description`** true if the number is negative

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:130

___

### isOdd

▸ **isOdd**(): `boolean`

**`description`** check if value is odd

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:140

___

### isZero

▸ **isZero**(): `boolean`

**`description`** check if value is zero

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:145

___

### ishln

▸ **ishln**(`b`): [BN](externals.bn-1.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:436

___

### ishrn

▸ **ishrn**(`b`): [BN](externals.bn-1.md)

**`description`** shift right (unimplemented https://github.com/indutny/bn.js/blob/master/lib/bn.js#L2086)

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:456

___

### isqr

▸ **isqr**(): [BN](externals.bn-1.md)

**`description`** square

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:310

___

### isub

▸ **isub**(`b`): [BN](externals.bn-1.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:270

___

### isubn

▸ **isubn**(`b`): [BN](externals.bn-1.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:280

___

### iuand

▸ **iuand**(`b`): [BN](externals.bn-1.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:396

___

### iuor

▸ **iuor**(`b`): [BN](externals.bn-1.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:376

___

### iushln

▸ **iushln**(`b`): [BN](externals.bn-1.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:446

___

### iushrn

▸ **iushrn**(`b`): [BN](externals.bn-1.md)

**`description`** shift right

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:466

___

### iuxor

▸ **iuxor**(`b`): [BN](externals.bn-1.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:421

___

### ixor

▸ **ixor**(`b`): [BN](externals.bn-1.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:411

___

### lt

▸ **lt**(`b`): `boolean`

**`description`** a less than b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:165

___

### lte

▸ **lte**(`b`): `boolean`

**`description`** a less than or equals b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:175

___

### lten

▸ **lten**(`b`): `boolean`

**`description`** a less than or equals b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:180

___

### ltn

▸ **ltn**(`b`): `boolean`

**`description`** a less than b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:170

___

### maskn

▸ **maskn**(`b`): [BN](externals.bn-1.md)

**`description`** clear bits with indexes higher or equal to `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:476

___

### mod

▸ **mod**(`b`): [BN](externals.bn-1.md)

**`description`** reduct

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:335

___

### modn

▸ **modn**(`b`): `number`

**`deprecated`**

**`description`** reduct

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`number`

#### Defined in

node_modules/@types/bn.js/index.d.ts:346

___

### modrn

▸ **modrn**(`b`): `number`

**`description`** reduct

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`number`

#### Defined in

node_modules/@types/bn.js/index.d.ts:351

___

### mul

▸ **mul**(`b`): [BN](externals.bn-1.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:285

___

### muln

▸ **muln**(`b`): [BN](externals.bn-1.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:295

___

### neg

▸ **neg**(): [BN](externals.bn-1.md)

**`description`** negate sign

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:225

___

### notn

▸ **notn**(`w`): [BN](externals.bn-1.md)

**`description`** not (for the width specified by `w`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `w` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:490

___

### or

▸ **or**(`b`): [BN](externals.bn-1.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:361

___

### pow

▸ **pow**(`b`): [BN](externals.bn-1.md)

**`description`** raise `a` to the power of `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:315

___

### setn

▸ **setn**(`b`): [BN](externals.bn-1.md)

**`description`** set specified bit to 1

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:426

___

### shln

▸ **shln**(`b`): [BN](externals.bn-1.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:431

___

### shrn

▸ **shrn**(`b`): [BN](externals.bn-1.md)

**`description`** shift right

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:451

___

### sqr

▸ **sqr**(): [BN](externals.bn-1.md)

**`description`** square

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:305

___

### sub

▸ **sub**(`b`): [BN](externals.bn-1.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:265

___

### subn

▸ **subn**(`b`): [BN](externals.bn-1.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:275

___

### testn

▸ **testn**(`b`): `boolean`

**`description`** test if specified bit is set

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

`boolean`

#### Defined in

node_modules/@types/bn.js/index.d.ts:471

___

### toArray

▸ **toArray**(`endian?`, `length?`): `number`[]

**`description`** convert to byte Array, and optionally zero pad to length, throwing if already exceeding

#### Parameters

| Name | Type |
| :------ | :------ |
| `endian?` | ``"le"`` \| ``"be"`` |
| `length?` | `number` |

#### Returns

`number`[]

#### Defined in

node_modules/@types/bn.js/index.d.ts:90

___

### toArrayLike

▸ **toArrayLike**(`ArrayType`, `endian?`, `length?`): `Buffer`

**`description`** convert to an instance of `type`, which must behave like an Array

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ArrayType` | `Object` | - |
| `ArrayType.poolSize` | `number` | This is the number of bytes used to determine the size of pre-allocated, internal Buffer instances used for pooling. This value may be modified. |
| `ArrayType.prototype` | `Buffer` | - |
| `ArrayType.alloc` |  | - |
| `ArrayType.allocUnsafe` |  | - |
| `ArrayType.allocUnsafeSlow` |  | - |
| `ArrayType.byteLength` |  | - |
| `ArrayType.compare` |  | - |
| `ArrayType.concat` |  | - |
| `ArrayType.from` |  | - |
| `ArrayType.isBuffer` |  | - |
| `ArrayType.isEncoding` |  | - |
| `ArrayType.of` |  | - |
| `endian?` | ``"le"`` \| ``"be"`` | - |
| `length?` | `number` | - |

#### Returns

`Buffer`

#### Defined in

node_modules/@types/bn.js/index.d.ts:95

▸ **toArrayLike**(`ArrayType`, `endian?`, `length?`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | `any`[] |
| `endian?` | ``"le"`` \| ``"be"`` |
| `length?` | `number` |

#### Returns

`any`[]

#### Defined in

node_modules/@types/bn.js/index.d.ts:101

___

### toBuffer

▸ **toBuffer**(`endian?`, `length?`): `Buffer`

**`description`** convert to Node.js Buffer (if available). For compatibility with browserify and similar tools, use this instead: a.toArrayLike(Buffer, endian, length)

#### Parameters

| Name | Type |
| :------ | :------ |
| `endian?` | ``"le"`` \| ``"be"`` |
| `length?` | `number` |

#### Returns

`Buffer`

#### Defined in

node_modules/@types/bn.js/index.d.ts:110

___

### toJSON

▸ **toJSON**(): `string`

**`description`** convert to JSON compatible hex string (alias of toString(16))

#### Returns

`string`

#### Defined in

node_modules/@types/bn.js/index.d.ts:85

___

### toNumber

▸ **toNumber**(): `number`

**`description`** convert to Javascript Number (limited to 53 bits)

#### Returns

`number`

#### Defined in

node_modules/@types/bn.js/index.d.ts:80

___

### toRed

▸ **toRed**(`reductionContext`): `RedBN`

**`description`** Convert number to red

#### Parameters

| Name | Type |
| :------ | :------ |
| `reductionContext` | [ReductionContext](../interfaces/externals.bn.reductioncontext.md) |

#### Returns

`RedBN`

#### Defined in

node_modules/@types/bn.js/index.d.ts:515

___

### toString

▸ **toString**(`base?`, `length?`): `string`

**`description`** convert to base-string and pad with zeroes

#### Parameters

| Name | Type |
| :------ | :------ |
| `base?` | `number` \| ``"hex"`` |
| `length?` | `number` |

#### Returns

`string`

#### Defined in

node_modules/@types/bn.js/index.d.ts:75

___

### toTwos

▸ **toTwos**(`width`): [BN](externals.bn-1.md)

**`description`** convert to two's complement representation, where width is bit width

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:215

___

### uand

▸ **uand**(`b`): [BN](externals.bn-1.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:391

___

### ucmp

▸ **ucmp**(`b`): ``0`` \| ``1`` \| ``-1``

**`description`** compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

``0`` \| ``1`` \| ``-1``

#### Defined in

node_modules/@types/bn.js/index.d.ts:155

___

### umod

▸ **umod**(`b`): [BN](externals.bn-1.md)

**`description`** reduct

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:340

___

### uor

▸ **uor**(`b`): [BN](externals.bn-1.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:371

___

### ushln

▸ **ushln**(`b`): [BN](externals.bn-1.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:441

___

### ushrn

▸ **ushrn**(`b`): [BN](externals.bn-1.md)

**`description`** shift right

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:461

___

### uxor

▸ **uxor**(`b`): [BN](externals.bn-1.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:416

___

### xor

▸ **xor**(`b`): [BN](externals.bn-1.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:406

___

### zeroBits

▸ **zeroBits**(): `number`

**`description`** return number of less-significant consequent zero bits (example: 1010000 has 4 zero bits)

#### Returns

`number`

#### Defined in

node_modules/@types/bn.js/index.d.ts:120

___

### isBN

▸ `Static` **isBN**(`b`): b is BN

**`description`** returns true if the supplied object is a BN.js instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `any` |

#### Returns

b is BN

#### Defined in

node_modules/@types/bn.js/index.d.ts:55

___

### max

▸ `Static` **max**(`left`, `right`): [BN](externals.bn-1.md)

**`description`** returns the maximum of 2 BN instances.

#### Parameters

| Name | Type |
| :------ | :------ |
| `left` | [BN](externals.bn-1.md) |
| `right` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:60

___

### min

▸ `Static` **min**(`left`, `right`): [BN](externals.bn-1.md)

**`description`** returns the minimum of 2 BN instances.

#### Parameters

| Name | Type |
| :------ | :------ |
| `left` | [BN](externals.bn-1.md) |
| `right` | [BN](externals.bn-1.md) |

#### Returns

[BN](externals.bn-1.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:65

___

### mont

▸ `Static` **mont**(`num`): [ReductionContext](../interfaces/externals.bn.reductioncontext.md)

**`description`** create a reduction context  with the Montgomery trick.

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | [BN](externals.bn-1.md) |

#### Returns

[ReductionContext](../interfaces/externals.bn.reductioncontext.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:50

___

### red

▸ `Static` **red**(`reductionContext`): [ReductionContext](../interfaces/externals.bn.reductioncontext.md)

**`description`** create a reduction context

#### Parameters

| Name | Type |
| :------ | :------ |
| `reductionContext` | [BN](externals.bn-1.md) \| ``"k256"`` \| ``"p224"`` \| ``"p192"`` \| ``"p25519"`` |

#### Returns

[ReductionContext](../interfaces/externals.bn.reductioncontext.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:45
