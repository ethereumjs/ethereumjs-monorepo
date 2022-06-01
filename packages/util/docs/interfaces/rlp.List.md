[ethereumjs-util](../README.md) / [rlp](../modules/rlp.md) / List

# Interface: List

[rlp](../modules/rlp.md).List

## Hierarchy

- `Array`<[`Input`](../modules/rlp.md#input)\>

  ↳ **`List`**

## Table of contents

### Properties

- [lastIndex](rlp.List.md#lastindex)
- [lastItem](rlp.List.md#lastitem)
- [length](rlp.List.md#length)

### Methods

- [[iterator]](rlp.List.md#[iterator])
- [[unscopables]](rlp.List.md#[unscopables])
- [at](rlp.List.md#at)
- [concat](rlp.List.md#concat)
- [copyWithin](rlp.List.md#copywithin)
- [entries](rlp.List.md#entries)
- [every](rlp.List.md#every)
- [fill](rlp.List.md#fill)
- [filter](rlp.List.md#filter)
- [find](rlp.List.md#find)
- [findIndex](rlp.List.md#findindex)
- [flat](rlp.List.md#flat)
- [flatMap](rlp.List.md#flatmap)
- [forEach](rlp.List.md#foreach)
- [includes](rlp.List.md#includes)
- [indexOf](rlp.List.md#indexof)
- [join](rlp.List.md#join)
- [keys](rlp.List.md#keys)
- [lastIndexOf](rlp.List.md#lastindexof)
- [map](rlp.List.md#map)
- [pop](rlp.List.md#pop)
- [push](rlp.List.md#push)
- [reduce](rlp.List.md#reduce)
- [reduceRight](rlp.List.md#reduceright)
- [reverse](rlp.List.md#reverse)
- [shift](rlp.List.md#shift)
- [slice](rlp.List.md#slice)
- [some](rlp.List.md#some)
- [sort](rlp.List.md#sort)
- [splice](rlp.List.md#splice)
- [toLocaleString](rlp.List.md#tolocalestring)
- [toString](rlp.List.md#tostring)
- [turn](rlp.List.md#turn)
- [unshift](rlp.List.md#unshift)
- [values](rlp.List.md#values)

## Properties

### lastIndex

• `Readonly` **lastIndex**: `number`

#### Inherited from

Array.lastIndex

#### Defined in

node_modules/@types/core-js/index.d.ts:88

___

### lastItem

• **lastItem**: [`Input`](../modules/rlp.md#input)

#### Inherited from

Array.lastItem

#### Defined in

node_modules/@types/core-js/index.d.ts:87

___

### length

• **length**: `number`

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### Inherited from

Array.length

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1279

## Methods

### [iterator]

▸ **[iterator]**(): `IterableIterator`<[`Input`](../modules/rlp.md#input)\>

Iterator

#### Returns

`IterableIterator`<[`Input`](../modules/rlp.md#input)\>

#### Inherited from

Array.\_\_@iterator@88

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:60

___

### [unscopables]

▸ **[unscopables]**(): `Object`

Returns an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `copyWithin` | `boolean` |
| `entries` | `boolean` |
| `fill` | `boolean` |
| `find` | `boolean` |
| `findIndex` | `boolean` |
| `keys` | `boolean` |
| `values` | `boolean` |

#### Inherited from

Array.\_\_@unscopables@90

#### Defined in

node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:99

___

### at

▸ **at**(`index`): `undefined` \| [`Input`](../modules/rlp.md#input)

Takes an integer value and returns the item at that index,
allowing for positive and negative integers.
Negative integers count back from the last item in the array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`undefined` \| [`Input`](../modules/rlp.md#input)

#### Inherited from

Array.at

#### Defined in

node_modules/@types/node/globals.d.ts:86

___

### concat

▸ **concat**(...`items`): [`Input`](../modules/rlp.md#input)[]

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | `ConcatArray`<[`Input`](../modules/rlp.md#input)\>[] | Additional arrays and/or items to add to the end of the array. |

#### Returns

[`Input`](../modules/rlp.md#input)[]

#### Inherited from

Array.concat

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1303

▸ **concat**(...`items`): [`Input`](../modules/rlp.md#input)[]

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | ([`Input`](../modules/rlp.md#input) \| `ConcatArray`<[`Input`](../modules/rlp.md#input)\>)[] | Additional arrays and/or items to add to the end of the array. |

#### Returns

[`Input`](../modules/rlp.md#input)[]

#### Inherited from

Array.concat

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1309

___

### copyWithin

▸ **copyWithin**(`target`, `start`, `end?`): [`List`](rlp.List.md)

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | `number` | If target is negative, it is treated as length+target where length is the length of the array. |
| `start` | `number` | If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. |
| `end?` | `number` | If not specified, length of the this object is used as its default value. |

#### Returns

[`List`](rlp.List.md)

#### Inherited from

Array.copyWithin

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:64

___

### entries

▸ **entries**(): `IterableIterator`<[`number`, [`Input`](../modules/rlp.md#input)]\>

Returns an iterable of key, value pairs for every entry in the array

#### Returns

`IterableIterator`<[`number`, [`Input`](../modules/rlp.md#input)]\>

#### Inherited from

Array.entries

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:65

___

### every

▸ **every**<`S`\>(`predicate`, `thisArg?`): this is S[]

Determines whether all the members of an array satisfy the specified test.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`Input`](../modules/rlp.md#input) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => value is S | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

this is S[]

#### Inherited from

Array.every

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1386

▸ **every**(`predicate`, `thisArg?`): `boolean`

Determines whether all the members of an array satisfy the specified test.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `unknown` | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`boolean`

#### Inherited from

Array.every

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1395

___

### fill

▸ **fill**(`value`, `start?`, `end?`): [`List`](rlp.List.md)

Changes all array elements from `start` to `end` index to a static `value` and returns the modified array

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`Input`](../modules/rlp.md#input) | value to fill array section with |
| `start?` | `number` | index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array. |
| `end?` | `number` | index to stop filling the array at. If end is negative, it is treated as length+end. |

#### Returns

[`List`](rlp.List.md)

#### Inherited from

Array.fill

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:53

___

### filter

▸ **filter**<`S`\>(`predicate`, `thisArg?`): `S`[]

Returns the elements of an array that meet the condition specified in a callback function.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`Input`](../modules/rlp.md#input) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => value is S | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`S`[]

#### Inherited from

Array.filter

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1422

▸ **filter**(`predicate`, `thisArg?`): [`Input`](../modules/rlp.md#input)[]

Returns the elements of an array that meet the condition specified in a callback function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `unknown` | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

[`Input`](../modules/rlp.md#input)[]

#### Inherited from

Array.filter

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1428

___

### find

▸ **find**<`S`\>(`predicate`, `thisArg?`): `undefined` \| `S`

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`Input`](../modules/rlp.md#input) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`this`: `void`, `value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `obj`: [`Input`](../modules/rlp.md#input)[]) => value is S | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`undefined` \| `S`

#### Inherited from

Array.find

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:31

▸ **find**(`predicate`, `thisArg?`): `undefined` \| [`Input`](../modules/rlp.md#input)

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `obj`: [`Input`](../modules/rlp.md#input)[]) => `unknown` |
| `thisArg?` | `any` |

#### Returns

`undefined` \| [`Input`](../modules/rlp.md#input)

#### Inherited from

Array.find

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:32

___

### findIndex

▸ **findIndex**(`predicate`, `thisArg?`): `number`

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `obj`: [`Input`](../modules/rlp.md#input)[]) => `unknown` | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`number`

#### Inherited from

Array.findIndex

#### Defined in

node_modules/typescript/lib/lib.es2015.core.d.ts:43

___

### flat

▸ **flat**<`A`, `D`\>(`this`, `depth?`): `FlatArray`<`A`, `D`\>[]

Returns a new array with all sub-array elements concatenated into it recursively up to the
specified depth.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | `A` |
| `D` | extends `number` = ``1`` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `A` | - |
| `depth?` | `D` | The maximum recursion depth |

#### Returns

`FlatArray`<`A`, `D`\>[]

#### Inherited from

Array.flat

#### Defined in

node_modules/typescript/lib/lib.es2019.array.d.ts:81

___

### flatMap

▸ **flatMap**<`U`, `This`\>(`callback`, `thisArg?`): `U`[]

Calls a defined callback function on each element of an array. Then, flattens the result into
a new array.
This is identical to a map followed by flat with depth 1.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | `U` |
| `This` | `undefined` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`this`: `This`, `value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `U` \| readonly `U`[] | A function that accepts up to three arguments. The flatMap method calls the callback function one time for each element in the array. |
| `thisArg?` | `This` | An object to which the this keyword can refer in the callback function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

#### Inherited from

Array.flatMap

#### Defined in

node_modules/typescript/lib/lib.es2019.array.d.ts:70

___

### forEach

▸ **forEach**(`callbackfn`, `thisArg?`): `void`

Performs the specified action for each element in an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `void` | A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`void`

#### Inherited from

Array.forEach

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1410

___

### includes

▸ **includes**(`searchElement`, `fromIndex?`): `boolean`

Determines whether an array includes a certain element, returning true or false as appropriate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchElement` | [`Input`](../modules/rlp.md#input) | The element to search for. |
| `fromIndex?` | `number` | The position in this array at which to begin searching for searchElement. |

#### Returns

`boolean`

#### Inherited from

Array.includes

#### Defined in

node_modules/typescript/lib/lib.es2016.array.include.d.ts:27

___

### indexOf

▸ **indexOf**(`searchElement`, `fromIndex?`): `number`

Returns the index of the first occurrence of a value in an array, or -1 if it is not present.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchElement` | [`Input`](../modules/rlp.md#input) | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0. |

#### Returns

`number`

#### Inherited from

Array.indexOf

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1371

___

### join

▸ **join**(`separator?`): `string`

Adds all the elements of an array into a string, separated by the specified separator string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `separator?` | `string` | A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma. |

#### Returns

`string`

#### Inherited from

Array.join

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1314

___

### keys

▸ **keys**(): `IterableIterator`<`number`\>

Returns an iterable of keys in the array

#### Returns

`IterableIterator`<`number`\>

#### Inherited from

Array.keys

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:70

___

### lastIndexOf

▸ **lastIndexOf**(`searchElement`, `fromIndex?`): `number`

Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `searchElement` | [`Input`](../modules/rlp.md#input) | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array. |

#### Returns

`number`

#### Inherited from

Array.lastIndexOf

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1377

___

### map

▸ **map**<`U`\>(`callbackfn`, `thisArg?`): `U`[]

Calls a defined callback function on each element of an array, and returns an array that contains the results.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `U` | A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

#### Inherited from

Array.map

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1416

___

### pop

▸ **pop**(): `undefined` \| [`Input`](../modules/rlp.md#input)

Removes the last element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| [`Input`](../modules/rlp.md#input)

#### Inherited from

Array.pop

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1292

___

### push

▸ **push**(...`items`): `number`

Appends new elements to the end of an array, and returns the new length of the array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | [`Input`](../modules/rlp.md#input)[] | New elements to add to the array. |

#### Returns

`number`

#### Inherited from

Array.push

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1297

___

### reduce

▸ **reduce**(`callbackfn`): [`Input`](../modules/rlp.md#input)

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: [`Input`](../modules/rlp.md#input), `currentValue`: [`Input`](../modules/rlp.md#input), `currentIndex`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => [`Input`](../modules/rlp.md#input) | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |

#### Returns

[`Input`](../modules/rlp.md#input)

#### Inherited from

Array.reduce

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1434

▸ **reduce**(`callbackfn`, `initialValue`): [`Input`](../modules/rlp.md#input)

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`previousValue`: [`Input`](../modules/rlp.md#input), `currentValue`: [`Input`](../modules/rlp.md#input), `currentIndex`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => [`Input`](../modules/rlp.md#input) |
| `initialValue` | [`Input`](../modules/rlp.md#input) |

#### Returns

[`Input`](../modules/rlp.md#input)

#### Inherited from

Array.reduce

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1435

▸ **reduce**<`U`\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: `U`, `currentValue`: [`Input`](../modules/rlp.md#input), `currentIndex`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `U` | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

#### Returns

`U`

#### Inherited from

Array.reduce

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1441

___

### reduceRight

▸ **reduceRight**(`callbackfn`): [`Input`](../modules/rlp.md#input)

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: [`Input`](../modules/rlp.md#input), `currentValue`: [`Input`](../modules/rlp.md#input), `currentIndex`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => [`Input`](../modules/rlp.md#input) | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |

#### Returns

[`Input`](../modules/rlp.md#input)

#### Inherited from

Array.reduceRight

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1447

▸ **reduceRight**(`callbackfn`, `initialValue`): [`Input`](../modules/rlp.md#input)

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`previousValue`: [`Input`](../modules/rlp.md#input), `currentValue`: [`Input`](../modules/rlp.md#input), `currentIndex`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => [`Input`](../modules/rlp.md#input) |
| `initialValue` | [`Input`](../modules/rlp.md#input) |

#### Returns

[`Input`](../modules/rlp.md#input)

#### Inherited from

Array.reduceRight

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1448

▸ **reduceRight**<`U`\>(`callbackfn`, `initialValue`): `U`

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callbackfn` | (`previousValue`: `U`, `currentValue`: [`Input`](../modules/rlp.md#input), `currentIndex`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `U` | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

#### Returns

`U`

#### Inherited from

Array.reduceRight

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1454

___

### reverse

▸ **reverse**(): [`Input`](../modules/rlp.md#input)[]

Reverses the elements in an array in place.
This method mutates the array and returns a reference to the same array.

#### Returns

[`Input`](../modules/rlp.md#input)[]

#### Inherited from

Array.reverse

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1319

___

### shift

▸ **shift**(): `undefined` \| [`Input`](../modules/rlp.md#input)

Removes the first element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| [`Input`](../modules/rlp.md#input)

#### Inherited from

Array.shift

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1324

___

### slice

▸ **slice**(`start?`, `end?`): [`Input`](../modules/rlp.md#input)[]

Returns a copy of a section of an array.
For both start and end, a negative index can be used to indicate an offset from the end of the array.
For example, -2 refers to the second to last element of the array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start?` | `number` | The beginning index of the specified portion of the array. If start is undefined, then the slice begins at index 0. |
| `end?` | `number` | The end index of the specified portion of the array. This is exclusive of the element at the index 'end'. If end is undefined, then the slice extends to the end of the array. |

#### Returns

[`Input`](../modules/rlp.md#input)[]

#### Inherited from

Array.slice

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1334

___

### some

▸ **some**(`predicate`, `thisArg?`): `boolean`

Determines whether the specified callback function returns true for any element of an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `predicate` | (`value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `unknown` | A function that accepts up to three arguments. The some method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`boolean`

#### Inherited from

Array.some

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1404

___

### sort

▸ **sort**(`compareFn?`): [`List`](rlp.List.md)

Sorts an array in place.
This method mutates the array and returns a reference to the same array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compareFn?` | (`a`: [`Input`](../modules/rlp.md#input), `b`: [`Input`](../modules/rlp.md#input)) => `number` | Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, ASCII character order. ```ts [11,2,22,1].sort((a, b) => a - b) ``` |

#### Returns

[`List`](rlp.List.md)

#### Inherited from

Array.sort

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1345

___

### splice

▸ **splice**(`start`, `deleteCount?`): [`Input`](../modules/rlp.md#input)[]

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | `number` | The number of elements to remove. |

#### Returns

[`Input`](../modules/rlp.md#input)[]

An array containing the elements that were deleted.

#### Inherited from

Array.splice

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1352

▸ **splice**(`start`, `deleteCount`, ...`items`): [`Input`](../modules/rlp.md#input)[]

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | `number` | The number of elements to remove. |
| `...items` | [`Input`](../modules/rlp.md#input)[] | Elements to insert into the array in place of the deleted elements. |

#### Returns

[`Input`](../modules/rlp.md#input)[]

An array containing the elements that were deleted.

#### Inherited from

Array.splice

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1360

___

### toLocaleString

▸ **toLocaleString**(): `string`

Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.

#### Returns

`string`

#### Inherited from

Array.toLocaleString

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1287

___

### toString

▸ **toString**(): `string`

Returns a string representation of an array.

#### Returns

`string`

#### Inherited from

Array.toString

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1283

___

### turn

▸ **turn**<`U`\>(`callbackfn`, `memo?`): `U`

Non-standard.

#### Type parameters

| Name |
| :------ |
| `U` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`memo`: `U`, `value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `void` |
| `memo?` | `U` |

#### Returns

`U`

#### Inherited from

Array.turn

#### Defined in

node_modules/@types/core-js/index.d.ts:413

▸ **turn**(`callbackfn`, `memo?`): [`Input`](../modules/rlp.md#input)[]

Non-standard.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackfn` | (`memo`: [`Input`](../modules/rlp.md#input)[], `value`: [`Input`](../modules/rlp.md#input), `index`: `number`, `array`: [`Input`](../modules/rlp.md#input)[]) => `void` |
| `memo?` | [`Input`](../modules/rlp.md#input)[] |

#### Returns

[`Input`](../modules/rlp.md#input)[]

#### Inherited from

Array.turn

#### Defined in

node_modules/@types/core-js/index.d.ts:418

___

### unshift

▸ **unshift**(...`items`): `number`

Inserts new elements at the start of an array, and returns the new length of the array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...items` | [`Input`](../modules/rlp.md#input)[] | Elements to insert at the start of the array. |

#### Returns

`number`

#### Inherited from

Array.unshift

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1365

___

### values

▸ **values**(): `IterableIterator`<[`Input`](../modules/rlp.md#input)\>

Returns an iterable of values in the array

#### Returns

`IterableIterator`<[`Input`](../modules/rlp.md#input)\>

#### Inherited from

Array.values

#### Defined in

node_modules/typescript/lib/lib.es2015.iterable.d.ts:75
