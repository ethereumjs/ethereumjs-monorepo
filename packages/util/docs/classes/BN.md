[ethereumjs-util](../README.md) / BN

# Class: BN

[`BN`](https://github.com/indutny/bn.js)

## Table of contents

### Constructors

- [constructor](BN.md#constructor)

### Properties

- [BN](BN.md#bn)
- [wordSize](BN.md#wordsize)

### Methods

- [abs](BN.md#abs)
- [add](BN.md#add)
- [addn](BN.md#addn)
- [and](BN.md#and)
- [andln](BN.md#andln)
- [bincn](BN.md#bincn)
- [bitLength](BN.md#bitlength)
- [byteLength](BN.md#bytelength)
- [clone](BN.md#clone)
- [cmp](BN.md#cmp)
- [cmpn](BN.md#cmpn)
- [div](BN.md#div)
- [divRound](BN.md#divround)
- [divn](BN.md#divn)
- [egcd](BN.md#egcd)
- [eq](BN.md#eq)
- [eqn](BN.md#eqn)
- [fromTwos](BN.md#fromtwos)
- [gcd](BN.md#gcd)
- [gt](BN.md#gt)
- [gte](BN.md#gte)
- [gten](BN.md#gten)
- [gtn](BN.md#gtn)
- [iabs](BN.md#iabs)
- [iadd](BN.md#iadd)
- [iaddn](BN.md#iaddn)
- [iand](BN.md#iand)
- [idivn](BN.md#idivn)
- [imaskn](BN.md#imaskn)
- [imul](BN.md#imul)
- [imuln](BN.md#imuln)
- [ineg](BN.md#ineg)
- [inotn](BN.md#inotn)
- [invm](BN.md#invm)
- [ior](BN.md#ior)
- [isEven](BN.md#iseven)
- [isNeg](BN.md#isneg)
- [isOdd](BN.md#isodd)
- [isZero](BN.md#iszero)
- [ishln](BN.md#ishln)
- [ishrn](BN.md#ishrn)
- [isqr](BN.md#isqr)
- [isub](BN.md#isub)
- [isubn](BN.md#isubn)
- [iuand](BN.md#iuand)
- [iuor](BN.md#iuor)
- [iushln](BN.md#iushln)
- [iushrn](BN.md#iushrn)
- [iuxor](BN.md#iuxor)
- [ixor](BN.md#ixor)
- [lt](BN.md#lt)
- [lte](BN.md#lte)
- [lten](BN.md#lten)
- [ltn](BN.md#ltn)
- [maskn](BN.md#maskn)
- [mod](BN.md#mod)
- [modn](BN.md#modn)
- [modrn](BN.md#modrn)
- [mul](BN.md#mul)
- [muln](BN.md#muln)
- [neg](BN.md#neg)
- [notn](BN.md#notn)
- [or](BN.md#or)
- [pow](BN.md#pow)
- [setn](BN.md#setn)
- [shln](BN.md#shln)
- [shrn](BN.md#shrn)
- [sqr](BN.md#sqr)
- [sub](BN.md#sub)
- [subn](BN.md#subn)
- [testn](BN.md#testn)
- [toArray](BN.md#toarray)
- [toArrayLike](BN.md#toarraylike)
- [toBuffer](BN.md#tobuffer)
- [toJSON](BN.md#tojson)
- [toNumber](BN.md#tonumber)
- [toRed](BN.md#tored)
- [toString](BN.md#tostring)
- [toTwos](BN.md#totwos)
- [uand](BN.md#uand)
- [ucmp](BN.md#ucmp)
- [umod](BN.md#umod)
- [uor](BN.md#uor)
- [ushln](BN.md#ushln)
- [ushrn](BN.md#ushrn)
- [uxor](BN.md#uxor)
- [xor](BN.md#xor)
- [zeroBits](BN.md#zerobits)
- [isBN](BN.md#isbn)
- [max](BN.md#max)
- [min](BN.md#min)
- [mont](BN.md#mont)
- [red](BN.md#red)

## Constructors

### constructor

• **new BN**(`number`, `base?`, `endian?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `string` \| `number` \| `number`[] \| `Uint8Array` \| `Buffer` \| [`BN`](BN.md) |
| `base?` | `number` \| ``"hex"`` |
| `endian?` | [`Endianness`](../modules/BN.md#endianness) |

#### Defined in

node_modules/@types/bn.js/index.d.ts:32

• **new BN**(`number`, `endian?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `string` \| `number` \| `number`[] \| `Uint8Array` \| `Buffer` \| [`BN`](BN.md) |
| `endian?` | [`Endianness`](../modules/BN.md#endianness) |

#### Defined in

node_modules/@types/bn.js/index.d.ts:37

## Properties

### BN

▪ `Static` **BN**: typeof [`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:29

___

### wordSize

▪ `Static` **wordSize**: ``26``

#### Defined in

node_modules/@types/bn.js/index.d.ts:30

## Methods

### abs

▸ **abs**(): [`BN`](BN.md)

**`description`** absolute value

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:235

___

### add

▸ **add**(`b`): [`BN`](BN.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:245

___

### addn

▸ **addn**(`b`): [`BN`](BN.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:255

___

### and

▸ **and**(`b`): [`BN`](BN.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:381

___

### andln

▸ **andln**(`b`): [`BN`](BN.md)

**`description`** and (NOTE: `andln` is going to be replaced with `andn` in future)

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:401

___

### bincn

▸ **bincn**(`b`): [`BN`](BN.md)

**`description`** add `1 << b` to the number

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

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

▸ **clone**(): [`BN`](BN.md)

**`description`** clone number

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:70

___

### cmp

▸ **cmp**(`b`): ``0`` \| ``1`` \| ``-1``

**`description`** compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

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

▸ **div**(`b`): [`BN`](BN.md)

**`description`** divide

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:320

___

### divRound

▸ **divRound**(`b`): [`BN`](BN.md)

**`description`** rounded division

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:356

___

### divn

▸ **divn**(`b`): [`BN`](BN.md)

**`description`** divide

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:325

___

### egcd

▸ **egcd**(`b`): `Object`

**`description`** Extended GCD results `({ a: ..., b: ..., gcd: ... })`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `a` | [`BN`](BN.md) |
| `b` | [`BN`](BN.md) |
| `gcd` | [`BN`](BN.md) |

#### Defined in

node_modules/@types/bn.js/index.d.ts:505

___

### eq

▸ **eq**(`b`): `boolean`

**`description`** a equals b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

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

▸ **fromTwos**(`width`): [`BN`](BN.md)

**`description`** convert from two's complement representation, where width is the bit width

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:220

___

### gcd

▸ **gcd**(`b`): [`BN`](BN.md)

**`description`** GCD

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:500

___

### gt

▸ **gt**(`b`): `boolean`

**`description`** a greater than b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

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
| `b` | [`BN`](BN.md) |

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

▸ **iabs**(): [`BN`](BN.md)

**`description`** absolute value

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:240

___

### iadd

▸ **iadd**(`b`): [`BN`](BN.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:250

___

### iaddn

▸ **iaddn**(`b`): [`BN`](BN.md)

**`description`** addition

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:260

___

### iand

▸ **iand**(`b`): [`BN`](BN.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:386

___

### idivn

▸ **idivn**(`b`): [`BN`](BN.md)

**`description`** divide

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:330

___

### imaskn

▸ **imaskn**(`b`): [`BN`](BN.md)

**`description`** clear bits with indexes higher or equal to `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:481

___

### imul

▸ **imul**(`b`): [`BN`](BN.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:290

___

### imuln

▸ **imuln**(`b`): [`BN`](BN.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:300

___

### ineg

▸ **ineg**(): [`BN`](BN.md)

**`description`** negate sign

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:230

___

### inotn

▸ **inotn**(`w`): [`BN`](BN.md)

**`description`** not (for the width specified by `w`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `w` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:495

___

### invm

▸ **invm**(`b`): [`BN`](BN.md)

**`description`** inverse `a` modulo `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:510

___

### ior

▸ **ior**(`b`): [`BN`](BN.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

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

▸ **ishln**(`b`): [`BN`](BN.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:436

___

### ishrn

▸ **ishrn**(`b`): [`BN`](BN.md)

**`description`** shift right (unimplemented https://github.com/indutny/bn.js/blob/master/lib/bn.js#L2086)

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:456

___

### isqr

▸ **isqr**(): [`BN`](BN.md)

**`description`** square

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:310

___

### isub

▸ **isub**(`b`): [`BN`](BN.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:270

___

### isubn

▸ **isubn**(`b`): [`BN`](BN.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:280

___

### iuand

▸ **iuand**(`b`): [`BN`](BN.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:396

___

### iuor

▸ **iuor**(`b`): [`BN`](BN.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:376

___

### iushln

▸ **iushln**(`b`): [`BN`](BN.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:446

___

### iushrn

▸ **iushrn**(`b`): [`BN`](BN.md)

**`description`** shift right

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:466

___

### iuxor

▸ **iuxor**(`b`): [`BN`](BN.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:421

___

### ixor

▸ **ixor**(`b`): [`BN`](BN.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:411

___

### lt

▸ **lt**(`b`): `boolean`

**`description`** a less than b

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

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
| `b` | [`BN`](BN.md) |

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

▸ **maskn**(`b`): [`BN`](BN.md)

**`description`** clear bits with indexes higher or equal to `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:476

___

### mod

▸ **mod**(`b`): [`BN`](BN.md)

**`description`** reduct

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

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

▸ **mul**(`b`): [`BN`](BN.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:285

___

### muln

▸ **muln**(`b`): [`BN`](BN.md)

**`description`** multiply

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:295

___

### neg

▸ **neg**(): [`BN`](BN.md)

**`description`** negate sign

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:225

___

### notn

▸ **notn**(`w`): [`BN`](BN.md)

**`description`** not (for the width specified by `w`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `w` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:490

___

### or

▸ **or**(`b`): [`BN`](BN.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:361

___

### pow

▸ **pow**(`b`): [`BN`](BN.md)

**`description`** raise `a` to the power of `b`

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:315

___

### setn

▸ **setn**(`b`): [`BN`](BN.md)

**`description`** set specified bit to 1

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:426

___

### shln

▸ **shln**(`b`): [`BN`](BN.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:431

___

### shrn

▸ **shrn**(`b`): [`BN`](BN.md)

**`description`** shift right

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:451

___

### sqr

▸ **sqr**(): [`BN`](BN.md)

**`description`** square

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:305

___

### sub

▸ **sub**(`b`): [`BN`](BN.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:265

___

### subn

▸ **subn**(`b`): [`BN`](BN.md)

**`description`** subtraction

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

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
| `endian?` | [`Endianness`](../modules/BN.md#endianness) |
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

| Name | Type |
| :------ | :------ |
| `ArrayType` | `BufferConstructor` |
| `endian?` | [`Endianness`](../modules/BN.md#endianness) |
| `length?` | `number` |

#### Returns

`Buffer`

#### Defined in

node_modules/@types/bn.js/index.d.ts:95

▸ **toArrayLike**(`ArrayType`, `endian?`, `length?`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `ArrayType` | `any`[] |
| `endian?` | [`Endianness`](../modules/BN.md#endianness) |
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
| `endian?` | [`Endianness`](../modules/BN.md#endianness) |
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
| `reductionContext` | [`ReductionContext`](../interfaces/BN.ReductionContext.md) |

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

▸ **toTwos**(`width`): [`BN`](BN.md)

**`description`** convert to two's complement representation, where width is bit width

#### Parameters

| Name | Type |
| :------ | :------ |
| `width` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:215

___

### uand

▸ **uand**(`b`): [`BN`](BN.md)

**`description`** and

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:391

___

### ucmp

▸ **ucmp**(`b`): ``0`` \| ``1`` \| ``-1``

**`description`** compare numbers and return `-1 (a < b)`, `0 (a == b)`, or `1 (a > b)` depending on the comparison result

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

``0`` \| ``1`` \| ``-1``

#### Defined in

node_modules/@types/bn.js/index.d.ts:155

___

### umod

▸ **umod**(`b`): [`BN`](BN.md)

**`description`** reduct

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:340

___

### uor

▸ **uor**(`b`): [`BN`](BN.md)

**`description`** or

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:371

___

### ushln

▸ **ushln**(`b`): [`BN`](BN.md)

**`description`** shift left

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:441

___

### ushrn

▸ **ushrn**(`b`): [`BN`](BN.md)

**`description`** shift right

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | `number` |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:461

___

### uxor

▸ **uxor**(`b`): [`BN`](BN.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:416

___

### xor

▸ **xor**(`b`): [`BN`](BN.md)

**`description`** xor

#### Parameters

| Name | Type |
| :------ | :------ |
| `b` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

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

▸ `Static` **max**(`left`, `right`): [`BN`](BN.md)

**`description`** returns the maximum of 2 BN instances.

#### Parameters

| Name | Type |
| :------ | :------ |
| `left` | [`BN`](BN.md) |
| `right` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:60

___

### min

▸ `Static` **min**(`left`, `right`): [`BN`](BN.md)

**`description`** returns the minimum of 2 BN instances.

#### Parameters

| Name | Type |
| :------ | :------ |
| `left` | [`BN`](BN.md) |
| `right` | [`BN`](BN.md) |

#### Returns

[`BN`](BN.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:65

___

### mont

▸ `Static` **mont**(`num`): [`ReductionContext`](../interfaces/BN.ReductionContext.md)

**`description`** create a reduction context  with the Montgomery trick.

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | [`BN`](BN.md) |

#### Returns

[`ReductionContext`](../interfaces/BN.ReductionContext.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:50

___

### red

▸ `Static` **red**(`reductionContext`): [`ReductionContext`](../interfaces/BN.ReductionContext.md)

**`description`** create a reduction context

#### Parameters

| Name | Type |
| :------ | :------ |
| `reductionContext` | [`IPrimeName`](../modules/BN.md#iprimename) \| [`BN`](BN.md) |

#### Returns

[`ReductionContext`](../interfaces/BN.ReductionContext.md)

#### Defined in

node_modules/@types/bn.js/index.d.ts:45
